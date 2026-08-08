import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-20 border-t border-line bg-[color-mix(in_oklab,var(--mist)_70%,white)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div>
          <p className="font-display text-3xl font-extrabold tracking-[-0.04em]">the tiny marketplace</p>
          <p className="mt-3 max-w-sm text-ink-soft">
            Curating small brands and their Shopify shops so you can find better cosmetics, cleaner labels, and people who care about the same things.
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-soft/70">Explore</p>
          <ul className="mt-3 space-y-2 font-semibold">
            <li>
              <Link href="/browse" className="hover:text-teal-deep">
                Browse products
              </Link>
            </li>
            <li>
              <Link href="/ingredients" className="hover:text-teal-deep">
                Ingredient search
              </Link>
            </li>
            <li>
              <Link href="/community" className="hover:text-teal-deep">
                Community talk
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-soft/70">Mockup note</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            This is an early experience mock — sample brands, reviews, and ingredient filters. Shopify sync, accounts, and checkout come next.
          </p>
        </div>
      </div>
    </footer>
  );
}
