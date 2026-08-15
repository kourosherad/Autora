import Link from "next/link";
import { registerAction } from "@/app/actions";
import { getDictionary, getPublicLocale } from "@/lib/i18n";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const locale = await getPublicLocale(); const t = getDictionary(locale); const query = await searchParams;
  return <section className="card card-elevated stack" style={{ width: "min(100%, 460px)", padding: "clamp(22px, 6vw, 38px)" }} dir={locale === "fa" ? "rtl" : "ltr"}>
    <div><span className="eyebrow">{t.tagline}</span><h1 className="heading-lg">{t.register}</h1></div>
    {query.error && <div className="alert" role="alert">{query.error === "exists" ? t.accountExists : t.formError}</div>}
    <form action={registerAction} className="form-grid">
      <input type="hidden" name="locale" value={locale} />
      <label className="field"><span className="label">{t.name}</span><input className="input" name="name" autoComplete="name" minLength={2} maxLength={80} required /></label>
      <label className="field"><span className="label">{t.email}</span><input className="input" name="email" type="email" autoComplete="email" required /></label>
      <label className="field"><span className="label">{t.password}</span><input className="input" name="password" type="password" autoComplete="new-password" minLength={8} maxLength={128} pattern="(?=.*[A-Za-z])(?=.*\d).{8,}" required /></label>
      <button className="btn btn-accent" type="submit">{t.register}</button>
    </form>
    <div className="divider" /><Link className="btn btn-secondary" href="/login">{t.signIn}</Link>
  </section>;
}

