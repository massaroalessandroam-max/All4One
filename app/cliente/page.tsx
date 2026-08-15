import { AreaHeader, ProtectedArea } from "@/components/protected-area";
import { WorkoutJournal } from "@/components/workout-journal";

export default function ClientDashboard() {
  return <ProtectedArea role="cliente"><main className="page client-page"><AreaHeader role="cliente" /><p className="eyebrow">AREA CLIENTE</p><h1>Il tuo percorso</h1><p className="lead">Registra gli allenamenti e costruisci uno storico utile per te e per il tuo PT.</p><WorkoutJournal /></main></ProtectedArea>;
}
