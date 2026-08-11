import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductTile } from "@/components/ProductTile";
import { ReviewCard } from "@/components/ReviewCard";
import { SaveBrandButton } from "@/components/SaveBrandButton";
import { getBrand, productsForBrand, reviewsForBrand } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrand(slug);
  return { title: brand?.name ?? "Brand" };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();

  const brandProducts = productsForBrand(brand.id);
  const brandReviews = reviewsForBrand(brand.id);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: dbBrand } = await supabase.from("brands").select("id").eq("slug", slug).maybeSingle();

  let initialSaved = false;
  if (user && dbBrand?.id) {
    const { data: saved } = await supabase
      .from("saved_brands")
      .select("brand_id")
      .eq("user_id", user.id)
      .eq("brand_id", dbBrand.id)
      .maybeSingle();
    initialSaved = Boolean(saved);
  }

  return (
    <div>
      <section
        className="relative overflow-hidden border-b border-line"
        style={{
          background: `linear-gradient(135deg, color-mix(in oklab, ${brand.accent} 35%, white), var(--foam) 55%, color-mix(in oklab, var(--mist) 70%, white))`,
        }}
      >
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-5 sm:py-14 md:px-8 md:py-20">
          <Link href="/browse" className="text-sm font-semibold text-ink-soft hover:text-ink">
            ← Back to browse
          </Link>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-ink-soft/70 sm:mt-6">
            {brand.location} · Est. {brand.founded}
          </p>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl md:text-6xl">{brand.name}</h1>
          <p className="mt-3 max-w-xl text-lg text-ink-soft sm:text-xl">{brand.tagline}</p>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">{brand.story}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm font-semibold sm:gap-4">
            <span className="rounded-full bg-ink px-3 py-1.5 text-lemon">★ {brand.rating.toFixed(1)}</span>
            <span className="rounded-full bg-white/70 px-3 py-1.5">{brand.reviewCount} reviews</span>
            <span className="rounded-full bg-white/70 px-3 py-1.5">
              {brand.followerCount.toLocaleString()} following
            </span>
            {dbBrand?.id ? <SaveBrandButton brandId={dbBrand.id} initialSaved={initialSaved} /> : null}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-5 sm:py-14 md:px-8">
        <h2 className="font-display text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">On the shelf</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {brandProducts.map((product) => (
            <ProductTile key={product.id} product={product} />
          ))}
        </div>

        <h2 className="mt-12 font-display text-2xl font-extrabold tracking-[-0.03em] sm:mt-16 sm:text-3xl">Brand reviews</h2>
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
