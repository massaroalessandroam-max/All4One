import { AreaHeader, ProtectedArea } from "@/components/protected-area";

export default function NutritionistDashboard() {
  return <ProtectedArea role="nutrizionista"><main className="page"><AreaHeader role="nutrizionista" /><p className="eyebrow">AREA NUTRIZIONISTA</p><h1>I tuoi piani</h1><p className="lead">Qui arriveranno schede nutrizionali, diario pasti e report autorizzati.</p><section className="status"><b>Fondazioni attive</b><span>Task 02: dati cliente e diario alimentare.</span></section></main></ProtectedArea>;
}
