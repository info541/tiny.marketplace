import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { brands, categories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Brands",
  description: "Clean-leaning skincare, SPF, deodorant, oral care, and supplement brands on tiny.",
};

export default function BrandsIndexPage() {
  const sorted = [...brands].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-5 sm:py-12 md:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-soft/70">Brands</p>
      <h1 className="mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
        All {brands.length} brands
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-ink-soft sm:text-base">
        From mineral SPF to hydroxyapatite toothpaste — browse the brands we&apos;re featuring and stocking next.
      </p>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((brand) => (
          <Link
            key={brand.id}
            href={`/brands/${brand.slug}`}
            className="group flex gap-4 border border-line bg-white p-4 transition hover:border-ink/25 sm:p-5"
          >
            <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden border border-line bg-mist p-2">
              {brand.logoUrl ? (
                <BrandLogo src={brand.logoUrl} name={brand.name} size={56} />
              ) : (
                <span className="font-display text-xl" style={{ color: brand.accent }}>
                  {brand.name.slice(0, 1)}
                </span>
              )}
            </span>
            <span className="min-w-0">
              <span className="block font-display text-xl font-medium tracking-tight group-hover:underline">
                {brand.name}
              </span>
              <span className="mt-1 block text-sm text-ink-soft line-clamp-2">{brand.tagline}</span>
              <span className="mt-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft/70">
                {brand.categories
                  .map((id) => categories.find((c) => c.id === id)?.label ?? id)
                  .join(" · ")}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
