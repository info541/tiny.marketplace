import Link from "next/link";
import { getBrand } from "@/lib/data";
import type { Product } from "@/lib/types";

export function ProductTile({ product }: { product: Product }) {
  const brand = getBrand(product.brandId);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group surface pack flex flex-col overflow-hidden rounded-[1.35rem] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow)]"
    >
      <div
        className="relative flex aspect-[4/3] items-end overflow-hidden p-5"
        style={{
          background: product.imageUrl
            ? `linear-gradient(160deg, color-mix(in oklab, ${product.accent} 22%, #ffffff), color-mix(in oklab, ${product.accent} 38%, #e8efe9))`
            : `linear-gradient(145deg, ${product.accent} 0%, color-mix(in oklab, ${product.accent} 55%, #142821) 100%)`,
        }}
      >
        {product.imageUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.imageUrl}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-contain p-4 transition duration-300 group-hover:scale-[1.04]"
            />
            {product.badge ? (
              <span className="absolute left-4 top-4 z-10 rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-lemon">
                {product.badge}
              </span>
            ) : null}
          </>
        ) : (
          <>
            <div className="absolute right-4 top-4 h-16 w-16 rounded-full bg-white/25 blur-md transition group-hover:scale-125" />
            <div className="absolute left-6 top-6 h-24 w-14 rotate-[-12deg] rounded-xl border border-white/40 bg-white/25 shadow-lg backdrop-blur-sm transition duration-300 group-hover:rotate-[-6deg]" />
            <div className="relative z-10">
              {product.badge ? (
                <span className="mb-2 inline-block rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-lemon">
                  {product.badge}
                </span>
              ) : null}
              <p className="font-display text-2xl font-bold leading-tight tracking-[-0.03em] text-white drop-shadow-sm">
                {product.name}
              </p>
            </div>
          </>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {product.imageUrl ? (
              <p className="font-display text-lg font-bold leading-tight tracking-[-0.02em] text-ink">
                {product.name}
              </p>
            ) : null}
            <p className={`text-sm font-semibold text-ink-soft ${product.imageUrl ? "mt-1" : ""}`}>
              {brand?.name}
            </p>
            <p className="mt-1 line-clamp-2 text-sm text-ink-soft/80">{product.description}</p>
          </div>
          <p className="shrink-0 font-display text-lg font-bold tracking-tight sm:text-xl">${product.price}</p>
        </div>
        <div className="mt-auto flex flex-wrap gap-1.5">
          {product.ingredients.slice(0, 3).map((ing) => (
            <span key={ing} className="rounded-full bg-mist px-2 py-0.5 text-[11px] font-semibold text-ink-soft">
              {ing}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">★ {product.rating.toFixed(1)}</span>
          <span className="text-ink-soft">{product.reviewCount} reviews</span>
        </div>
      </div>
    </Link>
  );
}
