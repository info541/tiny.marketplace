"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  brandId: string;
  initialSaved: boolean;
};

export function SaveBrandButton({ brandId, initialSaved }: Props) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      router.push("/login");
      return;
    }

    if (saved) {
      const { error: deleteError } = await supabase
        .from("saved_brands")
        .delete()
        .eq("user_id", user.id)
        .eq("brand_id", brandId);
      setLoading(false);
      if (deleteError) {
        setError(deleteError.message);
        return;
      }
      setSaved(false);
      return;
    }

    const { error: insertError } = await supabase.from("saved_brands").insert({
      user_id: user.id,
      brand_id: brandId,
    });
    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setSaved(true);
  }

  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        disabled={loading}
        className={`btn !py-2 text-sm ${saved ? "btn-ghost" : "btn-primary"} disabled:opacity-60`}
      >
        {loading ? "Saving…" : saved ? "Saved ✓" : "Save brand"}
      </button>
      {error ? <p className="mt-2 text-xs font-semibold text-coral">{error}</p> : null}
    </div>
  );
}
