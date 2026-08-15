import Link from "next/link";

export default function NotFound() {
  return <main className="container" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}><section className="card empty"><span className="eyebrow">404</span><h1 className="heading-lg">Vehicle not found</h1><Link href="/garage" className="btn btn-accent">Back to garage</Link></section></main>;
}

