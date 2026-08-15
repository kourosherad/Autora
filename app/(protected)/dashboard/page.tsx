import Link from "next/link";
import { AlertTriangle, ArrowRight, CarFront, CheckCircle2, Plus } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import { getDictionary } from "@/lib/i18n";
import { calculateMaintenanceStatus } from "@/lib/maintenance";
import { emptyStatusCounts } from "@/lib/queries";

export default async function DashboardPage() {
  const user = await requireUser(); const locale = user.preferredLanguage; const t = getDictionary(locale);
  const vehicles = await db.vehicle.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: { maintenanceItems: { where: { enabled: true } }, maintenanceRecords: { orderBy: { serviceDate: "desc" }, take: 5 }, expenses: true },
  });
  if (!vehicles.length) return <main className="container page"><section className="card empty"><div className="empty-icon"><CarFront /></div><h1 className="heading-lg">{t.noVehicles}</h1><Link className="btn btn-accent" href="/garage"><Plus size={18} />{t.addFirstVehicle}</Link></section></main>;

  const allItems = vehicles.flatMap((vehicle) => vehicle.maintenanceItems.map((item) => ({ ...item, vehicle })));
  const statusCounts = emptyStatusCounts();
  const evaluated = allItems.map((item) => ({ item, result: calculateMaintenanceStatus({ currentOdometer: item.vehicle.currentOdometer, nextServiceDate: item.nextServiceDate, nextServiceOdometer: item.nextServiceOdometer }) }));
  evaluated.forEach(({ result }) => statusCounts[result.status]++);
  const priority = { OVERDUE: 0, DUE: 1, DUE_SOON: 2, HEALTHY: 3 };
  evaluated.sort((a, b) => priority[a.result.status] - priority[b.result.status]);
  const expenses = vehicles.flatMap((vehicle) => vehicle.expenses);
  const now = new Date(); const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)); const yearStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  const total = (after?: Date) => expenses.filter((expense) => !after || expense.date >= after).reduce((sum, expense) => sum + Number(expense.amount), 0);
  const recent = vehicles.flatMap((vehicle) => vehicle.maintenanceRecords.map((record) => ({ ...record, vehicle }))).sort((a, b) => b.serviceDate.getTime() - a.serviceDate.getTime()).slice(0, 5);
  const urgent = statusCounts.OVERDUE + statusCounts.DUE;

  return <main className="container page stack">
    <section className="dashboard-hero">
      <span className="eyebrow" style={{ color: "#ff9a71" }}>{t.overview}</span>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 18, marginBlockStart: 14 }}><div><strong style={{ display: "block", fontSize: "2.7rem", letterSpacing: "-.05em" }}>{formatNumber(urgent, locale)}</strong><span style={{ color: "#bfd0ca" }}>{urgent ? t.urgent : t.allClear}</span></div>{urgent ? <AlertTriangle size={34} color="#ff8352" /> : <CheckCircle2 size={34} color="#75d0aa" />}</div>
    </section>

    <section className="status-grid" aria-label={t.health}>
      {[["HEALTHY", t.healthy], ["DUE_SOON", t.dueSoon], ["DUE", t.due], ["OVERDUE", t.overdue]].map(([status, label]) => <div className="status-tile" key={status}><strong>{formatNumber(statusCounts[status as keyof typeof statusCounts], locale)}</strong><span className="metric-label">{label}</span></div>)}
    </section>

    <div className="dashboard-grid">
      <section className="card"><div className="section-head"><div><span className="eyebrow">{t.maintenance}</span><h2 className="heading-md">{t.upcoming}</h2></div></div>
        {evaluated.slice(0, 6).map(({ item, result }) => <Link href={`/vehicles/${item.vehicleId}/maintenance`} className="list-row" key={item.id}><div><strong>{item.name}</strong><div className="muted" style={{ fontSize: ".82rem" }}>{item.vehicle.name} · {result.remainingKm !== null ? `${formatNumber(Math.abs(result.remainingKm), locale)} ${t.km}` : result.remainingDays !== null ? `${formatNumber(Math.abs(result.remainingDays), locale)} ${t.days}` : "—"}</div></div><StatusBadge status={result.status} t={t} /></Link>)}
      </section>
      <section className="card"><div className="section-head"><div><span className="eyebrow">{t.expenses}</span><h2 className="heading-md">{t.spending}</h2></div></div>
        <div className="stack"><div className="metric"><span className="metric-value">{formatCurrency(total(monthStart), locale)}</span><span className="metric-label">{t.thisMonth}</span></div><div className="divider"/><div className="grid-2"><div className="metric"><strong>{formatCurrency(total(yearStart), locale)}</strong><span className="metric-label">{t.thisYear}</span></div><div className="metric"><strong>{formatCurrency(total(), locale)}</strong><span className="metric-label">{t.lifetime}</span></div></div></div>
      </section>
      <section className="card"><div className="section-head"><h2 className="heading-md">{t.recent}</h2><Link className="btn btn-ghost btn-sm" href="/history">{t.history}<ArrowRight size={16}/></Link></div>
        {recent.length ? recent.map((record) => <div className="list-row" key={record.id}><div><strong>{record.vehicle.name}</strong><div className="muted" style={{ fontSize: ".82rem" }}>{formatDate(record.serviceDate, locale)} · {formatNumber(record.odometer, locale)} {t.km}</div></div>{record.cost && <strong>{formatCurrency(Number(record.cost), locale)}</strong>}</div>) : <div className="empty"><span className="muted">{t.noHistory}</span></div>}
      </section>
      <section className="card"><div className="section-head"><h2 className="heading-md">{t.garage}</h2><Link className="btn btn-secondary btn-sm" href="/garage"><Plus size={16}/>{t.addVehicle}</Link></div>
        {vehicles.slice(0,4).map((vehicle) => <Link className="list-row" href={`/vehicles/${vehicle.id}`} key={vehicle.id}><div><strong>{vehicle.name}</strong><div className="muted" style={{ fontSize: ".82rem" }}>{vehicle.make} {vehicle.model}</div></div><span>{formatNumber(vehicle.currentOdometer, locale)} {t.km}</span></Link>)}
      </section>
    </div>
  </main>;
}

