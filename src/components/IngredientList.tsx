import Link from "next/link";
import { ingredientHref } from "@/lib/ingredients";

type Props = {
  ingredients: string[];
  freeFrom?: string[];
};

export function IngredientList({ ingredients, freeFrom = [] }: Props) {
  return (
    <>
      <ol className="mt-6 grid gap-0 sm:grid-cols-2 sm:gap-x-10">
        {ingredients.map((ing, index) => (
          <li key={`${ing}-${index}`} className="border-b border-line/70 py-2.5">
            <Link href={ingredientHref(ing)} className="group flex w-full items-baseline gap-3 text-left text-sm hover:text-ink">
              <span className="w-6 shrink-0 font-mono text-xs text-ink-soft/55">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 break-words font-medium group-hover:underline">{ing}</span>
            </Link>
          </li>
        ))}
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
