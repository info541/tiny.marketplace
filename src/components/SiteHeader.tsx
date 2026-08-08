import { SiteHeaderClient } from "@/components/SiteHeaderClient";
import { createClient } from "@/lib/supabase/server";

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <SiteHeaderClient email={user?.email ?? null} />;
}
