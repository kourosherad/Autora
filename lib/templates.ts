import type { MaintenanceCategory } from "@prisma/client";

export const starterMaintenanceTemplates: Array<{
  name: string;
  category: MaintenanceCategory;
  intervalKm?: number;
  intervalDays?: number;
}> = [
  { name: "Engine Oil", category: "ENGINE", intervalKm: 7000, intervalDays: 180 },
  { name: "Oil Filter", category: "FILTERS", intervalKm: 7000, intervalDays: 180 },
  { name: "Air Filter", category: "FILTERS", intervalKm: 15000, intervalDays: 365 },
  { name: "Brake Inspection", category: "BRAKES", intervalKm: 10000, intervalDays: 180 },
  { name: "Coolant", category: "COOLING", intervalKm: 40000, intervalDays: 730 },
];

