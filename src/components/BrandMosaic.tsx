import Image from "next/image";
import Link from "next/link";
import { brands, coverProductForBrand } from "@/lib/data";

export function BrandMosaic() {
  const tiles = brands.slice(0, 8);

  return (
    <section id="brands" className="scroll-mt-16">
      <div className="grid grid-cols-2 gap-px bg-white md:grid-cols-4">
        {tiles.map((brand) => {
          const cover = coverProductForBrand(brand.id);
          return (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="group relative aspect-square overflow-hidden bg-ink"
            >
              <div
                className="absolute inset-0 transition duration-500 group-hover:scale-105"
                style={{
                  background: `linear-gradient(160deg, color-mix(in oklab, ${brand.accent} 55%, #2a2a2a), #1a1a1a)`,
                }}
              />
              {cover?.imageUrl ? (
                <Image
                  src={cover.imageUrl}
                  alt=""
                  fill
                  className="object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-90"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              ) : null}
              <div className="absolute inset-0 bg-ink/30 transition group-hover:bg-ink/20" />
              <span className="absolute inset-0 flex items-center justify-center px-4 text-center font-display text-xl font-medium tracking-tight text-white drop-shadow-sm sm:text-2xl">
                {brand.name}
              </span>
            </Link>
          );
        })}
      </div>
      <div className="border-t border-line bg-mist px-4 py-3 text-center sm:px-5">
        <Link href="/brands" className="text-sm font-semibold text-ink underline-offset-4 hover:underline">
          Browse all {brands.length} brands →
        </Link>
      </div>
    </section>
  );
}
