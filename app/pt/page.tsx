import { AreaHeader, ProtectedArea } from "@/components/protected-area";

export default function TrainerDashboard() {
  return <ProtectedArea role="pt"><main className="page"><AreaHeader role="pt" /><p className="eyebrow">AREA PT</p><h1>I tuoi clienti</h1><p className="lead">Qui arriveranno schede allenamento, confronto periodi e report autorizzati.</p><section className="status"><b>Fondazioni attive</b><span>Task 02: dati cliente e diario allenamenti.</span></section></main></ProtectedArea>;
}
