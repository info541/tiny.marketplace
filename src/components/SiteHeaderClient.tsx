"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useId, useRef, useState } from "react";
import { HeaderSearch } from "@/components/HeaderSearch";

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
        className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-xs font-bold tracking-wide text-lemon shadow-[0_6px_16px_color-mix(in_oklab,var(--ink)_22%,transparent)] transition hover:-translate-y-0.5 hover:bg-teal-deep"
        title="Account menu"
      >
        {initials}
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 z-50 mt-2 w-[min(14rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-white/95 shadow-[var(--shadow)] backdrop-blur-xl"
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

function MenuButton({
  open,
  onClick,
  controls,
}: {
  open: boolean;
  onClick: () => void;
  controls: string;
}) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={controls}
      aria-label={open ? "Close menu" : "Open menu"}
      onClick={onClick}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--mist)_85%,white)] text-ink transition hover:bg-mist"
    >
      <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      <span className="relative block h-3.5 w-4" aria-hidden>
        <span
          className={`absolute left-0 top-0 h-0.5 w-4 rounded-full bg-ink transition ${
            open ? "translate-y-[6px] rotate-45" : ""
          }`}
        />
        <span
          className={`absolute left-0 top-[6px] h-0.5 w-4 rounded-full bg-ink transition ${
            open ? "opacity-0" : ""
          }`}
        />
        <span
          className={`absolute left-0 top-[12px] h-0.5 w-4 rounded-full bg-ink transition ${
            open ? "-translate-y-[6px] -rotate-45" : ""
          }`}
        />
      </span>
    </button>
  );
}

export function SiteHeaderClient({ email }: Props) {
  const pathname = usePathname();
  const hideChrome = pathname === "/login" || pathname === "/signup";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[color-mix(in_oklab,white_88%,transparent)] pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      {/* Desktop: single row */}
      <div className="mx-auto hidden max-w-6xl items-center justify-between gap-4 px-8 py-3.5 md:flex">
        <Link href="/" className="group flex min-w-0 items-baseline gap-2">
          <span className="font-display text-2xl font-extrabold tracking-[-0.04em]">the tiny marketplace</span>
          <span className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft/70 lg:inline">
            cosmetics first
          </span>
        </Link>

        {!hideChrome ? (
          <div className="flex items-center gap-3">
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

      {/* Mobile: logo + auth on top, hamburger + search below */}
      <div className="md:hidden">
        <div className="flex items-center justify-between gap-3 px-4 pt-3 sm:px-5">
          <Link href="/" className="min-w-0">
            <span className="font-display text-[1.15rem] font-extrabold tracking-[-0.04em] sm:text-[1.35rem]">
              the tiny marketplace
            </span>
          </Link>

          {!hideChrome ? (
            email ? (
              <UserMenu email={email} />
            ) : (
              <Link href="/login" className="shrink-0 text-sm font-bold text-ink">
                Log in
              </Link>
            )
          ) : (
            <Link href="/" className="shrink-0 text-sm font-semibold text-ink-soft hover:text-ink">
              ← Back
            </Link>
          )}
        </div>

        {!hideChrome ? (
          <div className="flex items-center gap-2.5 px-4 pb-3 pt-2.5 sm:px-5">
            <MenuButton open={menuOpen} controls={menuId} onClick={() => setMenuOpen((value) => !value)} />
            <Suspense
              fallback={
                <div className="h-11 min-w-0 flex-1 rounded-full border border-line bg-white" aria-hidden />
              }
            >
              <HeaderSearch />
            </Suspense>
          </div>
        ) : null}
      </div>

      {!hideChrome && menuOpen ? (
        <div
          id={menuId}
          className="border-t border-line bg-[color-mix(in_oklab,white_94%,transparent)] backdrop-blur-xl md:hidden"
        >
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-5">
            {links.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-base font-semibold transition ${
                    active ? "bg-ink text-foam" : "text-ink hover:bg-mist"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {email ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-2xl px-4 py-3 text-base font-semibold text-ink hover:bg-mist"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-2xl px-4 py-3 text-base font-semibold text-ink hover:bg-mist"
                >
                  Profile
                </Link>
              </>
            ) : null}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
