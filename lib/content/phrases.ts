import phrasesJson from "@/data/phrases.json";
import tipsJson from "@/data/tips.json";
import type { Phrase, Tip } from "../types";

export const phrases = phrasesJson as Phrase[];
export const tips = tipsJson as Tip[];
export const getPhrase = (id: string) => phrases.find((p) => p.id === id);
