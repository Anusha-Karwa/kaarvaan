import { getArea, getCraft, getDish, getPlace, getShop, getWorkshop, itemInfo, type ItemInfo } from "@/lib/data";
import type { CheckIn, ItemKind, ItemRef, PhotoMeta } from "@/lib/types";
import { hash01, refKey, stampDate } from "@/components/plan/planUtils";

export const STAMP_COLORS: Record<ItemKind, string> = {
  shop: "#C2185B", // rani
  workshop: "#2E7D5B", // leaf
  place: "#1F2A5C", // indigo
  dish: "#B5462F", // terracotta
};

export interface PassportStamp {
  key: string;
  ref: ItemRef;
  info: ItemInfo;
  at: number;
  /** Circular text, e.g. "BANDHANI · JOHARI BAZAAR · 14 NOV" */
  text: string;
  /** Short centre word */
  centre: string;
  color: string;
  rotate: number;
  source: "visit" | "photo";
}

function words(ref: ItemRef): { first: string; second: string; centre: string } {
  switch (ref.kind) {
    case "shop": {
      const s = getShop(ref.slug);
      return { first: getCraft(s?.craft ?? "")?.name ?? "Craft", second: s?.market ?? "Jaipur", centre: "Shop" };
    }
    case "workshop": {
      const w = getWorkshop(ref.slug);
      return { first: `${getCraft(w?.craft ?? "")?.name ?? "Craft"} workshop`, second: getArea(w?.area ?? "")?.name ?? "Jaipur", centre: "Made it" };
    }
    case "place": {
      const p = getPlace(ref.slug);
      return { first: p?.name ?? "Place", second: getArea(p?.area ?? "")?.name ?? "Jaipur", centre: "Visited" };
    }
    case "dish": {
      const d = getDish(ref.slug);
      return { first: d?.name ?? "Dish", second: getArea(d?.spots[0]?.area ?? "")?.name ?? "Jaipur", centre: "Tasted" };
    }
  }
}

/** One stamp per item experienced on this trip: "I visited" check-ins plus tagged photos. */
export function tripStamps(tripId: string, checkIns: CheckIn[], photos: PhotoMeta[]): PassportStamp[] {
  const seen = new Map<string, { ref: ItemRef; at: number; source: "visit" | "photo" }>();
  checkIns
    .filter((c) => c.tripId === tripId)
    .forEach((c) => seen.set(refKey(c), { ref: { kind: c.kind, slug: c.slug }, at: c.at, source: "visit" }));
  photos
    .filter((p) => p.tripId === tripId && p.tag)
    .forEach((p) => {
      const k = refKey(p.tag!);
      if (!seen.has(k)) seen.set(k, { ref: p.tag!, at: p.addedAt, source: "photo" });
    });
  return [...seen.entries()]
    .map(([key, v]) => {
      const info = itemInfo(v.ref);
      if (!info) return null;
      const w = words(v.ref);
      return {
        key,
        ref: v.ref,
        info,
        at: v.at,
        text: `${w.first} · ${w.second} · ${stampDate(v.at)}`.toUpperCase(),
        centre: w.centre,
        color: STAMP_COLORS[v.ref.kind],
        rotate: Math.round((hash01(key) * 2 - 1) * 14),
        source: v.source,
      } satisfies PassportStamp;
    })
    .filter((x): x is PassportStamp => !!x)
    .sort((a, b) => a.at - b.at);
}
