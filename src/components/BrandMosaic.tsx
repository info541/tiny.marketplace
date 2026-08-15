import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { brands } from "@/lib/data";

export function BrandMosaic() {
  return (
    <section id="brands" className="scroll-mt-16 border-y border-line bg-mist">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-16 md:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-soft/70">Brands</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
            {brands.length} brands on the shelf
          </h2>
          <Link href="/brands" className="text-sm font-semibold text-ink underline-offset-4 hover:underline">
            Browse all →
          </Link>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-ink-soft sm:text-base">
          Clean-leaning skincare, mineral SPF, natural deodorant, oral care, and supplements we&apos;re stocking next.
        </p>

        <div className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-6 lg:grid-cols-8">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="group flex aspect-square flex-col items-center justify-center gap-2 border border-line bg-white p-3 transition hover:border-ink/30"
              title={brand.name}
            >
              <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden sm:h-14 sm:w-14">
                {brand.logoUrl ? (
                  <BrandLogo
                    src={brand.logoUrl}
                    name={brand.name}
                    size={56}
                    className="h-full w-full object-contain p-0.5 transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <span
                    className="flex h-full w-full items-center justify-center font-display text-lg text-white"
                    style={{ background: brand.accent }}
                  >
                    {brand.name.slice(0, 1)}
                  </span>
                )}
              </span>
              <span className="line-clamp-2 text-center text-[10px] font-medium leading-tight text-ink-soft sm:text-[11px]">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
