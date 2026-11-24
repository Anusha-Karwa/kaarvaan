import craftsJson from "@/data/crafts.json";
import type { Craft } from "../types";

export const crafts = craftsJson as unknown as Craft[];
export const getCraft = (slug: string) => crafts.find((c) => c.slug === slug);
