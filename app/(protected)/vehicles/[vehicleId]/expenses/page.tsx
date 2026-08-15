import { CircleDollarSign, Plus } from "lucide-react";
import { notFound } from "next/navigation";
import { createExpenseAction } from "@/app/actions";
import { LocalizedDateInput } from "@/components/localized-date-input";
import { VehicleTabs } from "@/components/vehicle-tabs";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/format";
import { getDictionary } from "@/lib/i18n";

const categories = ["MAINTENANCE","REPAIR","PARTS","TIRES","FUEL","INSURANCE","OTHER"] as const;

export default async function ExpensesPage({ params, searchParams }: { params: Promise<{ vehicleId: string }>; searchParams: Promise<{ category?: string; error?: string }> }) {
  const user = await requireUser(); const locale = user.preferredLanguage; const t = getDictionary(locale); const { vehicleId } = await params; const query = await searchParams;
  const vehicle = await db.vehicle.findFirst({ where: { id: vehicleId, userId: user.id }, include: { expenses: { where: query.category ? { category: query.category as never } : {}, orderBy: { date: "desc" }, take: 100 } } }); if (!vehicle) notFound();
  const now = new Date(); const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)); const yearStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  const total = (after?: Date) => vehicle.expenses.filter((expense) => !after || expense.date >= after).reduce((sum, expense) => sum + Number(expense.amount), 0);
  const monthTotals = Array.from({ length: 6 }, (_, index) => { const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (5-index), 1)); const end = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth()+1, 1)); return { date, value: vehicle.expenses.filter((e) => e.date >= date && e.date < end).reduce((sum,e) => sum + Number(e.amount), 0) }; });
  const max = Math.max(...monthTotals.map((month) => month.value), 1);
  return <main className="container page stack"><div><span className="eyebrow">{vehicle.name}</span><h1 className="heading-lg">{t.expenses}</h1></div><VehicleTabs id={vehicle.id} active="expenses" t={t}/>{query.error && <div className="alert">{t.formError}</div>}
    <section className="grid-3"><div className="card metric"><span className="metric-value">{formatCurrency(total(monthStart), locale)}</span><span className="metric-label">{t.thisMonth}</span></div><div className="card metric"><span className="metric-value">{formatCurrency(total(yearStart), locale)}</span><span className="metric-label">{t.thisYear}</span></div><div className="card metric"><span className="metric-value">{formatCurrency(total(), locale)}</span><span className="metric-label">{t.lifetime}</span></div></section>
    <section className="card"><h2 className="heading-md">{t.thisYear}</h2><div className="chart" aria-label={t.spending}>{monthTotals.map((month) => <div className="bar" style={{ height: `${Math.max(4, month.value/max*100)}%` }} title={`${formatDate(month.date, locale)}: ${formatCurrency(month.value, locale)}`} key={month.date.toISOString()}/>)}</div></section>
    {vehicle.expenses.length ? <section className="card">{vehicle.expenses.map((expense) => <div className="list-row" key={expense.id}><div><strong>{expense.description ?? expense.category}</strong><div className="muted" style={{ fontSize: ".82rem" }}>{formatDate(expense.date, locale)} · {expense.category}</div></div><strong>{formatCurrency(Number(expense.amount), locale, expense.currency)}</strong></div>)}</section> : <section className="card empty"><div className="empty-icon"><CircleDollarSign/></div><span>{t.noExpenses}</span></section>}
    <section className="card card-elevated stack"><div><span className="eyebrow"><Plus size={14} style={{display:"inline"}}/> {t.addExpense}</span><h2 className="heading-md">{t.addExpense}</h2></div><form action={createExpenseAction} className="form-grid two"><input type="hidden" name="vehicleId" value={vehicle.id}/><label className="field"><span className="label">{t.category}</span><select className="input" name="category">{categories.map((category)=><option value={category} key={category}>{category}</option>)}</select></label><label className="field"><span className="label">{t.amount}</span><input className="input" name="amount" inputMode="numeric" required/></label><label className="field"><span className="label">{t.date}</span><LocalizedDateInput name="date" locale={locale} required/></label><label className="field"><span className="label">{t.description}</span><input className="input" name="description"/></label><button className="btn btn-accent" type="submit">{t.saveExpense}</button></form></section>
  </main>;
}

