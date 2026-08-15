import { Clock3 } from "lucide-react";
import { notFound } from "next/navigation";
import { VehicleTabs } from "@/components/vehicle-tabs";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import { getDictionary } from "@/lib/i18n";
import { maintenanceName } from "@/lib/labels";

export default async function VehicleHistoryPage({ params }: { params: Promise<{ vehicleId: string }> }) {
  const user = await requireUser(); const locale = user.preferredLanguage; const t = getDictionary(locale); const { vehicleId } = await params;
  const vehicle = await db.vehicle.findFirst({ where: { id: vehicleId, userId: user.id }, include: { maintenanceRecords: { include: { maintenanceItem: true }, orderBy: { serviceDate: "desc" }, take: 100 } } }); if (!vehicle) notFound();
  return <main className="container page stack"><div><span className="eyebrow">{vehicle.name}</span><h1 className="heading-lg">{t.history}</h1></div><VehicleTabs id={vehicle.id} active="history" t={t}/>{vehicle.maintenanceRecords.length ? <section className="card">{vehicle.maintenanceRecords.map((record) => <article className="list-row" key={record.id}><div className="timeline-item"><strong>{maintenanceName(record.maintenanceItem?.name ?? t.maintenance, locale)}</strong><div className="muted" style={{ fontSize: ".82rem" }}>{formatDate(record.serviceDate, locale)} · {formatNumber(record.odometer, locale)} {t.km}</div>{record.notes && <small className="muted">{record.notes}</small>}</div>{record.cost && <strong>{formatCurrency(Number(record.cost), locale)}</strong>}</article>)}</section> : <section className="card empty"><div className="empty-icon"><Clock3/></div><span>{t.noHistory}</span></section>}</main>;
}

