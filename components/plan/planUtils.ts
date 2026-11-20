import { Hammer, Landmark, ShoppingBag, UtensilsCrossed, type LucideIcon } from "lucide-react";
import { areas, dishes, getArea, getCraft, itemInfo, places, shops, workshops, type ItemInfo } from "@/lib/data";
import { haversine } from "@/lib/geo";
import { directionsUrl } from "@/lib/maps";
import { encodePlan, smartOrder, timeWindows, uid, type TimeWindow } from "@/lib/plan";
import { formatClock } from "@/lib/geo";
import { SITE_URL } from "@/lib/share";
import type { AreaSlug, CraftSlug, ItemKind, ItemRef, PlanStop, Trip } from "@/lib/types";

export const KIND_ICON: Record<ItemKind, LucideIcon> = {
  shop: ShoppingBag,
  workshop: Hammer,
  place: Landmark,
  dish: UtensilsCrossed,
};

export const KIND_ORDER: ItemKind[] = ["place", "workshop", "shop", "dish"];

export const sameRef = (a: ItemRef, b: ItemRef) => a.kind === b.kind && a.slug === b.slug;
export const refKey = (r: ItemRef) => `${r.kind}:${r.slug}`;

/** Dish slugs that are best eaten at breakfast, for smartOrder. */
export const BREAKFAST = new Set(dishes.filter((d) => d.bestTime === "breakfast").map((d) => d.slug));

export interface StopWithInfo<T extends ItemRef = PlanStop> {
  stop: T;
  info: ItemInfo;
}

/** Joins stops with content; silently drops anything whose content no longer exists. */
export function withInfo<T extends ItemRef>(stops: T[]): StopWithInfo<T>[] {
  return stops
    .map((stop) => ({ stop, info: itemInfo(stop) }))
    .filter((x): x is StopWithInfo<T> => !!x.info);
}

export function orderStops<T extends ItemRef>(stops: T[]): T[] {
  const joined = withInfo(stops);
  const missing = stops.filter((s) => !joined.some((j) => j.stop === s));
  const ordered = smartOrder(
    joined.map((j) => ({ ...j.info, kind: j.stop.kind, slug: j.stop.slug, __stop: j.stop })),
    BREAKFAST,
  ).map((x) => x.__stop);
  return [...ordered, ...missing];
}

export function windowsFor(infos: ItemInfo[], weekday = 1): TimeWindow[] {
  return timeWindows(infos, undefined, weekday);
}

/** Calendar date of day `i` of a trip, if the trip has a start date. */
export function dayDate(trip: Pick<Trip, "start">, i: number): Date | null {
  if (!trip.start) return null;
  const d = new Date(trip.start + "T00:00:00");
  if (Number.isNaN(d.getTime())) return null;
  d.setDate(d.getDate() + i);
  return d;
}

