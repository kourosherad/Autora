import { CarFront, Plus } from "lucide-react";
import { createVehicleAction } from "@/app/actions";
import { VehicleCard } from "@/components/vehicle-card";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDictionary } from "@/lib/i18n";
import { calculateMaintenanceStatus } from "@/lib/maintenance";
import { emptyStatusCounts } from "@/lib/queries";

export default async function GaragePage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await requireUser(); const locale = user.preferredLanguage; const t = getDictionary(locale); const query = await searchParams;
  const vehicles = await db.vehicle.findMany({ where: { userId: user.id }, include: { maintenanceItems: { where: { enabled: true } } }, orderBy: { createdAt: "desc" } });
  return <main className="container page stack">
    <div className="section-head"><div><span className="eyebrow">{t.brand}</span><h1 className="heading-lg">{t.garage}</h1></div></div>
    {query.error && <div className="alert">{t.formError}</div>}
    {vehicles.length ? <section className="grid-3">{vehicles.map((vehicle) => {
      const counts = emptyStatusCounts(); vehicle.maintenanceItems.forEach((item) => counts[calculateMaintenanceStatus({ currentOdometer: vehicle.currentOdometer, nextServiceDate: item.nextServiceDate, nextServiceOdometer: item.nextServiceOdometer }).status]++);
      return <VehicleCard vehicle={vehicle} counts={counts} t={t} locale={locale} key={vehicle.id} />;
    })}</section> : <section className="card empty"><div className="empty-icon"><CarFront /></div><p>{t.noVehicles}</p></section>}

    <section className="card card-elevated stack" style={{ marginBlockStart: 14 }}>
      <div><span className="eyebrow"><Plus size={14} style={{ display: "inline" }} /> {t.addVehicle}</span><h2 className="heading-md">{t.addVehicle}</h2></div>
      <form action={createVehicleAction} className="form-grid two">
        <label className="field"><span className="label">{t.vehicleName}</span><input className="input" name="name" maxLength={80} placeholder="Peugeot 207" required /></label>
        <label className="field"><span className="label">{t.make}</span><input className="input" name="make" maxLength={60} required /></label>
        <label className="field"><span className="label">{t.model}</span><input className="input" name="model" maxLength={60} required /></label>
        <label className="field"><span className="label">{t.year}</span><input className="input" name="year" inputMode="numeric" /></label>
        <label className="field"><span className="label">{t.odometer}</span><input className="input" name="currentOdometer" inputMode="numeric" required /></label>
        <label className="field"><span className="label">{t.plate}</span><input className="input" name="plateNumber" /></label>
        <label className="field"><span className="label">{t.vin}</span><input className="input" name="vin" /></label>
        <label className="checkbox" style={{ alignSelf: "end", paddingBlock: 12 }}><input type="checkbox" name="useTemplate" defaultChecked /><span><strong>{t.useTemplate}</strong><small className="muted" style={{ display: "block" }}>{t.starterDisclaimer}</small></span></label>
        <div className="form-actions"><button className="btn btn-accent" type="submit">{t.saveVehicle}</button></div>
      </form>
    </section>
  </main>;
}

