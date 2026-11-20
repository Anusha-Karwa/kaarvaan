"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Languages, MapPinned, Search, ShoppingBag } from "lucide-react";
import { Buti } from "./motifs/Buti";
import { ToranBorder } from "./motifs/ToranBorder";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { PreviewBanner } from "./ui/PreviewBanner";

const NAV = [
  { href: "/shop", key: "nav.shopping" },
  { href: "/experiences", key: "nav.experiences" },
  { href: "/plan", key: "nav.plan" },
  { href: "/memories", key: "nav.memories" },
] as const;

export function ModeToggle({ className = "" }: { className?: string }) {
  const mode = useStore((s) => s.mode);
  const hydrated = useStore((s) => s.hydrated);
  const set = useStore((s) => s.set);
  const t = useT();
  const opts = [
    { id: "planning" as const, icon: Compass, label: t("mode.planning") },
    { id: "here" as const, icon: MapPinned, label: t("mode.here") },
  ];
  return (
    <div role="radiogroup" aria-label={t("mode.label")} className={`flex rounded-full bg-indigo-dark/60 p-0.5 ring-1 ring-marigold/40 ${className}`}>
      {opts.map((o) => {
        const active = hydrated && mode === o.id;
        return (
          <button
            key={o.id}
            role="radio"
            aria-checked={active}
            onClick={() => set({ mode: o.id })}
            className={`flex min-h-10 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-xs font-semibold transition-colors sm:px-3 sm:text-sm ${
              active ? "bg-marigold text-indigo-dark" : "text-ivory/80 hover:text-ivory"
            }`}
          >
            <o.icon className="h-4 w-4" aria-hidden="true" />
            <span className={active ? "" : "sr-only sm:not-sr-only"}>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function Header() {
  const t = useT();
  const pathname = usePathname();
  const count = useStore((s) => (s.hydrated ? s.saved.length : 0));
  const lang = useStore((s) => s.lang);
  const set = useStore((s) => s.set);
  const openSearch = useStore((s) => s.setSearchOpen);
  return (
    <header className="sticky top-0 z-50 no-print">
      <PreviewBanner />
      <div className="bg-indigo text-ivory">
        <div className="container-k flex h-14 items-center gap-2 sm:h-16">
          <Link href="/" className="mr-auto flex items-center gap-1.5 rounded-lg" aria-label="Kaarvaan home">
            <Buti size={26} />
            <span className="font-display text-[26px] leading-none text-ivory sm:text-[28px]">Kaarvaan</span>
          </Link>
          <nav aria-label="Main" className="mr-2 hidden items-center gap-1 lg:flex">
            {NAV.map((n) => {
              const active = pathname.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-3 py-2 text-[15px] font-semibold transition-colors ${active ? "bg-white/10 text-haldi" : "text-ivory/85 hover:text-ivory"}`}
                >
                  {t(n.key)}
                </Link>
              );
            })}
          </nav>
          <ModeToggle />
          <button
            onClick={() => set({ lang: lang === "en" ? "hi" : "en" })}
            className="hidden h-11 w-11 items-center justify-center rounded-full hover:bg-white/10 sm:flex"
            aria-label={lang === "en" ? "Switch to Hindi" : "Switch to English"}
            title={lang === "en" ? "हिन्दी" : "English"}
          >
            <Languages className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            onClick={() => openSearch(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10"
            aria-label={t("nav.search")}
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </button>
          <Link
            href="/saved"
            className="relative flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10"
            aria-label={`${t("nav.saved")}: ${count} saved`}
          >
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rani px-1 text-[11px] font-bold text-white ring-2 ring-indigo">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
      <ToranBorder animate className="-mt-px" />
    </header>
  );
}
