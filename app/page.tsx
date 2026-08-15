import Link from "next/link";
import {
  ArrowUpRight,
  BellRing,
  CalendarDays,
  CarFront,
  Check,
  CheckCircle2,
  CircleGauge,
  Clock3,
  Droplets,
  Fingerprint,
  History,
  LockKeyhole,
  Route,
  ShieldCheck,
  Sparkles,
  WalletCards,
  Wrench,
} from "lucide-react";
import { Brand } from "@/components/app-shell";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { getDictionary, getPublicLocale } from "@/lib/i18n";
import styles from "./landing.module.css";

const landingCopy = {
  en: {
    badge: "A calmer way to care for your car",
    proof: ["No spreadsheets", "All vehicles in one place", "Private account"],
    preview: "Live vehicle overview",
    synced: "Everything is on track",
    nextService: "Next service",
    engineOil: "Engine oil",
    brakeCheck: "Brake inspection",
    remaining: "1,240 km remaining",
    days: "in 18 days",
    snapshot: "Know what your car needs — before it asks.",
    snapshotBody: "Autora turns mileage, dates, services and costs into one clear maintenance plan.",
    stepDescriptions: [
      "Save the details that matter, from mileage to VIN.",
      "Start with useful defaults and tailor every interval.",
      "See what is healthy, due soon, or needs attention.",
    ],
    sectionBadge: "One clear dashboard",
    featuresTitle: "Less guessing. More confident driving.",
    featuresBody: "The important details surface at the right moment, without turning car care into another full-time job.",
    healthTitle: "Maintenance health at a glance",
    healthBody: "A simple status system makes priorities obvious.",
    reminderBody: "Get a clear heads-up based on time or mileage.",
    historyBody: "Every completed service stays organized and searchable.",
    garageBody: "Switch between family cars without losing context.",
    privacyBody: "Your vehicle records belong to you. Every account is isolated and protected.",
    statOne: "maintenance states",
    statTwo: "organized timeline",
    statThree: "unnecessary clutter",
    ctaBody: "Create your free garage and add your first vehicle in a few minutes.",
    free: "Free to start",
  },
  fa: {
    badge: "یک راه آرام‌تر برای مراقبت از خودرو",
    proof: ["بدون فایل اکسل", "همه خودروها در یک جا", "حساب کاملاً شخصی"],
    preview: "نمای زنده خودرو",
    synced: "همه‌چیز مرتب است",
    nextService: "سرویس بعدی",
    engineOil: "روغن موتور",
    brakeCheck: "بازدید ترمز",
    remaining: "۱٬۲۴۰ کیلومتر باقی‌مانده",
    days: "۱۸ روز دیگر",
    snapshot: "قبل از اینکه خودرو یادآوری کند، شما بدانید چه لازم دارد.",
    snapshotBody: "اتورا کارکرد، تاریخ‌ها، سرویس‌ها و هزینه‌ها را به یک برنامه نگهداری روشن تبدیل می‌کند.",
    stepDescriptions: [
      "اطلاعات مهم خودرو، از کارکرد تا شماره شاسی را ثبت کنید.",
      "با برنامه پیشنهادی شروع کنید و هر بازه را شخصی‌سازی کنید.",
      "وضعیت سالم، نزدیک سرویس و نیازمند توجه را یک‌جا ببینید.",
    ],
    sectionBadge: "یک داشبورد روشن",
    featuresTitle: "حدس کمتر، رانندگی مطمئن‌تر.",
    featuresBody: "اطلاعات مهم درست در زمان لازم نمایش داده می‌شوند؛ بدون اینکه نگهداری خودرو به یک کار تمام‌وقت تبدیل شود.",
    healthTitle: "سلامت نگهداری در یک نگاه",
    healthBody: "وضعیت‌های ساده، اولویت هر سرویس را کاملاً روشن می‌کنند.",
    reminderBody: "بر اساس زمان یا کارکرد، به‌موقع یادآوری بگیرید.",
    historyBody: "همه سرویس‌های انجام‌شده مرتب و قابل جست‌وجو می‌مانند.",
    garageBody: "بین خودروهای خانواده جابه‌جا شوید، بدون اینکه اطلاعات گم شوند.",
    privacyBody: "اطلاعات خودرو متعلق به شماست؛ هر حساب جدا و محافظت‌شده نگهداری می‌شود.",
    statOne: "وضعیت نگهداری",
    statTwo: "تاریخچه منظم",
    statThree: "شلوغی اضافه",
    ctaBody: "گاراژ رایگان خود را بسازید و اولین خودرو را در چند دقیقه اضافه کنید.",
    free: "شروع رایگان",
  },
} as const;

