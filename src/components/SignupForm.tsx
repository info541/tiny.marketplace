"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      router.push("/");
      router.refresh();
      return;
    }

    setMessage("Check your email for a confirmation link, then come back to sign in.");
  }

  return (
    <form onSubmit={onSubmit} className="surface space-y-4 rounded-[1.5rem] p-6 md:p-8">
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
          className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 outline-none ring-lemon transition focus:ring-4"
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
          autoComplete="new-password"
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 outline-none ring-lemon transition focus:ring-4"
          placeholder="At least 6 characters"
        />
      </label>

      {error ? (
        <p className="rounded-xl bg-[color-mix(in_oklab,var(--coral)_14%,white)] px-3 py-2 text-sm font-semibold text-ink">
          {error}
        </p>
      ) : null}

      {message ? (
        <p className="rounded-xl bg-mist px-3 py-2 text-sm font-semibold text-ink">{message}</p>
      ) : null}

      <button type="submit" disabled={loading} className="btn btn-primary w-full disabled:opacity-60">
        {loading ? "Creating account…" : "Create account"}
      </button>

      <p className="text-center text-sm text-ink-soft">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-teal-deep hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
