export default function Loading() {
  return <main className="container page stack" aria-busy="true" aria-label="Loading"><div className="card" style={{ minHeight: 180, opacity: .55 }}/><div className="grid-3"><div className="card" style={{ minHeight: 150, opacity: .45 }}/><div className="card" style={{ minHeight: 150, opacity: .4 }}/><div className="card" style={{ minHeight: 150, opacity: .35 }}/></div></main>;
}

