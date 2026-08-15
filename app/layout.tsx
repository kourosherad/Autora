import type { Metadata, Viewport } from "next";
import { Geist, Vazirmatn } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { getPublicLocale, getPublicTheme } from "@/lib/i18n";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const vazir = Vazirmatn({ subsets: ["arabic"], variable: "--font-vazir" });
const siteUrl = process.env.AUTH_URL
  ?? process.env.NEXTAUTH_URL
  ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Autora — Smart Vehicle Maintenance", template: "%s — Autora" },
  description: "Keep your vehicle healthy, your history organized, and your maintenance on schedule.",
  applicationName: "Autora",
  manifest: "/manifest.webmanifest",
  robots: { index: true, follow: true },
  openGraph: { type: "website", title: "Autora — Smart Vehicle Maintenance", description: "Never miss your next service.", images: [{ url: "/og.png", width: 1733, height: 908, alt: "Autora — Never miss your next service." }] },
  twitter: { card: "summary_large_image", title: "Autora — Smart Vehicle Maintenance", description: "Never miss your next service.", images: ["/og.png"] },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0d3b36" };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [locale, theme] = await Promise.all([getPublicLocale(), getPublicTheme()]);
  return (
    <html lang={locale} dir={locale === "fa" ? "rtl" : "ltr"} suppressHydrationWarning>
      <body className={`${geist.variable} ${vazir.variable}`} style={{ "--font-sans": locale === "fa" ? "IRANSansWeb, IRANSans, var(--font-vazir)" : "var(--font-geist)" } as React.CSSProperties}>
        <ThemeProvider defaultTheme={theme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
