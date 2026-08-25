"use cache";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import { CompareSearch } from "@/components/CompareSearch";
import { ProductColumn } from "@/components/ProductColumn";
import { PRODUCTS_CACHE_TAG } from "@/lib/cache-tags";
import { getBrand, getProduct, products } from "@/lib/data";
import { normalizeIngredientKey } from "@/lib/ingredient-info";
import { getCompareSuggestions } from "@/lib/search";
import type { Brand, Product } from "@/lib/types";

function sharedIngredientKeys(left: string[], right: string[]) {
  const other = new Set(right.map(normalizeIngredientKey));
  return [...new Set(left.map(normalizeIngredientKey).filter((key) => other.has(key)))];
}

function CompareMini({
  product,
  brand,
  className = "",
}: {
  product: Product;
  brand?: Brand;
  className?: string;
}) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className={`flex min-w-0 items-center gap-2 px-2 py-2 sm:gap-3 sm:px-4 sm:py-2.5 ${className}`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden border border-line bg-mist sm:h-9 sm:w-9">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt="" className="h-full w-full object-contain p-0.5" />
        ) : (
          <span className="font-display text-[10px] font-medium text-ink/70">{product.name.slice(0, 1)}</span>
        )}
      </span>
      <span className="min-w-0">
        {brand ? <span className="block truncate text-[10px] text-ink-soft sm:text-xs">{brand.name}</span> : null}
        <span className="block truncate text-[11px] font-medium leading-tight sm:text-sm">{product.name}</span>
      </span>
    </Link>
  );
}

export async function generateStaticParams() {
  const featured = products.filter((product) => product.badge).slice(0, 2);
  const pair = featured.length === 2 ? featured : products.slice(0, 2);
  return [{ slug: pair[0]!.slug, other: pair[1]!.slug }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; other: string }>;
}): Promise<Metadata> {
  const { slug, other } = await params;
  cacheLife("max");
  cacheTag(PRODUCTS_CACHE_TAG, `product:${slug}`, `product:${other}`);
  const product = getProduct(slug);
  const compared = getProduct(other);
  if (!product) return { title: "Product" };
  return { title: compared ? `${product.name} vs ${compared.name}` : product.name };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string; other: string }>;
}) {
  const { slug, other: otherSlug } = await params;
  cacheLife("max");
  cacheTag(PRODUCTS_CACHE_TAG, `product:${slug}`, `product:${otherSlug}`);

  const product = getProduct(slug);
  if (!product) notFound();
  const other = otherSlug !== slug ? getProduct(otherSlug) : undefined;
  if (!other) notFound();

  const brand = getBrand(product.brandId);
  const otherBrand = getBrand(other.brandId);
  const suggestions = getCompareSuggestions(product.slug);
  const sharedKeys = sharedIngredientKeys(product.ingredients, other.ingredients);

  return (
    <div className="mx-auto max-w-7xl px-0 py-3 sm:px-3 sm:py-8 md:px-6 md:py-12">
      <h1 className="sr-only">
        {product.name} vs {other.name}
      </h1>
      <div className="sticky top-[calc(4rem+env(safe-area-inset-top))] z-20 border-y border-line bg-foam/95 backdrop-blur sm:border-x">
        <div className="flex items-center gap-2 px-2 py-2 sm:px-4">
          <Link
            href={`/products/${product.slug}`}
            className="text-xs font-semibold text-ink-soft hover:text-ink sm:text-sm"
          >
            ← <span className="sm:hidden">Exit</span>
            <span className="hidden sm:inline">Exit compare</span>
          </Link>
          <p className="hidden min-w-0 flex-1 text-center text-[10px] uppercase tracking-[0.16em] text-ink-soft md:block">
            {sharedKeys.length
              ? `${sharedKeys.length} shared ingredient${sharedKeys.length === 1 ? "" : "s"}`
              : "No overlapping ingredients"}
          </p>
          <div className="ml-auto">
            <CompareSearch
              currentSlug={product.slug}
              excludeSlugs={[product.slug, other.slug]}
              suggestions={suggestions}
              compact
              align="end"
              label="Change"
            />
          </div>
        </div>
        <div className="relative grid grid-cols-2 divide-x divide-line border-t border-line">
          <CompareMini product={product} brand={brand} className="pr-5 sm:pr-7" />
          <CompareMini product={other} brand={otherBrand} className="pl-5 sm:pl-7" />
          <span className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.14em] text-white sm:px-2 sm:text-[10px]">
            vs
          </span>
        </div>
      </div>

      <p className="px-3 pt-3 text-center text-[10px] text-ink-soft sm:hidden">
        {sharedKeys.length
          ? `Shaded rows are in both · ${sharedKeys.length} shared`
          : "No overlapping ingredients"}
      </p>

      <div className="grid grid-cols-2 divide-x divide-line">
        <div className="min-w-0 px-2 py-4 sm:px-4 sm:py-6 md:px-6">
          <ProductColumn compact product={product} brand={brand} sharedKeys={sharedKeys} />
        </div>
        <div className="min-w-0 px-2 py-4 sm:px-4 sm:py-6 md:px-6">
          <ProductColumn compact product={other} brand={otherBrand} sharedKeys={sharedKeys} />
        </div>
      </div>
    </div>
  );
}
