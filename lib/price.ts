export type Verdict = "fair" | "bit-high" | "too-high" | "low";

/**
 * Compare a quoted price to an indicative range.
 * - below min*0.6 -> "low" (fine to pay, but a very low price can mean a copy)
 * - up to max -> "fair"
 * - up to max*1.5 -> "bit-high"
 * - above -> "too-high"
 */
export function priceVerdict(quoted: number, min: number, max: number): Verdict {
  if (!Number.isFinite(quoted) || quoted <= 0) return "fair";
  if (quoted < min * 0.6) return "low";
  if (quoted <= max) return "fair";
  if (quoted <= max * 1.5) return "bit-high";
  return "too-high";
}

/**
 * Needle angle for the semicircle gauge, in degrees: -90 (far left) … 90 (far right).
 * The scale runs from 0 to 2 × max. "Fair" zone ends at max (angle 0).
 */
export function gaugeAngle(quoted: number, max: number): number {
  if (!Number.isFinite(quoted) || quoted <= 0 || max <= 0) return -90;
  const ratio = Math.min(quoted / (2 * max), 1);
  return -90 + ratio * 180;
}

export const VERDICT_COPY: Record<Verdict, { title: string; titleHi: string; body: string }> = {
  low: {
    title: "Surprisingly low",
    titleHi: "Bahut sasta",
    body: "Below the usual range. Lucky find, or a copy? Check the real-vs-copy signs before you pay.",
  },
  fair: {
    title: "Fair",
    titleHi: "Theek hai",
    body: "This is within the indicative range. A small, friendly bargain is fine, but no need to push.",
  },
  "bit-high": {
    title: "A bit high",
    titleHi: "Thoda zyada",
    body: "Higher than usual. Smile, ask for their best price, and name a number near the top of the range.",
  },
  "too-high": {
    title: "Too high",
    titleHi: "Bahut zyada",
    body: "Well above the usual range. Bargain politely, or thank them and walk on. There are other makers.",
  },
};

export function formatINR(n: number): string {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}
