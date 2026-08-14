"use client";

import { useMemo, useState } from "react";
import { ProductTile } from "@/components/ProductTile";
import {
  avoidIngredients,
  popularIngredients,
  searchByIngredient,
} from "@/lib/data";

export function IngredientExplorer({
  initialQuery = "",
  initialMode = "contains",
}: {
  initialQuery?: string;
  initialMode?: "contains" | "free-from";
}) {
  const [query, setQuery] = useState(initialQuery);
  const [mode, setMode] = useState<"contains" | "free-from">(initialMode);

  const results = useMemo(() => searchByIngredient(query, mode), [query, mode]);

  return (
    <div className="space-y-8">
      <div className="surface p-4 sm:p-5 md:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <label className="flex-1">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-ink-soft/70">
              Search ingredients
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try zinc oxide, fragrance, hemp protein…"
              className="w-full rounded-lg border border-line bg-white px-4 py-3.5 text-base outline-none transition focus:border-ink/30 focus:ring-2 focus:ring-ink/10"
            />
          </label>
          <div className="flex w-full gap-2 md:w-auto md:pt-6">
            <button
              type="button"
              onClick={() => setMode("contains")}
              className={`chip flex-1 justify-center md:flex-none ${mode === "contains" ? "chip-active" : ""}`}
            >
              Contains
            </button>
            <button
              type="button"
              onClick={() => setMode("free-from")}
              className={`chip flex-1 justify-center md:flex-none ${mode === "free-from" ? "chip-active" : ""}`}
            >
              Free from
            </button>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-soft/70">Popular</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {popularIngredients.map((ing) => (
              <button key={ing} type="button" className="chip" onClick={() => { setQuery(ing); setMode("contains"); }}>
                {ing}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-soft/70">Often avoided</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {avoidIngredients.map((ing) => (
              <button
                key={ing}
                type="button"
                className="chip !border-coral/30 !bg-[color-mix(in_oklab,var(--coral)_10%,white)]"
                onClick={() => {
                  setQuery(ing);
                  setMode("free-from");
                }}
              >
                No {ing}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <p className="mb-4 text-sm font-semibold text-ink-soft">
          {results.length} product{results.length === 1 ? "" : "s"}
          {query ? (
            <>
              {" "}
              {mode === "contains" ? "with" : "free from"} <span className="text-ink">“{query}”</span>
            </>
          ) : null}
        </p>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {results.map((product) => (
            <ProductTile key={product.id} product={product} />
          ))}
        </div>
        {results.length === 0 ? (
          <p className="surface rounded-2xl p-8 text-center text-ink-soft">
            No matches yet — try a broader ingredient or flip to “Contains”.
          </p>
        ) : null}
      </div>
    </div>
  );
}
