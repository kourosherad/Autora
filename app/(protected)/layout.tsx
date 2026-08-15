import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const locale = user.preferredLanguage;
  const t = getDictionary(locale);
  return <AppShell t={t} locale={locale} userName={user.name}>{children}</AppShell>;
}
