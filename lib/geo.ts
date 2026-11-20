import type { Hours } from "./types";

/** Great-circle distance in km. */
export function haversine(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

export function formatKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000 / 50) * 50} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

/** "HH:MM" -> minutes after midnight */
export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m || 0);
}

/** minutes after midnight -> "8 pm" / "10:30 am" */
export function formatClock(mins: number): string {
  const m = ((mins % 1440) + 1440) % 1440;
  const h24 = Math.floor(m / 60);
  const mm = m % 60;
  const suffix = h24 >= 12 ? "pm" : "am";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return mm ? `${h12}:${String(mm).padStart(2, "0")} ${suffix}` : `${h12} ${suffix}`;
}

/** Wall-clock in Jaipur (IST, UTC+5:30) regardless of device timezone. */
export function istParts(date: Date): { day: number; minutes: number } {
  const ist = new Date(date.getTime() + (date.getTimezoneOffset() + 330) * 60_000);
  return { day: ist.getDay(), minutes: ist.getHours() * 60 + ist.getMinutes() };
}

/** Is the place open on `day` (0=Sun) at `minutes` after midnight? Handles closing after midnight. */
export function isOpenAt(hours: Hours, day: number, minutes: number): boolean {
  const open = toMinutes(hours.open);
  const close = toMinutes(hours.close);
  if (close > open) {
    if (hours.closedDays.includes(day)) return false;
    return minutes >= open && minutes < close;
  }
  // Overnight (e.g. 18:00–01:00)
  if (minutes >= open) return !hours.closedDays.includes(day);
  if (minutes < close) return !hours.closedDays.includes((day + 6) % 7);
  return false;
}

export function isOpenNow(hours: Hours, now: Date = new Date()): boolean {
  const { day, minutes } = istParts(now);
  return isOpenAt(hours, day, minutes);
}

export interface OpenStatus {
  open: boolean;
  label: string;
}

const DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function openStatus(hours: Hours, now: Date = new Date()): OpenStatus {
  const { day, minutes } = istParts(now);
  if (isOpenAt(hours, day, minutes)) {
    return { open: true, label: `Open now · closes ${formatClock(toMinutes(hours.close))}` };
  }
  const open = toMinutes(hours.open);
  if (!hours.closedDays.includes(day) && minutes < open) {
    return { open: false, label: `Closed · opens ${formatClock(open)}` };
  }
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    if (!hours.closedDays.includes(d)) {
      return {
        open: false,
        label: `Closed · opens ${i === 1 ? "tomorrow" : DAY[d]} ${formatClock(open)}`,
      };
    }
  }
  return { open: false, label: "Closed" };
}

export function hoursLabel(hours: Hours): string {
  const base = `${formatClock(toMinutes(hours.open))} – ${formatClock(toMinutes(hours.close))}`;
  if (!hours.closedDays.length) return `${base}, every day`;
  return `${base} · closed ${hours.closedDays.map((d) => DAY[d]).join(", ")}`;
}

// ---------- Browser location (never stored) ----------

export function getPosition(timeout = 10000): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("unsupported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout,
      maximumAge: 5 * 60_000,
    });
  });
}

/** Reverse-geocode to an Indian state name using BigDataCloud's free client-side endpoint. */
export async function reverseGeocodeState(lat: number, lng: number): Promise<string | null> {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = (await res.json()) as { principalSubdivision?: string; countryCode?: string };
    if (json.countryCode && json.countryCode !== "IN") return json.principalSubdivision || "outside India";
    return json.principalSubdivision || null;
  } catch {
    return null;
  }
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
