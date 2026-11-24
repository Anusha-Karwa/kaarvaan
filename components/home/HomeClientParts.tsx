"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, CalendarHeart, Gauge, Landmark, MapPin, Navigation, Share2, ShoppingBag, UtensilsCrossed, Hammer } from "lucide-react";
import { useActiveTrip, useStore } from "@/lib/store";
import { useT, type TKey } from "@/lib/i18n";
import { getArea } from "@/lib/content/areas";
import { KIND_META } from "@/lib/content/meta";
import { formatKm, haversine, openStatus } from "@/lib/geo";
import { daysUntil } from "@/lib/plan";
import { directionsUrl } from "@/lib/maps";
import { useNow } from "@/lib/useNow";
import type { Hours, ItemKind } from "@/lib/types";
import { Buti } from "../motifs/Buti";
import { BlockPrintPattern } from "../motifs/BlockPrintPattern";
import { BandhaniDots } from "../motifs/BandhaniDots";
import { StampIcon } from "../motifs/StampIcon";
import { SectionHeader } from "../ui/SectionHeader";
import { ButtonLink } from "../ui/Button";
import { Chip, OpenChip } from "../ui/Chip";
import { Skeleton } from "../ui/Skeleton";
import { AreaPickerSheet, LocationButton } from "../LocationButton";

/** Translated UI string as a tiny client island, so server components can stay server-rendered. */
export function T({ k }: { k: TKey }) {
  const t = useT();
  return <>{t(k)}</>;
}

export function LocationStrip() {
  const t = useT();
  const area = useStore((s) => (s.hydrated ? s.area : null));
  const [picker, setPicker] = useState(false);
  return (
    <div className="container-k">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-sand bg-white/80 px-4 py-2 shadow-[var(--shadow-card)]">
        <MapPin className="h-5 w-5 shrink-0 text-rani" aria-hidden="true" />
        <p className="mr-auto text-[15px]">
          {t("home.exploring")}{" "}
          <strong className="text-indigo">
            Rajasthan · Jaipur{area ? ` · ${getArea(area)?.name}` : ""}
          </strong>
        </p>
        <button onClick={() => setPicker(true)} className="min-h-11 rounded-full px-3 text-sm font-semibold text-indigo underline decoration-marigold decoration-wavy underline-offset-4">
          {t("home.change")}
        </button>
        <LocationButton />
      </div>
      <AreaPickerSheet open={picker} onClose={() => setPicker(false)} />
    </div>
  );
}

export interface NearItem {
  kind: ItemKind;
  slug: string;
  title: string;
  subtitle: string;
  href: string;
  lat: number;
  lng: number;
  hours?: Hours;
}

const KIND_ICON = { shop: ShoppingBag, place: Landmark, dish: UtensilsCrossed, workshop: Hammer } as const;

