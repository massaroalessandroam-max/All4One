"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { dashboardPath, roleLabels, type Role } from "@/lib/types";
import { supabase } from "@/lib/supabase";

export function ProtectedArea({ role, children }: { role: Role; children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState("Verifica dell’accesso…");
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let active = true;
    async function verify() {
      if (!supabase) { if (active) setStatus("Configurazione Supabase assente."); return; }
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) { router.replace("/accedi"); return; }
      const { data: profile, error } = await supabase.from("profiles").select("role").eq("id", userData.user.id).single();
      if (error || !profile) { if (active) setStatus("Profilo non disponibile. Completa la migrazione di autenticazione."); return; }
      const actualRole = profile.role as Role;
      if (actualRole !== role) { router.replace(dashboardPath(actualRole)); return; }
      if (active) setAllowed(true);
    }
    verify();
    return () => { active = false; };
  }, [role, router]);

  async function signOut() {
    await supabase?.auth.signOut();
    router.replace("/accedi");
  }

  if (!allowed) return <main className="page"><p className="eyebrow">ALL4ONE</p><p className="lead">{status}</p><Link className="back" href="/accedi">Torna all’accesso</Link></main>;
  return <>{children}<button className="sign-out" onClick={signOut}>Esci</button></>;
}

export function AreaHeader({ role }: { role: Role }) {
  return <nav><Link href="/">All4One</Link><span>{roleLabels[role]}</span><Link href="/accedi">Account</Link></nav>;
}
