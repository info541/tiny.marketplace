"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useId, useRef, useState } from "react";
import { HeaderSearch } from "@/components/HeaderSearch";

const links = [
  { href: "/browse", label: "Browse" },
  { href: "/#brands", label: "Brands" },
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
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-[11px] font-medium tracking-wide text-white transition hover:bg-white/10"
        title="Account menu"
      >
        {initials}
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 z-50 mt-2 w-[min(14rem,calc(100vw-2rem))] overflow-hidden border border-line bg-white shadow-[var(--shadow)]"
        >
          <div className="border-b border-line px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-soft">Signed in</p>
            <p className="mt-1 truncate text-sm font-medium text-ink">{email}</p>
          </div>
          <div className="p-1.5">
            <Link
              href="/dashboard"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-mist"
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-mist"
            >
              Profile
            </Link>
          </div>
          <div className="border-t border-line p-1.5">
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                role="menuitem"
                className="w-full px-3 py-2.5 text-left text-sm font-medium text-coral transition hover:bg-[color-mix(in_oklab,var(--coral)_10%,white)]"
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
      className="flex h-10 w-10 shrink-0 items-center justify-center text-white transition hover:bg-white/10"
    >
      <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      <span className="relative block h-3.5 w-4" aria-hidden>
        <span
          className={`absolute top-0 left-0 h-px w-4 bg-white transition ${
            open ? "translate-y-[6px] rotate-45" : ""
          }`}
        />
        <span
          className={`absolute top-[6px] left-0 h-px w-4 bg-white transition ${
            open ? "opacity-0" : ""
          }`}
        />
        <span
          className={`absolute top-[12px] left-0 h-px w-4 bg-white transition ${
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
  const [menuPath, setMenuPath] = useState(pathname);
  const menuId = useId();

  if (pathname !== menuPath) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }

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
    <header className="sticky top-0 z-40 bg-header pt-[env(safe-area-inset-top)] text-white">
      <div className="flex items-center gap-4 px-4 py-3 sm:px-5 md:gap-6 md:px-8">
        <Link href="/" className="shrink-0">
          <span className="font-display text-[1.65rem] leading-none font-normal tracking-tight lowercase sm:text-[1.8rem]">
            tiny
          </span>
          <span className="sr-only">the tiny marketplace</span>
        </Link>

        {hideChrome ? (
          <Link href="/" className="ml-auto text-sm text-white/70 hover:text-white">
            ← Back
          </Link>
        ) : (
          <>
            <nav className="hidden items-center gap-5 lg:flex">
              {links.map((link) => {
                const active =
                  link.href !== "/#brands" &&
                  (pathname === link.href || pathname.startsWith(`${link.href}/`));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-[13px] transition ${
                      active ? "text-white" : "text-white/70 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="ml-auto flex min-w-0 items-center gap-2 sm:gap-3">
              {email ? (
                <UserMenu email={email} />
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden text-[13px] text-white/80 transition hover:text-white sm:inline"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="hidden rounded-full border border-white/40 px-3.5 py-1.5 text-[13px] text-white transition hover:border-white hover:bg-white/10 sm:inline"
                  >
                    Sign Up
                  </Link>
                </>
              )}

              <Suspense
                fallback={
                  <div className="h-10 min-w-0 flex-1 rounded-full bg-[#2a2a2a] md:w-56 md:flex-none" aria-hidden />
                }
              >
                <HeaderSearch
                  inputId="site-search"
                  className="min-w-0 flex-1 md:w-56 md:flex-none lg:w-72"
                />
              </Suspense>

              <span className="lg:hidden">
                <MenuButton open={menuOpen} controls={menuId} onClick={() => setMenuOpen((value) => !value)} />
              </span>
            </div>
          </>
        )}
      </div>

      {!hideChrome && menuOpen ? (
        <div id={menuId} className="border-t border-white/10 bg-header lg:hidden">
          <nav className="flex flex-col px-4 py-3 sm:px-5">
            {links.map((link) => {
              const active =
                link.href !== "/#brands" &&
                (pathname === link.href || pathname.startsWith(`${link.href}/`));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-1 py-3 text-base ${active ? "text-white" : "text-white/75"}`}
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
                  className="px-1 py-3 text-base text-white/75"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="px-1 py-3 text-base text-white/75"
                >
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="px-1 py-3 text-base text-white/75 sm:hidden"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="px-1 py-3 text-base text-white sm:hidden"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
