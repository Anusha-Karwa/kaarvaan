import { describe, expect, it } from "vitest";
import { formatINR, gaugeAngle, priceVerdict } from "@/lib/price";

describe("priceVerdict", () => {
  it("is fair within range", () => {
    expect(priceVerdict(1200, 800, 1500)).toBe("fair");
    expect(priceVerdict(1500, 800, 1500)).toBe("fair");
  });
  it("is a bit high up to 1.5x the max", () => {
    expect(priceVerdict(1800, 800, 1500)).toBe("bit-high");
    expect(priceVerdict(2250, 800, 1500)).toBe("bit-high");
  });
  it("is too high beyond that", () => {
    expect(priceVerdict(2251, 800, 1500)).toBe("too-high");
    expect(priceVerdict(6000, 800, 1500)).toBe("too-high");
  });
  it("flags suspiciously low prices", () => {
    expect(priceVerdict(300, 800, 1500)).toBe("low");
  });
});

describe("gaugeAngle", () => {
  it("maps 0 → -90, max → 0, 2×max and above → 90", () => {
    expect(gaugeAngle(0, 1000)).toBe(-90);
    expect(gaugeAngle(1000, 1000)).toBe(0);
    expect(gaugeAngle(2000, 1000)).toBe(90);
    expect(gaugeAngle(9000, 1000)).toBe(90);
  });
  it("puts the 'bit high' boundary at 45°", () => {
    expect(gaugeAngle(1500, 1000)).toBe(45);
  });
});

it("formats rupees Indian-style", () => {
  expect(formatINR(125000)).toBe("₹1,25,000");
});
