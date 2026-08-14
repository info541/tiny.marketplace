import { brands } from "@/lib/data";

export function BrandMarquee() {
  const row = [...brands, ...brands];

  return (
    <div className="relative overflow-hidden border-y border-line bg-white py-2.5 sm:py-3">
      <div className="animate-marquee flex w-max gap-8 whitespace-nowrap px-4 sm:gap-10">
        {row.map((brand, i) => (
          <span key={`${brand.id}-${i}`} className="inline-flex items-center gap-2.5 font-display text-base font-medium tracking-tight sm:gap-3 sm:text-lg">
            <span className="text-ink-soft">·</span>
            {brand.name}
          </span>
        ))}
      </div>
    </div>
  );
}
