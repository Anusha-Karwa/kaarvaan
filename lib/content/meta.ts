import type { CraftSlug, ItemKind } from "../types";

/** Tiny lookups that client components can import without pulling in the content JSON. */
export const CRAFT_NAMES: Record<CraftSlug, { name: string; nameHi: string }> = {
  bandhani: { name: "Bandhani", nameHi: "बांधनी" },
  "block-print": { name: "Hand-block print", nameHi: "हाथ ठप्पा छपाई" },
  "blue-pottery": { name: "Blue pottery", nameHi: "नीली पॉटरी" },
  "kundan-meenakari": { name: "Kundan-Meenakari", nameHi: "कुंदन-मीनाकारी" },
  mojari: { name: "Mojari", nameHi: "मोजड़ी" },
};

export const KIND_META: Record<
  ItemKind,
  { label: string; plural: string; color: string; text: string; bg: string; section: "shopping" | "experiences" }
> = {
  shop: { label: "Shop", plural: "Shops", color: "#C2185B", text: "text-rani", bg: "bg-rani", section: "shopping" },
  workshop: { label: "Workshop", plural: "Workshops", color: "#2E7D5B", text: "text-leaf", bg: "bg-leaf", section: "experiences" },
  place: { label: "Place", plural: "Places", color: "#1F2A5C", text: "text-indigo", bg: "bg-indigo", section: "experiences" },
  dish: { label: "Food", plural: "Food", color: "#B5462F", text: "text-terracotta", bg: "bg-terracotta", section: "experiences" },
};
