import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignupForm } from "@/components/SignupForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Sign up",
};

export default async function SignupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/");

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-14 md:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-soft/70">Join the tiny side</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold tracking-[-0.04em]">Create account</h1>
      <p className="mt-2 text-ink-soft">One account for reviews, talk, and your tiny finds.</p>
      <div className="mt-8">
        <SignupForm />
      </div>
    </div>
  );
}
