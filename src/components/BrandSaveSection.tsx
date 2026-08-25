"use client";

import { useEffect, useState } from "react";
import { SaveBrandButton } from "@/components/SaveBrandButton";
import { createClient } from "@/lib/supabase/client";

type Props = {
  slug: string;
};

export function BrandSaveSection({ slug }: Props) {
  const [brandId, setBrandId] = useState<string | null>(null);
  const [initialSaved, setInitialSaved] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data: dbBrand } = await supabase.from("brands").select("id").eq("slug", slug).maybeSingle();

      if (cancelled) return;

      if (!dbBrand?.id) {
        setReady(true);
        return;
      }

      setBrandId(dbBrand.id);

      if (user) {
        const { data: saved } = await supabase
          .from("saved_brands")
          .select("brand_id")
          .eq("user_id", user.id)
          .eq("brand_id", dbBrand.id)
          .maybeSingle();
        if (!cancelled) setInitialSaved(Boolean(saved));
      }

      if (!cancelled) setReady(true);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!ready || !brandId) return null;

  return <SaveBrandButton brandId={brandId} initialSaved={initialSaved} />;
}
