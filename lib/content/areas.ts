import areasJson from "@/data/areas.json";
import type { Area, AreaSlug } from "../types";

export const areas = areasJson as Area[];
export const getArea = (slug: AreaSlug | string) => areas.find((a) => a.slug === slug);
