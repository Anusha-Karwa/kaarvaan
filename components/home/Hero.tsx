"use client";

import { Camera, Hammer, Landmark, Palette, UtensilsCrossed } from "lucide-react";
import { useNow } from "@/lib/useNow";
import { Jharokha } from "../motifs/Jharokha";
import { Mandala } from "../motifs/Mandala";
import { BlockPrintPattern } from "../motifs/BlockPrintPattern";
import { RouteLine, type RouteStop } from "../motifs/RouteLine";
import { ButtonLink } from "../ui/Button";
import { useStore } from "@/lib/store";
import { useT, type TKey } from "@/lib/i18n";

const STOPS: RouteStop[] = [
  { label: "Crafts", sub: "the real thing", href: "/shop/rajasthan", icon: Palette, color: "#C2185B" },
  { label: "Workshops", sub: "make it yourself", href: "/experiences?tab=workshops", icon: Hammer, color: "#2E7D5B" },
  { label: "Food", sub: "kachori to ghewar", href: "/experiences?tab=food", icon: UtensilsCrossed, color: "#B5462F" },
  { label: "Places", sub: "forts & stepwells", href: "/experiences?tab=places", icon: Landmark, color: "#1F2A5C" },
  { label: "Memories", sub: "your trip story", href: "/memories", icon: Camera, color: "#E8A33D" },
];

function useGreeting(): { word: TKey; meaning: TKey } | null {
  const now = useNow();
  if (!now) return null;
  const h = now.getHours();
  if (h >= 4 && h < 12) return { word: "greet.morning", meaning: "greet.morningEn" };
  if (h >= 12 && h < 17) return { word: "greet.afternoon", meaning: "greet.afternoonEn" };
  return { word: "greet.evening", meaning: "greet.eveningEn" };
}

export function Hero() {
  const t = useT();
  const name = useStore((s) => (s.hydrated ? s.name : ""));
  const g = useGreeting();
  return (
    <section className="relative overflow-hidden pb-6 pt-6 sm:pt-10" aria-labelledby="hero-title">
      <BlockPrintPattern opacity={0.05} />
      <div className="container-k relative grid items-center gap-8 lg:grid-cols-[1.05fr_1fr]">
        <div className="relative mx-auto w-full max-w-[460px] animate-rise [animation-delay:0.2s]">
          <div className="relative aspect-[10/12] w-full">
            <Jharokha aspect={1.2} rise={0.36} fill="#1F2A5C" stroke="#141B3D" strokeWidth={3} />
            <div className="absolute inset-x-0 top-[3%] flex justify-center">
              <Mandala size={150} color="#E8A33D" accent="#C2185B" className="opacity-40" />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-end px-[9%] pb-[9%] text-center text-ivory">
              <p className="min-h-7 font-hand text-xl text-haldi" aria-live="off">
                {g && (
                  <>
                    {t(g.word)}, {name || t("greet.traveller")}
                    <span className="block font-sans text-xs text-ivory/75">({t(g.meaning)})</span>
                  </>
                )}
              </p>
              <h1 id="hero-title" className="mt-1 text-[46px] leading-none text-ivory sm:text-[58px]">
                Kaarvaan
              </h1>
              <p className="mt-1 text-lg text-haldi">
                <span lang="hi" className="deva">
                  कारवाँ
                </span>{" "}
                · the caravan
              </p>
              <p className="mt-3 max-w-xs text-[17px] leading-snug text-ivory/90">{t("home.tagline")}</p>
              <ButtonLink href="/shop/rajasthan" size="lg" className="mt-5">
                {t("home.cta")}
              </ButtonLink>
              <p className="mt-3 text-sm text-ivory/70">A culture guide for first-time travellers, starting with Jaipur.</p>
            </div>
          </div>
        </div>
        <div className="lg:pl-4">
          <p className="mb-3 hidden font-hand text-xl text-rani lg:block">Your caravan route through Jaipur →</p>
          <RouteLine stops={STOPS} className="lg:hidden" ariaLabel="Your route" compact />
          <RouteLine stops={STOPS} orientation="vertical" className="hidden lg:block [--seg:5.5rem]" ariaLabel="Your route" />
        </div>
      </div>
    </section>
  );
}
