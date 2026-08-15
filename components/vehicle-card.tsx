import Link from "next/link";
import { ArrowRight, Gauge } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/format";
import { formatNumber } from "@/lib/format";
import type { MaintenanceStatus } from "@/lib/maintenance";

export function VehicleCard({ vehicle, counts, t, locale }: {
  vehicle: { id: string; name: string; make: string; model: string; currentOdometer: number };
  counts: Record<MaintenanceStatus, number>;
  t: Dictionary;
  locale: Locale;
}) {
  return <article className="card vehicle-card">
    <div className="vehicle-art" aria-hidden="true" />
    <div className="vehicle-meta"><div><h2 className="heading-md">{vehicle.name}</h2><span className="muted">{vehicle.make} · {vehicle.model}</span></div><span className="status status-overdue">{formatNumber(counts.OVERDUE, locale)} {t.overdue}</span></div>
    <div className="list-row"><span className="muted" style={{ display: "inline-flex", gap: 7, alignItems: "center" }}><Gauge size={17} />{t.odometer}</span><strong>{formatNumber(vehicle.currentOdometer, locale)} {t.km}</strong></div>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><span className="status status-healthy">{formatNumber(counts.HEALTHY, locale)} {t.healthy}</span><span className="status status-due-soon">{formatNumber(counts.DUE_SOON + counts.DUE, locale)} {t.dueSoon}</span></div>
    <Link href={`/vehicles/${vehicle.id}`} className="btn btn-secondary">{t.viewVehicle}<ArrowRight size={17} style={{ transform: locale === "fa" ? "scaleX(-1)" : undefined }} /></Link>
  </article>;
}

