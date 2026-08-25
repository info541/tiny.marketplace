"use cache";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import { BrandLogo } from "@/components/BrandLogo";
import { BrandSaveSection } from "@/components/BrandSaveSection";
import { ProductTile } from "@/components/ProductTile";
import { ReviewCard } from "@/components/ReviewCard";
import { getBrand, productsForBrand, reviewsForBrand, brands } from "@/lib/data";

export async function generateStaticParams() {
  return brands.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  cacheLife("max");
  cacheTag("brands", `brand:${slug}`);
  const brand = getBrand(slug);
  return { title: brand?.name ?? "Brand" };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  cacheLife("max");
  cacheTag("brands", `brand:${slug}`);

  const brand = getBrand(slug);
  if (!brand) notFound();

  const brandProducts = productsForBrand(brand.id);
  const brandReviews = reviewsForBrand(brand.id);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-line bg-mist">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-5 sm:py-14 md:px-8 md:py-20">
          <Link href="/brands" className="text-sm font-semibold text-ink-soft hover:text-ink">
            ← All brands
          </Link>
          <div className="mt-5 flex flex-wrap items-center gap-4 sm:mt-6">
            {brand.logoUrl ? (
              <span className="flex h-16 w-16 items-center justify-center overflow-hidden border border-line bg-white p-2 sm:h-20 sm:w-20">
                <BrandLogo src={brand.logoUrl} name={brand.name} size={72} />
              </span>
            ) : null}
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-soft/70">
              {brand.location} · Est. {brand.founded}
            </p>
          </div>
          <h1 className="mt-2 font-display text-4xl font-medium tracking-tight sm:text-5xl md:text-6xl">{brand.name}</h1>
          <p className="mt-3 max-w-xl text-lg text-ink-soft sm:text-xl">{brand.tagline}</p>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">{brand.story}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm font-semibold sm:gap-4">
            <span className="bg-ink px-3 py-1.5 text-white">★ {brand.rating.toFixed(1)}</span>
            <span className="rounded-full bg-white/70 px-3 py-1.5">{brand.reviewCount} reviews</span>
            <span className="rounded-full bg-white/70 px-3 py-1.5">
              {brand.followerCount.toLocaleString()} following
            </span>
            {brand.websiteUrl ? (
              <a
                href={brand.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-ink px-3 py-1.5 text-white hover:opacity-90"
              >
                Visit shop ↗
              </a>
            ) : null}
            <BrandSaveSection slug={slug} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-5 sm:py-14 md:px-8">
        <h2 className="font-display text-2xl font-medium tracking-tight sm:text-3xl">On the shelf</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {brandProducts.map((product) => (
            <ProductTile key={product.id} product={product} />
          ))}
        </div>

        <h2 className="mt-12 font-display text-2xl font-medium tracking-tight sm:mt-16 sm:text-3xl">Brand reviews</h2>
        <div className="mt-6 grid gap-4 sm:gap-5 md:grid-cols-2">
          {brandReviews.length ? (
            brandReviews.map((review) => <ReviewCard key={review.id} review={review} />)
          ) : (
            <p className="text-ink-soft">No reviews yet — be the first after launch.</p>
          )}
        </div>
      </div>
    </div>
  );
}
