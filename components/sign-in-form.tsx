"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function SignInForm({ labels }: { labels: { email: string; password: string; submit: string; error: string } }) {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);
  return (
    <form className="form-grid" onSubmit={async (event) => {
      event.preventDefault(); setPending(true); setError(false);
      const form = new FormData(event.currentTarget);
      const result = await signIn("credentials", { email: form.get("email"), password: form.get("password"), redirect: false });
      setPending(false);
      if (result?.ok) { router.push("/dashboard"); router.refresh(); } else setError(true);
    }}>
      {error && <div className="alert" role="alert">{labels.error}</div>}
      <label className="field"><span className="label">{labels.email}</span><input className="input" name="email" type="email" autoComplete="email" required /></label>
      <label className="field"><span className="label">{labels.password}</span><input className="input" name="password" type="password" autoComplete="current-password" minLength={8} required /></label>
      <button className="btn btn-accent" type="submit" disabled={pending}>{pending ? "…" : labels.submit}</button>
    </form>
  );
}

