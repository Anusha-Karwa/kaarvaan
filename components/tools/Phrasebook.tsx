"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Compass, Hand, Heart, ShoppingBag, UtensilsCrossed, type LucideIcon } from "lucide-react";
import { phrases } from "@/lib/data";
import type { PhraseCategory } from "@/lib/types";
import { useStore } from "@/lib/store";
import { StampIcon } from "@/components/motifs/StampIcon";
import { RangoliDivider } from "@/components/motifs/RangoliDivider";
import { Handnote } from "@/components/ui/Handnote";
import { PhraseCard } from "./PhraseCard";
import { SpeechNote } from "./SpeakButton";

export const PHRASE_GROUPS: { id: PhraseCategory; label: string; hi: string; icon: LucideIcon; color: string; note: string }[] = [
  { id: "shopping", label: "Shopping and bargaining", hi: "ख़रीदारी और मोलभाव", icon: ShoppingBag, color: "#C2185B", note: "Smile while you bargain. It's a conversation, not a fight." },
  { id: "directions", label: "Directions", hi: "रास्ता", icon: Compass, color: "#1F2A5C", note: "Point at the map on your phone too. Everyone understands a blue dot." },
  { id: "food", label: "Food", hi: "खाना", icon: UtensilsCrossed, color: "#B5462F", note: "“Kam teekha” is the most useful phrase in Rajasthan." },
  { id: "basics", label: "Polite basics", hi: "शिष्टाचार", icon: Hand, color: "#2E7D5B", note: "A namaste with folded hands opens every door." },
];

/** Measures the sticky site header so the jump bar can sit just below it. */
function useHeaderOffset() {
  const [h, setH] = useState(56);
  useEffect(() => {
    const el = document.querySelector("header");
    if (!el) return;
    const ro = new ResizeObserver(() => setH(el.getBoundingClientRect().height));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return h;
}

export function Phrasebook() {
  const top = useHeaderOffset();
  const [active, setActive] = useState<PhraseCategory>("shopping");
  const favCount = useStore((s) => (s.hydrated ? s.favPhrases.length : 0));
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = PHRASE_GROUPS.map((g) => document.getElementById(`cat-${g.id}`)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id.replace("cat-", "") as PhraseCategory);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Keep the active chip in view on narrow screens
  useEffect(() => {
    const chip = barRef.current?.querySelector<HTMLElement>(`[data-cat="${active}"]`);
    chip?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [active]);

  return (
    <>
      <div className="sticky z-30 -mx-4 border-b border-sand bg-ivory/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6" style={{ top }}>
        <nav aria-label="Phrase categories" ref={barRef} className="scroll-x !gap-2 !pb-0">
          {PHRASE_GROUPS.map((g) => {
            const on = active === g.id;
            return (
              <a
                key={g.id}
                data-cat={g.id}
                href={`#cat-${g.id}`}
                aria-current={on ? "true" : undefined}
                className={`inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-full border-2 px-4 text-sm font-semibold transition-colors ${
                  on ? "text-white" : "border-sand bg-white text-ink hover:border-marigold"
                }`}
                style={on ? { background: g.color, borderColor: g.color } : undefined}
              >
                <g.icon className="h-4 w-4" aria-hidden="true" />
                {g.label}
              </a>
            );
          })}
        </nav>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <p className="flex items-center gap-1.5 text-sm text-muted">
          <Heart className="h-4 w-4 text-rani" fill="currentColor" aria-hidden="true" />
          {favCount} favourite{favCount === 1 ? "" : "s"}. They appear on{" "}
          <Link href="/price-check" className="link-wavy">
            Price check
          </Link>
        </p>
      </div>
      <SpeechNote className="mt-4" />

      {PHRASE_GROUPS.map((g, gi) => {
        const list = phrases.filter((p) => p.category === g.id);
        return (
          <section key={g.id} id={`cat-${g.id}`} aria-labelledby={`h-${g.id}`} className="scroll-mt-16 pt-8">
            <div className="flex items-center gap-3">
              <StampIcon icon={g.icon} color={g.color} size={48} />
              <div>
                <h2 id={`h-${g.id}`} className="text-2xl sm:text-[28px]">
                  {g.label}
                </h2>
                <p lang="hi" className="deva text-muted">
                  {g.hi}
                </p>
              </div>
            </div>
            <Handnote className="ml-1 mt-2 -rotate-1" color={g.id === "basics" ? "text-leaf-dark" : g.id === "directions" ? "text-indigo" : "text-rani"}>
              {g.note}
            </Handnote>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => (
                <PhraseCard key={p.id} phrase={p} anchor />
              ))}
            </div>
            {gi < PHRASE_GROUPS.length - 1 && <RangoliDivider className="pb-0 pt-8" />}
          </section>
        );
      })}
    </>
  );
}
