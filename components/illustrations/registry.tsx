// Inline SVG components for every illustration. Used only at build time by
// scripts/build-illustrations.tsx (pages show the generated files via <Illustration>).
import type { JSX } from "react";
import { BandhaniDupatta, BluePotteryVase, KundanJhumka, Mojari, PrintingBlock } from "./crafts";
import { Chai, Curry, Ghewar, Kachori, Lassi, MirchiVada, Thali } from "./food";
import {
  AutoRickshaw,
  Camel,
  ComicCommissionShop,
  ComicDriver,
  ComicHappy,
  ComicOverpay,
  ComicPlanning,
  DesertDusk,
  Driver,
  ShopKeeper,
  Traveller,
} from "./misc";
import { Fort, HawaMahal, Museum, Observatory, Palace, Stepwell, Village } from "./places";
import type { IllustrationProps } from "./primitives";

export * from "./crafts";
export * from "./places";
export * from "./food";
export * from "./misc";
export type { IllustrationProps } from "./primitives";

export type IllustrationName =
  | "bandhani"
  | "block-print"
  | "blue-pottery"
  | "kundan-meenakari"
  | "mojari"
  | "fort"
  | "hawa-mahal"
  | "palace"
  | "observatory"
  | "stepwell"
  | "museum"
  | "village"
  | "thali"
  | "kachori"
  | "mirchi-vada"
  | "ghewar"
  | "curry"
  | "lassi"
  | "chai"
  | "camel"
  | "auto-rickshaw"
  | "desert-dusk"
  | "comic-planning"
  | "comic-driver"
  | "comic-shop"
  | "comic-overpay"
  | "comic-happy";

export const REGISTRY: Record<IllustrationName, (props: IllustrationProps) => JSX.Element> = {
  bandhani: BandhaniDupatta,
  "block-print": PrintingBlock,
  "blue-pottery": BluePotteryVase,
  "kundan-meenakari": KundanJhumka,
  mojari: Mojari,
  fort: Fort,
  "hawa-mahal": HawaMahal,
  palace: Palace,
  observatory: Observatory,
  stepwell: Stepwell,
  museum: Museum,
  village: Village,
  thali: Thali,
  kachori: Kachori,
  "mirchi-vada": MirchiVada,
  ghewar: Ghewar,
  curry: Curry,
  lassi: Lassi,
  chai: Chai,
  camel: Camel,
  "auto-rickshaw": AutoRickshaw,
  "desert-dusk": DesertDusk,
  "comic-planning": ComicPlanning,
  "comic-driver": ComicDriver,
  "comic-shop": ComicCommissionShop,
  "comic-overpay": ComicOverpay,
  "comic-happy": ComicHappy,
};

/** Characters that are exported but not part of the IllustrationName union. */
export const CHARACTERS = { Traveller, Driver, ShopKeeper };
