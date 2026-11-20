"use client";

import Link from "next/link";
import { Buti } from "./motifs/Buti";
import { BlockPrintPattern } from "./motifs/BlockPrintPattern";
import { ToranBorder } from "./motifs/ToranBorder";
import { useT } from "@/lib/i18n";

export function Footer() {
  const t = useT();
  const links = [
    { href: "/about", label: t("nav.about") },
    { href: "/how-we-choose", label: t("nav.how") },
    { href: "/privacy", label: t("nav.privacy") },
    { href: "/settings", label: t("nav.settings") },
    { href: "/phrases", label: t("nav.phrases") },
    { href: "/price-check", label: t("nav.priceCheck") },
    { href: "/getting-around", label: t("nav.gettingAround") },
    { href: "/saved", label: t("nav.saved") },
  ];
  return (
    <footer className="no-print mt-16">
      <ToranBorder flip band="#141B3D" />
      <div className="relative overflow-hidden bg-indigo-dark pb-28 pt-10 text-ivory md:pb-12">
        <BlockPrintPattern color="#E8A33D" opacity={0.07} />
        <div className="container-k relative grid gap-8 sm:grid-cols-[1.2fr_2fr]">
          <div>
            <div className="flex items-center gap-2">
              <Buti size={28} />
              <span className="font-display text-3xl">Kaarvaan</span>
              <span lang="hi" className="deva text-xl text-haldi">
                कारवाँ
              </span>
            </div>
            <p className="mt-2 max-w-xs text-ivory/80">A culture guide for first-time travellers, starting with Jaipur.</p>
            <p className="mt-4 font-hand text-xl text-haldi">{t("footer.love")}</p>
            <p className="text-sm text-ivory/70">{t("footer.loveEn")}</p>
          </div>
          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex min-h-11 items-center text-ivory/90 underline-offset-4 hover:text-haldi hover:underline hover:decoration-wavy">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="container-k relative mt-8 text-xs text-ivory/60">
          Shop, host and food-stall listings are fictional samples in this preview. Prices are indicative ranges. No accounts, no tracking of you: your trip stays on your phone.
        </p>
      </div>
    </footer>
  );
}
