import { areas, getArea } from "./content/areas";
import { states } from "./content/states";
import { crafts, getCraft } from "./content/crafts";
import { getShop, shops, shopsForCraft } from "./content/shops";
import { dishes, getDish, getPlace, getWorkshop, places, workshops } from "./content/experiences";
import { getPhrase, phrases, tips } from "./content/phrases";
import { KIND_META } from "./content/meta";
import type { AreaSlug, Hours, ItemRef } from "./types";

// Full barrel: server components and pages that need everything import from here.
// Client components should import the smallest module in ./content instead.
export { areas, getArea, states, crafts, getCraft, shops, getShop, shopsForCraft, workshops, places, dishes };
export { getWorkshop, getPlace, getDish, phrases, tips, getPhrase, KIND_META };
export { CRAFT_NAMES } from "./content/meta";

/** A normalised view of any content item, used by planner, saved, search, near-me. */
export interface ItemInfo extends ItemRef {
  title: string;
  titleHi?: string;
  subtitle: string;
  href: string;
  area: AreaSlug;
  lat: number;
  lng: number;
  hours?: Hours;
  minutes: number; // time to spend
  illustration: string;
  whatsapp?: string;
  isDemo?: boolean;
}

export function itemInfo(ref: ItemRef): ItemInfo | null {
  switch (ref.kind) {
    case "shop": {
      const s = getShop(ref.slug);
      if (!s) return null;
      const c = getCraft(s.craft);
      return {
        ...ref,
        title: s.name,
        subtitle: `${c?.name ?? s.craft} · ${s.market}`,
        href: `/shop/rajasthan/${s.craft}/${s.slug}`,
        area: s.area,
        lat: s.lat,
        lng: s.lng,
        hours: s.hours,
        minutes: 45,
        illustration: s.craft,
        whatsapp: s.whatsapp,
        isDemo: true,
      };
    }
    case "workshop": {
      const w = getWorkshop(ref.slug);
      if (!w) return null;
      return {
        ...ref,
        title: w.title,
        subtitle: `Workshop · ${w.host} · ${w.durationHours} h`,
        href: `/experiences/workshops/${w.slug}`,
        area: w.area,
        lat: w.lat,
        lng: w.lng,
        hours: w.hours,
        minutes: Math.round(w.durationHours * 60),
        illustration: w.craft,
        isDemo: true,
      };
    }
    case "place": {
      const p = getPlace(ref.slug);
      if (!p) return null;
      return {
        ...ref,
        title: p.name,
        titleHi: p.nameHi,
        subtitle: `Place · ${getArea(p.area)?.name ?? p.area}`,
        href: `/experiences/places/${p.slug}`,
        area: p.area,
        lat: p.lat,
        lng: p.lng,
        hours: p.hours,
        minutes: p.minutes,
        illustration: p.illustration,
      };
    }
    case "dish": {
      const d = getDish(ref.slug);
      if (!d) return null;
      const spot = d.spots[0];
      return {
        ...ref,
        title: d.name,
        titleHi: d.nameHi,
        subtitle: `Food · ${d.bestTimeLabel}`,
        href: `/experiences/food/${d.slug}`,
        area: spot?.area ?? "old-city",
        lat: spot?.lat ?? 26.9196,
        lng: spot?.lng ?? 75.8267,
        hours: spot?.hours,
        minutes: 40,
        illustration: d.illustration,
        isDemo: true,
      };
    }
  }
}

export function allItems(): ItemInfo[] {
  const refs: ItemRef[] = [
    ...shops.map((s) => ({ kind: "shop" as const, slug: s.slug })),
    ...workshops.map((w) => ({ kind: "workshop" as const, slug: w.slug })),
    ...places.map((p) => ({ kind: "place" as const, slug: p.slug })),
    ...dishes.map((d) => ({ kind: "dish" as const, slug: d.slug })),
  ];
  return refs.map(itemInfo).filter((x): x is ItemInfo => !!x);
}

// ---------- Search ----------

export interface SearchResult {
  group: "Crafts" | "Shops" | "Workshops" | "Places" | "Food" | "Phrases";
  title: string;
  titleHi?: string;
  subtitle: string;
  href: string;
  color: string;
}

function norm(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/[^\p{L}\p{N} ]/gu, " ");
}

export function search(query: string): SearchResult[] {
  const q = norm(query).trim();
  if (q.length < 2) return [];
  const terms = q.split(/\s+/);
  const hit = (...fields: (string | undefined)[]) => {
    const hay = norm(fields.filter(Boolean).join(" "));
    return terms.every((t) => hay.includes(t));
  };
  const out: SearchResult[] = [];
  for (const c of crafts)
    if (hit(c.name, c.nameHi, c.hook, c.origin, c.slug))
      out.push({ group: "Crafts", title: c.name, titleHi: c.nameHi, subtitle: c.hook, href: `/shop/rajasthan/${c.slug}`, color: "#C2185B" });
  for (const s of shops)
    if (hit(s.name, s.market, s.craft, getCraft(s.craft)?.name, s.makes.join(" "), s.makers.map((m) => m.name).join(" ")))
      out.push({ group: "Shops", title: s.name, subtitle: `${getCraft(s.craft)?.name} · ${s.market}`, href: `/shop/rajasthan/${s.craft}/${s.slug}`, color: "#C2185B" });
  for (const w of workshops)
    if (hit(w.title, w.host, w.craft, getCraft(w.craft)?.name, "workshop class", getArea(w.area)?.name, w.summary))
      out.push({ group: "Workshops", title: w.title, subtitle: `${w.host} · ${w.durationHours} h`, href: `/experiences/workshops/${w.slug}`, color: "#2E7D5B" });
  for (const p of places)
    if (hit(p.name, p.nameHi, p.why, p.illustration, getArea(p.area)?.name, p.history))
      out.push({ group: "Places", title: p.name, titleHi: p.nameHi, subtitle: p.why, href: `/experiences/places/${p.slug}`, color: "#2E7D5B" });
  for (const d of dishes)
    if (hit(d.name, d.nameHi, d.hook, d.what, d.bestTimeLabel, d.veg ? "veg vegetarian" : "non-veg meat"))
      out.push({ group: "Food", title: d.name, titleHi: d.nameHi, subtitle: d.hook, href: `/experiences/food/${d.slug}`, color: "#2E7D5B" });
  for (const p of phrases)
    if (hit(p.en, p.translit, p.hi))
      out.push({ group: "Phrases", title: p.en, titleHi: p.hi, subtitle: p.translit, href: `/phrases#${p.id}`, color: "#1F2A5C" });
  return out;
}
