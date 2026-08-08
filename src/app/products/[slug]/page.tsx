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
    <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
      <Link href="/browse" className="text-sm font-semibold text-ink-soft hover:text-ink">
        ← Back to browse
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div
          className="pack relative min-h-[360px] overflow-hidden rounded-[2rem] p-8 text-white shadow-[var(--shadow)]"
          style={{
            background: `linear-gradient(150deg, ${product.accent}, color-mix(in oklab, ${product.accent} 45%, #142821))`,
          }}
        >
          <div className="absolute right-10 top-12 h-40 w-24 rotate-12 rounded-2xl border border-white/40 bg-white/25 backdrop-blur-sm" />
          <div className="absolute bottom-16 left-12 h-28 w-28 rounded-full bg-white/20 blur-sm" />
          {product.badge ? (
            <span className="relative z-10 inline-block rounded-full bg-ink px-3 py-1 text-xs font-bold uppercase tracking-wide text-lemon">
              {product.badge}
            </span>
          ) : null}
          <h1 className="relative z-10 mt-6 max-w-md font-display text-4xl font-extrabold tracking-[-0.04em] md:text-5xl">
            {product.name}
          </h1>
          <p className="relative z-10 mt-4 text-lg text-white/85">{brand?.name}</p>
          <p className="relative z-10 mt-auto pt-24 font-display text-4xl font-bold">${product.price}</p>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
            <span className="rounded-full bg-lemon px-3 py-1">★ {product.rating.toFixed(1)}</span>
            <span className="text-ink-soft">{product.reviewCount} reviews</span>
            {brand ? (
              <Link href={`/brands/${brand.slug}`} className="text-teal-deep hover:underline">
                Visit {brand.name}
              </Link>
            ) : null}
          </div>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{product.description}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" className="btn btn-primary" disabled>
              View on brand shop (soon)
            </button>
            <Link href="/community" className="btn btn-ghost">
              Talk about it
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="surface rounded-[1.25rem] p-5">
              <h2 className="font-display text-xl font-bold">Ingredients</h2>
              <ul className="mt-3 space-y-2">
                {product.ingredients.map((ing) => (
                  <li key={ing}>
                    <Link
                      href={`/ingredients?q=${encodeURIComponent(ing)}`}
                      className="text-sm font-semibold text-teal-deep hover:underline"
                    >
                      {ing}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="surface rounded-[1.25rem] p-5">
              <h2 className="font-display text-xl font-bold">Free from</h2>
              <ul className="mt-3 space-y-2">
                {product.freeFrom.map((ing) => (
                  <li key={ing}>
                    <Link
                      href={`/ingredients?q=${encodeURIComponent(ing)}&mode=free-from`}
                      className="text-sm font-semibold text-ink-soft hover:text-ink hover:underline"
                    >
                      {ing}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-3xl font-extrabold tracking-[-0.03em]">Reviews</h2>
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
