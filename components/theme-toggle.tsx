"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const subscribe = () => () => undefined;

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const isDark = mounted && resolvedTheme === "dark";
  return (
    <button className="btn btn-ghost btn-sm" type="button" onClick={() => { const next = isDark ? "light" : "dark"; document.cookie = `autora-theme=${next}; path=/; max-age=31536000; samesite=lax`; setTheme(next); }} aria-label={isDark ? "Use light theme" : "Use dark theme"}>
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
