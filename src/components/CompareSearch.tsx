"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  highlightMatch,
  searchProducts,
  type CompareSuggestion,
  type ProductSearchHit,
} from "@/lib/search";

type Props = {
  currentSlug: string;
  excludeSlugs: string[];
  suggestions: CompareSuggestion[];
  compact?: boolean;
  label?: string;
  align?: "start" | "end";
};

function ProductThumb({
  imageUrl,
  accent,
  name,
}: {
  imageUrl?: string;
  accent: string;
  name: string;
}) {
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden border border-line bg-mist"
      style={{
        background: `linear-gradient(145deg, color-mix(in oklab, ${accent} 18%, white), color-mix(in oklab, ${accent} 28%, #f3f3f1))`,
      }}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="" className="h-full w-full object-contain p-1" />
      ) : (
        <span className="font-display text-xs font-medium text-ink/70">{name.slice(0, 1)}</span>
      )}
    </span>
  );
}

function Highlighted({ text, query }: { text: string; query: string }) {
  const parts = highlightMatch(text, query);
  return (
    <>
      {parts.map((part, i) =>
        part.match ? (
          <mark key={i} className="rounded-sm bg-mist px-0.5 text-ink">
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  );
}

export function CompareSearch({
  currentSlug,
  excludeSlugs,
  suggestions,
  compact = false,
  label = "Compare",
  align = "start",
}: Props) {
  const router = useRouter();
  const listboxId = useId();
  const inputId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [indexedQuery, setIndexedQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  if (query !== indexedQuery) {
    setIndexedQuery(query);
    setActiveIndex(0);
  }

  const excludeKey = excludeSlugs.join("|");
  const hits = useMemo(
    () => searchProducts(query, { excludeSlugs: excludeKey.split("|").filter(Boolean), limit: 8 }),
    [query, excludeKey],
  );

  const suggestionHits = useMemo(
    () => suggestions.filter((item) => !excludeKey.split("|").includes(item.slug)),
    [suggestions, excludeKey],
  );

  const browsing = query.trim().length === 0;
  const results: Array<{ slug: string; title: string; subtitle: string; imageUrl?: string; accent: string }> =
    browsing
      ? suggestionHits.map((item) => ({
          slug: item.slug,
          title: item.name,
          subtitle: item.brandName ? `${item.brandName} · $${item.price}` : `$${item.price}`,
          imageUrl: item.imageUrl,
          accent: item.accent,
        }))
      : hits.map((hit: ProductSearchHit) => ({
          slug: hit.href.replace("/products/", ""),
          title: hit.title,
          subtitle: hit.subtitle,
          imageUrl: hit.imageUrl,
          accent: hit.accent,
        }));

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    const prev = document.body.style.overflow;
    if (window.matchMedia("(max-width: 639px)").matches) {
      document.body.style.overflow = "hidden";
    }
    inputRef.current?.focus();

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open]);

  function compareHref(slug: string) {
    return `/products/${currentSlug}/compare/${encodeURIComponent(slug)}`;
  }

  function selectSlug(slug: string) {
    setOpen(false);
    setQuery("");
    router.push(compareHref(slug));
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % Math.max(results.length, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % Math.max(results.length, 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const active = results[activeIndex];
      if (active) selectSlug(active.slug);
    }
  }

  return (
    <div ref={rootRef} className={`relative ${compact ? "" : "w-full sm:w-auto"}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((value) => !value)}
        className={
          compact
            ? "btn btn-ghost !min-h-0 !px-3 !py-1.5 text-xs"
            : "btn btn-ghost btn-stack"
        }
      >
        {label}
      </button>

      {open ? (
        <>
          <div className="fixed inset-0 z-40 bg-ink/25 sm:hidden" onClick={() => setOpen(false)} />
          <div
            className={`fixed inset-x-0 bottom-0 z-50 flex max-h-[min(82vh,34rem)] flex-col border-t border-line bg-white pb-[env(safe-area-inset-bottom)] shadow-[var(--shadow)] sm:absolute sm:inset-x-auto sm:bottom-auto sm:top-[calc(100%+0.45rem)] sm:z-30 sm:w-[min(22rem,calc(100vw-2rem))] sm:border sm:pb-0 ${
              align === "end" ? "sm:right-0 sm:left-auto" : "sm:left-0 sm:right-auto"
            }`}
            role="dialog"
            aria-label="Search a product to compare"
          >
            <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:hidden">
              <p className="font-display text-lg">Compare with</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-ink-soft hover:text-ink"
              >
                Close
              </button>
            </div>

            <div className="border-b border-line p-3">
              <label htmlFor={inputId} className="sr-only">
                Search products to compare
              </label>
              <input
                ref={inputRef}
                id={inputId}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search a product or brand"
                autoComplete="off"
                enterKeyHint="search"
                role="combobox"
                aria-expanded
                aria-controls={listboxId}
                aria-autocomplete="list"
                aria-activedescendant={
                  results[activeIndex] ? `${listboxId}-opt-${activeIndex}` : undefined
                }
                className="h-11 w-full rounded-full border border-line bg-mist px-4 text-sm outline-none placeholder:text-ink-soft focus:border-ink"
              />
            </div>

            <div id={listboxId} role="listbox" className="min-h-0 flex-1 overflow-auto">
              <p className="sticky top-0 z-[1] border-b border-line bg-mist px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-ink-soft">
                {browsing ? "Suggested" : "Products"}
              </p>
              {results.length === 0 ? (
                <p className="px-4 py-5 text-sm text-ink-soft">
                  No products matched <span className="font-medium text-ink">“{query.trim()}”</span>
                </p>
              ) : (
                <ul>
                  {results.map((item, index) => {
                    const active = index === activeIndex;
                    return (
                      <li key={item.slug} role="option" aria-selected={active}>
                        <Link
                          id={`${listboxId}-opt-${index}`}
                          href={compareHref(item.slug)}
                          onMouseEnter={() => setActiveIndex(index)}
                          onClick={() => {
                            setOpen(false);
                            setQuery("");
                          }}
                          className={`flex items-center gap-3 px-3 py-2.5 transition ${
                            active ? "bg-mist" : "hover:bg-mist/70"
                          }`}
                        >
                          <ProductThumb imageUrl={item.imageUrl} accent={item.accent} name={item.title} />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-ink">
                              {browsing ? item.title : <Highlighted text={item.title} query={query} />}
                            </span>
                            <span className="mt-0.5 block truncate text-xs text-ink-soft">{item.subtitle}</span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
