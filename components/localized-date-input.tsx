"use client";

import { useMemo, useState } from "react";
import { format as formatJalali, parse as parseJalali } from "date-fns-jalali";
import { isValid } from "date-fns";

function isoDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function LocalizedDateInput({ name, locale, required = false, defaultValue }: { name: string; locale: "en" | "fa"; required?: boolean; defaultValue?: string }) {
  const initial = useMemo(() => defaultValue ?? isoDate(new Date()), [defaultValue]);
  const [stored, setStored] = useState(initial);
  const [shown, setShown] = useState(() => locale === "fa" ? formatJalali(new Date(`${initial}T12:00:00`), "yyyy/MM/dd") : initial);
  if (locale === "en") return <input className="input" type="date" name={name} value={shown} required={required} onChange={(event) => setShown(event.target.value)} />;
  return <>
    <input className="input" inputMode="numeric" dir="ltr" value={shown} placeholder="1405/05/24" required={required} onChange={(event) => {
      const value = event.target.value; setShown(value);
      const date = parseJalali(value, "yyyy/MM/dd", new Date());
      if (isValid(date)) setStored(isoDate(date));
    }} />
    <input type="hidden" name={name} value={stored} />
  </>;
}

