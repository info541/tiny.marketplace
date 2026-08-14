import Link from "next/link";
import { IngredientList } from "@/components/IngredientList";
import { ReviewCard } from "@/components/ReviewCard";
import type { Brand, Product, Review } from "@/lib/types";

type Props = {
  product: Product;
  brand?: Brand;
  reviews?: Review[];
  compact?: boolean;
  sharedKeys?: string[];
  children?: React.ReactNode;
};

export function ProductColumn({
  product,
  brand,
  reviews = [],
  compact = false,
  sharedKeys,
  children,
}: Props) {
  const isAmazon = Boolean(product.affiliateUrl?.includes("amazon.com"));
  const shopLabel = isAmazon
    ? "Buy on Amazon"
    : brand
      ? `View on ${brand.name}`
      : "View on brand shop";
  const compactShopLabel = isAmazon ? "Amazon" : "Brand shop";

  return (
    <article className={compact ? "min-w-0" : ""}>
      <div
        className={
          compact
            ? "flex flex-col gap-3"
            : "flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8"
        }
      >
        <div
          className={
            compact
              ? "flex h-28 w-full items-center justify-center overflow-hidden border border-line bg-mist sm:h-auto sm:aspect-square"
              : "mx-auto h-44 w-44 shrink-0 overflow-hidden border border-line bg-mist sm:mx-0 sm:h-52 sm:w-52"
          }
        >
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- remote Shopify CDN URLs; avoid next/image fill sizing issues
            <img
              src={product.imageUrl}
              alt={product.name}
              width={compact ? 480 : 208}
              height={compact ? 480 : 208}
              className={compact ? "h-full w-full object-contain p-2 sm:p-3" : "h-full w-full object-contain p-3"}
            />
          ) : (
            <div className="flex h-full items-center justify-center p-3 text-center">
              <p
                className={
                  compact
                    ? "font-display text-sm font-bold leading-tight text-ink sm:text-base"
                    : "font-display text-lg font-bold leading-tight text-ink"
                }
              >
                {product.name}
              </p>
            </div>
          )}
        </div>

        <div className={compact ? "min-w-0" : "min-w-0 flex-1 text-center sm:text-left"}>
          {brand ? (
            <Link
              href={`/brands/${brand.slug}`}
              className={
                compact
                  ? "text-[11px] font-medium text-ink underline-offset-4 hover:underline sm:text-sm"
                  : "text-sm font-medium text-ink underline-offset-4 hover:underline"
              }
            >
              {brand.name}
            </Link>
          ) : null}
          {compact ? (
            <h2 className="mt-0.5 font-display text-[0.95rem] font-medium leading-snug tracking-tight sm:text-xl md:text-2xl">
              <Link href={`/products/${product.slug}`} className="hover:underline">
                {product.name}
              </Link>
            </h2>
          ) : (
            <h1 className="mt-1 font-display text-[1.75rem] font-medium tracking-tight sm:text-3xl md:text-4xl">
              {product.name}
            </h1>
          )}
          <div
            className={
              compact
                ? "mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[11px] sm:mt-3 sm:gap-x-3 sm:text-sm"
                : "mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm sm:justify-start"
            }
          >
            <span
              className={
                compact
                  ? "font-display text-base font-bold tracking-tight sm:text-xl"
                  : "font-display text-2xl font-bold tracking-tight"
              }
            >
              ${product.price}
            </span>
            <span className="font-semibold">★ {product.rating.toFixed(1)}</span>
            <span className="text-ink-soft">
              {product.reviewCount}
              {compact ? <span className="hidden sm:inline"> reviews</span> : " reviews"}
            </span>
            {product.badge ? (
              <span
                className={
                  compact
                    ? "w-fit bg-ink px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-white sm:px-2.5 sm:py-1 sm:text-[11px]"
                    : "bg-ink px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-white"
                }
              >
                {product.badge}
              </span>
            ) : null}
          </div>
          <p
            className={
              compact
                ? "mt-2 line-clamp-3 text-[11px] leading-relaxed text-ink-soft sm:mt-3 sm:line-clamp-4 sm:text-sm"
                : "mt-4 max-w-xl text-sm leading-relaxed text-ink-soft sm:mx-0 sm:text-base"
            }
          >
            {product.description}
          </p>
          <div
            className={
              compact
                ? "mt-3 flex flex-col gap-2"
                : "mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            }
          >
            {product.affiliateUrl ? (
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel={isAmazon ? "noopener noreferrer nofollow sponsored" : "noopener noreferrer"}
                className={
                  compact
                    ? "btn btn-primary !min-h-0 w-full !px-2.5 !py-2 text-center text-[11px] leading-tight sm:!px-4 sm:text-sm"
                    : "btn btn-primary btn-stack"
                }
              >
                {compact ? compactShopLabel : shopLabel}
              </a>
            ) : (
              <button
                type="button"
                className={
                  compact
                    ? "btn btn-primary !min-h-0 w-full !px-2.5 !py-2 text-[11px] leading-tight sm:text-sm"
                    : "btn btn-primary btn-stack"
                }
                disabled
              >
                {compact ? "Shop soon" : "View on brand shop (soon)"}
              </button>
            )}
            {compact ? null : (
              <Link href="/community" className="btn btn-ghost btn-stack">
                Talk about it
              </Link>
            )}
            {children}
          </div>
        </div>
      </div>

      <section className={compact ? "mt-5 border-t border-line pt-4 sm:mt-8 sm:pt-6" : "mt-10 border-t border-line pt-8 sm:mt-12 sm:pt-10"}>
        <div
          className={
            compact
              ? "flex flex-col gap-1"
              : "flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-3"
          }
        >
          <div>
            {compact ? (
              <h3 className="font-display text-base font-medium tracking-tight sm:text-xl">Ingredients</h3>
            ) : (
              <h2 className="font-display text-xl font-medium tracking-tight sm:text-2xl">Ingredients</h2>
            )}
            <p className={compact ? "mt-0.5 text-[10px] leading-snug text-ink-soft sm:text-sm" : "mt-1 text-sm text-ink-soft"}>
              {compact
                ? `${product.ingredients.length} in formula`
                : `${product.ingredients.length} in this formula · tap any to learn more`}
            </p>
          </div>
          {compact ? null : (
            <Link href="/ingredients" className="text-sm font-medium text-ink underline-offset-4 hover:underline">
              All ingredients →
            </Link>
          )}
        </div>

        <IngredientList
          ingredients={product.ingredients}
          freeFrom={compact ? [] : product.freeFrom}
          compact={compact}
          sharedKeys={sharedKeys}
        />
      </section>

      {compact ? null : (
        <section className="mt-10 border-t border-line pt-8 sm:mt-12 sm:pt-10">
          <h2 className="font-display text-xl font-medium tracking-tight sm:text-2xl">Reviews</h2>
          <div className="mt-6 grid gap-4 sm:gap-5 md:grid-cols-2">
            {reviews.length ? (
              reviews.map((review) => <ReviewCard key={review.id} review={review} />)
            ) : (
              <p className="text-ink-soft">No product reviews yet — check the community for early chatter.</p>
            )}
          </div>
        </section>
      )}
    </article>
  );
}
