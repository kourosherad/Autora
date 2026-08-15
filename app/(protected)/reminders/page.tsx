import Link from "next/link";
import { Bell, CheckCircle2 } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatNumber } from "@/lib/format";
import { getDictionary } from "@/lib/i18n";
import { maintenanceName } from "@/lib/labels";
import { calculateMaintenanceStatus } from "@/lib/maintenance";

export default async function RemindersPage() {
  const user = await requireUser(); const locale = user.preferredLanguage; const t = getDictionary(locale);
  const items = await db.maintenanceItem.findMany({ where: { enabled: true, vehicle: { userId: user.id } }, include: { vehicle: true }, orderBy: { nextServiceDate: "asc" } });
  const evaluated = items.map((item) => ({ item, result: calculateMaintenanceStatus({ currentOdometer: item.vehicle.currentOdometer, nextServiceDate: item.nextServiceDate, nextServiceOdometer: item.nextServiceOdometer }) })).filter(({ result }) => result.status !== "HEALTHY");
  return <main className="container page stack"><div><span className="eyebrow">{t.brand}</span><h1 className="heading-lg">{t.reminders}</h1></div>{evaluated.length ? <section className="stack">{evaluated.map(({item,result}) => <Link className="card list-row" href={`/vehicles/${item.vehicleId}/maintenance`} key={item.id}><div style={{ display: "flex", gap: 12, alignItems: "center" }}><div className="empty-icon" style={{ width: 44, height: 44 }}><Bell size={20}/></div><div><strong>{maintenanceName(item.name, locale)}</strong><div className="muted" style={{ fontSize: ".82rem" }}>{item.vehicle.name} · {result.remainingKm !== null ? `${formatNumber(Math.abs(result.remainingKm), locale)} ${t.km}` : `${formatNumber(Math.abs(result.remainingDays ?? 0), locale)} ${t.days}`}</div></div></div><StatusBadge status={result.status} t={t}/></Link>)}</section> : <section className="card empty"><div className="empty-icon"><CheckCircle2/></div><h2 className="heading-md">{t.noReminders}</h2><span className="muted">{t.allClear}</span></section>}</main>;
}
