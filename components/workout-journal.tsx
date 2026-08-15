"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Workout = { id: string; title: string; performed_at: string; notes: string | null };
type WorkoutSet = { id: string; workout_id: string; exercise_name: string; muscle_group: string; set_number: number; reps: number; weight_kg: number; rpe: number | null };

const exerciseCatalog = [
  { name: "Panca piana bilanciere", muscleGroup: "Petto" },
  { name: "Panca inclinata manubri", muscleGroup: "Petto" },
  { name: "Chest press", muscleGroup: "Petto" },
  { name: "Croci ai cavi", muscleGroup: "Petto" },
  { name: "Lat machine", muscleGroup: "Schiena" },
  { name: "Rematore bilanciere", muscleGroup: "Schiena" },
  { name: "Rematore manubrio", muscleGroup: "Schiena" },
  { name: "Pulley basso", muscleGroup: "Schiena" },
  { name: "Squat bilanciere", muscleGroup: "Gambe" },
  { name: "Leg press", muscleGroup: "Gambe" },
  { name: "Stacco rumeno", muscleGroup: "Gambe" },
  { name: "Leg curl", muscleGroup: "Gambe" },
  { name: "Leg extension", muscleGroup: "Gambe" },
  { name: "Calf raise", muscleGroup: "Gambe" },
  { name: "Military press", muscleGroup: "Spalle" },
  { name: "Shoulder press manubri", muscleGroup: "Spalle" },
  { name: "Alzate laterali", muscleGroup: "Spalle" },
  { name: "Face pull", muscleGroup: "Spalle" },
  { name: "Curl bilanciere", muscleGroup: "Braccia" },
  { name: "Curl manubri", muscleGroup: "Braccia" },
  { name: "Push down cavi", muscleGroup: "Braccia" },
  { name: "French press", muscleGroup: "Braccia" },
  { name: "Crunch", muscleGroup: "Core" },
  { name: "Plank", muscleGroup: "Core" },
  { name: "Corsa", muscleGroup: "Cardio" },
  { name: "Cyclette", muscleGroup: "Cardio" },
] as const;
const today = new Date().toISOString().slice(0, 10);

