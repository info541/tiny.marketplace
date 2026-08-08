import { brands } from "@/lib/data";

export function BrandMarquee() {
  const row = [...brands, ...brands];

  return (
    <div className="relative overflow-hidden border-y border-line bg-[color-mix(in_oklab,var(--lemon)_35%,white)] py-3">
      <div className="animate-marquee flex w-max gap-10 whitespace-nowrap px-4">
        {row.map((brand, i) => (
          <span key={`${brand.id}-${i}`} className="inline-flex items-center gap-3 font-display text-lg font-bold tracking-[-0.02em]">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: brand.accent }} />
            {brand.name}
            <span className="text-sm font-semibold text-ink-soft">· {brand.tagline}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
