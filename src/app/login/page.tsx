"use cache";

import type { Metadata } from "next";
import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginPage() {
  cacheLife("max");
  cacheTag("login");

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12 sm:px-5 sm:py-14 md:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-soft/70">Welcome back</p>
      <h1 className="mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl">Sign in</h1>
      <p className="mt-2 text-sm text-ink-soft sm:text-base">Save favorites, leave reviews, and join the talk.</p>
      <div className="mt-8">
        <Suspense fallback={<div className="surface h-64 animate-pulse" aria-hidden />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