export function WorkoutJournal() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(null);
  const [title, setTitle] = useState("Allenamento");
  const [date, setDate] = useState(today);
  const [exercise, setExercise] = useState<string>(exerciseCatalog[0].name);
  const [reps, setReps] = useState("8");
  const [weight, setWeight] = useState("0");
  const [rpe, setRpe] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const activeWorkout = workouts.find((workout) => workout.id === activeWorkoutId) ?? null;
  const activeSets = sets.filter((set) => set.workout_id === activeWorkoutId);
  const selectedExercise = exerciseCatalog.find((item) => item.name === exercise) ?? exerciseCatalog[0];

  async function loadJournal() {
    if (!supabase) return;
    setLoading(true);
    const [{ data: workoutData, error: workoutError }, { data: setData, error: setError }] = await Promise.all([
      supabase.from("workouts").select("id,title,performed_at,notes").order("performed_at", { ascending: false }),
      supabase.from("workout_sets").select("id,workout_id,exercise_name,muscle_group,set_number,reps,weight_kg,rpe").order("created_at", { ascending: true }),
    ]);
    if (workoutError || setError) setMessage("Impossibile caricare il diario. Verifica di aver eseguito la migrazione allenamenti.");
    else {
      const loadedWorkouts = (workoutData ?? []) as Workout[];
      setWorkouts(loadedWorkouts);
      setSets((setData ?? []) as WorkoutSet[]);
      setActiveWorkoutId((current) => current ?? loadedWorkouts[0]?.id ?? null);
    }
    setLoading(false);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadJournal(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function createWorkout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setMessage("");
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    const { data, error } = await supabase.from("workouts")
      .insert({ client_id: userData.user.id, title: title.trim(), performed_at: new Date(`${date}T12:00:00`).toISOString() })
      .select("id,title,performed_at,notes")
      .single();
    if (error || !data) { setMessage(error?.message ?? "Non è stato possibile creare l’allenamento."); return; }
    setWorkouts((current) => [data as Workout, ...current]);
    setActiveWorkoutId(data.id);
    setMessage("Allenamento creato. Aggiungi la prima serie.");
  }

  async function addSet(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !activeWorkoutId || !exercise.trim()) return;
    setMessage("");
    const sameExerciseSets = activeSets.filter((set) => set.exercise_name.toLowerCase() === exercise.trim().toLowerCase());
    const { data, error } = await supabase.from("workout_sets").insert({
      workout_id: activeWorkoutId,
      exercise_name: exercise.trim(),
      muscle_group: selectedExercise.muscleGroup,
      set_number: sameExerciseSets.length + 1,
      reps: Number(reps),
      weight_kg: Number(weight),
      rpe: rpe ? Number(rpe) : null,
    }).select("id,workout_id,exercise_name,muscle_group,set_number,reps,weight_kg,rpe").single();
    if (error || !data) { setMessage(error?.message ?? "Non è stato possibile salvare la serie."); return; }
    setSets((current) => [...current, data as WorkoutSet]);
    setMessage("Serie salvata.");
  }

  const summary = useMemo(() => {
    const groups = new Map<string, { sets: number; volume: number }>();
    activeSets.forEach((set) => {
      const current = groups.get(set.muscle_group) ?? { sets: 0, volume: 0 };
      groups.set(set.muscle_group, { sets: current.sets + 1, volume: current.volume + set.reps * set.weight_kg });
    });
    return [...groups.entries()].map(([group, values]) => ({ group, ...values }));
  }, [activeSets]);

  const records = useMemo(() => {
    const byExercise = new Map<string, { weight: number; reps: number; volume: number }>();
    sets.forEach((set) => {
      const current = byExercise.get(set.exercise_name) ?? { weight: 0, reps: 0, volume: 0 };
      byExercise.set(set.exercise_name, { weight: Math.max(current.weight, set.weight_kg), reps: Math.max(current.reps, set.reps), volume: Math.max(current.volume, set.weight_kg * set.reps) });
    });
    return [...byExercise.entries()].map(([exerciseName, values]) => ({ exerciseName, ...values }));
  }, [sets]);

  return <div className="journal">
    <section className="journal-panel">
      <div className="section-heading"><div><p className="eyebrow">ALLENAMENTI</p><h2>Il tuo diario</h2></div><span className="metric">{workouts.length} sessioni</span></div>
      <form className="workout-create" onSubmit={createWorkout}>
        <label>Nome allenamento<input required value={title} onChange={(event) => setTitle(event.target.value)} /></label>
        <label>Data<input required type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
        <button className="button">Nuovo allenamento</button>
      </form>
      {workouts.length > 0 && <div className="workout-list">{workouts.map((workout) => <button key={workout.id} className={workout.id === activeWorkoutId ? "workout-item active" : "workout-item"} onClick={() => setActiveWorkoutId(workout.id)}><b>{workout.title}</b><span>{new Date(workout.performed_at).toLocaleDateString("it-IT")}</span></button>)}</div>}
    </section>

    {activeWorkout && <section className="journal-panel">
      <div className="section-heading"><div><p className="eyebrow">SESSIONE ATTIVA</p><h2>{activeWorkout.title}</h2></div><span className="metric">{activeSets.length} serie</span></div>
      <form className="set-form" onSubmit={addSet}>
        <label>Esercizio<select value={exercise} onChange={(event) => setExercise(event.target.value)}>{[...new Set(exerciseCatalog.map((item) => item.muscleGroup))].map((group) => <optgroup key={group} label={group}>{exerciseCatalog.filter((item) => item.muscleGroup === group).map((item) => <option key={item.name}>{item.name}</option>)}</optgroup>)}</select></label>
        <label>Gruppo muscolare<output className="muscle-output">{selectedExercise.muscleGroup}</output></label>
        <label>Ripetizioni<input required min="1" type="number" value={reps} onChange={(event) => setReps(event.target.value)} /></label>
        <label>Carico kg<input required min="0" step="0.5" type="number" value={weight} onChange={(event) => setWeight(event.target.value)} /></label>
        <label>RPE (facoltativo)<input min="1" max="10" step="0.5" type="number" value={rpe} onChange={(event) => setRpe(event.target.value)} /></label>
        <button className="button">Salva serie</button>
      </form>
      {activeSets.length > 0 && <div className="set-table"><div className="set-row table-head"><span>Esercizio</span><span>Serie</span><span>Rep.</span><span>Kg</span><span>RPE</span></div>{activeSets.map((set) => <div className="set-row" key={set.id}><b>{set.exercise_name}<small>{set.muscle_group}</small></b><span>{set.set_number}</span><span>{set.reps}</span><span>{set.weight_kg}</span><span>{set.rpe ?? "—"}</span></div>)}</div>}
      {summary.length > 0 && <div className="summary"><b>Riepilogo gruppi muscolari</b>{summary.map((item) => <span key={item.group}>{item.group}: {item.sets} serie · {Math.round(item.volume)} kg volume</span>)}</div>}
    </section>}

    <section className="journal-panel">
      <div className="section-heading"><div><p className="eyebrow">RECORD PERSONALI</p><h2>I tuoi migliori risultati</h2></div></div>
      {records.length === 0 ? <p className="muted">I record appariranno dopo la prima serie salvata.</p> : <div className="record-grid">{records.map((record) => <article key={record.exerciseName}><b>{record.exerciseName}</b><span>Carico max: {record.weight} kg</span><span>Ripetizioni max: {record.reps}</span><span>Volume serie max: {Math.round(record.volume)} kg</span></article>)}</div>}
    </section>
    {loading && <p className="muted">Caricamento diario…</p>}
    {message && <p className="notice" role="status">{message}</p>}
  </div>;
}
