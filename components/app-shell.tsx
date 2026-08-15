import { Gauge } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/format";
import { NavLinks, type NavItem } from "./nav-links";
import { LanguageSwitcher } from "./language-switcher";
import { SignOutButton } from "./auth-buttons";
import { ThemeToggle } from "./theme-toggle";

export function Brand() {
  return <span className="brand"><span className="brand-mark"><Gauge size={19} /></span>Autora</span>;
}

export function AppShell({ children, t, locale, userName }: { children: React.ReactNode; t: Dictionary; locale: Locale; userName: string }) {
  const items: NavItem[] = [
    { href: "/dashboard", label: t.home, icon: "home" },
    { href: "/garage", label: t.garage, icon: "garage" },
    { href: "/history", label: t.history, icon: "history" },
    { href: "/reminders", label: t.reminders, icon: "reminders" },
    { href: "/profile", label: t.profile, icon: "profile" },
  ];
  return <div className="app-layout" dir={locale === "fa" ? "rtl" : "ltr"}>
    <aside className="desktop-sidebar">
      <Brand />
      <NavLinks items={items} variant="sidebar" />
      <div className="sidebar-foot"><SignOutButton label={t.signOut} /></div>
    </aside>
    <div className="app-main">
      <header className="app-topbar">
        <div><span className="topbar-title">{t.welcome}, {userName.split(" ")[0]}</span></div>
        <div className="header-actions"><LanguageSwitcher locale={locale} /><ThemeToggle /></div>
      </header>
      {children}
      <NavLinks items={items} variant="bottom" />
    </div>
  </div>;
}