export function shortDate(d: Date): string {
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

export function stampDate(at: number | Date): string {
  return new Date(at).toLocaleDateString("en-GB", { day: "numeric", month: "short" }).toUpperCase();
}

export function tripDatesLabel(trip: Pick<Trip, "start" | "end">): string | null {
  if (!trip.start) return null;
  const s = new Date(trip.start + "T00:00:00");
  const e = trip.end ? new Date(trip.end + "T00:00:00") : null;
  const fmt = (d: Date, year = false) =>
    d.toLocaleDateString("en-GB", { day: "numeric", month: "short", ...(year ? { year: "numeric" } : {}) });
  if (!e || e.getTime() === s.getTime()) return fmt(s, true);
  return `${fmt(s)} – ${fmt(e, true)}`;
}

/** WhatsApp-ready text for one day. */
export function shareDayText(trip: Trip, dayIdx: number): string {
  const stops = withInfo(trip.days[dayIdx] ?? []);
  const date = dayDate(trip, dayIdx);
  const wins = windowsFor(
    stops.map((s) => s.info),
    date?.getDay() ?? 1,
  );
  const lines = [`*${trip.name}* · Day ${dayIdx + 1}${date ? ` (${shortDate(date)})` : ""}`, ""];
  stops.forEach(({ info, stop }, i) => {
    const w = wins[i];
    lines.push(
      `${i + 1}. ${info.title}${stop.status === "requested" ? " (requested)" : ""}`,
      `   ${formatClock(w.start)} – ${formatClock(w.end)}${w.openAtStart === false ? " · check it's open" : ""}`,
      `   ${directionsUrl(info.lat, info.lng)}`,
    );
  });
  const note = trip.journal?.[dayIdx];
  if (note?.trim()) lines.push("", `Note: ${note.trim()}`);
  lines.push("", "Planned with Kaarvaan");
  return lines.join("\n");
}

export function planLink(trip: Trip): string {
  const code = encodePlan({
    name: trip.name,
    start: trip.start,
    days: trip.days.map((d) => d.map(({ kind, slug }) => ({ kind, slug }))),
  });
  return `${SITE_URL}/plan/view?p=${code}`;
}

/** Stable pseudo-random number in [0,1) from a string (for rotations etc. without Math.random in render). */
export function hash01(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

// ---------- "Plan my day for me" ----------

export const INTERESTS = [
  "Textiles",
  "Jewellery",
  "Pottery",
  "Food",
  "Forts and palaces",
  "Workshops",
  "Photography",
  "Shopping for gifts",
] as const;
export type Interest = (typeof INTERESTS)[number];

export interface PlanRequest {
  area: AreaSlug;
  interests: Interest[];
  length: "half" | "full";
}

function craftsFor(interests: Interest[]): CraftSlug[] {
  const out = new Set<CraftSlug>();
  if (interests.includes("Textiles")) ["bandhani", "block-print"].forEach((c) => out.add(c as CraftSlug));
  if (interests.includes("Jewellery")) out.add("kundan-meenakari");
  if (interests.includes("Pottery")) out.add("blue-pottery");
  if (interests.includes("Shopping for gifts")) ["mojari", "block-print", "blue-pottery"].forEach((c) => out.add(c as CraftSlug));
  return [...out];
}

/** Simple, explainable rules. No AI: just the content we have, sorted by distance from the chosen area. */
export function generateDay(req: PlanRequest): PlanStop[] {
  const centre = getArea(req.area) ?? areas[0];
  const dist = (x: { lat: number; lng: number }) => haversine(centre.lat, centre.lng, x.lat, x.lng);
  const has = (i: Interest) => req.interests.includes(i);
  const full = req.length === "full";
  const out: ItemRef[] = [];
  const add = (r: ItemRef) => {
    if (!out.some((x) => sameRef(x, r))) out.push(r);
  };

  // Places
  const forty = (p: (typeof places)[number]) => p.illustration === "fort" || p.illustration === "palace";
  const photoGood = (p: (typeof places)[number]) => ["hawa-mahal", "stepwell", "observatory", "fort"].includes(p.illustration);
  const placeScore = (p: (typeof places)[number]) =>
    dist(p) - (has("Forts and palaces") && forty(p) ? 3 : 0) - (has("Photography") && photoGood(p) ? 2 : 0) + (p.dayTrip ? 50 : 0);
  // A day trip (e.g. Abhaneri) fills the morning on its own.
  const dayTrip = places.find((p) => p.dayTrip && p.area === req.area);
  if (dayTrip) add({ kind: "place", slug: dayTrip.slug });
  // Amer in the morning if forts are on the list.
  else if (full && has("Forts and palaces") && req.area !== "amer") add({ kind: "place", slug: "amber-fort" });
  const placeCount = dayTrip ? 0 : full ? (out.length ? 1 : 2) : has("Workshops") ? 0 : 1;
  places
    .filter((p) => !p.dayTrip && !out.some((x) => x.slug === p.slug))
    .sort((a, b) => placeScore(a) - placeScore(b))
    .slice(0, placeCount)
    .forEach((p) => add({ kind: "place", slug: p.slug }));

  const crafts = craftsFor(req.interests);

  // Workshop
  if (has("Workshops")) {
    const w = workshops
      .slice()
      .sort((a, b) => dist(a) - (crafts.includes(a.craft) ? 5 : 0) - (dist(b) - (crafts.includes(b.craft) ? 5 : 0)))[0];
    if (w) add({ kind: "workshop", slug: w.slug });
  }

  // Shops
  const shopCount = full ? 2 : 1;
  const pool = shops.filter((s) => !crafts.length || crafts.includes(s.craft));
  const usedCrafts = new Set<string>();
  pool
    .slice()
    .sort((a, b) => dist(a) + a.recommendedRank * 0.4 - (dist(b) + b.recommendedRank * 0.4))
    .forEach((s) => {
      if (out.filter((x) => x.kind === "shop").length >= shopCount) return;
      if (usedCrafts.has(s.craft) && pool.some((p) => !usedCrafts.has(p.craft))) return;
      usedCrafts.add(s.craft);
      add({ kind: "shop", slug: s.slug });
    });
  // Top up if craft spread was too picky
  pool.forEach((s) => {
    if (out.filter((x) => x.kind === "shop").length < shopCount) add({ kind: "shop", slug: s.slug });
  });

  // Food by time of day
  const pick = (times: string[]) => dishes.find((d) => times.includes(d.bestTime) && !out.some((x) => x.slug === d.slug));
  const food = full
    ? [pick(["lunch"]), has("Food") ? pick(["evening"]) : null]
    : [has("Food") ? pick(["breakfast", "evening"]) : pick(["anytime", "breakfast"])];
  food.forEach((d) => d && add({ kind: "dish", slug: d.slug }));

  const trimmed = full ? out : out.slice(0, 3);
  return orderStops(trimmed.map((r) => ({ ...r, id: uid("stop") })));
}

export function describeCraft(slug: string): string {
  return getCraft(slug)?.name ?? slug;
}
