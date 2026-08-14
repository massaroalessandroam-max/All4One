import Link from "next/link";

export default function NutritionistDashboard() {
  return <main className="page"><nav><Link href="/">All4One</Link><span>Nutrizionista</span><Link href="/accedi">Cambia ruolo</Link></nav><p className="eyebrow">AREA NUTRIZIONISTA</p><h1>I tuoi piani</h1><p className="lead">Qui arriveranno schede nutrizionali, diario pasti e report autorizzati.</p><section className="status"><b>Fondazioni attive</b><span>Task 02: dati cliente e diario alimentare.</span></section></main>;
}
