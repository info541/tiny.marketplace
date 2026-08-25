import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { Analytics } from "@vercel/analytics/next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeaderClient } from "@/components/SiteHeaderClient";
import "./globals.css";

const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "the tiny marketplace",
    template: "%s · the tiny marketplace",
  },
  description:
    "A marketplace for small cosmetic & wellness brands — discover products, hunt ingredients, leave reviews, and talk shop.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1a1a1a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <CachedHeader />
        <main className="relative z-10 flex-1">{children}</main>
        <CachedFooter />
        <Analytics />
      </body>
    </html>
  );
}

async function CachedHeader() {
  "use cache";
  cacheLife("max");
  cacheTag("layout");

  return (
    <Suspense fallback={<header className="sticky top-0 z-40 h-[52px] bg-header pt-[env(safe-area-inset-top)]" aria-hidden />}>
      <SiteHeaderClient />
    </Suspense>
  );
}

async function CachedFooter() {
  "use cache";
  cacheLife("max");
  cacheTag("layout");

  return <SiteFooter />;
}
