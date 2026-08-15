import { expect, it } from "vitest";
import { calculateExpenseTotals } from "./expense";

it("calculates expense totals by period", () => {
  const totals = calculateExpenseTotals([{ amount: 100, date: new Date("2026-08-02") }, { amount: 200, date: new Date("2026-01-02") }, { amount: 400, date: new Date("2025-12-01") }], new Date("2026-08-15"));
  expect(totals).toEqual({ month: 100, year: 300, lifetime: 700 });
});
