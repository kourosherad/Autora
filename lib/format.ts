import { format as formatJalali } from "date-fns-jalali";

export type Locale = "en" | "fa";

export function formatNumber(value: number | bigint, locale: Locale = "en") {
  return new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(value);
}

export function formatDate(value: Date | string, locale: Locale = "en") {
  const date = typeof value === "string" ? new Date(value) : value;
  if (locale === "fa") return formatJalali(date, "yyyy/MM/dd");
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }).format(date);
}

export function formatCurrency(value: number | bigint, locale: Locale = "en", currency = "TOMAN") {
  const unit = currency === "TOMAN" ? (locale === "fa" ? "تومان" : "Toman") : currency;
  return `${formatNumber(value, locale)} ${unit}`;
}

export function normalizeLocalizedNumber(value: string) {
  const normalized = value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/[٬,\s]/g, "");
  return Number(normalized);
}

