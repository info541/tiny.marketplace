import Image from "next/image";
import Link from "next/link";
import { amazonShopUrl, blogDisplayName, categoryLabel, formatBlogPrice } from "@/lib/blog";
import { getBrand } from "@/lib/data";
import type { Product } from "@/lib/types";

export function BlogProductEmbed({ product }: { product: Product }) {
  const brand = getBrand(product.brandId);
  const name = blogDisplayName(product.name);
  const shopUrl = amazonShopUrl(product);

  return (
    <div className="my-8 border border-line bg-white">
      <div className="grid sm:grid-cols-[9.5rem_1fr]">
        <div className="relative aspect-square bg-mist sm:aspect-auto sm:min-h-[9.5rem]">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={name}
              fill
              className="object-contain p-5"
              sizes="(max-width: 640px) 100vw, 152px"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(145deg, ${product.accent} 0%, color-mix(in oklab, ${product.accent} 45%, #1a1a1a) 100%)`,
              }}
            />
          )}
        </div>
        <div className="flex flex-col justify-center gap-2 p-5 sm:p-6">
          {brand ? <p className="text-sm text-ink-soft">{brand.name}</p> : null}
          <p className="font-display text-xl font-medium leading-tight tracking-tight sm:text-2xl">{name}</p>
          <p className="text-sm text-ink-soft">
            {formatBlogPrice(product.price)} · {categoryLabel(product.category)} · ★ {product.rating.toFixed(1)}
            {product.reviewCount ? ` · ${product.reviewCount.toLocaleString()} reviews` : ""}
          </p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {shopUrl ? (
              <a
                href={shopUrl}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
                className="btn btn-primary !min-h-0 !px-4 !py-2 text-sm"
              >
                Shop on Amazon
              </a>
            ) : null}
            <Link href={`/products/${product.slug}`} className="btn btn-ghost !min-h-0 !px-4 !py-2 text-sm">
              Full product page
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-line px-5 py-5 sm:px-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-soft/80">Breakdown</p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-ink-soft">Price</dt>
            <dd className="mt-0.5 font-medium">{formatBlogPrice(product.price)}</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Category</dt>
            <dd className="mt-0.5 font-medium">{categoryLabel(product.category)}</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Ingredients</dt>
            <dd className="mt-0.5 font-medium">{product.ingredients.length} in the formula</dd>
          </div>
        </dl>
        <ol className="mt-3 grid gap-0 sm:grid-cols-2 sm:gap-x-8">
          {product.ingredients.map((ing, index) => (
            <li key={`${ing}-${index}`} className="flex items-baseline gap-2 border-b border-line/70 py-1.5 text-sm">
              <span className="w-6 shrink-0 font-mono text-xs text-ink-soft/55">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 break-words">{ing}</span>
            </li>
          ))}
        </ol>
        {product.freeFrom.length > 0 ? (
          <div className="mt-5">
            <p className="text-sm text-ink-soft">Not in it</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {product.freeFrom.map((ing) => (
                <li key={ing} className="border border-line bg-mist px-2.5 py-1 text-sm">
                  {ing}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
