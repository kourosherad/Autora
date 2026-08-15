import { Languages } from "lucide-react";
import { setPublicLocale } from "@/app/actions";

export function LanguageSwitcher({ locale }: { locale: "en" | "fa" }) {
  const next = locale === "en" ? "fa" : "en";
  return (
    <form action={setPublicLocale.bind(null, next)}>
      <button className="btn btn-ghost btn-sm" type="submit" aria-label={locale === "en" ? "Switch to Persian" : "تغییر زبان به انگلیسی"}>
        <Languages size={18} aria-hidden="true" /> {next === "fa" ? "فارسی" : "EN"}
      </button>
    </form>
  );
}

