"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { ArrowRight, BookOpen, IndianRupee, Package, ScanSearch, Store } from "lucide-react";
import { crafts, getCraft } from "@/lib/content/crafts";
import { getPhrase } from "@/lib/content/phrases";
import { formatINR, priceVerdict, VERDICT_COPY, type Verdict } from "@/lib/price";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import type { CraftSlug, Phrase } from "@/lib/types";
import { ChipButton } from "@/components/ui/Chip";
import { PriceGauge } from "@/components/ui/PriceGauge";
import { Handnote } from "@/components/ui/Handnote";
import { RouteLine } from "@/components/motifs/RouteLine";
import { RangoliDivider } from "@/components/motifs/RangoliDivider";
import { BlockPrintPattern } from "@/components/motifs/BlockPrintPattern";
import { PhraseCard } from "./PhraseCard";
import { SpeechNote } from "./SpeakButton";

const VERDICT_STYLE: Record<Verdict, { text: string; ring: string; bg: string }> = {
  fair: { text: "text-leaf-dark", ring: "ring-leaf/40", bg: "bg-leaf/10" },
  low: { text: "text-marigold-ink", ring: "ring-marigold/50", bg: "bg-haldi/20" },
  "bit-high": { text: "text-marigold-ink", ring: "ring-marigold/50", bg: "bg-haldi/20" },
  "too-high": { text: "text-terracotta", ring: "ring-terracotta/40", bg: "bg-terracotta/10" },
};

const subscribeLocation = (cb: () => void) => {
  window.addEventListener("popstate", cb);
  return () => window.removeEventListener("popstate", cb);
};

/** ?craft=<slug> preselects a craft (e.g. linked from a craft page). */
function useCraftFromQuery(): CraftSlug | null {
  const search = useSyncExternalStore(subscribeLocation, () => window.location.search, () => "");
  const slug = new URLSearchParams(search).get("craft");
  return slug && getCraft(slug) ? (slug as CraftSlug) : null;
}

