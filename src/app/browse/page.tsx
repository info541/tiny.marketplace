import type { Metadata } from "next";
import { Suspense } from "react";
import { BrowseClient } from "@/components/BrowseClient";

export const metadata: Metadata = {
  title: "Browse",
};

export default function BrowsePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-5 sm:py-12 md:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-soft/70">Browse</p>
      <h1 className="mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
        Find your next tiny obsession
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-ink-soft sm:text-base">
        Cosmetics & wellness from small brands — filter by category, sort by what matters, then dive into ingredients.
      </p>
      <div className="mt-8 sm:mt-10">
        <Suspense fallback={<p className="text-ink-soft">Loading shelf…</p>}>
          <BrowseClient />
        </Suspense>
      </div>
    </div>
  );
}
