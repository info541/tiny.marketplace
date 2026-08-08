"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

const links = [
  { href: "/browse", label: "Browse" },
  { href: "/ingredients", label: "Ingredients" },
  { href: "/community", label: "Talk" },
];

type Props = {
  email?: string | null;
};

function initialsFromEmail(email: string) {
  const local = email.split("@")[0] ?? "u";
  const parts = local.split(/[._-]/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
  }
  return local.slice(0, 2).toUpperCase();
}

function UserMenu({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const initials = initialsFromEmail(email);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-xs font-bold tracking-wide text-lemon shadow-[0_6px_16px_color-mix(in_oklab,var(--ink)_22%,transparent)] transition hover:-translate-y-0.5 hover:bg-teal-deep"
        title="Account menu"
      >
        {initials}
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-line bg-white/95 shadow-[var(--shadow)] backdrop-blur-xl"
        >
          <div className="border-b border-line px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-soft/70">Signed in</p>
            <p className="mt-1 truncate text-sm font-semibold text-ink">{email}</p>
          </div>
          <div className="p-1.5">
            <Link
              href="/dashboard"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-ink transition hover:bg-mist"
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-ink transition hover:bg-mist"
            >
              Profile
            </Link>
          </div>
          <div className="border-t border-line p-1.5">
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                role="menuitem"
                className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-bold text-coral transition hover:bg-[color-mix(in_oklab,var(--coral)_12%,white)]"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function SiteHeaderClient({ email }: Props) {
  const pathname = usePathname();
  const hideChrome = pathname === "/login" || pathname === "/signup";

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

        {!hideChrome ? (
          <div className="flex items-center gap-2 md:gap-3">
            <nav className="flex items-center gap-0.5 sm:gap-1 md:gap-2">
              {links.map((link) => {
                const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-full px-2.5 py-1.5 text-sm font-semibold transition sm:px-3 ${
                      active ? "bg-ink text-foam" : "text-ink-soft hover:bg-mist"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {email ? (
              <UserMenu email={email} />
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-lemon px-3.5 py-1.5 text-sm font-bold tracking-[-0.01em] text-ink shadow-[0_6px_18px_color-mix(in_oklab,var(--lemon)_45%,transparent)] transition hover:-translate-y-0.5 hover:brightness-[1.03]"
              >
                Log in
              </Link>
            )}
          </div>
        ) : (
          <Link href="/" className="text-sm font-semibold text-ink-soft hover:text-ink">
            ← Back
          </Link>
        )}
      </div>
    </header>
  );
}
