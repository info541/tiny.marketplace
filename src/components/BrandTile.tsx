import Image from "next/image";
import Link from "next/link";
import { coverProductForBrand } from "@/lib/data";
import type { Brand } from "@/lib/types";

export function BrandTile({ brand }: { brand: Brand }) {
  const cover = coverProductForBrand(brand.id);

  return (
    <Link href={`/brands/${brand.slug}`} className="group relative flex min-h-[240px] flex-col justify-end overflow-hidden bg-ink p-5">
      {cover?.imageUrl ? (
        <Image
          src={cover.imageUrl}
          alt=""
          fill
          className="object-cover opacity-80 transition duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      ) : (
        <div
          className="absolute inset-0 transition duration-500 group-hover:scale-105"
          style={{
            background: `linear-gradient(160deg, ${brand.accent}, color-mix(in oklab, ${brand.accent} 50%, #1a1a1a))`,
          }}
        />
      )}
      <div className="absolute inset-0 bg-ink/40 transition group-hover:bg-ink/30" />
      <div className="relative text-white">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/70">{brand.location}</p>
        <h3 className="mt-1 font-display text-2xl font-medium tracking-tight">{brand.name}</h3>
        <p className="mt-2 max-w-[18rem] text-sm text-white/75">{brand.tagline}</p>
        <p className="mt-4 text-sm">★ {brand.rating.toFixed(1)}</p>
      </div>
    </Link>
  );
}
