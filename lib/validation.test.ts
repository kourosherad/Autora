import { describe, expect, it } from "vitest";
import { vehicleSchema } from "./validation";

const vehicle = {
  name: "Peugeot 207",
  make: "Iran Khodro",
  model: "207",
  currentOdometer: "۲۵٬۰۰۰",
};

describe("vehicle validation", () => {
  it("accepts a Solar Hijri model year and stores its Gregorian equivalent", () => {
    expect(vehicleSchema.parse({ ...vehicle, year: "۱۴۰۳" }).year).toBe(2024);
  });

  it("keeps a Gregorian model year unchanged", () => {
    expect(vehicleSchema.parse({ ...vehicle, year: "2022" }).year).toBe(2022);
  });
});
