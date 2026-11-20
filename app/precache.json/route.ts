import { crafts, dishes, places, shops, states, workshops } from "@/lib/data";

export const dynamic = "force-static";

/** Every page URL, used by the service worker for "Download Jaipur for offline". */
export function GET() {
  const urls = [
    "/",
    "/shop",
    "/shop/rajasthan",
    "/experiences",
    "/plan",
    "/plan/view",
    "/saved",
    "/memories",
    "/memories/passport",
    "/price-check",
    "/phrases",
    "/getting-around",
    "/about",
    "/how-we-choose",
    "/settings",
    "/privacy",
    ...states.filter((s) => !s.live).map((s) => `/shop/${s.slug}`),
    ...crafts.map((c) => `/shop/rajasthan/${c.slug}`),
    ...shops.map((s) => `/shop/rajasthan/${s.craft}/${s.slug}`),
    ...workshops.map((w) => `/experiences/workshops/${w.slug}`),
    ...places.map((p) => `/experiences/places/${p.slug}`),
    ...dishes.map((d) => `/experiences/food/${d.slug}`),
  ];
  return Response.json({ version: 1, urls });
}