export default async function LandingPage() {
  const locale = await getPublicLocale();
  const t = getDictionary(locale);
  const copy = landingCopy[locale];
  const Arrow = ArrowUpRight;

  const steps = [
    { number: "01", title: t.stepOne, description: copy.stepDescriptions[0], icon: CarFront },
    { number: "02", title: t.stepTwo, description: copy.stepDescriptions[1], icon: Wrench },
    { number: "03", title: t.stepThree, description: copy.stepDescriptions[2], icon: CheckCircle2 },
  ];

  return (
    <main className={styles.landing} dir={locale === "fa" ? "rtl" : "ltr"}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <Link href="/" aria-label="Autora home"><Brand /></Link>
          <nav className={styles.nav} aria-label="Landing navigation">
            <a href="#how">{t.howItWorks}</a>
            <a href="#features">{t.maintenance}</a>
            <a href="#privacy">{t.privacy}</a>
          </nav>
          <div className="header-actions">
            <LanguageSwitcher locale={locale} />
            <ThemeToggle />
            <Link className="btn btn-secondary btn-sm" href="/login">{t.signIn}</Link>
          </div>
        </header>

        <section className={styles.hero}>
          <div className={styles.heroGlow} aria-hidden="true" />
          <div className={styles.heroCopy}>
            <span className={styles.badge}><Sparkles size={15} />{copy.badge}</span>
            <h1>{t.hero}</h1>
            <p>{t.heroBody}</p>
            <div className={styles.heroActions}>
              <Link className={`${styles.primaryButton} btn`} href="/register">
                {t.getStarted}<Arrow size={18} />
              </Link>
              <Link className={`${styles.ghostButton} btn`} href="#features">{t.maintenance}</Link>
            </div>
            <div className={styles.proofRow}>
              {copy.proof.map((item) => <span key={item}><Check size={15} />{item}</span>)}
            </div>
          </div>

          <div className={styles.heroVisual} aria-label={copy.preview}>
            <div className={styles.previewWindow}>
              <div className={styles.previewTopbar}>
                <div>
                  <span className={styles.previewLabel}>{copy.preview}</span>
                  <strong>Peugeot 207</strong>
                </div>
                <span className={styles.liveStatus}><i />{copy.synced}</span>
              </div>

              <div className={styles.carStage}>
                <div className={styles.roadLine} />
                <div className={styles.carHalo} />
                <CarFront className={styles.carIcon} strokeWidth={1.4} />
                <span className={styles.mileageChip}><Route size={16} /> 48,760 km</span>
              </div>

              <div className={styles.previewGrid}>
                <div className={styles.healthCard}>
                  <div className={styles.healthRing}><strong>82</strong><span>%</span></div>
                  <div><span>{t.health}</span><strong>{t.healthy}</strong></div>
                </div>
                <div className={styles.serviceStack}>
                  <div className={styles.serviceRow}>
                    <span className={styles.serviceIcon}><Droplets size={17} /></span>
                    <div><strong>{copy.engineOil}</strong><small>{copy.remaining}</small></div>
                    <span className={styles.progressDot} />
                  </div>
                  <div className={styles.serviceRow}>
                    <span className={styles.serviceIcon}><CircleGauge size={17} /></span>
                    <div><strong>{copy.brakeCheck}</strong><small>{copy.days}</small></div>
                    <span className={styles.warningDot} />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.floatingReminder}>
              <span><BellRing size={18} /></span>
              <div><small>{copy.nextService}</small><strong>{copy.engineOil}</strong></div>
              <CalendarDays size={18} />
            </div>
          </div>
        </section>

        <section className={styles.intro}>
          <p>{copy.snapshot}</p>
          <span>{copy.snapshotBody}</span>
        </section>

        <section className={styles.how} id="how">
          <div className={styles.sectionHeading}>
            <span className={styles.kicker}>Autora / 01</span>
            <h2>{t.howItWorks}</h2>
          </div>
          <div className={styles.steps}>
            {steps.map(({ number, title, description, icon: Icon }) => (
              <article className={styles.stepCard} key={number}>
                <div className={styles.stepTop}><span>{number}</span><Icon size={24} /></div>
                <h3>{title}</h3>
                <p>{description}</p>
                <div className={styles.stepLine}><i /></div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.features} id="features">
          <div className={styles.featureIntro}>
            <span className={styles.badge}><CircleGauge size={15} />{copy.sectionBadge}</span>
            <h2>{copy.featuresTitle}</h2>
            <p>{copy.featuresBody}</p>
          </div>

          <div className={styles.bento}>
            <article className={`${styles.bentoCard} ${styles.healthFeature}`}>
              <div className={styles.cardIcon}><CircleGauge /></div>
              <div><h3>{copy.healthTitle}</h3><p>{copy.healthBody}</p></div>
              <div className={styles.statusBars} aria-hidden="true">
                <span><i className={styles.greenBar} />{t.healthy}<b>5</b></span>
                <span><i className={styles.yellowBar} />{t.dueSoon}<b>2</b></span>
                <span><i className={styles.redBar} />{t.overdue}<b>0</b></span>
              </div>
            </article>

            <article className={`${styles.bentoCard} ${styles.reminderFeature}`}>
              <div className={styles.cardIcon}><BellRing /></div>
              <div><h3>{t.featureReminders}</h3><p>{copy.reminderBody}</p></div>
              <div className={styles.miniCalendar} aria-hidden="true">
                <span>16</span><span>17</span><span className={styles.today}>18<i /></span><span>19</span><span>20</span>
              </div>
            </article>

            <article className={`${styles.bentoCard} ${styles.historyFeature}`}>
              <div className={styles.cardIcon}><History /></div>
              <div><h3>{t.featureHistory}</h3><p>{copy.historyBody}</p></div>
              <div className={styles.timeline} aria-hidden="true">
                <span><i /><b>{copy.engineOil}</b><small>48,000 km</small></span>
                <span><i /><b>{copy.brakeCheck}</b><small>42,500 km</small></span>
              </div>
            </article>

            <article className={`${styles.bentoCard} ${styles.garageFeature}`}>
              <div className={styles.cardIcon}><CarFront /></div>
              <div><h3>{t.featureGarage}</h3><p>{copy.garageBody}</p></div>
              <div className={styles.garageCards} aria-hidden="true">
                <span><CarFront /><b>207</b></span><span><CarFront /><b>Corolla</b></span>
              </div>
            </article>

            <article className={`${styles.bentoCard} ${styles.privacyFeature}`} id="privacy">
              <div className={styles.cardIcon}><LockKeyhole /></div>
              <div><h3>{t.privacy}</h3><p>{copy.privacyBody}</p></div>
              <div className={styles.securitySeal} aria-hidden="true"><ShieldCheck /><span><b>Private</b><small>Protected by design</small></span><Fingerprint /></div>
            </article>
          </div>
        </section>

        <section className={styles.stats} aria-label="Autora benefits">
          <div><strong>4</strong><span>{copy.statOne}</span></div>
          <div><strong>1</strong><span>{copy.statTwo}</span></div>
          <div><strong>0</strong><span>{copy.statThree}</span></div>
        </section>

        <section className={styles.cta}>
          <div className={styles.ctaOrbit} aria-hidden="true"><Clock3 /><Wrench /><WalletCards /></div>
          <div>
            <span className={styles.ctaLabel}>{copy.free}</span>
            <h2>{t.ctaTitle}</h2>
            <p>{copy.ctaBody}</p>
          </div>
          <Link className={`${styles.ctaButton} btn`} href="/register">{t.getStarted}<Arrow size={18} /></Link>
        </section>

        <footer className={styles.footer}>
          <Brand />
          <span>© {new Date().getFullYear()} Autora · {t.tagline}</span>
          <Link href="/register">{copy.free}<Arrow size={15} /></Link>
        </footer>
      </div>
    </main>
  );
}
