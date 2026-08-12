import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const body = Figtree({
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
    "A fun marketplace for small cosmetic & wellness brands — discover products, hunt ingredients, leave reviews, and talk shop.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f7fbf8",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <main className="relative z-10 flex-1">{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
