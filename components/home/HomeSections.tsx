"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ArrowRight, CalendarHeart, Gauge, MapPin, Navigation, Share2, ShoppingBag } from "lucide-react";
import { useActiveTrip, useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { useMotionOK } from "@/lib/motion";
import { areas, crafts, dishes, getArea, KIND_META, places, shops, workshops, allItems } from "@/lib/data";
import { formatKm, haversine, openStatus } from "@/lib/geo";
import { daysUntil } from "@/lib/plan";
import { directionsUrl } from "@/lib/maps";
import { Illustration, type IllustrationName } from "../illustrations";
import { ArchTop } from "../motifs/Jharokha";
import { Buti } from "../motifs/Buti";
import { BlockPrintPattern } from "../motifs/BlockPrintPattern";
import { BandhaniDots } from "../motifs/BandhaniDots";
import { StampIcon } from "../motifs/StampIcon";
import { SectionHeader } from "../ui/SectionHeader";
import { ButtonLink } from "../ui/Button";
import { Chip, OpenChip } from "../ui/Chip";
import { FlipCard } from "../ui/FlipCard";
import { Skeleton } from "../ui/Skeleton";
import { CRAFT_TINT, DishCard, PlaceCard, useNow, WorkshopCard } from "../Cards";
import { AreaPickerSheet, LocationButton } from "../LocationButton";

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

const OPTIONS = [
  { href: "/shop/rajasthan", title: "opt.shopping", desc: "opt.shoppingDesc", color: "#C2185B", tint: "#FBE3EC", ill: "bandhani" },
  { href: "/experiences", title: "opt.experiences", desc: "opt.experiencesDesc", color: "#2E7D5B", tint: "#E3F1EA", ill: "hawa-mahal" },
  { href: "/memories", title: "opt.memories", desc: "opt.memoriesDesc", color: "#E8A33D", tint: "#FBF0D8", ill: "lassi" },
] as const;

export function OptionCards() {
  const t = useT();
  return (
    <section className="container-k mt-8" aria-label="Choose where to start">
      <div className="grid gap-5 sm:grid-cols-3">
        {OPTIONS.map((o, i) => (
          <div key={o.href} className="animate-rise" style={{ animationDelay: `${0.45 + i * 0.12}s` }}>
            <Link
              href={o.href}
              className="group relative flex h-full flex-col drop-shadow-[0_4px_10px_rgba(31,42,92,0.08)] transition-transform duration-200 hover:-translate-y-1 active:-translate-y-1"
            >
              <ArchTop height={44} fill={o.tint} className="text-sand transition-colors group-hover:text-marigold" />
              <div className="relative -mt-px flex flex-1 items-center gap-3 overflow-hidden rounded-b-2xl border border-t-0 border-sand p-4 pt-1 transition-colors group-hover:border-marigold sm:flex-col sm:items-start" style={{ background: o.tint }}>
                <span className="absolute inset-x-0 bottom-0 h-1.5" style={{ background: o.color }} aria-hidden="true" />
                <Illustration name={o.ill as IllustrationName} className="h-20 w-20 shrink-0 sm:h-28 sm:w-auto sm:self-center" />
                <div className="min-w-0 flex-1">
                  <h2 className="flex items-center gap-2 text-[26px]" style={{ color: o.color === "#E8A33D" ? "#8a5a12" : o.color }}>
                    {t(o.title)}
                    <span className="transition-transform duration-300 group-hover:rotate-45" aria-hidden="true">
                      <Buti size={18} color={o.color} center="#F2C14E" />
                    </span>
                  </h2>
                  <p className="text-[15px] leading-snug text-ink/85">{t(o.desc)}</p>
                </div>
                <ArrowRight className="h-6 w-6 shrink-0 transition-transform group-hover:translate-x-1 sm:absolute sm:bottom-5 sm:right-4" style={{ color: o.color === "#E8A33D" ? "#8a5a12" : o.color }} aria-hidden="true" />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export function NearYou() {
  const t = useT();
  const coords = useStore((s) => s.coords);
  const area = useStore((s) => s.area);
  const now = useNow();
  const origin = coords ?? (area ? getArea(area) : getArea("old-city"))!;
  const list = useMemo(() => {
    return allItems()
      .filter((i) => i.kind !== "workshop")
      .map((i) => ({ ...i, d: haversine(origin.lat, origin.lng, i.lat, i.lng) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 10);
  }, [origin.lat, origin.lng]);
  return (
    <section className="mt-10" aria-labelledby="near-title">
      <div className="container-k">
        <SectionHeader
          id="near-title"
          title={t("home.nearYou")}
          color="#2E7D5B"
          sub={coords ? "Sorted by distance from you (location is never stored)." : `Sorted from ${getArea(area ?? "old-city")?.name}. Tap "Use my location" for real distances.`}
        />
      </div>
      <div className="container-k">
        <ul className="scroll-x -mx-1 px-1">
          {list.map((i) => {
            const st = now && i.hours ? openStatus(i.hours, now) : null;
            return (
              <li key={`${i.kind}-${i.slug}`} className="w-60">
                <div className="card flex h-full flex-col overflow-hidden">
                  <Link href={i.href} className="flex flex-1 flex-col">
                    <div className="relative flex h-24 items-end justify-center" style={{ background: i.kind === "shop" ? CRAFT_TINT[i.illustration] : "#EAF0F8" }}>
                      <Illustration name={i.illustration as IllustrationName} className="h-20 w-auto" />
                      <span className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-xs font-bold text-white" style={{ background: KIND_META[i.kind].color }}>
                        {KIND_META[i.kind].label}
                      </span>
                    </div>
                    <div className="flex-1 p-3">
                      <h3 className="text-lg leading-tight">{i.title}</h3>
                      <p className="line-clamp-1 text-sm text-muted">{i.subtitle}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <Chip tone="sand">{formatKm(i.d)}</Chip>
                        {st && <OpenChip open={st.open} />}
                      </div>
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

export function DontGetFooled() {
  const t = useT();
  return (
    <section className="mt-12" aria-labelledby="fool-title">
      <div className="container-k">
        <SectionHeader id="fool-title" title={t("home.dontFooled")} color="#C2185B" sub="Real vs copy at a glance. Tap a card to flip it." />
        <ul className="scroll-x -mx-1 px-1 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-5">
          {crafts.map((c) => (
            <li key={c.slug} className="w-64 sm:w-auto">
              <FlipCard
                label={`${c.name}: real vs copy`}
                className="h-72 w-full"
                front={
                  <div className="flex h-full flex-col rounded-2xl border-2 border-leaf bg-white p-4 shadow-[var(--shadow-card)]">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-leaf px-2.5 py-0.5 text-sm font-bold text-white">✓ Real</span>
                      <Illustration name={c.slug} className="h-14 w-auto" />
                    </div>
                    <h3 className="mt-2 text-xl">{c.name}</h3>
                    <p className="mt-1 text-[15px] leading-snug">{c.checks[0].real}</p>
                    <p className="mt-auto font-hand text-base text-leaf-dark">pakka genuine →</p>
                  </div>
                }
                back={
                  <div className="flex h-full flex-col rounded-2xl border-2 border-terracotta bg-[#FFF4EF] p-4 shadow-[var(--shadow-card)]">
                    <span className="self-start rounded-full bg-terracotta px-2.5 py-0.5 text-sm font-bold text-white">✗ Copy</span>
                    <h3 className="mt-2 text-xl">{c.name}</h3>
                    <p className="mt-1 text-[15px] leading-snug">{c.checks[0].copy}</p>
                    <Link href={`/shop/rajasthan/${c.slug}#spot`} onClick={(e) => e.stopPropagation()} className="link-wavy mt-auto text-sm">
                      All 5 checks
                    </Link>
                  </div>
                }
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const PANELS = [
  { ill: "comic-planning", cap: "10+ hours of reels, vlogs and group chats." },
  { ill: "comic-driver", cap: "“Bhaiya, where do I buy real Bandhani?”" },
  { ill: "comic-shop", cap: "He takes her to his favourite shop. He gets ~20%." },
  { ill: "comic-overpay", cap: "She pays 4× the price. For a printed copy." },
] as const;

export function AnanyaStory() {
  const t = useT();
  const ok = useMotionOK();
  return (
    <section className="container-k mt-12" aria-labelledby="story-title">
      <SectionHeader id="story-title" title={t("home.story")} sub="Ananya, 28, from Bengaluru. Her first trip to Jaipur." />
      <ol className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {PANELS.map((p, i) => (
          <motion.li
            key={p.ill}
            initial={ok ? { opacity: 0, rotate: i % 2 ? 2 : -2, y: 12 } : false}
            whileInView={{ opacity: 1, rotate: i % 2 ? 1 : -1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border-2 border-indigo bg-white p-2 shadow-[4px_4px_0_#1F2A5C]"
          >
            <Illustration name={p.ill} className="aspect-[5/4] w-full rounded-md bg-ivory" title={p.cap} />
            <p className="mt-1.5 font-hand text-[15px] leading-snug text-ink">
              <span className="font-bold text-rani">{i + 1}.</span> {p.cap}
            </p>
          </motion.li>
        ))}
        <motion.li
          initial={ok ? { opacity: 0, scale: 0.94 } : false}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="col-span-2 rounded-xl border-2 border-leaf bg-[#EFF8F2] p-2 shadow-[4px_4px_0_#2E7D5B] lg:col-span-1"
        >
          <Illustration name="comic-happy" className="aspect-[5/4] w-full rounded-md" title="Ananya with a Bandhani maker, both smiling" />
          <p className="mt-1.5 text-[15px] font-semibold leading-snug text-leaf-dark">
            With Kaarvaan: the real Bandhani, from the maker, at a fair price.
          </p>
        </motion.li>
      </ol>
    </section>
  );
}

export function Featured() {
  const t = useT();
  const items = [
    ...workshops.slice(0, 2).map((w) => <WorkshopCard key={w.slug} w={w} className="h-full" />),
    ...places.slice(0, 3).map((p) => <PlaceCard key={p.slug} p={p} className="h-full" />),
    ...dishes.slice(0, 2).map((d) => <DishCard key={d.slug} d={d} className="h-full" />),
  ];
  return (
    <section className="mt-12" aria-labelledby="feat-title">
      <div className="container-k">
        <SectionHeader id="feat-title" title={t("home.featured")} color="#2E7D5B" action={{ href: "/experiences", label: t("act.seeAll") }} />
        <ul className="scroll-x -mx-1 px-1 pt-2">
          {items.map((el, i) => (
            <li key={i} className="w-72">
              {el}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const FACTS = [
  { big: "1727", text: "Founded by Sawai Jai Singh II as a planned city, laid out on a grid.", note: "one of India's first planned cities" },
  { big: "1876", text: "Painted pink to welcome the Prince of Wales. It stayed pink.", note: "Pink City since 1876" },
  { big: "953", text: "Small jharokha windows on the Hawa Mahal façade, made for catching the breeze.", note: "count them, we dare you" },
  { big: "5", text: "Crafts you'll meet here: Bandhani, block print, blue pottery, Kundan-Meenakari, mojari.", note: "and the hands behind them" },
];

export function OneLineFacts() {
  const t = useT();
  return (
    <section className="container-k mt-12" aria-labelledby="facts-title">
      <SectionHeader id="facts-title" title={t("home.oneLine")} />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FACTS.map((f) => (
          <li key={f.big} className="card relative overflow-hidden p-5">
            <span className="font-display text-5xl text-rani">{f.big}</span>
            <p className="mt-1">{f.text}</p>
            <p className="mt-2 -rotate-2 font-hand text-lg text-marigold-ink">↳ {f.note}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-muted">
        Areas we cover: {areas.map((a) => a.name).join(" · ")}. Shops listed: {shops.length} (samples during preview).
      </p>
    </section>
  );
}
