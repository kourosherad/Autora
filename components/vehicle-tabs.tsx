import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";

export function VehicleTabs({ id, active, t }: { id: string; active: "overview" | "maintenance" | "history" | "expenses"; t: Dictionary }) {
  const tabs = [
    ["overview", `/vehicles/${id}`, t.home],
    ["maintenance", `/vehicles/${id}/maintenance`, t.maintenance],
    ["history", `/vehicles/${id}/history`, t.history],
    ["expenses", `/vehicles/${id}/expenses`, t.expenses],
  ] as const;
  return <nav className="pill-tabs" aria-label={t.overview}>{tabs.map(([key, href, label]) => <Link key={key} className={`pill-tab${active === key ? " active" : ""}`} href={href}>{label}</Link>)}</nav>;
}

