import Link from "next/link";

export default function TrainerDashboard() {
  return <main className="page"><nav><Link href="/">All4One</Link><span>Personal trainer</span><Link href="/accedi">Cambia ruolo</Link></nav><p className="eyebrow">AREA PT</p><h1>I tuoi clienti</h1><p className="lead">Qui arriveranno schede allenamento, confronto periodi e report autorizzati.</p><section className="status"><b>Fondazioni attive</b><span>Task 02: dati cliente e diario allenamenti.</span></section></main>;
}
