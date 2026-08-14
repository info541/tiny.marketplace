"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  initialDisplayName: string;
  initialBio: string;
  email: string;
};

export function ProfileForm({ initialDisplayName, initialBio, email }: Props) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [bio, setBio] = useState(initialBio);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { error: updateError } = await supabase.from("profiles").upsert({
      id: user.id,
      display_name: displayName.trim() || email.split("@")[0],
      bio: bio.trim(),
      updated_at: new Date().toISOString(),
    });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setMessage("Profile saved.");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="surface space-y-4 rounded-[1.5rem] p-5 sm:p-6 md:p-8">
      <label className="block">
        <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-ink-soft/70">
          Email
        </span>
        <input
          value={email}
          disabled
          className="w-full rounded-2xl border border-line bg-mist/60 px-4 py-3 text-ink-soft outline-none"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-ink-soft/70">
          Display name
        </span>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full rounded-lg border border-line bg-white px-4 py-3 outline-none transition focus:border-ink/30 focus:ring-2 focus:ring-ink/10"
          placeholder="How you show up in reviews"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-ink-soft/70">
          Bio
        </span>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          className="w-full resize-y rounded-lg border border-line bg-white px-4 py-3 outline-none transition focus:border-ink/30 focus:ring-2 focus:ring-ink/10"
          placeholder="Skin type, favorite categories, what you’re hunting for…"
        />
      </label>

      {error ? (
        <p className="rounded-xl bg-[color-mix(in_oklab,var(--coral)_14%,white)] px-3 py-2 text-sm font-semibold">
          {error}
        </p>
      ) : null}
      {message ? <p className="rounded-xl bg-mist px-3 py-2 text-sm font-semibold">{message}</p> : null}

      <button type="submit" disabled={loading} className="btn btn-primary btn-stack disabled:opacity-60">
        {loading ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
