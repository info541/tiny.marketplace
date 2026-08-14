import type { Metadata } from "next";
import { IngredientIndex } from "@/components/IngredientIndex";
import { listIngredients } from "@/lib/ingredients";

export const metadata: Metadata = {
  title: "Ingredients",
};

export default async function IngredientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const ingredients = listIngredients();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-5 sm:py-12 md:px-8">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-soft/80">Glossary</p>
      <h1 className="mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
        Ingredients
      </h1>
      <p className="mt-3 max-w-xl text-sm text-ink-soft sm:text-base">
        A searchable list of what’s actually in these formulas. Open any ingredient to read what it does and see every product that uses it.
      </p>
      <div className="mt-8 sm:mt-10">
        <IngredientIndex ingredients={ingredients} initialQuery={params.q ?? ""} />
      </div>
    </div>
  );
}
