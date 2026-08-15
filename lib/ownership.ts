export function ownedVehicleWhere(userId: string, vehicleId: string) {
  return { id: vehicleId, userId } as const;
}

export function ownedMaintenanceWhere(userId: string, vehicleId: string, maintenanceItemId: string) {
  return { id: maintenanceItemId, vehicleId, vehicle: { userId } } as const;
}

