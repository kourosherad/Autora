"use server";

import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { calculateNextService } from "@/lib/maintenance";
import { starterMaintenanceTemplates } from "@/lib/templates";
import { expenseSchema, maintenanceSchema, odometerSchema, registerSchema, serviceSchema, vehicleSchema } from "@/lib/validation";

function raw(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse(raw(formData));
  if (!parsed.success) redirect(`/register?error=invalid`);
  const existing = await db.user.findUnique({ where: { email: parsed.data.email }, select: { id: true } });
  if (existing) redirect(`/register?error=exists`);
  await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash: await hash(parsed.data.password, 12),
      preferredLanguage: parsed.data.locale,
      timezone: parsed.data.locale === "fa" ? "Asia/Tehran" : "UTC",
    },
  });
  const cookieStore = await cookies();
  cookieStore.set("autora-locale", parsed.data.locale, { sameSite: "lax", maxAge: 31_536_000 });
  redirect("/login?registered=1");
}

export async function setPublicLocale(locale: "en" | "fa") {
  const cookieStore = await cookies();
  cookieStore.set("autora-locale", locale, { sameSite: "lax", maxAge: 31_536_000 });
  revalidatePath("/", "layout");
}

export async function createVehicleAction(formData: FormData) {
  const user = await requireUser();
  const parsed = vehicleSchema.safeParse(raw(formData));
  if (!parsed.success) redirect("/garage?error=invalid");
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const vehicle = await db.$transaction(async (tx) => {
    const created = await tx.vehicle.create({
      data: {
        userId: user.id,
        name: parsed.data.name,
        make: parsed.data.make,
        model: parsed.data.model,
        year: parsed.data.year,
        plateNumber: parsed.data.plateNumber,
        currentOdometer: parsed.data.currentOdometer,
        odometerRecords: { create: { odometer: parsed.data.currentOdometer, recordedAt: today } },
      },
    });
    if (parsed.data.useTemplate) {
      for (const template of starterMaintenanceTemplates) {
        const next = calculateNextService({ serviceDate: today, odometer: parsed.data.currentOdometer, intervalKm: template.intervalKm, intervalDays: template.intervalDays });
        const item = await tx.maintenanceItem.create({
          data: {
            vehicleId: created.id,
            ...template,
            lastServiceDate: today,
            lastServiceOdometer: parsed.data.currentOdometer,
            ...next,
          },
        });
        await tx.reminder.create({
          data: {
            vehicleId: created.id,
            maintenanceItemId: item.id,
            reminderType: template.intervalKm && template.intervalDays ? "COMBINED" : template.intervalKm ? "ODOMETER" : "DATE",
            triggerDate: next.nextServiceDate,
            triggerOdometer: next.nextServiceOdometer,
          },
        });
      }
    }
    return created;
  });
  redirect(`/vehicles/${vehicle.id}`);
}

export async function updateOdometerAction(formData: FormData) {
  const user = await requireUser();
  const parsed = odometerSchema.safeParse(raw(formData));
  if (!parsed.success) redirect("/garage?error=invalid");
  const vehicle = await db.vehicle.findFirst({ where: { id: parsed.data.vehicleId, userId: user.id } });
  if (!vehicle) redirect("/garage?error=not-found");
  if (parsed.data.odometer < vehicle.currentOdometer) redirect(`/vehicles/${vehicle.id}?error=lower-mileage`);
  await db.$transaction([
    db.odometerRecord.create({ data: { vehicleId: vehicle.id, odometer: parsed.data.odometer, recordedAt: parsed.data.recordedAt } }),
    db.vehicle.update({ where: { id: vehicle.id }, data: { currentOdometer: parsed.data.odometer } }),
  ]);
  revalidatePath(`/vehicles/${vehicle.id}`);
  revalidatePath("/dashboard");
}

export async function createMaintenanceAction(formData: FormData) {
  const user = await requireUser();
  const parsed = maintenanceSchema.safeParse(raw(formData));
  if (!parsed.success) redirect(`/vehicles/${formData.get("vehicleId")}/maintenance?error=invalid`);
  const vehicle = await db.vehicle.findFirst({ where: { id: parsed.data.vehicleId, userId: user.id } });
  if (!vehicle) redirect("/garage?error=not-found");
  const baselineDate = parsed.data.lastServiceDate ?? new Date();
  const baselineOdometer = parsed.data.lastServiceOdometer ?? vehicle.currentOdometer;
  const next = calculateNextService({ serviceDate: baselineDate, odometer: baselineOdometer, intervalKm: parsed.data.intervalKm, intervalDays: parsed.data.intervalDays });
  await db.$transaction(async (tx) => {
    const item = await tx.maintenanceItem.create({ data: { ...parsed.data, lastServiceDate: baselineDate, lastServiceOdometer: baselineOdometer, ...next } });
    await tx.reminder.create({ data: {
      vehicleId: vehicle.id,
      maintenanceItemId: item.id,
      reminderType: parsed.data.intervalKm && parsed.data.intervalDays ? "COMBINED" : parsed.data.intervalKm ? "ODOMETER" : "DATE",
      triggerDate: next.nextServiceDate,
      triggerOdometer: next.nextServiceOdometer,
    } });
  });
  revalidatePath(`/vehicles/${vehicle.id}/maintenance`);
  revalidatePath(`/vehicles/${vehicle.id}`);
}

