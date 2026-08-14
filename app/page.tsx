import Link from "next/link";

export default function HomePage() {
  return (
    <main className="landing">
      <p className="eyebrow">ALL4ONE · BASE MVP</p>
      <h1>Un unico percorso.<br />Tre punti di vista.</h1>
      <p className="lead">
        Cliente, personal trainer e nutrizionista collaborano con dati condivisi solo quando il cliente lo autorizza.
      </p>
      <div className="actions">
        <Link className="button" href="/accedi">Accedi alla demo</Link>
        <a className="button secondary" href="#principi">Come proteggiamo i dati</a>
      </div>
      <section id="principi" className="principles">
        <article><b>Ruoli separati</b><span>Ogni persona vede esclusivamente ciò che le compete.</span></article>
        <article><b>Consenso revocabile</b><span>Il cliente decide le condivisioni incrociate.</span></article>
        <article><b>AI assistiva</b><span>Ogni trascrizione o suggerimento richiede conferma.</span></article>
      </section>
    </main>
  );
}
