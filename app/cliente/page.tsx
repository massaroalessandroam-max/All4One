import { AreaHeader, ProtectedArea } from "@/components/protected-area";

export default function ClientDashboard() {
  return <ProtectedArea role="cliente"><main className="page"><AreaHeader role="cliente" /><p className="eyebrow">AREA CLIENTE</p><h1>Il tuo percorso</h1><p className="lead">Qui arriveranno diario pasti, allenamenti, progressi, report e consensi.</p><section className="status"><b>Fondazioni attive</b><span>Task 02: registrazione pasti e allenamenti.</span></section></main></ProtectedArea>;
}
