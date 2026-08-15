import { Clock3, Filter } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import { getDictionary } from "@/lib/i18n";
import { maintenanceName } from "@/lib/labels";

export default async function HistoryPage({ searchParams }: { searchParams: Promise<{ vehicle?: string; category?: string }> }) {
  const user = await requireUser(); const locale = user.preferredLanguage; const t = getDictionary(locale); const filters = await searchParams;
  const vehicles = await db.vehicle.findMany({ where: { userId: user.id }, select: { id: true, name: true } });
  const records = await db.maintenanceRecord.findMany({ where: { vehicle: { userId: user.id }, ...(filters.vehicle ? { vehicleId: filters.vehicle } : {}), ...(filters.category ? { maintenanceItem: { category: filters.category as never } } : {}) }, include: { vehicle: true, maintenanceItem: true }, orderBy: { serviceDate: "desc" }, take: 100 });
  return <main className="container page stack"><div><span className="eyebrow">{t.brand}</span><h1 className="heading-lg">{t.history}</h1></div>
    <form className="card form-grid two" method="get"><label className="field"><span className="label">{t.garage}</span><select className="input" name="vehicle" defaultValue={filters.vehicle ?? ""}><option value="">{t.garage}</option>{vehicles.map((vehicle) => <option value={vehicle.id} key={vehicle.id}>{vehicle.name}</option>)}</select></label><label className="field"><span className="label">{t.category}</span><select className="input" name="category" defaultValue={filters.category ?? ""}><option value="">{t.category}</option><option value="ENGINE">Engine</option><option value="FILTERS">Filters</option><option value="BRAKES">Brakes</option><option value="FLUIDS">Fluids</option></select></label><button className="btn btn-secondary" type="submit"><Filter size={17}/>{t.history}</button></form>
    {records.length ? <section className="card">{records.map((record) => <article className="list-row" key={record.id}><div className="timeline-item"><strong>{maintenanceName(record.maintenanceItem?.name ?? t.maintenance, locale)}</strong><div className="muted" style={{ fontSize: ".82rem" }}>{record.vehicle.name} · {formatDate(record.serviceDate, locale)} · {formatNumber(record.odometer, locale)} {t.km}</div>{record.provider && <small className="muted">{record.provider}</small>}</div>{record.cost && <strong>{formatCurrency(Number(record.cost), locale)}</strong>}</article>)}</section> : <section className="card empty"><div className="empty-icon"><Clock3/></div><span>{t.noHistory}</span></section>}
  </main>;
}

