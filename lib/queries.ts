import type { MaintenanceItem } from "@prisma/client";
import { db } from "./db";
import { calculateMaintenanceStatus, type MaintenanceStatus } from "./maintenance";

export function getItemStatus(item: Pick<MaintenanceItem, "nextServiceDate" | "nextServiceOdometer">, currentOdometer: number) {
  return calculateMaintenanceStatus({ currentOdometer, nextServiceDate: item.nextServiceDate, nextServiceOdometer: item.nextServiceOdometer });
}

export function emptyStatusCounts(): Record<MaintenanceStatus, number> {
  return { HEALTHY: 0, DUE_SOON: 0, DUE: 0, OVERDUE: 0 };
}

export async function getOwnedVehicle(userId: string, id: string) {
  return db.vehicle.findFirst({ where: { id, userId } });
}

