import { describe, expect, it } from "vitest";
import { formatClock, haversine, isOpenAt, isOpenNow, istParts, openStatus } from "@/lib/geo";
import type { Hours } from "@/lib/types";

describe("haversine", () => {
  it("is zero for the same point", () => {
    expect(haversine(26.9, 75.8, 26.9, 75.8)).toBe(0);
  });
  it("Hawa Mahal to Amber Fort is roughly 10 km", () => {
    const d = haversine(26.9239, 75.8267, 26.9855, 75.8513);
    expect(d).toBeGreaterThan(6.5);
    expect(d).toBeLessThan(8);
  });
  it("Jaipur to Delhi is about 240 km", () => {
    const d = haversine(26.9124, 75.7873, 28.6139, 77.209);
    expect(d).toBeGreaterThan(230);
    expect(d).toBeLessThan(250);
  });
  it("is symmetric", () => {
    expect(haversine(1, 2, 3, 4)).toBeCloseTo(haversine(3, 4, 1, 2), 10);
  });
});

describe("open-now", () => {
  const shop: Hours = { open: "10:30", close: "20:30", closedDays: [0] };
  it("is open in the middle of a weekday", () => {
    expect(isOpenAt(shop, 2, 15 * 60)).toBe(true);
  });
  it("is closed before opening and at closing time", () => {
    expect(isOpenAt(shop, 2, 10 * 60)).toBe(false);
    expect(isOpenAt(shop, 2, 20 * 60 + 30)).toBe(false);
  });
  it("respects closed days", () => {
    expect(isOpenAt(shop, 0, 15 * 60)).toBe(false);
  });
  it("handles hours past midnight", () => {
    const late: Hours = { open: "18:00", close: "01:00", closedDays: [1] };
    expect(isOpenAt(late, 2, 23 * 60)).toBe(true);
    expect(isOpenAt(late, 2, 30)).toBe(false); // Tue 00:30 belongs to Monday night, a closed day
    expect(isOpenAt(late, 3, 30)).toBe(true);
    expect(isOpenAt(late, 2, 12 * 60)).toBe(false);
    expect(isOpenAt(late, 1, 23 * 60)).toBe(false);
  });
  it("uses Jaipur time regardless of device timezone", () => {
    // 2026-11-17 (Tuesday) 09:30 UTC = 15:00 IST
    const d = new Date(Date.UTC(2026, 10, 17, 9, 30));
    expect(istParts(d)).toEqual({ day: 2, minutes: 15 * 60 });
    expect(isOpenNow(shop, d)).toBe(true);
  });
  it("builds friendly labels", () => {
    const tueMorning = new Date(Date.UTC(2026, 10, 17, 3, 30)); // 09:00 IST
    expect(openStatus(shop, tueMorning).label).toBe("Closed · opens 10:30 am");
    const tueAfternoon = new Date(Date.UTC(2026, 10, 17, 9, 30));
    expect(openStatus(shop, tueAfternoon).label).toBe("Open now · closes 8:30 pm");
    const satNight = new Date(Date.UTC(2026, 10, 21, 16, 30)); // Sat 22:00 IST, Sunday closed
    expect(openStatus(shop, satNight).label).toBe("Closed · opens Monday 10:30 am");
  });
  it("formats clock times", () => {
    expect(formatClock(0)).toBe("12 am");
    expect(formatClock(12 * 60)).toBe("12 pm");
    expect(formatClock(20 * 60 + 5)).toBe("8:05 pm");
  });
});
