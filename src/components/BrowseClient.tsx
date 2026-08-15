"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ProductTile } from "@/components/ProductTile";
import { categories, getBrand, products } from "@/lib/data";
import type { Category } from "@/lib/types";

const PAGE_SIZE = 24;
const categoryIds = new Set(categories.map((c) => c.id));

function parseCategory(value: string | null): Category | "all" {
  if (value && categoryIds.has(value as Category)) return value as Category;
  return "all";
}

export function BrowseClient() {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState<Category | "all">(() => parseCategory(searchParams.get("cat")));
  const [query, setQuery] = useState(() => searchParams.get("q")?.trim() ?? "");
  const [sort, setSort] = useState<"featured" | "rating" | "price-asc" | "price-desc">("featured");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setCategory(parseCategory(searchParams.get("cat")));
    setQuery(searchParams.get("q")?.trim() ?? "");
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    setPage(1);
  }, [category, sort]);

  const filtered = useMemo(() => {
    let list = category === "all" ? [...products] : products.filter((p) => p.category === category);
    if (query) {
      const needle = query.toLowerCase();
      list = list.filter((p) => {
        const brand = getBrand(p.brandId);
        return (
          p.name.toLowerCase().includes(needle) ||
          p.description.toLowerCase().includes(needle) ||
          brand?.name.toLowerCase().includes(needle) ||
          p.ingredients.some((ing) => ing.toLowerCase().includes(needle)) ||
          p.freeFrom.some((ing) => ing.toLowerCase().includes(needle))
        );
      });
    }
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [category, query, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div>
      {query ? (
        <p className="mb-4 text-sm font-semibold text-ink-soft">
          Results for <span className="text-ink">“{query}”</span>
        </p>
      ) : null}

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={() => setCategory("all")}
          className={`chip shrink-0 ${category === "all" ? "chip-active" : ""}`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategory(cat.id)}
            className={`chip shrink-0 ${category === cat.id ? "chip-active" : ""}`}
          >
            <span aria-hidden>{cat.mark}</span> {cat.label}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-ink-soft">{filtered.length} products</p>
        <label className="flex items-center gap-2 text-sm font-semibold">
          Sort
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="min-h-11 flex-1 rounded-full border border-line bg-white/80 px-3 py-2 outline-none sm:flex-none"
          >
            <option value="featured">Featured</option>
            <option value="rating">Top rated</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
          </select>
        </label>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {visible.map((product) => (
          <ProductTile key={product.id} product={product} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="surface mt-2 rounded-2xl p-8 text-center text-ink-soft">
          No products matched{query ? ` “{query}”` : ""}. Try another search or clear filters.
        </p>
      ) : null}

      {pageCount > 1 ? (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="min-h-11 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold disabled:opacity-40"
          >
            Previous
          </button>
          <p className="text-sm font-semibold text-ink-soft">
            Page {currentPage} of {pageCount}
          </p>
          <button
            type="button"
            disabled={currentPage >= pageCount}
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            className="min-h-11 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold disabled:opacity-40"
          >
            Next
          </button>
        </div>
      ) : null}

      <p className="mt-8 text-center text-sm text-ink-soft">
        Hunting a specific molecule?{" "}
        <Link href="/ingredients" className="font-medium text-ink underline-offset-4 hover:underline">
          Open the ingredients glossary
        </Link>
      </p>
    </div>
  );
}
