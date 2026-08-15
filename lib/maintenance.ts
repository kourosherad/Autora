export type MaintenanceStatus = "HEALTHY" | "DUE_SOON" | "DUE" | "OVERDUE";

export type MaintenanceInput = {
  currentOdometer: number;
  nextServiceOdometer?: number | null;
  nextServiceDate?: Date | null;
  now?: Date;
  warningKm?: number;
  warningDays?: number;
  dueWindowKm?: number;
  dueWindowDays?: number;
};

export type MaintenanceResult = {
  status: MaintenanceStatus;
  remainingKm: number | null;
  remainingDays: number | null;
};

export function calculateNextService(input: {
  serviceDate: Date;
  odometer: number;
  intervalKm?: number | null;
  intervalDays?: number | null;
}) {
  const serviceDayUtc = Date.UTC(input.serviceDate.getUTCFullYear(), input.serviceDate.getUTCMonth(), input.serviceDate.getUTCDate());
  return {
    nextServiceOdometer: input.intervalKm ? input.odometer + input.intervalKm : null,
    nextServiceDate: input.intervalDays ? new Date(serviceDayUtc + input.intervalDays * 86_400_000) : null,
  };
}

export function calculateMaintenanceStatus({
  currentOdometer,
  nextServiceOdometer,
  nextServiceDate,
  now = new Date(),
  warningKm = 1000,
  warningDays = 30,
  dueWindowKm = 100,
  dueWindowDays = 3,
}: MaintenanceInput): MaintenanceResult {
  const remainingKm = nextServiceOdometer == null ? null : nextServiceOdometer - currentOdometer;
  const utcDay = (date: Date) => Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const remainingDays = nextServiceDate == null ? null : Math.round((utcDay(nextServiceDate) - utcDay(now)) / 86_400_000);

  if ((remainingKm !== null && remainingKm < 0) || (remainingDays !== null && remainingDays < 0)) {
    return { status: "OVERDUE", remainingKm, remainingDays };
  }
  if ((remainingKm !== null && remainingKm <= dueWindowKm) || (remainingDays !== null && remainingDays <= dueWindowDays)) {
    return { status: "DUE", remainingKm, remainingDays };
  }
  if ((remainingKm !== null && remainingKm <= warningKm) || (remainingDays !== null && remainingDays <= warningDays)) {
    return { status: "DUE_SOON", remainingKm, remainingDays };
  }
  return { status: "HEALTHY", remainingKm, remainingDays };
}
