"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { IngredientEntry } from "@/lib/ingredients";

export function IngredientIndex({
  ingredients,
  initialQuery,
}: {
  ingredients: IngredientEntry[];
  initialQuery?: string;
}) {
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery ?? queryFromUrl);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return ingredients;
    return ingredients.filter(
      (ing) =>
        ing.name.toLowerCase().includes(needle) ||
        ing.role.toLowerCase().includes(needle) ||
        ing.description.toLowerCase().includes(needle),
    );
  }, [ingredients, query]);

  const groups = useMemo(() => {
    const map = new Map<string, IngredientEntry[]>();
    for (const ing of filtered) {
      const letter = (ing.name.match(/[A-Za-z]/)?.[0] ?? "#").toUpperCase();
      const list = map.get(letter) ?? [];
      list.push(ing);
      map.set(letter, list);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <div>
      <label className="block">
        <span className="sr-only">Search ingredients</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search zinc oxide, hyaluronic acid, ashwagandha…"
          className="h-12 w-full border border-line bg-white px-4 text-base outline-none transition focus:border-ink/30 focus:ring-2 focus:ring-ink/10"
        />
      </label>

      <p className="mt-4 text-sm text-ink-soft">
        {filtered.length} ingredient{filtered.length === 1 ? "" : "s"}
        {query.trim() ? (
          <>
            {" "}
            matching <span className="text-ink">“{query.trim()}”</span>
          </>
        ) : null}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-8 border border-line bg-white p-8 text-center text-ink-soft">
          No ingredients matched that search. Try a shorter name or a common INCI term.
        </p>
      ) : (
        <div className="mt-6">
          {groups.map(([letter, items]) => (
            <section key={letter} className="border-t border-line">
              <h2 className="bg-mist px-1 py-2 font-display text-lg font-medium tracking-tight text-ink-soft">
                {letter}
              </h2>
              <ul>
                {items.map((ing) => (
                  <li key={ing.slug} className="border-t border-line">
                    <Link
                      href={`/ingredient/${ing.slug}`}
                      className="flex flex-col gap-1 py-4 transition hover:bg-mist/70 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                    >
                      <span className="min-w-0">
                        <span className="block font-medium text-ink">{ing.name}</span>
                        <span className="mt-0.5 block text-sm text-ink-soft">{ing.role}</span>
                      </span>
                      <span className="shrink-0 text-sm text-ink-soft">
                        {ing.productCount} product{ing.productCount === 1 ? "" : "s"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
