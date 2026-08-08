import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return { supabase, user };
}

export async function ensureProfile(
  supabase: Awaited<ReturnType<typeof createClient>>,
  user: { id: string; email?: string | null },
) {
  const { data: existing } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url, bio")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) return existing;

  const displayName = user.email?.split("@")[0] ?? "tiny shopper";
  const { data: created } = await supabase
    .from("profiles")
    .upsert({ id: user.id, display_name: displayName })
    .select("id, display_name, avatar_url, bio")
    .single();

  return created;
}
