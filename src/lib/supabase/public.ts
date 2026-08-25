import { createClient } from "@supabase/supabase-js";

/** Cookie-less client for public, cacheable reads. */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
