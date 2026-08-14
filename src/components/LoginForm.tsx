"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="surface space-y-4 p-5 sm:p-6 md:p-8">
      <label className="block">
        <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-ink-soft/70">
          Email
        </span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-line bg-white px-4 py-3 outline-none transition focus:border-ink/30 focus:ring-2 focus:ring-ink/10"
          placeholder="you@email.com"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-ink-soft/70">
          Password
        </span>
        <input
          type="password"
          required
          autoComplete="current-password"
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-line bg-white px-4 py-3 outline-none transition focus:border-ink/30 focus:ring-2 focus:ring-ink/10"
          placeholder="••••••••"
        />
      </label>

      {error ? (
        <p className="rounded-xl bg-[color-mix(in_oklab,var(--coral)_14%,white)] px-3 py-2 text-sm font-semibold text-ink">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={loading} className="btn btn-primary w-full disabled:opacity-60">
        {loading ? "Signing in…" : "Sign in"}
      </button>

      <p className="text-center text-sm text-ink-soft">
        New here?{" "}
        <Link href="/signup" className="font-medium text-ink underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
