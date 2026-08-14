import { NextResponse } from "next/server";
import { supabaseConfigured } from "@/lib/supabase";

export function GET() {
  return NextResponse.json({ status: "ok", service: "all4one", supabaseConfigured });
}
