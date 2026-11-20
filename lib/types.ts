// Shared content + app types for Kaarvaan.
// Content lives in /data/*.json and must match these shapes.

export type AreaSlug =
  | "old-city"
  | "amer"
  | "sanganer"
  | "bagru"
  | "c-scheme"
  | "mi-road"
  | "abhaneri";

export interface Area {
  slug: AreaSlug;
  name: string;
  detail: string; // e.g. "Johari / Bapu / Tripolia Bazaar"
  lat: number;
  lng: number;
  /** Rough order used by "Smart order": lower = earlier in the day. */
  dayOrder: number;
}

/** Opening hours. Times are 24h "HH:MM" local (IST). closedDays: 0 = Sunday … 6 = Saturday. */
export interface Hours {
  open: string;
  close: string;
  closedDays: number[];
}

export interface StateInfo {
  slug: string;
  name: string;
  nameHi: string;
  type: "state" | "ut";
  live: boolean;
}

export type CraftSlug =
  | "bandhani"
  | "block-print"
  | "blue-pottery"
  | "kundan-meenakari"
  | "mojari";

export type Budget = "under-1000" | "1000-3000" | "3000-plus";

export interface Craft {
  slug: CraftSlug;
  name: string;
  nameHi: string;
  hook: string; // one-line hook for the card
  origin: string; // where it comes from (1-2 sentences)
  story: [string, string, string]; // 3-line story
  timePerPiece: string; // "2 days to 3 weeks for one dupatta"
  process: { title: string; text: string }[]; // exactly 4 steps
  checks: { real: string; copy: string }[]; // exactly 5 real-vs-copy checks
  prices: { item: string; min: number; max: number; unit?: string }[]; // 4 rows, INR
  gifts: { name: string; budget: Budget; why: string }[]; // 3 ideas
  quiz: { q: string; options: string[]; answer: number; explain: string }[]; // 3 questions
  phrases: string[]; // ids from phrases.json used in "Bargain politely" (4)
  tip: string; // short Kalam-style tip
}

export interface Maker {
  name: string;
  role: string;
  years: number;
}

export interface Shop {
  slug: string;
  craft: CraftSlug;
  name: string;
  market: string; // "Johari Bazaar"
  area: AreaSlug;
  lat: number;
  lng: number;
  hours: Hours;
  makers: Maker[];
  languages: string[];
  address: string;
  landmark: string; // "next to the blue door after the chai stall"
  makes: string[];
  about: string;
  phone: string; // demo: "+91 90000 00001"
  whatsapp: string; // digits only, demo
  visitedOn: string; // ISO date
  recommendedRank: number; // 1 = top recommendation within its craft
  isDemo: true;
}

export interface Workshop {
  slug: string;
  craft: CraftSlug;
  title: string;
  host: string;
  hostRole: string;
  area: AreaSlug;
  lat: number;
  lng: number;
  durationHours: number;
  groupSize: [number, number];
  priceMin: number;
  priceMax: number;
  takeHome: string;
  summary: string;
  steps: { title: string; text: string }[];
  wear: string;
  safety: string;
  gettingThere: string;
  hours: Hours;
  slots: string[]; // "Morning (10 am)", "Afternoon (2 pm)"
  isDemo: true;
}

export type PlaceIllustration =
  | "fort"
  | "hawa-mahal"
  | "palace"
  | "observatory"
  | "stepwell"
  | "museum"
  | "village";

export interface Place {
  slug: string;
  name: string;
  nameHi: string;
  area: AreaSlug;
  illustration: PlaceIllustration;
  why: string; // why go (1 line)
  history: string; // short plain-English history (2-4 sentences)
  mustSee: string[];
  bestTime: string;
  timeNeeded: string;
  minutes: number; // time needed in minutes (for planner)
  crowdTip: string;
  angleTip: string; // "Instagram-free angle" tip
  lat: number;
  lng: number;
  hours: Hours;
  nearbyFood: string; // dish slug
  nearbyCrafts: CraftSlug[];
  dayTrip?: boolean;
}

export type DishIllustration =
  | "thali"
  | "kachori"
  | "mirchi-vada"
  | "ghewar"
  | "curry"
  | "lassi"
  | "chai";

export type MealTime = "breakfast" | "lunch" | "evening" | "dinner" | "anytime";

export interface FoodSpot {
  name: string;
  area: AreaSlug;
  lat: number;
  lng: number;
  hours: Hours;
  note: string;
  isDemo: true;
}

export interface Dish {
  slug: string;
  name: string;
  nameHi: string;
  illustration: DishIllustration;
  veg: boolean;
  spice: 1 | 2 | 3;
  bestTime: MealTime;
  bestTimeLabel: string; // "Breakfast, with chai"
  hook: string;
  what: string;
  howToEat: string;
  vegNote: string;
  spots: FoodSpot[];
}

export type PhraseCategory = "shopping" | "directions" | "food" | "basics";

export interface Phrase {
  id: string;
  category: PhraseCategory;
  hi: string; // Devanagari
  translit: string;
  en: string;
}

export interface Tip {
  id: string;
  category: "auto" | "cabs" | "walking" | "timing" | "wear" | "safety" | "money";
  title: string;
  body: string;
}

// ---------- App (client) state ----------

export type ItemKind = "shop" | "workshop" | "place" | "dish";

export interface ItemRef {
  kind: ItemKind;
  slug: string;
}

export type Mode = "planning" | "here";
export type Lang = "en" | "hi";

export interface PlanStop extends ItemRef {
  id: string;
  status?: "requested";
  note?: string;
}

export interface Trip {
  id: string;
  name: string;
  start?: string; // ISO date
  end?: string;
  days: PlanStop[][];
  journal: Record<number, string>; // day index -> note
  createdAt: number;
}

export interface CheckIn extends ItemRef {
  tripId: string;
  at: number;
}

export interface PhotoMeta {
  id: string;
  tripId: string;
  caption: string;
  tag?: ItemRef;
  addedAt: number;
  w: number;
  h: number;
}
