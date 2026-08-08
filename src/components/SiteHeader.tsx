"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/browse", label: "Browse" },
  { href: "/ingredients", label: "Ingredients" },
  { href: "/community", label: "Talk" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[color-mix(in_oklab,white_72%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 md:px-8">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-display text-[1.35rem] font-extrabold tracking-[-0.04em] md:text-2xl">
            the tiny marketplace
          </span>
          <span className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft/70 sm:inline">
            cosmetics first
          </span>
        </Link>

        <nav className="flex items-center gap-1 md:gap-2">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                  active ? "bg-ink text-foam" : "text-ink-soft hover:bg-mist"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link href="/browse" className="btn btn-lemon ml-1 hidden !px-3.5 !py-2 text-sm sm:inline-flex">
            Shop tiny
          </Link>
        </nav>
      </div>
    </header>
  );
}
