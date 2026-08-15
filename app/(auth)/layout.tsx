import Link from "next/link";
import { Brand } from "@/components/app-shell";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <main className="container" style={{ minHeight: "100vh", display: "grid", gridTemplateRows: "72px 1fr" }}><header className="site-header"><Link href="/"><Brand /></Link></header><div style={{ display: "grid", placeItems: "center", paddingBlock: 30 }}>{children}</div></main>;
}

