import type { AreaSlug, CraftSlug, Dish, Place, Shop } from "@/lib/types";
import { dishes, places, shopsForCraft } from "@/lib/data";
import { haversine } from "@/lib/geo";

/** Nearest place to a point (same area wins ties), optionally excluding one slug. */
export function nearestPlace(lat: number, lng: number, area?: AreaSlug, exclude?: string): Place | undefined {
  return places
    .filter((p) => p.slug !== exclude)
    .map((p) => ({ p, d: haversine(lat, lng, p.lat, p.lng) - (p.area === area ? 1000 : 0) }))
    .sort((a, b) => a.d - b.d)[0]?.p;
}

/** Dishes ordered by how close their nearest spot is. */
export function nearestDishes(lat: number, lng: number, exclude?: string): Dish[] {
  return dishes
    .filter((d) => d.slug !== exclude)
    .map((d) => ({ d, km: Math.min(...d.spots.map((s) => haversine(lat, lng, s.lat, s.lng))) }))
    .sort((a, b) => a.km - b.km)
    .map((x) => x.d);
}

/** Genuine shops for the given crafts, same-area first, then by recommendation rank. */
export function shopsNear(crafts: CraftSlug[], area: AreaSlug, max: number): Shop[] {
  const all = crafts.flatMap((c) => shopsForCraft(c));
  const sorted = [...all].sort(
    (a, b) => Number(b.area === area) - Number(a.area === area) || a.recommendedRank - b.recommendedRank,
  );
  // Prefer variety: one per craft first, then fill.
  const out: Shop[] = [];
  const seen = new Set<string>();
  for (const s of sorted) {
    if (seen.has(s.craft) || out.length >= max) continue;
    out.push(s);
    seen.add(s.craft);
  }
  for (const s of sorted) if (!out.includes(s) && out.length < max) out.push(s);
  return out;
}
