import Link from "next/link";
import type { Brand } from "@/lib/types";

export function BrandTile({ brand }: { brand: Brand }) {
  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="group surface relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[1.35rem] p-5 transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow)]"
    >
      <div
        className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-80 transition group-hover:scale-110"
        style={{ background: brand.accent }}
      />
      <div className="absolute bottom-0 left-0 h-1.5 w-full" style={{ background: brand.accent }} />
      <div className="relative">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-soft/70">{brand.location}</p>
        <h3 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.03em]">{brand.name}</h3>
        <p className="mt-2 max-w-[18rem] text-sm text-ink-soft">{brand.tagline}</p>
      </div>
      <div className="relative flex items-center justify-between text-sm font-semibold">
        <span>★ {brand.rating.toFixed(1)}</span>
        <span className="text-ink-soft">{brand.followerCount.toLocaleString()} following</span>
      </div>
    </Link>
  );
}
