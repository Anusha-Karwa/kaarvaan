import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Kalam, Mukta, Rozha_One, Tiro_Devanagari_Hindi } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { SITE_URL } from "@/lib/site";

const rozha = Rozha_One({ weight: "400", subsets: ["latin"], display: "swap", variable: "--font-rozha" });
// Only Latin files are preloaded; Devanagari glyphs still load on demand via unicode-range.
const mukta = Mukta({ weight: ["400", "500", "600", "700"], subsets: ["latin"], display: "swap", variable: "--font-mukta" });
const tiro = Tiro_Devanagari_Hindi({ weight: "400", subsets: ["devanagari"], display: "swap", variable: "--font-tiro", preload: false });
const kalam = Kalam({ weight: ["400", "700"], subsets: ["latin"], display: "swap", variable: "--font-kalam", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Kaarvaan · Find the real Jaipur",
    template: "%s · Kaarvaan",
  },
  description:
    "A culture guide for first-time travellers, starting with Jaipur. Genuine crafts and their makers, what to do and eat, how to spot the real thing, and a fair price to bargain with.",
  applicationName: "Kaarvaan",
  appleWebApp: { capable: true, title: "Kaarvaan", statusBarStyle: "black-translucent" },
  openGraph: {
    type: "website",
    siteName: "Kaarvaan",
    title: "Kaarvaan · Find the real city: its crafts, its food, its people.",
    description: "A culture guide for first-time travellers, starting with Jaipur.",
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#1F2A5C",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Runs before first paint: reads saved preferences so server-rendered UI (onboarding, preview banner)
// shows or hides without waiting for JavaScript or shifting the layout.
const PRE_PAINT = `(function(){var d=document.documentElement;try{var s=(JSON.parse(localStorage.getItem("kaarvaan-v1")||"null")||{}).state||{};if(s.bannerDismissed)d.setAttribute("data-banner","0");var p=location.pathname,skip=/^\\/(plan\\/view|privacy|styleguide)/.test(p)||/[?&]from=hotel/.test(location.search);if(!s.onboarded&&!skip)d.setAttribute("data-onb","1")}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${rozha.variable} ${mukta.variable} ${tiro.variable} ${kalam.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PRE_PAINT }} />
      </head>
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-indigo px-4 py-2 text-ivory focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
        >
          Skip to content
        </a>
        {/* Suspense boundaries let React hydrate each region as its own interruptible chunk
            (selective hydration), so no single long task blocks the main thread. */}
        <AppShell>
          <Suspense>
            <Header />
          </Suspense>
          <main id="main" className="min-h-[60vh] pb-28 md:pb-12">
            <Suspense>{children}</Suspense>
          </main>
          <Suspense>
            <Footer />
          </Suspense>
          <Suspense>
            <BottomNav />
          </Suspense>
        </AppShell>
        {process.env.VERCEL && <Analytics />}
      </body>
    </html>
  );
}