export function PriceCheck() {
  const t = useT();
  const queryCraft = useCraftFromQuery();
  const [picked, setPicked] = useState<CraftSlug | null>(null);
  const [itemIdx, setItemIdx] = useState<number | null>(null);
  const [raw, setRaw] = useState("");
  const favPhrases = useStore((s) => (s.hydrated ? s.favPhrases : null));

  const craftSlug = picked ?? queryCraft;
  const craft = craftSlug ? getCraft(craftSlug) : undefined;
  const item = craft && itemIdx !== null ? craft.prices[itemIdx] : undefined;
  const quoted = Number(raw) || 0;
  const verdict = item && quoted > 0 ? priceVerdict(quoted, item.min, item.max) : null;

  const step = !craft ? 0 : !item ? 1 : quoted <= 0 ? 2 : 3;

  const bargain: Phrase[] = useMemo(() => {
    const ids = [...(favPhrases ?? []), ...(craft?.phrases ?? []), "how-much", "little-less", "final-price"];
    const out: Phrase[] = [];
    for (const id of ids) {
      if (out.length >= 3) break;
      const p = getPhrase(id);
      // Bargaining phrases only: favourites from Shopping or Polite basics
      if (p && !out.some((x) => x.id === p.id) && (p.category === "shopping" || p.category === "basics")) out.push(p);
    }
    return out;
  }, [favPhrases, craft]);

  const chooseCraft = (slug: CraftSlug) => {
    setPicked(slug);
    setItemIdx(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr] lg:items-start">
      <div className="space-y-6">
        <RouteLine
          compact
          animate={false}
          active={step}
          ariaLabel="Price check steps"
          stops={[
            { label: "Craft", icon: Store },
            { label: "Item", icon: Package },
            { label: "Price", icon: IndianRupee },
            { label: "Verdict", icon: ScanSearch },
          ]}
        />

        <fieldset>
          <legend className="font-display text-2xl text-indigo">1. What are you buying?</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {crafts.map((c) => (
              <ChipButton key={c.slug} active={craftSlug === c.slug} onClick={() => chooseCraft(c.slug)}>
                {c.name}
                <span lang="hi" className="deva text-xs font-normal opacity-80">
                  {c.nameHi}
                </span>
              </ChipButton>
            ))}
          </div>
        </fieldset>

        {craft && (
          <fieldset>
            <legend className="font-display text-2xl text-indigo">2. Which piece?</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label={`${craft.name} items`}>
              {craft.prices.map((p, i) => {
                const on = itemIdx === i;
                return (
                  <button
                    key={p.item}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setItemIdx(i)}
                    className={`flex min-h-14 flex-col items-start justify-center rounded-2xl border-2 px-4 py-2 text-left transition-colors ${
                      on ? "border-rani bg-rani/5" : "border-sand bg-white hover:border-marigold"
                    }`}
                  >
                    <span className="font-semibold leading-snug text-ink">{p.item}</span>
                    <span className="text-sm text-muted">
                      usually {formatINR(p.min)}–{formatINR(p.max)}
                      {p.unit ? ` ${p.unit}` : ""}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {item && (
          <div>
            <label htmlFor="quoted" className="font-display text-2xl text-indigo">
              3. What price did they say?
            </label>
            <div className="mt-3 flex items-center rounded-2xl border-2 border-indigo bg-white px-4 focus-within:border-marigold focus-within:ring-2 focus-within:ring-marigold/40">
              <span className="font-display text-4xl text-indigo" aria-hidden="true">
                ₹
              </span>
              <input
                id="quoted"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
                enterKeyHint="done"
                placeholder="0"
                value={raw ? Number(raw).toLocaleString("en-IN") : ""}
                onChange={(e) => setRaw(e.target.value.replace(/\D/g, "").slice(0, 7))}
                aria-describedby="quoted-hint"
                className="min-h-16 w-full min-w-0 bg-transparent px-2 font-display text-4xl text-ink outline-none placeholder:text-sand"
              />
              {item.unit && <span className="shrink-0 text-sm text-muted">{item.unit}</span>}
            </div>
            <p id="quoted-hint" className="mt-1 text-sm text-muted">
              In rupees. Ask &ldquo;Yeh kitne ka hai?&rdquo; if they haven&apos;t said yet.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-6 lg:sticky lg:top-24">
        <section aria-labelledby="verdict-h" className="relative overflow-hidden rounded-3xl bg-indigo p-5 text-ivory">
          <BlockPrintPattern color="#E8A33D" opacity={0.08} />
          <h2 id="verdict-h" className="sr-only">
            Verdict
          </h2>
          <div className="relative rounded-2xl bg-ivory p-4 text-ink">
            <PriceGauge quoted={quoted} min={item?.min ?? 1} max={item?.max ?? 1} />
            <div aria-live="polite" className="mt-2 text-center">
              {verdict && item ? (
                <div className={`rounded-2xl px-4 py-3 ring-1 ${VERDICT_STYLE[verdict].bg} ${VERDICT_STYLE[verdict].ring}`}>
                  <p className={`font-display text-3xl ${VERDICT_STYLE[verdict].text}`}>{VERDICT_COPY[verdict].title}</p>
                  <p className={`font-hand text-xl ${VERDICT_STYLE[verdict].text}`}>{VERDICT_COPY[verdict].titleHi}!</p>
                  <p className="mt-1 text-[15px] leading-snug">{VERDICT_COPY[verdict].body}</p>
                </div>
              ) : (
                <p className="font-hand text-xl text-muted">
                  {!craft ? "Pick a craft to start" : !item ? "Now pick the piece" : "Type the price they quoted"}
                </p>
              )}
            </div>
            {item && (
              <p className="mt-3 text-center text-sm">
                <span className="font-semibold">{t("common.indicative")}</span> {formatINR(item.min)}–{formatINR(item.max)}
                {item.unit ? ` ${item.unit}` : ""}
              </p>
            )}
          </div>
          {craft && (
            <Link
              href={`/shop/rajasthan/${craft.slug}#spot`}
              className="relative mt-4 flex min-h-11 items-center justify-between gap-2 rounded-full bg-white/10 px-4 font-semibold text-haldi ring-1 ring-haldi/40 hover:bg-white/15"
            >
              <span>Real or copy? Check the {craft.name} signs</span>
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </Link>
          )}
          <p className="relative mt-3 text-xs text-ivory/75">
            Ranges are indicative, from our own market visits. Fine work and silver cost more; a fair maker will explain why.
          </p>
        </section>

        <section aria-labelledby="bargain-h">
          <h2 id="bargain-h" className="text-2xl">
            Bargain politely
          </h2>
          <p className="text-sm text-muted">
            Your ♡ phrases come first.{" "}
            <Link href="/phrases#cat-shopping" className="link-wavy">
              <BookOpen className="mr-1 inline h-4 w-4" aria-hidden="true" />
              More in the phrasebook
            </Link>
          </p>
          <SpeechNote className="mt-3" />
          <div className="mt-3 grid gap-3">
            {bargain.map((p) => (
              <PhraseCard key={p.id} phrase={p} favToggle={false} />
            ))}
          </div>
          <RangoliDivider className="!py-4" />
          <Handnote className="-rotate-1 text-center text-2xl" color="text-rani">
            It&apos;s okay to walk away politely.
          </Handnote>
          <p className="mt-1 text-center text-sm text-muted">
            &ldquo;Nahin, dhanyavaad&rdquo; with a smile. There are other makers, and you might be called back with a better price.
          </p>
        </section>
      </div>
    </div>
  );
}
