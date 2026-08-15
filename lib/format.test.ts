import { describe, expect, it } from "vitest";
import { normalizeLocalizedNumber } from "./format";

describe("localized number normalization", () => {
  it("normalizes Persian digits and separators", () => expect(normalizeLocalizedNumber("۱۴۸٬۲۵۰")).toBe(148250));
  it("normalizes English numbers", () => expect(normalizeLocalizedNumber("3,500,000")).toBe(3500000));
});

