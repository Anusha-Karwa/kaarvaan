import type { AreaSlug, Hours, ItemKind, ItemRef } from "./types";
import { isOpenAt, toMinutes } from "./geo";

/** Minimal info the planner needs about a stop. */
export interface StopInfo extends ItemRef {
  area: AreaSlug;
  minutes: number;
  hours?: Hours;
}

/** Area order through the day: early Amer, then printing villages, old city bazaars, newer city. */
export const AREA_ORDER: Record<AreaSlug, number> = {
  abhaneri: 0,
  amer: 1,
  sanganer: 2,
  bagru: 2,
  "old-city": 3,
  "c-scheme": 4,
  "mi-road": 4,
};

const KIND_ORDER: Record<ItemKind, number> = { place: 0, workshop: 1, shop: 2, dish: 3 };

/**
 * "Smart order": sort stops by area so the day doesn't zig-zag.
 * Morning: Amer / day trips. Then printing villages, then old city bazaars, then the newer city.
 * Food stops drift to the end of the day (evening chaat and dinner) unless breakfast dishes are passed in `breakfast`.
 * Stable for equal keys.
 */
export function smartOrder<T extends StopInfo>(stops: T[], breakfast: Set<string> = new Set()): T[] {
  const key = (s: T) => {
    if (s.kind === "dish") return breakfast.has(s.slug) ? -1 : 1000;
    return AREA_ORDER[s.area] * 10 + KIND_ORDER[s.kind];
  };
  return stops
    .map((s, i) => ({ s, i }))
    .sort((a, b) => key(a.s) - key(b.s) || a.i - b.i)
    .map((x) => x.s);
}

export interface TimeWindow {
  start: number; // minutes after midnight
  end: number;
  openAtStart: boolean | null; // null = hours unknown
}

/** Suggested time windows for an ordered day, starting at `startAt` (default 9:00, 8:00 if Amer first). */
export function timeWindows(stops: StopInfo[], startAt?: number, weekday = 1): TimeWindow[] {
  let t = startAt ?? (stops[0]?.area === "amer" || stops[0]?.area === "abhaneri" ? 8 * 60 : 9 * 60 + 30);
  const out: TimeWindow[] = [];
  stops.forEach((s, i) => {
    if (i > 0) {
      const prev = stops[i - 1];
      t += prev.area === s.area ? 15 : 40; // walking vs auto/cab
    }
    if (s.hours) {
      // If we'd arrive before opening, wait until it opens.
      const open = toMinutes(s.hours.open);
      if (t < open && toMinutes(s.hours.close) > open) t = open;
    }
    const start = t;
    const end = t + s.minutes;
    out.push({
      start,
      end,
      openAtStart: s.hours ? isOpenAt(s.hours, weekday, start) && isOpenAt(s.hours, weekday, Math.max(start, end - 1)) : null,
    });
    t = end;
  });
  return out;
}

// ---------- Share-link encoding ----------

const KIND_CODE: Record<ItemKind, string> = { shop: "s", workshop: "w", place: "p", dish: "d" };
const CODE_KIND: Record<string, ItemKind> = { s: "shop", w: "workshop", p: "place", d: "dish" };

export interface SharedPlan {
  name: string;
  start?: string;
  days: ItemRef[][];
}

function toBase64Url(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): string {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4);
  const bin = atob(b64);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodePlan(plan: SharedPlan): string {
  const compact = {
    n: plan.name,
    s: plan.start,
    d: plan.days.map((day) => day.map((r) => `${KIND_CODE[r.kind]}:${r.slug}`)),
  };
  return toBase64Url(JSON.stringify(compact));
}

export function decodePlan(code: string): SharedPlan | null {
  try {
    const raw = JSON.parse(fromBase64Url(code)) as { n?: unknown; s?: unknown; d?: unknown };
    if (typeof raw.n !== "string" || !Array.isArray(raw.d)) return null;
    const days: ItemRef[][] = raw.d.map((day: unknown) => {
      if (!Array.isArray(day)) return [];
      return day
        .filter((x): x is string => typeof x === "string" && /^[swpd]:[a-z0-9-]+$/.test(x))
        .map((x) => ({ kind: CODE_KIND[x[0]], slug: x.slice(2) }));
    });
    return {
      name: raw.n.slice(0, 80),
      start: typeof raw.s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw.s) ? raw.s : undefined,
      days: days.slice(0, 14),
    };
  } catch {
    return null;
  }
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
}

export function daysUntil(iso: string, now: Date = new Date()): number {
  const target = new Date(iso + "T00:00:00");
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

export function tripDayCount(start?: string, end?: string): number {
  if (!start || !end) return 2;
  const n = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86_400_000) + 1;
  return Math.min(Math.max(n, 1), 10);
}
