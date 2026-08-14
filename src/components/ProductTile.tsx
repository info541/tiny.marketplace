import Image from "next/image";
import Link from "next/link";
import { getBrand } from "@/lib/data";
import type { Product } from "@/lib/types";

export function ProductTile({ product }: { product: Product }) {
  const brand = getBrand(product.brandId);

  return (
    <Link href={`/products/${product.slug}`} className="group flex flex-col border border-line bg-white">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-mist">
        {product.imageUrl ? (
          <>
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-contain p-6 transition duration-300 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            {product.badge ? (
              <span className="absolute left-3 top-3 z-10 bg-ink px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-white">
                {product.badge}
              </span>
            ) : null}
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(145deg, ${product.accent} 0%, color-mix(in oklab, ${product.accent} 45%, #1a1a1a) 100%)`,
            }}
          >
            {product.badge ? (
              <span className="absolute left-3 top-3 bg-white px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-ink">
                {product.badge}
              </span>
            ) : null}
            <p className="absolute inset-x-4 bottom-4 font-display text-xl font-medium leading-tight text-white">
              {product.name}
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {product.imageUrl ? (
              <p className="font-display text-lg font-medium leading-tight tracking-tight text-ink">{product.name}</p>
            ) : null}
            <p className={`text-sm text-ink-soft ${product.imageUrl ? "mt-1" : ""}`}>{brand?.name}</p>
          </div>
          <p className="shrink-0 font-display text-lg font-medium tracking-tight">${product.price}</p>
        </div>
        <p className="line-clamp-2 text-sm text-ink-soft/90">{product.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2 text-sm">
          <span className="font-medium">★ {product.rating.toFixed(1)}</span>
          <span className="text-ink-soft">{product.reviewCount} reviews</span>
        </div>
      </div>
    </Link>
  );
}