/** Here-now mode: nearest shops, places and food. `items` comes pre-trimmed from the server. */
export function NearYou({ items }: { items: NearItem[] }) {
  const t = useT();
  const coords = useStore((s) => s.coords);
  const area = useStore((s) => s.area);
  const now = useNow();
  const origin = coords ?? (area ? getArea(area) : getArea("old-city"))!;
  const list = useMemo(
    () =>
      items
        .map((i) => ({ ...i, d: haversine(origin.lat, origin.lng, i.lat, i.lng) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 10),
    [items, origin.lat, origin.lng],
  );
  return (
    <section className="mt-10" aria-labelledby="near-title">
      <div className="container-k">
        <SectionHeader
          id="near-title"
          title={t("home.nearYou")}
          color="#2E7D5B"
          sub={coords ? "Sorted by distance from you (location is never stored)." : `Sorted from ${getArea(area ?? "old-city")?.name}. Tap "Use my location" for real distances.`}
        />
        <ul className="scroll-x -mx-1 px-1">
          {list.map((i) => {
            const st = now && i.hours ? openStatus(i.hours, now) : null;
            const meta = KIND_META[i.kind];
            return (
              <li key={`${i.kind}-${i.slug}`} className="w-60">
                <div className="card flex h-full flex-col overflow-hidden">
                  <Link href={i.href} className="flex flex-1 flex-col p-3">
                    <div className="flex items-center gap-3">
                      <StampIcon icon={KIND_ICON[i.kind]} color={meta.color} size={44} />
                      <span className="text-xs font-bold uppercase tracking-wide" style={{ color: meta.color === "#B5462F" ? "#9a3a26" : meta.color }}>
                        {meta.label}
                      </span>
                    </div>
                    <h3 className="mt-2 text-lg leading-tight">{i.title}</h3>
                    <p className="line-clamp-1 text-sm text-muted">{i.subtitle}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Chip tone="sand">{formatKm(i.d)}</Chip>
                      {st && <OpenChip open={st.open} />}
                    </div>
                  </Link>
                  <a
                    href={directionsUrl(i.lat, i.lng)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-11 items-center justify-center gap-1.5 border-t border-sand text-sm font-semibold text-indigo hover:bg-ivory"
                  >
                    <Navigation className="h-4 w-4" aria-hidden="true" /> Directions
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** Mode-dependent block: here-now shows Near you + Price check; planning shows Your trip + Before you go. */
export function ModeSections({ nearItems }: { nearItems: NearItem[] }) {
  const hydrated = useStore((s) => s.hydrated);
  const mode = useStore((s) => s.mode);
  if (!hydrated)
    return (
      <div className="container-k mt-10 grid gap-4">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-44" />
      </div>
    );
  return mode === "here" ? (
    <>
      <NearYou items={nearItems} />
      <PriceCheckQuick />
    </>
  ) : (
    <>
      <YourTrip />
      <BeforeYouGo />
    </>
  );
}

export function PriceCheckQuick() {
  return (
    <div className="container-k mt-6">
      <Link
        href="/price-check"
        className="group relative flex items-center gap-4 overflow-hidden rounded-3xl bg-rani p-5 text-white shadow-[var(--shadow-lift)]"
      >
        <BandhaniDots color="#F2C14E" opacity={0.25} />
        <StampIcon icon={Gauge} color="#141B3D" size={56} />
        <span className="relative flex-1">
          <span className="block font-display text-2xl text-white">Price check</span>
          <span className="block text-[15px] text-white/90">In a shop right now? Check the quote against a fair range.</span>
        </span>
        <ArrowRight className="relative h-6 w-6 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </Link>
    </div>
  );
}

export function YourTrip() {
  const t = useT();
  const hydrated = useStore((s) => s.hydrated);
  const trip = useActiveTrip();
  const saved = useStore((s) => s.saved.length);
  const [today] = useState(() => new Date());
  if (!hydrated) return <div className="container-k mt-10"><Skeleton className="h-44" /></div>;
  const planned = trip.days.reduce((n, d) => n + d.length, 0);
  const left = trip.start ? daysUntil(trip.start, today) : null;
  return (
    <section className="container-k mt-10" aria-labelledby="trip-title">
      <div className="relative overflow-hidden rounded-3xl bg-indigo p-6 text-ivory shadow-[var(--shadow-lift)]">
        <BlockPrintPattern color="#E8A33D" opacity={0.08} />
        <div className="relative flex flex-wrap items-start gap-5">
          <div className="flex-1">
            <p className="font-hand text-lg text-haldi">{t("home.yourTrip")}</p>
            <h2 id="trip-title" className="text-3xl text-ivory">
              {left !== null && left > 0 ? `${left} days to Jaipur!` : left === 0 ? "Jaipur day! Chalo!" : trip.name}
            </h2>
            <p className="mt-1 text-ivory/80">
              {left === null ? "Add your dates in Plan for a countdown" : trip.name}
              {trip.start && ` · ${new Date(trip.start).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
              {trip.end && ` – ${new Date(trip.end).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
            </p>
            <div className="mt-4 flex gap-6">
              <p>
                <span className="block font-display text-4xl text-haldi">{saved}</span>
                <span className="text-sm text-ivory/80">in Mera thela</span>
              </p>
              <p>
                <span className="block font-display text-4xl text-haldi">{planned}</span>
                <span className="text-sm text-ivory/80">stops planned</span>
              </p>
              <p>
                <span className="block font-display text-4xl text-haldi">{trip.days.length}</span>
                <span className="text-sm text-ivory/80">days</span>
              </p>
            </div>
          </div>
          <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:flex-col">
            <ButtonLink href="/plan" variant="marigold">
              <CalendarHeart className="h-5 w-5" aria-hidden="true" /> {t("home.planDays")}
            </ButtonLink>
            <ButtonLink href="/saved" variant="light">
              <ShoppingBag className="h-5 w-5" aria-hidden="true" /> Mera thela
            </ButtonLink>
            <ButtonLink href="/plan#share" variant="light">
              <Share2 className="h-5 w-5" aria-hidden="true" /> Share with friends
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export const CHECKLIST = [
  { key: "shoes", label: "Comfortable shoes", note: "Forts are all ramps and stairs" },
  { key: "cash", label: "Cash for small shops", note: "UPI works mostly, but not always" },
  { key: "scarf", label: "Scarf for forts", note: "Sun, dust, temples" },
  { key: "water", label: "Water", note: "Refill, don't rebuy" },
  { key: "phrases", label: "Phrases saved", note: "Bargain kindly" },
  { key: "offline", label: "Offline download done", note: "Markets have weak signal" },
];

export function BeforeYouGo() {
  const t = useT();
  const checklist = useStore((s) => (s.hydrated ? s.checklist : {}));
  const done = CHECKLIST.filter((c) => checklist[c.key]).length;
  return (
    <section className="container-k mt-8" aria-labelledby="byg-title">
      <SectionHeader id="byg-title" title={t("home.beforeGo")} action={{ href: "/plan#checklist", label: "Full checklist" }} />
      <div className="card p-4">
        <p className="mb-3 text-sm text-muted">
          {done} of {CHECKLIST.length} done
        </p>
        <ul className="grid gap-2 sm:grid-cols-3">
          {CHECKLIST.map((c) => (
            <li key={c.key} className="flex items-center gap-2">
              <span className={`flex h-6 w-6 items-center justify-center rounded-full ${checklist[c.key] ? "bg-leaf" : "border-2 border-sand"}`} aria-hidden="true">
                {checklist[c.key] && <Buti size={16} color="#F2C14E" center="#fff" />}
              </span>
              <span className={checklist[c.key] ? "text-muted line-through" : ""}>{c.label}</span>
              <span className="sr-only">{checklist[c.key] ? "(done)" : "(not done)"}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

