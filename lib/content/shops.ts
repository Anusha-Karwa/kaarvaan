import shopsJson from "@/data/shops.json";
import type { CraftSlug, Shop } from "../types";

export const shops = shopsJson as Shop[];
export const getShop = (slug: string) => shops.find((s) => s.slug === slug);
export const shopsForCraft = (craft: CraftSlug | string) =>
  shops.filter((s) => s.craft === craft).sort((a, b) => a.recommendedRank - b.recommendedRank);
