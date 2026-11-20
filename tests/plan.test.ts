import { describe, expect, it } from "vitest";
import { decodePlan, encodePlan, smartOrder, timeWindows, type StopInfo } from "@/lib/plan";

const s = (kind: StopInfo["kind"], slug: string, area: StopInfo["area"], minutes = 60): StopInfo => ({ kind, slug, area, minutes });

describe("smartOrder", () => {
  it("puts Amer in the morning, bazaars in the afternoon and food in the evening", () => {
    const day = [s("dish", "laal-maas", "old-city"), s("shop", "johari", "old-city"), s("place", "amber-fort", "amer"), s("place", "hawa-mahal", "old-city")];
    expect(smartOrder(day).map((x) => x.slug)).toEqual(["amber-fort", "hawa-mahal", "johari", "laal-maas"]);
  });
  it("keeps breakfast dishes at the start", () => {
    const day = [s("place", "amber-fort", "amer"), s("dish", "pyaaz-kachori", "old-city")];
    expect(smartOrder(day, new Set(["pyaaz-kachori"])).map((x) => x.slug)).toEqual(["pyaaz-kachori", "amber-fort"]);
  });
  it("is stable for stops in the same area", () => {
    const day = [s("shop", "b", "old-city"), s("shop", "a", "old-city")];
    expect(smartOrder(day).map((x) => x.slug)).toEqual(["b", "a"]);
  });
  it("does not mutate the input", () => {
    const day = [s("dish", "x", "old-city"), s("place", "y", "amer")];
    smartOrder(day);
    expect(day[0].slug).toBe("x");
  });
});

describe("timeWindows", () => {
  it("starts at 8 am when Amer is first and adds travel time", () => {
    const w = timeWindows([s("place", "amber-fort", "amer", 150), s("place", "hawa-mahal", "old-city", 45)]);
    expect(w[0].start).toBe(8 * 60);
    expect(w[0].end).toBe(10 * 60 + 30);
    expect(w[1].start).toBe(11 * 60 + 10);
  });
  it("flags stops that are closed at that time", () => {
    const w = timeWindows([{ ...s("shop", "late", "old-city", 30), hours: { open: "07:00", close: "09:00", closedDays: [] } }], 10 * 60);
    expect(w[0].openAtStart).toBe(false);
  });
});

describe("share-link encoding", () => {
  it("round-trips a plan", () => {
    const plan = {
      name: "Ananya's Jaipur trip ✨",
      start: "2026-12-01",
      days: [
        [
          { kind: "place" as const, slug: "amber-fort" },
          { kind: "shop" as const, slug: "rangrez-bandhani-ghar" },
        ],
        [{ kind: "dish" as const, slug: "pyaaz-kachori" }],
      ],
    };
    const code = encodePlan(plan);
    expect(code).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(decodePlan(code)).toEqual(plan);
  });
  it("rejects garbage safely", () => {
    expect(decodePlan("not-a-plan")).toBeNull();
    expect(decodePlan("")).toBeNull();
  });
  it("drops malformed stops", () => {
    const code = Buffer.from(JSON.stringify({ n: "x", d: [["p:ok", "zz:bad", 5, "s:<script>"]] })).toString("base64url");
    expect(decodePlan(code)?.days).toEqual([[{ kind: "place", slug: "ok" }]]);
  });
});
