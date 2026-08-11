"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { highlightMatch, searchCatalog, type SearchHit } from "@/lib/search";

const TYPE_LABEL: Record<SearchHit["type"], string> = {
  product: "Products",
  brand: "Brands",
  category: "Categories",
  ingredient: "Ingredients",
};

function HitIcon({ hit }: { hit: SearchHit }) {
  if (hit.type === "product") {
    return (
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line"
        style={{
          background: `linear-gradient(145deg, color-mix(in oklab, ${hit.accent} 28%, white), color-mix(in oklab, ${hit.accent} 45%, #e8efe9))`,
        }}
      >
        {hit.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hit.imageUrl} alt="" className="h-full w-full object-contain p-1" />
        ) : (
          <span className="font-display text-xs font-bold text-ink/70">P</span>
        )}
      </span>
    );
  }

  if (hit.type === "brand") {
    return (
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line text-xs font-bold text-ink"
        style={{ background: `color-mix(in oklab, ${hit.accent} 35%, white)` }}
      >
        {hit.title.slice(0, 1)}
      </span>
    );
  }

  if (hit.type === "category") {
    return (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line bg-mist font-display text-base text-teal-deep">
        {hit.mark}
      </span>
    );
  }

  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line bg-white text-[10px] font-bold uppercase tracking-wide text-ink-soft">
      ING
    </span>
  );
}

function Highlighted({ text, query }: { text: string; query: string }) {
  const parts = highlightMatch(text, query);
  return (
    <>
      {parts.map((part, i) =>
        part.match ? (
          <mark key={i} className="rounded-sm bg-lemon/80 px-0.5 text-ink">
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  );
}

export function HeaderSearch({ className = "" }: { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listboxId = useId();
  const rootRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  const hits = useMemo(() => searchCatalog(query, 8), [query]);
  const showDropdown = open && query.trim().length > 0;

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const grouped = useMemo(() => {
    const order: SearchHit["type"][] = ["product", "brand", "category", "ingredient"];
    return order
      .map((type) => ({ type, items: hits.filter((h) => h.type === type) }))
      .filter((g) => g.items.length > 0);
  }, [hits]);

  const flatHits = useMemo(() => grouped.flatMap((g) => g.items), [grouped]);
  const indexById = useMemo(() => {
    const map = new Map<string, number>();
    flatHits.forEach((hit, i) => map.set(`${hit.type}-${hit.id}`, i));
    return map;
  }, [flatHits]);

  function goToBrowse(value: string) {
    const trimmed = value.trim();
    setOpen(false);
    if (!trimmed) {
      router.push("/browse");
      return;
    }
    router.push(`/browse?q=${encodeURIComponent(trimmed)}`);
  }

  function selectHit(hit: SearchHit) {
    setOpen(false);
    setQuery(hit.type === "ingredient" || hit.type === "category" ? hit.title : query);
    router.push(hit.href);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (showDropdown && flatHits[activeIndex]) {
      selectHit(flatHits[activeIndex]!);
      return;
    }
    goToBrowse(query);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown) {
      if (e.key === "ArrowDown" && query.trim()) {
        setOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % Math.max(flatHits.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + flatHits.length) % Math.max(flatHits.length, 1));
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  return (
    <form
      ref={rootRef}
      onSubmit={onSubmit}
      className={`relative z-50 min-w-0 flex-1 ${className}`}
      role="search"
    >
      <label htmlFor="site-search" className="sr-only">
        Search products and brands
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id="site-search"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search sunscreen, zinc, brands…"
          autoComplete="off"
          enterKeyHint="search"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            showDropdown && flatHits[activeIndex] ? `${listboxId}-opt-${activeIndex}` : undefined
          }
          className="h-11 w-full rounded-full border border-line bg-white py-0 pl-4 pr-12 text-base text-ink outline-none placeholder:text-ink-soft/55 focus:border-ink/25 focus:ring-4 focus:ring-lemon/50"
        />
        <button
          type="submit"
          aria-label="Search"
          className="absolute top-1/2 right-1.5 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-foam transition hover:bg-teal-deep"
        >
          <svg viewBox="0 0 20 20" fill="none" aria-hidden className="h-4 w-4">
            <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="M12.75 12.75 16.5 16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {showDropdown ? (
        <div
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+0.4rem)] max-h-[min(70vh,24rem)] overflow-auto rounded-2xl border border-line bg-white/95 shadow-[var(--shadow)] backdrop-blur-xl"
        >
          {flatHits.length === 0 ? (
            <div className="px-4 py-5 text-sm text-ink-soft">
              No matches for <span className="font-semibold text-ink">“{query.trim()}”</span>
              <button
                type="button"
                onClick={() => goToBrowse(query)}
                className="mt-3 block w-full rounded-xl bg-mist px-3 py-2.5 text-left text-sm font-semibold text-ink transition hover:bg-[color-mix(in_oklab,var(--mist)_70%,white)]"
              >
                Search all products →
              </button>
            </div>
          ) : (
            <>
              {grouped.map((group) => (
                <div key={group.type}>
                  <p className="sticky top-0 z-[1] border-b border-line/70 bg-[color-mix(in_oklab,white_92%,var(--mist))] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-soft/70">
                    {TYPE_LABEL[group.type]}
                  </p>
                  <ul>
                    {group.items.map((hit) => {
                      const index = indexById.get(`${hit.type}-${hit.id}`) ?? 0;
                      const active = index === activeIndex;
                      return (
                        <li key={`${hit.type}-${hit.id}`} role="option" aria-selected={active}>
                          <Link
                            id={`${listboxId}-opt-${index}`}
                            href={hit.href}
                            onMouseEnter={() => setActiveIndex(index)}
                            onClick={() => setOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 transition ${
                              active ? "bg-mist" : "hover:bg-mist/70"
                            }`}
                          >
                            <HitIcon hit={hit} />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-semibold text-ink">
                                <Highlighted text={hit.title} query={query} />
                              </span>
                              <span className="mt-0.5 block truncate text-xs text-ink-soft">
                                {hit.subtitle}
                              </span>
                            </span>
                            <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-ink-soft/55">
                              {hit.type}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
              <button
                type="button"
                onClick={() => goToBrowse(query)}
                className="sticky bottom-0 flex w-full items-center justify-between border-t border-line bg-white px-4 py-3 text-left text-sm font-bold text-teal-deep transition hover:bg-mist"
              >
                <span>See all results for “{query.trim()}”</span>
                <span aria-hidden>→</span>
              </button>
            </>
          )}
        </div>
      ) : null}
    </form>
  );
}
