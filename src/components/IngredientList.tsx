import Link from "next/link";
import { normalizeIngredientKey } from "@/lib/ingredient-info";
import { ingredientHref } from "@/lib/ingredients";

type Props = {
  ingredients: string[];
  freeFrom?: string[];
  compact?: boolean;
  sharedKeys?: string[];
};

export function IngredientList({ ingredients, freeFrom = [], compact = false, sharedKeys }: Props) {
  const shared = sharedKeys?.length ? new Set(sharedKeys) : null;

  return (
    <>
      <ol className={compact ? "mt-3 grid gap-0" : "mt-6 grid gap-0 sm:grid-cols-2 sm:gap-x-10"}>
        {ingredients.map((ing, index) => {
          const isShared = shared?.has(normalizeIngredientKey(ing)) ?? false;
          return (
            <li
              key={`${ing}-${index}`}
              className={`border-b border-line/70 ${compact ? "py-1.5 sm:py-2" : "py-2.5"} ${
                isShared ? "bg-mist/70" : ""
              }`}
            >
              <Link
                href={ingredientHref(ing)}
                className={`group flex w-full items-baseline text-left hover:text-ink ${
                  compact ? "gap-1.5 text-[11px] sm:gap-3 sm:text-sm" : "gap-3 text-sm"
                }`}
              >
                <span
                  className={`shrink-0 font-mono text-ink-soft/55 ${
                    compact ? "w-4 text-[10px] sm:w-6 sm:text-xs" : "w-6 text-xs"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 break-words font-medium group-hover:underline">{ing}</span>
                {isShared ? (
                  <span className="ml-auto hidden shrink-0 text-[9px] font-medium uppercase tracking-wide text-ink-soft sm:inline">
                    both
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ol>

      {freeFrom.length > 0 ? (
        <div className="mt-10">
          <h3 className="text-sm font-medium uppercase tracking-[0.12em] text-ink-soft">Free from</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {freeFrom.map((ing) => (
              <li key={ing}>
                <Link
                  href={ingredientHref(ing)}
                  className="inline-block border border-line bg-white px-3 py-1.5 text-sm font-medium text-ink-soft transition hover:border-ink hover:text-ink"
                >
                  {ing}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}
