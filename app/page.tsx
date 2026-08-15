import Link from "next/link";
import { BellRing, CarFront, CheckCircle2, Clock3, History, LockKeyhole, Wrench } from "lucide-react";
import { Brand } from "@/components/app-shell";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { getDictionary, getPublicLocale } from "@/lib/i18n";

export default async function LandingPage() {
  const locale = await getPublicLocale();
  const t = getDictionary(locale);
  return <main dir={locale === "fa" ? "rtl" : "ltr"}>
    <div className="container">
      <header className="site-header">
        <Brand />
        <nav className="landing-nav" aria-label="Landing navigation"><a href="#how">{t.howItWorks}</a><a href="#features">{t.maintenance}</a><a href="#privacy">{t.privacy}</a></nav>
        <div className="header-actions"><LanguageSwitcher locale={locale} /><ThemeToggle /><Link className="btn btn-secondary btn-sm" href="/login">{t.signIn}</Link></div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">{t.tagline}</span>
          <h1 className="heading-xl">{t.hero}</h1>
          <p className="hero-body">{t.heroBody}</p>
          <div className="hero-actions"><Link className="btn btn-accent" href="/register">{t.getStarted}</Link><Link className="btn btn-secondary" href="/login">{t.signIn}</Link></div>
        </div>
        <div className="hero-visual" aria-label={t.overview}>
          <div className="hero-stat"><strong>5</strong><span>{t.healthy}</span></div>
          <div className="hero-stat"><strong>2</strong><span>{t.dueSoon}</span></div>
          <div className="hero-stat"><strong>0</strong><span>{t.overdue}</span></div>
        </div>
      </section>

      <section className="landing-section" id="how">
        <div className="section-head"><div><span className="eyebrow">Autora</span><h2 className="heading-lg">{t.howItWorks}</h2></div></div>
        <div className="grid-3">
          {[["01", t.stepOne, CarFront], ["02", t.stepTwo, Wrench], ["03", t.stepThree, CheckCircle2]].map(([number, title, Icon]) => <article className="card feature-card" key={String(number)}><span className="step-number">{String(number)}</span><div className="feature-icon"><Icon size={23} /></div><h3 className="heading-md">{String(title)}</h3></article>)}
        </div>
      </section>

      <section className="landing-section" id="features">
        <div className="grid-2">
          <article className="card feature-card card-elevated"><div className="feature-icon"><BellRing /></div><div><h3 className="heading-md">{t.featureReminders}</h3><p className="muted">{t.upcoming}</p></div></article>
          <article className="card feature-card"><div className="feature-icon"><History /></div><div><h3 className="heading-md">{t.featureHistory}</h3><p className="muted">{t.history}</p></div></article>
          <article className="card feature-card"><div className="feature-icon"><CarFront /></div><div><h3 className="heading-md">{t.featureGarage}</h3><p className="muted">{t.garage}</p></div></article>
          <article className="card feature-card" id="privacy"><div className="feature-icon"><LockKeyhole /></div><div><h3 className="heading-md">{t.privacy}</h3><p className="muted">{t.allClear}</p></div></article>
        </div>
      </section>

      <section className="landing-section"><div className="cta-band"><div><Clock3 size={28} /><h2 className="heading-lg">{t.ctaTitle}</h2></div><Link className="btn btn-primary" href="/register">{t.getStarted}</Link></div></section>
      <footer className="site-footer"><span>© {new Date().getFullYear()} Autora · {t.tagline}</span></footer>
    </div>
  </main>;
}

