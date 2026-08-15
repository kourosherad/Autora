import type { MaintenanceCategory } from "@prisma/client";
import type { Locale } from "./format";

const maintenanceNames: Record<string, string> = {
  "Engine Oil": "روغن موتور", "Oil Filter": "فیلتر روغن", "Air Filter": "فیلتر هوا", "Brake Inspection": "بازرسی ترمز", "Coolant": "مایع خنک‌کننده",
};

const categories: Record<MaintenanceCategory, [string, string]> = {
  ENGINE: ["Engine", "موتور"], FILTERS: ["Filters", "فیلترها"], FLUIDS: ["Fluids", "مایعات"], BRAKES: ["Brakes", "ترمز"], TIRES: ["Tires", "لاستیک"], ELECTRICAL: ["Electrical", "برق"], SUSPENSION: ["Suspension", "تعلیق"], TRANSMISSION: ["Transmission", "گیربکس"], COOLING: ["Cooling", "خنک‌کاری"], EXTERIOR: ["Exterior", "بدنه"], INSPECTION: ["Inspection", "بازرسی"], OTHER: ["Other", "سایر"],
};

export function maintenanceName(name: string, locale: Locale) { return locale === "fa" ? maintenanceNames[name] ?? name : name; }
export function categoryName(category: MaintenanceCategory, locale: Locale) { return categories[category][locale === "fa" ? 1 : 0]; }

