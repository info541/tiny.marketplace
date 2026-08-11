import { brands } from "@/lib/data";

export function BrandMarquee() {
  const row = [...brands, ...brands];

  return (
    <div className="relative overflow-hidden border-y border-line bg-[color-mix(in_oklab,var(--lemon)_35%,white)] py-2.5 sm:py-3">
      <div className="animate-marquee flex w-max gap-8 whitespace-nowrap px-4 sm:gap-10">
        {row.map((brand, i) => (
          <span key={`${brand.id}-${i}`} className="inline-flex items-center gap-2.5 font-display text-base font-bold tracking-[-0.02em] sm:gap-3 sm:text-lg">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: brand.accent }} />
            {brand.name}
            <span className="text-xs font-semibold text-ink-soft sm:text-sm">· {brand.tagline}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
