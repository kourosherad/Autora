import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const email = "demo@example.com";
  const user = await db.user.upsert({
    where: { email },
    update: { name: "Demo Driver" },
    create: { name: "Demo Driver", email, passwordHash: await hash("Demo12345", 12), preferredLanguage: "en", timezone: "Asia/Tehran" },
  });
  await db.vehicle.deleteMany({ where: { userId: user.id } });
  const vehicle = await db.vehicle.create({
    data: {
      userId: user.id, name: "Peugeot 207", make: "Peugeot", model: "207", year: 2021, currentOdometer: 148250, fuelType: "Gasoline", transmission: "Automatic",
      odometerRecords: { create: [{ odometer: 145000, recordedAt: new Date("2026-02-01") }, { odometer: 148250, recordedAt: new Date("2026-08-01") }] },
    },
  });
  const items = await Promise.all([
    ["Engine Oil", "ENGINE", 7000, 180, 145000, "2026-02-01", 152000, "2026-07-31"],
    ["Air Filter", "FILTERS", 15000, 365, 140000, "2025-10-10", 155000, "2026-10-10"],
    ["Brake Fluid", "FLUIDS", null, 730, 120000, "2024-09-01", null, "2026-09-01"],
    ["Coolant", "COOLING", 40000, 730, 130000, "2025-01-15", 170000, "2027-01-15"],
    ["Brake Inspection", "BRAKES", 10000, 180, 145000, "2026-02-01", 155000, "2026-07-31"],
  ].map(async ([name, category, intervalKm, intervalDays, lastOdometer, lastDate, nextOdometer, nextDate]) => {
    const item = await db.maintenanceItem.create({ data: { vehicleId: vehicle.id, name: name as string, category: category as never, intervalKm: intervalKm as number | null, intervalDays: intervalDays as number, lastServiceOdometer: lastOdometer as number, lastServiceDate: new Date(lastDate as string), nextServiceOdometer: nextOdometer as number | null, nextServiceDate: new Date(nextDate as string) } });
    await db.reminder.create({ data: { vehicleId: vehicle.id, maintenanceItemId: item.id, reminderType: intervalKm ? "COMBINED" : "DATE", triggerDate: new Date(nextDate as string), triggerOdometer: nextOdometer as number | null } });
    return item;
  }));
  const oilRecord = await db.maintenanceRecord.create({ data: { vehicleId: vehicle.id, maintenanceItemId: items[0].id, serviceDate: new Date("2026-02-01"), odometer: 145000, cost: 1450000, provider: "Autocare Center", notes: "Oil and filter changed" } });
  await db.maintenanceRecord.create({ data: { vehicleId: vehicle.id, maintenanceItemId: items[1].id, serviceDate: new Date("2025-10-10"), odometer: 140000, cost: 520000, provider: "Local garage" } });
  await db.expense.createMany({ data: [
    { vehicleId: vehicle.id, category: "MAINTENANCE", amount: 1450000, date: new Date("2026-02-01"), description: "Engine oil service", maintenanceRecordId: oilRecord.id },
    { vehicleId: vehicle.id, category: "PARTS", amount: 520000, date: new Date("2025-10-10"), description: "Air filter" },
    { vehicleId: vehicle.id, category: "REPAIR", amount: 2850000, date: new Date("2026-07-18"), description: "Brake pads" },
  ] });
  console.log("Development seed created for demo@example.com");
}

main().finally(() => db.$disconnect());

