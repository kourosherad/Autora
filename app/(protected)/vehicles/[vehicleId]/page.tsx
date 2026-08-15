import Link from "next/link";
import { AlertTriangle, Gauge, Plus, Wrench } from "lucide-react";
import { notFound } from "next/navigation";
import { deleteVehicleAction, updateOdometerAction } from "@/app/actions";
import { ConfirmSubmit } from "@/components/confirm-submit";
import { LocalizedDateInput } from "@/components/localized-date-input";
import { StatusBadge } from "@/components/status-badge";
import { VehicleTabs } from "@/components/vehicle-tabs";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import { getDictionary } from "@/lib/i18n";
import { maintenanceName } from "@/lib/labels";
import { calculateMaintenanceStatus } from "@/lib/maintenance";
import { emptyStatusCounts } from "@/lib/queries";

export default async function VehiclePage({ params, searchParams }: { params: Promise<{ vehicleId: string }>; searchParams: Promise<{ error?: string }> }) {
  const user = await requireUser(); const locale = user.preferredLanguage; const t = getDictionary(locale); const { vehicleId } = await params; const query = await searchParams;
  const vehicle = await db.vehicle.findFirst({ where: { id: vehicleId, userId: user.id }, include: { maintenanceItems: { where: { enabled: true } }, maintenanceRecords: { orderBy: { serviceDate: "desc" }, take: 5, include: { maintenanceItem: true } }, expenses: true } });
  if (!vehicle) notFound();
  const evaluated = vehicle.maintenanceItems.map((item) => ({ item, result: calculateMaintenanceStatus({ currentOdometer: vehicle.currentOdometer, nextServiceDate: item.nextServiceDate, nextServiceOdometer: item.nextServiceOdometer }) }));
  const counts = emptyStatusCounts(); evaluated.forEach(({ result }) => counts[result.status]++);
  const priority = { OVERDUE: 0, DUE: 1, DUE_SOON: 2, HEALTHY: 3 }; evaluated.sort((a,b) => priority[a.result.status] - priority[b.result.status]);
  const now = new Date(); const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)); const yearStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  const spending = (after?: Date) => vehicle.expenses.filter((expense) => !after || expense.date >= after).reduce((sum, expense) => sum + Number(expense.amount), 0);
  return <main className="container page stack">
    <section className="dashboard-hero"><span className="eyebrow" style={{ color: "#ff9a71" }}>{vehicle.make} · {vehicle.model}</span><h1 className="heading-lg" style={{ marginBlockStart: 8 }}>{vehicle.name}</h1><div style={{ display: "flex", alignItems: "center", gap: 8, marginBlockStart: 22, color: "#c8d6d1" }}><Gauge size={19}/><strong style={{ color: "#fff", fontSize: "1.3rem" }}>{formatNumber(vehicle.currentOdometer, locale)}</strong> {t.km}</div></section>
    <VehicleTabs id={vehicle.id} active="overview" t={t} />
    {query.error === "lower-mileage" && <div className="alert"><AlertTriangle size={18}/>{t.mileageWarning}</div>}
    <section><div className="section-head"><h2 className="heading-md">{t.health}</h2></div><div className="status-grid">{[["HEALTHY", t.healthy], ["DUE_SOON", t.dueSoon], ["DUE", t.due], ["OVERDUE", t.overdue]].map(([key,label]) => <div className="status-tile" key={key}><strong>{formatNumber(counts[key as keyof typeof counts], locale)}</strong><span className="metric-label">{label}</span></div>)}</div></section>
    <div className="dashboard-grid">
      <section className="card"><div className="section-head"><h2 className="heading-md">{t.upcoming}</h2><Link href={`/vehicles/${vehicle.id}/maintenance`} className="btn btn-secondary btn-sm"><Plus size={16}/>{t.addMaintenance}</Link></div>
        {evaluated.length ? evaluated.slice(0,6).map(({item,result}) => <div className="list-row" key={item.id}><div><strong>{maintenanceName(item.name, locale)}</strong><div className="muted" style={{ fontSize: ".82rem" }}>{result.remainingKm !== null ? `${formatNumber(Math.abs(result.remainingKm), locale)} ${t.km} ${result.remainingKm < 0 ? t.pastDue : t.remaining}` : result.remainingDays !== null ? `${formatNumber(Math.abs(result.remainingDays), locale)} ${t.days} ${result.remainingDays < 0 ? t.pastDue : t.remaining}` : "—"}</div></div><StatusBadge status={result.status} t={t}/></div>) : <div className="empty"><div className="empty-icon"><Wrench/></div><span className="muted">{t.noMaintenance}</span></div>}
      </section>
      <section className="card stack"><h2 className="heading-md">{t.updateMileage}</h2><div className="metric"><span className="metric-value">{formatNumber(vehicle.currentOdometer, locale)} {t.km}</span><span className="metric-label">{t.odometer}</span></div><form action={updateOdometerAction} className="form-grid"><input type="hidden" name="vehicleId" value={vehicle.id}/><label className="field"><span className="label">{t.newMileage}</span><input className="input" name="odometer" inputMode="numeric" required/></label><label className="field"><span className="label">{t.date}</span><LocalizedDateInput name="recordedAt" locale={locale} required/></label><button className="btn btn-accent" type="submit">{t.saveMileage}</button></form></section>
      <section className="card"><div className="section-head"><h2 className="heading-md">{t.recent}</h2><Link href={`/vehicles/${vehicle.id}/history`} className="btn btn-ghost btn-sm">{t.history}</Link></div>{vehicle.maintenanceRecords.length ? vehicle.maintenanceRecords.map((record) => <div className="list-row" key={record.id}><div><strong>{maintenanceName(record.maintenanceItem?.name ?? t.maintenance, locale)}</strong><div className="muted" style={{ fontSize: ".82rem" }}>{formatDate(record.serviceDate, locale)} · {formatNumber(record.odometer, locale)} {t.km}</div></div>{record.cost && <strong>{formatCurrency(Number(record.cost), locale)}</strong>}</div>) : <div className="empty"><span className="muted">{t.noHistory}</span></div>}</section>
      <section className="card"><h2 className="heading-md">{t.spending}</h2><div className="grid-3" style={{ marginBlockStart: 18 }}><div className="metric"><strong>{formatCurrency(spending(monthStart), locale)}</strong><span className="metric-label">{t.thisMonth}</span></div><div className="metric"><strong>{formatCurrency(spending(yearStart), locale)}</strong><span className="metric-label">{t.thisYear}</span></div><div className="metric"><strong>{formatCurrency(spending(), locale)}</strong><span className="metric-label">{t.lifetime}</span></div></div></section>
    </div>
    <section className="card" style={{ borderColor: "color-mix(in srgb, var(--danger) 35%, var(--line))" }}><form action={deleteVehicleAction} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}><input type="hidden" name="vehicleId" value={vehicle.id}/><span className="muted">{locale === "fa" ? "حذف خودرو، تمام سوابق وابسته را برای همیشه پاک می‌کند." : "Deleting this vehicle permanently removes its maintenance history, reminders, expenses, and mileage records."}</span><ConfirmSubmit label={t.delete} message={locale === "fa" ? "این خودرو و همه سوابق آن حذف شود؟" : "Delete this vehicle and all of its records?"}/></form></section>
  </main>;
}

