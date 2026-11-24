import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { areas } from "@/lib/content/areas";
import { crafts } from "@/lib/content/crafts";
import { shops } from "@/lib/content/shops";
import { dishes, places, workshops } from "@/lib/content/experiences";
import { Illustration, type IllustrationName } from "../illustrations";
import { ArchTop } from "../motifs/Jharokha";
import { Buti } from "../motifs/Buti";
import { SectionHeader } from "../ui/SectionHeader";
import { FlipCard } from "../ui/FlipCard";
import { DishCard, PlaceCard, WorkshopCard } from "../Cards";
import { T } from "./HomeClientParts";

// Server-rendered home sections: illustrations and copy ship as HTML, not JavaScript.

const OPTIONS = [
  { href: "/shop/rajasthan", title: "opt.shopping", desc: "opt.shoppingDesc", color: "#C2185B", tint: "#FBE3EC", ill: "bandhani" },
  { href: "/experiences", title: "opt.experiences", desc: "opt.experiencesDesc", color: "#2E7D5B", tint: "#E3F1EA", ill: "hawa-mahal" },
  { href: "/memories", title: "opt.memories", desc: "opt.memoriesDesc", color: "#E8A33D", tint: "#FBF0D8", ill: "lassi" },
] as const;

export function OptionCards() {
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
                <Illustration priority name={o.ill as IllustrationName} className="h-20 w-20 shrink-0 sm:h-28 sm:w-auto sm:self-center" />
                <div className="min-w-0 flex-1">
                  <h2 className="flex items-center gap-2 text-[26px]" style={{ color: o.color === "#E8A33D" ? "#8a5a12" : o.color }}>
                    <T k={o.title} />
                    <span className="transition-transform duration-300 group-hover:rotate-45" aria-hidden="true">
                      <Buti size={18} color={o.color} center="#F2C14E" />
                    </span>
                  </h2>
                  <p className="text-[15px] leading-snug text-ink/85"><T k={o.desc} /></p>
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


export function DontGetFooled() {
  return (
    <section className="mt-12" aria-labelledby="fool-title">
      <div className="container-k">
        <SectionHeader id="fool-title" title={<T k="home.dontFooled" />} color="#C2185B" sub="Real vs copy at a glance. Tap a card to flip it." />
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
                    <p className="mt-auto font-hand text-base text-terracotta">← flip back</p>
                  </div>
                }
              />
              <Link href={`/shop/rajasthan/${c.slug}#spot`} className="link-wavy mt-2 inline-flex min-h-11 items-center text-sm">
                All 5 {c.name} checks
              </Link>
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
  return (
    <section className="container-k mt-12" aria-labelledby="story-title">
      <SectionHeader id="story-title" title={<T k="home.story" />} sub="Ananya, 28, from Bengaluru. Her first trip to Jaipur." />
      <ol className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {PANELS.map((p, i) => (
          <li
            key={p.ill}
            style={{ transform: `rotate(${i % 2 ? 1 : -1}deg)` }}
            className="rounded-xl border-2 border-indigo bg-white p-2 shadow-[4px_4px_0_#1F2A5C]"
          >
            <Illustration name={p.ill} className="aspect-[5/4] w-full rounded-md bg-ivory" title={p.cap} />
            <p className="mt-1.5 font-hand text-[15px] leading-snug text-ink">
              <span className="font-bold text-rani">{i + 1}.</span> {p.cap}
            </p>
          </li>
        ))}
        <li
          className="col-span-2 rounded-xl border-2 border-leaf bg-[#EFF8F2] p-2 shadow-[4px_4px_0_#2E7D5B] lg:col-span-1"
        >
          <Illustration name="comic-happy" className="aspect-[5/4] w-full rounded-md" title="Ananya with a Bandhani maker, both smiling" />
          <p className="mt-1.5 text-[15px] font-semibold leading-snug text-leaf-dark">
            With Kaarvaan: the real Bandhani, from the maker, at a fair price.
          </p>
        </li>
      </ol>
    </section>
  );
}

export function Featured() {
  const items = [
    ...workshops.slice(0, 2).map((w) => <WorkshopCard key={w.slug} w={w} className="h-full" />),
    ...places.slice(0, 3).map((p) => <PlaceCard key={p.slug} p={p} className="h-full" />),
    ...dishes.slice(0, 2).map((d) => <DishCard key={d.slug} d={d} className="h-full" />),
  ];
  return (
    <section className="mt-12" aria-labelledby="feat-title">
      <div className="container-k">
        <SectionHeader id="feat-title" title={<T k="home.featured" />} color="#2E7D5B" action={{ href: "/experiences", label: <T k="act.seeAll" /> }} />
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
  return (
    <section className="container-k mt-12" aria-labelledby="facts-title">
      <SectionHeader id="facts-title" title={<T k="home.oneLine" />} />
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
