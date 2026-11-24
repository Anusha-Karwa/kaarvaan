import { ArrowRight, Clock, Users } from "lucide-react";
import type { Craft, Dish, Place, Shop, Workshop } from "@/lib/types";
import { getArea } from "@/lib/content/areas";
import { shopsForCraft } from "@/lib/content/shops";
import { formatINR } from "@/lib/price";
import { Illustration, type IllustrationName } from "./illustrations";
import { ArchCard } from "./ui/Card";
import { Chillies, Chip, VegMark } from "./ui/Chip";
import { SampleRibbon } from "./ui/SampleRibbon";
import { BandhaniDots } from "./motifs/BandhaniDots";
import { BlockPrintPattern } from "./motifs/BlockPrintPattern";
import { ShopCardClient } from "./ShopCardClient";

export const CRAFT_TINT: Record<string, string> = {
  bandhani: "#FBE3EC",
  "block-print": "#E6E9F5",
  "blue-pottery": "#E3ECF8",
  "kundan-meenakari": "#FBF0D8",
  mojari: "#F6E4DA",
};

/** Patterned tile used in place of shop photos. */
export function CraftTile({ craft, className = "", children, priority = false }: { craft: string; className?: string; children?: React.ReactNode; priority?: boolean }) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: CRAFT_TINT[craft] ?? "#FBF6EC" }}>
      {craft === "bandhani" ? <BandhaniDots color="#C2185B" opacity={0.35} /> : <BlockPrintPattern color={craft === "blue-pottery" ? "#2F5DA8" : "#1F2A5C"} opacity={0.1} />}
      <Illustration priority={priority} name={craft as IllustrationName} className="relative mx-auto h-full w-auto max-w-[80%] p-2" />
      {children}
    </div>
  );
}

export function CraftCard({ craft }: { craft: Craft }) {
  const count = shopsForCraft(craft.slug).length;
  return (
    <ArchCard href={`/shop/rajasthan/${craft.slug}`} tint={CRAFT_TINT[craft.slug]} accent="#C2185B" className="h-full">
      <div className="flex h-32 items-end justify-center px-6">
        <Illustration name={craft.slug} className="h-28 w-auto" />
      </div>
      <div className="flex flex-1 flex-col p-4 pt-3">
        <h3 className="text-2xl">
          {craft.name}{" "}
          <span lang="hi" className="deva text-base text-muted">
            {craft.nameHi}
          </span>
        </h3>
        <p className="mt-1 flex-1 text-[15px] text-ink/85">{craft.hook}</p>
        <div className="mt-3 flex items-center justify-between">
          <Chip tone="rani">{count} genuine shops</Chip>
          <ArrowRight className="h-5 w-5 text-rani transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </div>
      </div>
    </ArchCard>
  );
}

/** Server wrapper: renders the illustration tile here so its SVG never ships as JavaScript. */
export function ShopCard({ shop }: { shop: Shop }) {
  return <ShopCardClient shop={shop} tile={<CraftTile craft={shop.craft} className="h-full min-h-32" />} />;
}

export function WorkshopCard({ w, className = "" }: { w: Workshop; className?: string }) {
  return (
    <ArchCard href={`/experiences/workshops/${w.slug}`} tint="#E3F1EA" accent="#2E7D5B" className={className}>
      <div className="flex h-28 items-end justify-center">
        <Illustration name={w.craft} className="h-24 w-auto" />
      </div>
      <div className="flex flex-1 flex-col p-4 pt-3">
        <SampleRibbon className="mb-1 self-start" />
        <h3 className="text-xl leading-tight">{w.title}</h3>
        <p className="text-sm text-muted">with {w.host}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Chip tone="leaf">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {w.durationHours} h
          </Chip>
          <Chip tone="sand">
            <Users className="h-3.5 w-3.5" aria-hidden="true" /> {w.groupSize[0]}–{w.groupSize[1]}
          </Chip>
          <Chip tone="haldi">
            {formatINR(w.priceMin)}–{formatINR(w.priceMax)}
          </Chip>
        </div>
        <p className="mt-2 flex-1 text-sm">
          <span className="font-semibold text-leaf-dark">You take home: </span>
          {w.takeHome}
        </p>
      </div>
    </ArchCard>
  );
}

export function PlaceCard({ p, className = "" }: { p: Place; className?: string }) {
  return (
    <ArchCard href={`/experiences/places/${p.slug}`} tint="#EAF0F8" accent="#2E7D5B" className={className}>
      <div className="flex h-28 items-end justify-center">
        <Illustration name={p.illustration} className="h-24 w-auto" />
      </div>
      <div className="flex flex-1 flex-col p-4 pt-3">
        <h3 className="text-xl leading-tight">
          {p.name}{" "}
          <span lang="hi" className="deva text-sm text-muted">
            {p.nameHi}
          </span>
        </h3>
        <p className="text-sm text-muted">
          {getArea(p.area)?.name}
          {p.dayTrip ? " · day trip" : ""} · {p.timeNeeded}
        </p>
        <p className="mt-1.5 flex-1 text-[15px]">{p.why}</p>
        <p className="mt-2 font-hand text-base leading-snug text-rani">✎ {p.angleTip}</p>
      </div>
    </ArchCard>
  );
}

export function DishCard({ d, className = "" }: { d: Dish; className?: string }) {
  return (
    <ArchCard href={`/experiences/food/${d.slug}`} tint="#FBEBDD" accent="#B5462F" className={className}>
      <div className="flex h-28 items-end justify-center">
        <Illustration name={d.illustration} className="h-24 w-auto" />
      </div>
      <div className="flex flex-1 flex-col p-4 pt-3">
        <h3 className="flex items-center gap-2 text-xl leading-tight">
          <VegMark veg={d.veg} /> {d.name}
        </h3>
        <p lang="hi" className="deva text-muted">
          {d.nameHi}
        </p>
        <p className="mt-1 flex-1 text-[15px]">{d.hook}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Chillies level={d.spice} />
          <Chip tone="haldi">{d.bestTimeLabel}</Chip>
        </div>
      </div>
    </ArchCard>
  );
}
