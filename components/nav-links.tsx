"use client";

import Link from "next/link";
import { Bell, Car, Clock3, Home, UserRound, type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export type NavItem = { href: string; label: string; icon: "home" | "garage" | "history" | "reminders" | "profile" };
const icons: Record<NavItem["icon"], LucideIcon> = { home: Home, garage: Car, history: Clock3, reminders: Bell, profile: UserRound };

export function NavLinks({ items, variant }: { items: NavItem[]; variant: "bottom" | "sidebar" }) {
  const pathname = usePathname();
  return <nav className={variant === "bottom" ? "bottom-nav" : "sidebar-nav"} aria-label="Primary navigation">
    {items.map((item) => {
      const Icon = icons[item.icon];
      const active = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
      return <Link className={`nav-item${active ? " active" : ""}`} href={item.href} key={item.href}><Icon aria-hidden="true" /><span>{item.label}</span></Link>;
    })}
  </nav>;
}

