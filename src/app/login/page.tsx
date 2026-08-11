import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/");

  const params = await searchParams;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12 sm:px-5 sm:py-14 md:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-soft/70">Welcome back</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">Sign in</h1>
      <p className="mt-2 text-sm text-ink-soft sm:text-base">Save favorites, leave reviews, and join the talk.</p>
      {params.error ? (
        <p className="mt-4 rounded-xl bg-[color-mix(in_oklab,var(--coral)_14%,white)] px-3 py-2 text-sm font-semibold">
          Auth link expired or invalid — try signing in again.
        </p>
      ) : null}
      <div className="mt-8">
        <LoginForm />
      </div>
    </div>
  );
}
