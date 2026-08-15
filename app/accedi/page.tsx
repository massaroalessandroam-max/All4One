"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { dashboardPath, type Role } from "@/lib/types";
import { supabase } from "@/lib/supabase";

type Mode = "login" | "register";

export default function AccessPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function openDashboard(userId: string) {
    if (!supabase) return;
    const { data, error } = await supabase.from("profiles").select("role").eq("id", userId).single();
    if (error || !data) {
      setMessage("Profilo non ancora disponibile. Verifica di aver applicato anche la migrazione di autenticazione.");
      return;
    }
    router.push(dashboardPath(data.role as Role));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) { setMessage("Configurazione Supabase assente."); return; }
    setSubmitting(true);
    setMessage("");

    if (mode === "register") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName.trim() } },
      });
      if (error) setMessage(error.message);
      else if (data.session && data.user) await openDashboard(data.user.id);
      else setMessage("Account creato. Controlla l’email e conferma l’indirizzo prima di accedere.");
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else if (data.user) await openDashboard(data.user.id);
    }
    setSubmitting(false);
  }

  return (
    <main className="page auth-page">
      <Link className="back" href="/">← All4One</Link>
      <p className="eyebrow">ACCESSO SICURO</p>
      <h1>{mode === "login" ? "Bentornato." : "Crea il tuo account."}</h1>
      <p className="lead">I clienti possono registrarsi autonomamente. PT e nutrizionisti vengono abilitati dall’amministrazione.</p>
      <form className="auth-form" onSubmit={submit}>
        {mode === "register" && <label>Nome e cognome<input required minLength={2} value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" /></label>}
        <label>Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></label>
        <label>Password<input required type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} /></label>
        <button className="button" disabled={submitting}>{submitting ? "Attendi…" : mode === "login" ? "Accedi" : "Crea account"}</button>
      </form>
      {message && <p className="notice" role="status">{message}</p>}
      <button className="text-button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setMessage(""); }}>
        {mode === "login" ? "Non hai un account? Registrati" : "Hai già un account? Accedi"}
      </button>
    </main>
  );
}
