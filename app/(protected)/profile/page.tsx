import { updateProfileAction } from "@/app/actions";
import { SignOutButton } from "@/components/auth-buttons";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDictionary } from "@/lib/i18n";

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const session = await requireUser(); const user = await db.user.findUniqueOrThrow({ where: { id: session.id } }); const locale = user.preferredLanguage; const t = getDictionary(locale); const query = await searchParams;
  return <main className="container page stack"><div><span className="eyebrow">{t.settings}</span><h1 className="heading-lg">{t.profile}</h1></div>{query.saved && <div className="alert" style={{background:"var(--positive-soft)",color:"var(--positive)"}}>{t.created}</div>}{query.error && <div className="alert">{t.formError}</div>}
    <section className="card card-elevated"><form action={updateProfileAction} className="form-grid two"><label className="field"><span className="label">{t.name}</span><input className="input" name="name" defaultValue={user.name} required/></label><label className="field"><span className="label">{t.email}</span><input className="input" name="email" type="email" defaultValue={user.email} required/></label><label className="field"><span className="label">{t.language}</span><select className="input" name="preferredLanguage" defaultValue={locale}><option value="fa">فارسی</option><option value="en">English</option></select></label><label className="field"><span className="label">{t.timezone}</span><select className="input" name="timezone" defaultValue={user.timezone}><option value="Asia/Tehran">Asia/Tehran</option><option value="UTC">UTC</option><option value="Europe/London">Europe/London</option><option value="America/New_York">America/New_York</option></select></label><label className="field"><span className="label">{t.appearance}</span><select className="input" name="theme" defaultValue={user.theme}><option value="SYSTEM">{t.system}</option><option value="LIGHT">{t.light}</option><option value="DARK">{t.dark}</option></select></label><div className="form-actions"><button className="btn btn-accent" type="submit">{t.saveProfile}</button></div></form></section>
    <section className="card"><SignOutButton label={t.signOut}/></section>
  </main>;
}
