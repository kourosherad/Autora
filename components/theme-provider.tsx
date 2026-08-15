"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, defaultTheme }: { children: React.ReactNode; defaultTheme: "system" | "light" | "dark" }) {
  return <NextThemesProvider attribute="class" defaultTheme={defaultTheme} enableSystem>{children}</NextThemesProvider>;
}
