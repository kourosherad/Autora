import { describe, expect, it } from "vitest";
import { calculateMaintenanceStatus, calculateNextService } from "./maintenance";

describe("maintenance status engine", () => {
  it("calculates remaining mileage", () => {
    expect(calculateMaintenanceStatus({ currentOdometer: 148500, nextServiceOdometer: 149000 })).toMatchObject({ status: "DUE_SOON", remainingKm: 500 });
  });
  it("detects overdue mileage", () => {
    expect(calculateMaintenanceStatus({ currentOdometer: 150001, nextServiceOdometer: 150000 }).status).toBe("OVERDUE");
  });
  it("detects due time windows", () => {
    const now = new Date("2026-08-15T10:00:00Z");
    expect(calculateMaintenanceStatus({ currentOdometer: 100, nextServiceDate: new Date("2026-08-17T00:00:00Z"), now }).status).toBe("DUE");
  });
  it("uses whichever combined trigger comes first", () => {
    const result = calculateMaintenanceStatus({ currentOdometer: 1000, nextServiceOdometer: 5000, nextServiceDate: new Date("2026-08-14"), now: new Date("2026-08-15") });
    expect(result.status).toBe("OVERDUE");
  });
  it("calculates both next triggers", () => {
    const next = calculateNextService({ serviceDate: new Date("2026-01-01"), odometer: 145000, intervalKm: 7000, intervalDays: 180 });
    expect(next.nextServiceOdometer).toBe(152000);
    expect(next.nextServiceDate?.toISOString().slice(0,10)).toBe("2026-06-30");
  });
});

