import Link from "next/link";

export default function ClientDashboard() {
  return <Dashboard role="Cliente" title="Il tuo percorso" description="Qui arriveranno diario pasti, allenamenti, progressi, report e consensi." next="Task 02: registrazione pasti e allenamenti." />;
}

function Dashboard({ role, title, description, next }: { role: string; title: string; description: string; next: string }) {
  return <main className="page"><nav><Link href="/">All4One</Link><span>{role}</span><Link href="/accedi">Cambia ruolo</Link></nav><p className="eyebrow">AREA {role.toUpperCase()}</p><h1>{title}</h1><p className="lead">{description}</p><section className="status"><b>Fondazioni attive</b><span>{next}</span></section></main>;
}
