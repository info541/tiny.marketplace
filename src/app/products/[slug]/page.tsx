"use cache";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import { CompareSearch } from "@/components/CompareSearch";
import { ProductColumn } from "@/components/ProductColumn";
import { PRODUCTS_CACHE_TAG } from "@/lib/cache-tags";
import { getBrand, getProduct, products, reviewsForProduct } from "@/lib/data";
import { getCompareSuggestions } from "@/lib/search";

export async function generateStaticParams() {
  const featured = products.filter((product) => product.badge);
  const list = featured.length ? featured : products.slice(0, 12);
  return list.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  cacheLife("max");
  cacheTag(PRODUCTS_CACHE_TAG, `product:${slug}`);
  const product = getProduct(slug);
  return { title: product?.name ?? "Product" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  cacheLife("max");
  cacheTag(PRODUCTS_CACHE_TAG, `product:${slug}`);

  const product = getProduct(slug);
  if (!product) notFound();
  const brand = getBrand(product.brandId);
  const productReviews = reviewsForProduct(product.id);
  const suggestions = getCompareSuggestions(product.slug);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-5 sm:py-10 md:px-8 md:py-14">
      <Link href="/browse" className="text-sm font-semibold text-ink-soft hover:text-ink">
        ← Back to browse
      </Link>

      <div className="mt-6 sm:mt-8">
        <ProductColumn product={product} brand={brand} reviews={productReviews}>
          <CompareSearch
            currentSlug={product.slug}
            excludeSlugs={[product.slug]}
            suggestions={suggestions}
          />
        </ProductColumn>
      </div>
    </div>
  );
}
