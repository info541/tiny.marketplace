import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-header pb-[env(safe-area-inset-bottom)] text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-5 sm:py-16 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div>
          <p className="font-display text-3xl font-medium tracking-tight lowercase">tiny</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/55">
            Curating small brands and their shops so you can find better cosmetics, cleaner labels, and people who care about the same things.
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm text-white/80">
            <li>
              <Link href="/browse" className="hover:text-white">
                Browse products
              </Link>
            </li>
            <li>
              <Link href="/ingredients" className="hover:text-white">
                Ingredient search
              </Link>
            </li>
            <li>
              <Link href="/community" className="hover:text-white">
                Community talk
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">About</p>
          <p className="mt-4 text-sm leading-relaxed text-white/55">
            An early marketplace mock — sample brands, reviews, and ingredient filters. Shopify sync and checkout come next.
          </p>
        </div>
      </div>
    </footer>
  );
}
