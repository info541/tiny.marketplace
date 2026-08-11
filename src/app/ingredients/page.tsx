import type { Metadata } from "next";
import { IngredientExplorer } from "@/components/IngredientExplorer";

export const metadata: Metadata = {
  title: "Ingredients",
};

export default async function IngredientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; mode?: string }>;
}) {
  const params = await searchParams;
  const mode = params.mode === "free-from" ? "free-from" : "contains";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-5 sm:py-12 md:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-soft/70">Ingredient search</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl md:text-5xl">
        What’s inside — made searchable
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-ink-soft sm:text-base">
        Look for actives you love, or filter out the stuff you don’t. Built for curious shoppers who read labels for fun.
      </p>
      <div className="mt-8 sm:mt-10">
        <IngredientExplorer initialQuery={params.q ?? ""} initialMode={mode} />
      </div>
    </div>
  );
}
