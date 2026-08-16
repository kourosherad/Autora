import { z } from "zod";
import { normalizeLocalizedNumber } from "./format";

const numericString = z.string().transform((value, context) => {
  const number = normalizeLocalizedNumber(value);
  if (!Number.isFinite(number)) context.addIssue({ code: "custom", message: "Invalid number" });
  return number;
});

const optionalNumber = z.string().optional().transform((value) => value?.trim() ? normalizeLocalizedNumber(value) : null);
const optionalText = z.string().trim().max(500).optional().transform((value) => value || null);
const dateOnly = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform((value) => new Date(`${value}T00:00:00.000Z`));
const vehicleYear = optionalNumber
  .transform((value) => value !== null && value >= 1200 && value <= 1600 ? value + 621 : value)
  .refine((value) => value === null || (Number.isInteger(value) && value >= 1886 && value <= new Date().getFullYear() + 1));

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().email().transform((value) => value.toLowerCase().trim()),
  password: z.string().min(8).max(128).regex(/[A-Za-z]/).regex(/\d/),
  locale: z.enum(["en", "fa"]).default("en"),
});

export const vehicleSchema = z.object({
  name: z.string().trim().min(2).max(80),
  make: z.string().trim().min(1).max(60),
  model: z.string().trim().min(1).max(60),
  year: vehicleYear,
  currentOdometer: numericString.refine((value) => Number.isInteger(value) && value >= 0 && value <= 10_000_000),
  plateNumber: optionalText,
  useTemplate: z.string().optional().transform((value) => value === "on"),
});

export const odometerSchema = z.object({
  vehicleId: z.string().cuid(),
  odometer: numericString.refine((value) => Number.isInteger(value) && value >= 0 && value <= 10_000_000),
  recordedAt: dateOnly,
});

export const maintenanceSchema = z.object({
  vehicleId: z.string().cuid(),
  name: z.string().trim().min(2).max(100),
  category: z.enum(["ENGINE", "FILTERS", "FLUIDS", "BRAKES", "TIRES", "ELECTRICAL", "SUSPENSION", "TRANSMISSION", "COOLING", "EXTERIOR", "INSPECTION", "OTHER"]),
  intervalKm: optionalNumber.refine((value) => value === null || (Number.isInteger(value) && value > 0 && value <= 1_000_000)),
  intervalDays: optionalNumber.refine((value) => value === null || (Number.isInteger(value) && value > 0 && value <= 3650)),
  lastServiceDate: z.string().optional().transform((value) => value ? new Date(`${value}T00:00:00.000Z`) : null),
  lastServiceOdometer: optionalNumber,
  description: optionalText,
  notes: optionalText,
}).refine((data) => data.intervalKm || data.intervalDays, { message: "At least one interval is required" });

export const serviceSchema = z.object({
  vehicleId: z.string().cuid(),
  maintenanceItemId: z.string().cuid(),
  serviceDate: dateOnly,
  odometer: numericString.refine((value) => Number.isInteger(value) && value >= 0),
  cost: optionalNumber.refine((value) => value === null || value >= 0),
  provider: optionalText,
  notes: optionalText,
});

export const expenseSchema = z.object({
  vehicleId: z.string().cuid(),
  category: z.enum(["MAINTENANCE", "REPAIR", "PARTS", "TIRES", "FUEL", "INSURANCE", "OTHER"]),
  amount: numericString.refine((value) => value > 0),
  date: dateOnly,
  description: optionalText,
});
