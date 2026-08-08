"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ProductTile } from "@/components/ProductTile";
import { categories, products } from "@/lib/data";
import type { Category } from "@/lib/types";

const categoryIds = new Set(categories.map((c) => c.id));

function parseCategory(value: string | null): Category | "all" {
  if (value && categoryIds.has(value as Category)) return value as Category;
  return "all";
}

export function BrowseClient() {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState<Category | "all">(() => parseCategory(searchParams.get("cat")));
  const [sort, setSort] = useState<"featured" | "rating" | "price-asc" | "price-desc">("featured");

  useEffect(() => {
    setCategory(parseCategory(searchParams.get("cat")));
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = category === "all" ? [...products] : products.filter((p) => p.category === category);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [category, sort]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory("all")}
          className={`chip ${category === "all" ? "chip-active" : ""}`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategory(cat.id)}
            className={`chip ${category === cat.id ? "chip-active" : ""}`}
          >
            <span aria-hidden>{cat.mark}</span> {cat.label}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink-soft">{filtered.length} products</p>
        <label className="flex items-center gap-2 text-sm font-semibold">
          Sort
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="rounded-full border border-line bg-white/80 px-3 py-2 outline-none"
          >
            <option value="featured">Featured</option>
            <option value="rating">Top rated</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
          </select>
        </label>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <ProductTile key={product.id} product={product} />
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-ink-soft">
        Hunting a specific molecule?{" "}
        <Link href="/ingredients" className="font-bold text-teal-deep underline-offset-2 hover:underline">
          Open ingredient search
        </Link>
      </p>
    </div>
  );
}
