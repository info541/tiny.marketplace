import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReviewCard } from "@/components/ReviewCard";
import { getBrand, getProduct, reviewsForProduct } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return { title: product?.name ?? "Product" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const brand = getBrand(product.brandId);
  const productReviews = reviewsForProduct(product.id);

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-14">
      <Link href="/browse" className="text-sm font-semibold text-ink-soft hover:text-ink">
        ← Back to browse
      </Link>

      {/* Compact header: small image left, details right */}
      <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
        <div
          className="mx-auto h-44 w-44 shrink-0 overflow-hidden rounded-2xl border border-line sm:mx-0 sm:h-52 sm:w-52"
          style={{
            background: `linear-gradient(160deg, color-mix(in oklab, ${product.accent} 14%, #ffffff), color-mix(in oklab, ${product.accent} 24%, #eef3ef))`,
          }}
        >
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- remote Shopify CDN URLs; avoid next/image fill sizing issues
            <img
              src={product.imageUrl}
              alt={product.name}
              width={208}
              height={208}
              className="h-full w-full object-contain p-3"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-4 text-center">
              <p className="font-display text-lg font-bold leading-tight text-ink">{product.name}</p>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          {brand ? (
            <Link
              href={`/brands/${brand.slug}`}
              className="text-sm font-semibold text-teal-deep hover:underline"
            >
              {brand.name}
            </Link>
          ) : null}
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-[-0.04em] md:text-4xl">
            {product.name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="font-display text-2xl font-bold tracking-tight">${product.price}</span>
            <span className="font-semibold">★ {product.rating.toFixed(1)}</span>
            <span className="text-ink-soft">{product.reviewCount} reviews</span>
            {product.badge ? (
              <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-lemon">
                {product.badge}
              </span>
            ) : null}
          </div>
          <p className="mt-4 max-w-xl leading-relaxed text-ink-soft">{product.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className="btn btn-primary" disabled>
              View on brand shop (soon)
            </button>
            <Link href="/community" className="btn btn-ghost">
              Talk about it
            </Link>
          </div>
        </div>
      </div>

      {/* Full-width scannable ingredients */}
      <section className="mt-12 border-t border-line pt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-extrabold tracking-[-0.03em]">Ingredients</h2>
            <p className="mt-1 text-sm text-ink-soft">
              {product.ingredients.length} in this formula · tap any to explore
            </p>
          </div>
          <Link href="/ingredients" className="text-sm font-semibold text-teal-deep hover:underline">
            Ingredient explorer →
          </Link>
        </div>

        <ol className="mt-6 grid gap-0 sm:grid-cols-2 sm:gap-x-10">
          {product.ingredients.map((ing, index) => (
            <li key={`${ing}-${index}`} className="border-b border-line/70 py-2.5">
              <Link
                href={`/ingredients?q=${encodeURIComponent(ing)}`}
                className="group flex items-baseline gap-3 text-sm hover:text-teal-deep"
              >
                <span className="w-6 shrink-0 font-mono text-xs text-ink-soft/55">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-medium group-hover:underline">{ing}</span>
              </Link>
            </li>
          ))}
        </ol>

        {product.freeFrom.length > 0 ? (
          <div className="mt-10">
            <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-ink-soft">Free from</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {product.freeFrom.map((ing) => (
                <li key={ing}>
                  <Link
                    href={`/ingredients?q=${encodeURIComponent(ing)}&mode=free-from`}
                    className="inline-block rounded-full border border-line bg-white/70 px-3 py-1.5 text-sm font-semibold text-ink-soft hover:border-teal hover:text-teal-deep"
                  >
                    {ing}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section className="mt-12 border-t border-line pt-10">
        <h2 className="font-display text-2xl font-extrabold tracking-[-0.03em]">Reviews</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {productReviews.length ? (
            productReviews.map((review) => <ReviewCard key={review.id} review={review} />)
          ) : (
            <p className="text-ink-soft">No product reviews yet — check the community for early chatter.</p>
          )}
        </div>
      </section>
    </div>
  );
}
