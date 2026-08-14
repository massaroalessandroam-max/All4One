import Link from "next/link";

const demoRoles = [
  { href: "/cliente", title: "Entra come cliente", detail: "Diario, progressi e condivisioni" },
  { href: "/pt", title: "Entra come PT", detail: "Clienti, schede e report allenamento" },
  { href: "/nutrizionista", title: "Entra come nutrizionista", detail: "Piani, diario e report alimentazione" },
];

export default function AccessPage() {
  return (
    <main className="page">
      <Link className="back" href="/">← All4One</Link>
      <p className="eyebrow">ACCESSO</p>
      <h1>Ambiente di sviluppo</h1>
      <p className="lead">Scegli un ruolo demo. L’accesso reale viene attivato collegando Supabase.</p>
      <div className="cards">
        {demoRoles.map((role) => <Link className="card" href={role.href} key={role.href}><b>{role.title}</b><span>{role.detail}</span><small>Apri area →</small></Link>)}
      </div>
      <p className="notice">Nessun dato reale viene salvato finché non viene configurato il database.</p>
    </main>
  );
}
