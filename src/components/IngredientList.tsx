"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { getIngredientInfo } from "@/lib/ingredient-info";

type Props = {
  ingredients: string[];
  freeFrom?: string[];
};

export function IngredientList({ ingredients, freeFrom = [] }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const info = active ? getIngredientInfo(active) : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [active]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    function onClose() {
      setActive(null);
    }
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  return (
    <>
      <ol className="mt-6 grid gap-0 sm:grid-cols-2 sm:gap-x-10">
        {ingredients.map((ing, index) => (
          <li key={`${ing}-${index}`} className="border-b border-line/70 py-2.5">
            <button
              type="button"
              onClick={() => setActive(ing)}
              className="group flex w-full items-baseline gap-3 text-left text-sm hover:text-ink"
            >
              <span className="w-6 shrink-0 font-mono text-xs text-ink-soft/55">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 break-words font-medium group-hover:underline">{ing}</span>
            </button>
          </li>
        ))}
      </ol>

      {freeFrom.length > 0 ? (
        <div className="mt-10">
          <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-ink-soft">Free from</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {freeFrom.map((ing) => (
              <li key={ing}>
                <button
                  type="button"
                  onClick={() => setActive(ing)}
                  className="inline-block border border-line bg-white px-3 py-1.5 text-sm font-medium text-ink-soft transition hover:border-ink hover:text-ink"
                >
                  {ing}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="fixed inset-0 z-50 m-auto max-h-[min(32rem,calc(100dvh-2rem))] w-[min(28rem,calc(100vw-1.5rem))] overflow-auto rounded-[1.5rem] border border-line bg-white p-0 text-ink shadow-[var(--shadow)] open:flex open:flex-col [&::backdrop]:bg-[color-mix(in_oklab,var(--ink)_42%,transparent)]"
        onClick={(e) => {
          if (e.target === dialogRef.current) setActive(null);
        }}
      >
        {info ? (
          <div className="flex flex-col">
            <div className="border-b border-line px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-soft/70">{info.role}</p>
              <h3 id={titleId} className="mt-1 font-display text-xl font-medium tracking-tight">
                {info.name}
              </h3>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm leading-relaxed text-ink-soft">{info.description}</p>
            </div>
            <div className="mt-auto flex flex-col gap-2 border-t border-line px-5 py-4 sm:flex-row">
              <Link
                href={`/ingredients?q=${encodeURIComponent(info.name)}`}
                className="btn btn-primary !min-h-0 flex-1 !py-2.5 text-sm"
                onClick={() => setActive(null)}
              >
                Find products with it
              </Link>
              <button
                type="button"
                onClick={() => setActive(null)}
                className="btn btn-ghost !min-h-0 flex-1 !py-2.5 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
