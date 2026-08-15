import { notFound } from "next/navigation";
import { Plus, Wrench } from "lucide-react";
import { createMaintenanceAction, deleteMaintenanceAction, recordServiceAction, toggleMaintenanceAction } from "@/app/actions";
import { ConfirmSubmit } from "@/components/confirm-submit";
import { LocalizedDateInput } from "@/components/localized-date-input";
import { StatusBadge } from "@/components/status-badge";
import { VehicleTabs } from "@/components/vehicle-tabs";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate, formatNumber } from "@/lib/format";
import { getDictionary } from "@/lib/i18n";
import { categoryName, maintenanceName } from "@/lib/labels";
import { calculateMaintenanceStatus } from "@/lib/maintenance";

const categories = ["ENGINE","FILTERS","FLUIDS","BRAKES","TIRES","ELECTRICAL","SUSPENSION","TRANSMISSION","COOLING","EXTERIOR","INSPECTION","OTHER"] as const;

export default async function MaintenancePage({ params, searchParams }: { params: Promise<{ vehicleId: string }>; searchParams: Promise<{ error?: string }> }) {
  const user = await requireUser(); const locale = user.preferredLanguage; const t = getDictionary(locale); const { vehicleId } = await params; const query = await searchParams;
  const vehicle = await db.vehicle.findFirst({ where: { id: vehicleId, userId: user.id }, include: { maintenanceItems: { orderBy: [{ enabled: "desc" }, { createdAt: "desc" }] } } });
  if (!vehicle) notFound();
  return <main className="container page stack">
    <div><span className="eyebrow">{vehicle.name}</span><h1 className="heading-lg">{t.schedules}</h1></div><VehicleTabs id={vehicle.id} active="maintenance" t={t}/>
    {query.error && <div className="alert">{t.formError}</div>}
    <section className="stack">{vehicle.maintenanceItems.length ? vehicle.maintenanceItems.map((item) => {
      const status = calculateMaintenanceStatus({ currentOdometer: vehicle.currentOdometer, nextServiceDate: item.nextServiceDate, nextServiceOdometer: item.nextServiceOdometer });
      return <article className="card stack" key={item.id} style={{ opacity: item.enabled ? 1 : .62 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}><div><span className="eyebrow">{categoryName(item.category, locale)}</span><h2 className="heading-md">{maintenanceName(item.name, locale)}</h2></div><StatusBadge status={status.status} t={t}/></div>
        <div className="grid-2"><div className="metric"><strong>{item.intervalKm ? `${formatNumber(item.intervalKm, locale)} ${t.km}` : "—"}{item.intervalKm && item.intervalDays ? " / " : ""}{item.intervalDays ? `${formatNumber(item.intervalDays, locale)} ${t.days}` : ""}</strong><span className="metric-label">{t.maintenance}</span></div><div className="metric"><strong>{item.nextServiceDate ? formatDate(item.nextServiceDate, locale) : item.nextServiceOdometer ? `${formatNumber(item.nextServiceOdometer, locale)} ${t.km}` : "—"}</strong><span className="metric-label">{t.upcoming}</span></div></div>
        <details><summary className="btn btn-accent btn-sm" style={{ width: "fit-content" }}>{t.completeService}</summary><form action={recordServiceAction} className="form-grid two" style={{ marginBlockStart: 16 }}><input type="hidden" name="vehicleId" value={vehicle.id}/><input type="hidden" name="maintenanceItemId" value={item.id}/><label className="field"><span className="label">{t.serviceDate}</span><LocalizedDateInput name="serviceDate" locale={locale} required/></label><label className="field"><span className="label">{t.odometer}</span><input className="input" name="odometer" inputMode="numeric" defaultValue={vehicle.currentOdometer} required/></label><label className="field"><span className="label">{t.cost}</span><input className="input" name="cost" inputMode="numeric" /></label><label className="field"><span className="label">{t.provider}</span><input className="input" name="provider"/></label><label className="field"><span className="label">{t.notes}</span><textarea className="input" name="notes"/></label><div className="form-actions"><button className="btn btn-accent" type="submit">{t.saveService}</button></div></form></details>
        <div className="form-actions"><form action={toggleMaintenanceAction}><input type="hidden" name="id" value={item.id}/><button className="btn btn-secondary btn-sm" type="submit">{item.enabled ? t.disable : t.enable}</button></form><form action={deleteMaintenanceAction}><input type="hidden" name="id" value={item.id}/><ConfirmSubmit label={t.delete} message={locale === "fa" ? "این برنامه حذف شود؟" : "Delete this maintenance schedule?"}/></form></div>
      </article>;
    }) : <section className="card empty"><div className="empty-icon"><Wrench/></div><span>{t.noMaintenance}</span></section>}</section>

    <section className="card card-elevated stack"><div><span className="eyebrow"><Plus size={14} style={{ display: "inline" }}/> {t.addMaintenance}</span><h2 className="heading-md">{t.addMaintenance}</h2></div><p className="muted">{t.starterDisclaimer}</p>
      <form action={createMaintenanceAction} className="form-grid two"><input type="hidden" name="vehicleId" value={vehicle.id}/><label className="field"><span className="label">{t.name}</span><input className="input" name="name" maxLength={100} required/></label><label className="field"><span className="label">{t.category}</span><select className="input" name="category">{categories.map((category) => <option value={category} key={category}>{categoryName(category, locale)}</option>)}</select></label><label className="field"><span className="label">{t.intervalKm}</span><input className="input" name="intervalKm" inputMode="numeric"/></label><label className="field"><span className="label">{t.intervalDays}</span><input className="input" name="intervalDays" inputMode="numeric"/></label><label className="field"><span className="label">{t.lastDate}</span><LocalizedDateInput name="lastServiceDate" locale={locale}/></label><label className="field"><span className="label">{t.lastOdometer}</span><input className="input" name="lastServiceOdometer" inputMode="numeric" defaultValue={vehicle.currentOdometer}/></label><label className="field"><span className="label">{t.description}</span><textarea className="input" name="description"/></label><label className="field"><span className="label">{t.notes}</span><textarea className="input" name="notes"/></label><div className="form-actions"><button className="btn btn-accent" type="submit">{t.saveSchedule}</button></div></form>
    </section>
  </main>;
}