export async function toggleMaintenanceAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id"));
  const item = await db.maintenanceItem.findFirst({ where: { id, vehicle: { userId: user.id } } });
  if (!item) redirect("/garage?error=not-found");
  await db.maintenanceItem.update({ where: { id }, data: { enabled: !item.enabled } });
  revalidatePath(`/vehicles/${item.vehicleId}/maintenance`);
}

export async function deleteMaintenanceAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id"));
  const item = await db.maintenanceItem.findFirst({ where: { id, vehicle: { userId: user.id } }, select: { vehicleId: true } });
  if (!item) redirect("/garage?error=not-found");
  await db.maintenanceItem.delete({ where: { id } });
  revalidatePath(`/vehicles/${item.vehicleId}/maintenance`);
}

export async function recordServiceAction(formData: FormData) {
  const user = await requireUser();
  const parsed = serviceSchema.safeParse(raw(formData));
  if (!parsed.success) redirect(`/vehicles/${formData.get("vehicleId")}/maintenance?error=invalid`);
  const item = await db.maintenanceItem.findFirst({
    where: { id: parsed.data.maintenanceItemId, vehicleId: parsed.data.vehicleId, vehicle: { userId: user.id } },
    include: { vehicle: true },
  });
  if (!item) redirect("/garage?error=not-found");
  const next = calculateNextService({ serviceDate: parsed.data.serviceDate, odometer: parsed.data.odometer, intervalKm: item.intervalKm, intervalDays: item.intervalDays });
  await db.$transaction(async (tx) => {
    const record = await tx.maintenanceRecord.create({ data: parsed.data });
    await tx.maintenanceItem.update({ where: { id: item.id }, data: { lastServiceDate: parsed.data.serviceDate, lastServiceOdometer: parsed.data.odometer, ...next } });
    await tx.reminder.upsert({
      where: { maintenanceItemId: item.id },
      create: { vehicleId: item.vehicleId, maintenanceItemId: item.id, reminderType: item.intervalKm && item.intervalDays ? "COMBINED" : item.intervalKm ? "ODOMETER" : "DATE", triggerDate: next.nextServiceDate, triggerOdometer: next.nextServiceOdometer },
      update: { status: "PENDING", triggerDate: next.nextServiceDate, triggerOdometer: next.nextServiceOdometer },
    });
    if (parsed.data.cost && parsed.data.cost > 0) {
      await tx.expense.create({ data: { vehicleId: item.vehicleId, maintenanceRecordId: record.id, category: "MAINTENANCE", amount: parsed.data.cost, date: parsed.data.serviceDate, description: item.name } });
    }
    if (parsed.data.odometer > item.vehicle.currentOdometer) {
      await tx.vehicle.update({ where: { id: item.vehicleId }, data: { currentOdometer: parsed.data.odometer } });
      await tx.odometerRecord.create({ data: { vehicleId: item.vehicleId, odometer: parsed.data.odometer, recordedAt: parsed.data.serviceDate, notes: item.name } });
    }
  });
  revalidatePath(`/vehicles/${item.vehicleId}`);
  revalidatePath(`/vehicles/${item.vehicleId}/maintenance`);
  revalidatePath(`/vehicles/${item.vehicleId}/history`);
  revalidatePath(`/vehicles/${item.vehicleId}/expenses`);
}

export async function createExpenseAction(formData: FormData) {
  const user = await requireUser();
  const parsed = expenseSchema.safeParse(raw(formData));
  if (!parsed.success) redirect(`/vehicles/${formData.get("vehicleId")}/expenses?error=invalid`);
  const vehicle = await db.vehicle.findFirst({ where: { id: parsed.data.vehicleId, userId: user.id }, select: { id: true } });
  if (!vehicle) redirect("/garage?error=not-found");
  await db.expense.create({ data: parsed.data });
  revalidatePath(`/vehicles/${vehicle.id}/expenses`);
  revalidatePath(`/vehicles/${vehicle.id}`);
}

export async function deleteVehicleAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("vehicleId"));
  const result = await db.vehicle.deleteMany({ where: { id, userId: user.id } });
  if (!result.count) redirect("/garage?error=not-found");
  redirect("/garage");
}

export async function updateProfileAction(formData: FormData) {
  const user = await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const preferredLanguage = formData.get("preferredLanguage") === "fa" ? "fa" : "en";
  const timezone = String(formData.get("timezone") ?? "UTC").slice(0, 80);
  const themeRaw = String(formData.get("theme") ?? "SYSTEM");
  const theme = themeRaw === "LIGHT" || themeRaw === "DARK" ? themeRaw : "SYSTEM";
  if (name.length < 2 || name.length > 80 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) redirect("/profile?error=invalid");
  const duplicate = await db.user.findFirst({ where: { email, NOT: { id: user.id } }, select: { id: true } });
  if (duplicate) redirect("/profile?error=exists");
  await db.user.update({ where: { id: user.id }, data: { name, email, preferredLanguage, timezone, theme } });
  const cookieStore = await cookies();
  cookieStore.set("autora-locale", preferredLanguage, { sameSite: "lax", maxAge: 31_536_000 });
  cookieStore.set("autora-theme", theme.toLowerCase(), { sameSite: "lax", maxAge: 31_536_000 });
  redirect("/profile?saved=1");
}
