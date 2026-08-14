import Image from "next/image";
import Link from "next/link";
import { categories, coverProductForCategory, productsWithImages } from "@/lib/data";
import type { Product } from "@/lib/types";

function HeroRail({
  slots,
  side,
}: {
  slots: (Product | null)[];
  side: "left" | "right";
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute top-1/2 hidden w-[min(28%,18rem)] -translate-y-1/2 grid-cols-2 gap-3 lg:grid ${
        side === "left" ? "-left-6 xl:left-4" : "-right-6 xl:right-4"
      }`}
    >
      {slots.map((product, i) => (
        <div
          key={`${side}-${i}`}
          className={`relative aspect-square overflow-hidden rounded-2xl bg-[#ecece8] ${
            i % 2 === (side === "left" ? 1 : 0) ? "translate-y-6" : "-translate-y-4"
          }`}
        >
          {product?.imageUrl ? (
            <Image src={product.imageUrl} alt="" fill className="object-contain p-4" sizes="140px" />
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function HomeHero() {
  const pictured = productsWithImages();
  const left: (Product | null)[] = [null, pictured[0] ?? null, pictured[1] ?? null, pictured[2] ?? null];
  const right: (Product | null)[] = [pictured[3] ?? null, null, pictured[4] ?? null, pictured[5] ?? null];

  return (
    <section className="relative overflow-hidden bg-foam">
      <HeroRail slots={left} side="left" />
      <HeroRail slots={right} side="right" />

      <div className="relative z-10 mx-auto flex min-h-[min(72vh,40rem)] max-w-3xl flex-col items-center justify-center px-6 py-20 text-center sm:min-h-[min(78vh,44rem)] sm:py-28">
        <h1 className="animate-rise font-display text-[2.35rem] font-medium leading-[1.15] tracking-tight text-ink sm:text-5xl md:text-6xl">
          Let’s find your <em className="italic font-medium">formula</em>
        </h1>
        <p className="animate-rise delay-1 mt-4 max-w-md text-[15px] text-ink-soft sm:mt-5 sm:text-base">
          Discover small cosmetic brands, peek inside the ingredients, and shop what actually works.
        </p>
        <div className="animate-rise delay-2 mt-8 flex w-full max-w-md flex-col gap-3 sm:w-auto sm:flex-row">
          <Link href="/browse" className="btn btn-primary">
            Start browsing
          </Link>
          <Link href="#categories" className="btn btn-ghost">
            Shop top categories
          </Link>
        </div>
      </div>
    </section>
  );
}

export function CategoryShopGrid() {
  return (
    <section id="categories" className="scroll-mt-20 border-t border-line bg-mist">
      <div className="grid grid-cols-2 md:grid-cols-4">
        {categories.map((cat) => {
          const product = coverProductForCategory(cat.id);
          return (
            <Link
              key={cat.id}
              href={`/browse?cat=${cat.id}`}
              className="group flex flex-col items-center border-r border-b border-line px-4 py-10 text-center"
            >
              <div className="relative flex h-28 w-full items-center justify-center sm:h-36">
                {product?.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt=""
                    fill
                    className="object-contain p-2 transition duration-300 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <span className="font-display text-4xl text-ink/20">{cat.mark}</span>
                )}
              </div>
              <p className="mt-5 font-display text-sm italic text-ink">Shop</p>
              <p className="mt-1 font-display text-2xl font-medium tracking-tight text-ink sm:text-[1.75rem]">
                {cat.label}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
