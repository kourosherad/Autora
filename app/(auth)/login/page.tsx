import Link from "next/link";
import { SignInForm } from "@/components/sign-in-form";
import { getDictionary, getPublicLocale } from "@/lib/i18n";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ registered?: string }> }) {
  const locale = await getPublicLocale(); const t = getDictionary(locale); const query = await searchParams;
  return <section className="card card-elevated stack" style={{ width: "min(100%, 430px)", padding: "clamp(22px, 6vw, 38px)" }} dir={locale === "fa" ? "rtl" : "ltr"}>
    <div><span className="eyebrow">{t.brand}</span><h1 className="heading-lg">{t.signIn}</h1></div>
    {query.registered && <div className="alert" style={{ background: "var(--positive-soft)", color: "var(--positive)" }}>{t.created}</div>}
    <SignInForm labels={{ email: t.email, password: t.password, submit: t.signIn, error: t.invalidCredentials }} />
    <div className="divider" /><Link className="btn btn-secondary" href="/register">{t.register}</Link>
  </section>;
}

