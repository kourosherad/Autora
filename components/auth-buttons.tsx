"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function SignOutButton({ label }: { label: string }) {
  return <button type="button" className="btn btn-ghost btn-sm" onClick={() => signOut({ callbackUrl: "/" })}><LogOut size={17} />{label}</button>;
}

