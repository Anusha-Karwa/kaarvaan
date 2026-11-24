# Kaarvaan (कारवाँ)

**Find the real city: its crafts, its food, its people.**
A mobile-first, installable culture guide for first-time travellers, starting with Jaipur.

Traveller-only version: no accounts, no payments, no backend. Everything a traveller saves, plans or photographs stays on their phone.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (all content pages are statically generated)
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm test           # Vitest: haversine, open-now, smart order, share links, price gauge
```

The service worker only registers in production builds (`npm run build && npm start`).

## Deploy on Vercel

1. Push this folder to a GitHub repo.
2. In Vercel: **Add New → Project**, import the repo, keep the **Next.js** preset (no build settings to change).
3. Under **Environment Variables**, set:
   - `NEXT_PUBLIC_SITE_URL`: your production URL, e.g. `https://kaarvaan.vercel.app`
   - `NEXT_PUBLIC_KAARVAAN_WHATSAPP`: the Kaarvaan desk WhatsApp number, digits with country code (e.g. `9198XXXXXXXX`)
4. **Deploy**, then check:
   - home, a craft page (`/shop/rajasthan/bandhani`), a shop page, the planner (`/plan`), Memories (`/memories`) and price check (`/price-check`);
   - "Add to Home Screen" on Android Chrome / iOS Safari installs the app;
   - Settings → **Download Jaipur for offline**, then turn on airplane mode and browse.
5. Vercel Analytics: enable it in the project's Analytics tab (anonymous page views only).

QR codes for hotel receptions should point to `https://<site>/?from=hotel&area=<area>`, where `<area>` is one of `old-city`, `amer`, `sanganer`, `bagru`, `c-scheme`, `mi-road`. This skips onboarding, switches to "I'm in Jaipur now" mode and pre-selects the area.

## What's inside

| Path | What |
|---|---|
| `app/` | Routes: home, `shop/[state]/[craft]/[shop]`, `experiences/{workshops,places,food}/[slug]`, `plan`, `plan/view`, `memories`, `memories/passport`, `saved`, `price-check`, `phrases`, `getting-around`, `about`, `how-we-choose`, `settings`, `privacy`, `styleguide` (noindex), `not-found`, `manifest.ts`, `opengraph-image.tsx`, `precache.json` |
| `components/motifs/` | Buti, BlockPrintPattern, ToranBorder, Jharokha (+ ArchTop, ArchClip), Mandala, BandhaniDots, RangoliDivider, RouteLine, StampIcon, VerifiedSeal, PetalConfetti, PaperGrain |
| `components/illustrations/` | Hand-drawn flat SVGs: crafts, places, food, camel, auto-rickshaw, desert dusk, Ananya comic panels |
| `components/ui/` | Button, Card/ArchCard, Chip, Tabs, Sheet, Toast, SectionHeader, EmptyState, SampleRibbon, PreviewBanner, PriceGauge, FlipCard, Skeleton |
| `lib/` | `types`, `data` (content + search), `store` (Zustand, persisted), `i18n`, `geo` (haversine, open-now in IST), `plan` (smart order, time windows, share-link encoding), `price`, `whatsapp`, `maps`, `share`, `idb` (photos in IndexedDB) |
| `data/*.json` | All content: 36 states/UTs, 5 crafts, 15 sample shops, 4 workshops, 10 places, 8 dishes, 32 phrases, 13 tips |
| `public/sw.js` | Hand-written service worker |
| `tests/` | Vitest unit tests |

## Before launch: replace these

- **`NEXT_PUBLIC_KAARVAAN_WHATSAPP`**: the placeholder `91XXXXXXXXXX` must become the real desk number.
- **Shops, workshop hosts and food stalls** in `data/shops.json`, `data/workshops.json` and the `spots` in `data/food.json` are **fictional samples** (`isDemo: true`), as are their phone and WhatsApp numbers. Replace them with real makers after your verification visits, then remove the "Sample listing" ribbons and the preview banner (`components/ui/PreviewBanner.tsx`).
- **Prices** in `data/crafts.json` are indicative estimates. Re-check them during visits.
- Places are real public landmarks with general descriptions; check opening hours before launch.

## Decisions

- **Next.js 16.4 instead of 14.** Every 14.x release has open security advisories (fixed only in the current line), so the app uses the latest stable Next. "Cache Components" is switched off because the app is fully static.
- **Tailwind v4** (CSS-first config): the palette lives as `@theme` tokens in `app/globals.css`, e.g. `bg-rani`, `text-indigo`, `border-sand`.
- **Contrast.** `muted` is `#6E626A` (slightly darker than the brief's `#7A6E75`) so small grey text passes WCAG AA on ivory. Marigold is never used for small text; `marigold-ink` (`#8A5A12`) is used instead.
- **Hand-written service worker** rather than Serwist: simple, no build plugin, works with Turbopack. It caches the app shell on install, pages as you browse, and every page on "Download Jaipur for offline". Content JSON and illustrations are bundled into the JS, so caching pages caches them too.
- **Persisted state** uses Zustand with `skipHydration`, rehydrated on mount, so server HTML never mismatches. Persisted UI waits for hydration and shows skeletons first.
- **Location** is requested only on tap. Coordinates live in memory only; the single network call is BigDataCloud's free client reverse-geocoder. A 150 km radius around Jaipur also counts as "in Rajasthan" so it still works when that call fails.
- **Open now** is always computed in Jaipur time (IST), whatever the phone's timezone.
- **Smart order:** day trips (Abhaneri) and Amer first, then printing villages, old city bazaars, newer city; food last unless it's a breakfast dish.
- **Price gauge:** at or under the top of the range is Fair, up to 1.5× is A bit high, above is Too high. Below 60% of the bottom of the range gets a "surprisingly low: check it's not a copy" note.
- **Share links** encode the plan as base64url JSON in `?p=`; decoding validates every stop, so a crafted link can't inject content.
- **Workshop slot requests and problem reports** go to the Kaarvaan desk WhatsApp (not the sample hosts), so a real person can relay them.
- **Hindi toggle** translates the interface chrome (navigation, buttons, key headings). Content stays English with Hindi names alongside, as the brief specifies.
- **OpenGraph image** uses the default font of `next/og`, so it builds offline.
- **Illustrations are static SVG files.** `npm run build:illustrations` (run automatically before every build) renders the React drawings in `components/illustrations/registry.tsx` to `public/illustrations/*.svg`, and `<Illustration>` shows them as `<img>`. Inlining them made the home page 880 KB of HTML with 4,500+ SVG nodes. Edit a drawing in `registry.tsx`, then rebuild.
- **Server-first pages.** Home sections and content cards render on the server. Client components are small islands (greeting, location, mode sections, shop cards with live "Open now"). Translated headings inside server sections use the tiny `<T k="…"/>` client component.
- **Pre-paint script.** A few lines in `app/layout.tsx` read saved preferences before first paint. They show the server-rendered onboarding for first-time visitors and hide the preview banner once dismissed, with no JavaScript wait and no layout shift.
- **Framer Motion loads lazily** (`LazyMotion` + `m` components). Search, planner sheets and the planner's extras load on first use.
- **Content is split per collection** (`lib/content/*`). Client components import only the slice they need; `lib/data.ts` stays the full barrel for server code.

## Verification status (local production build, 360px phone)

- `next build` (100 static pages), `eslint .`, `tsc --noEmit` and `vitest` (27 tests) all pass.
- Click-through in Chromium: onboarding (3 steps, skippable), QR entry, mode toggle, Hindi toggle, save / add to plan / I visited (confetti + passport stamp), quiz, "Plan my day for me", share link → read-only view, photo upload (compressed to ≤1600px, stored in IndexedDB), passport, search, price gauge, 404. No page errors.
- Offline: "Download Jaipur for offline" caches all 93 pages in ~2s. Deep pages and client-side navigation then work with the network off, and the offline pill shows.
- Lighthouse on the live site (mobile, simulated slow 4G), 24 Nov 2026: Performance 90–95 on all 12 main pages (home 90, shop pages 92–95, planner 90, price check 93, phrasebook 94). Accessibility, Best Practices and SEO score 100 apart from the two fixes in the latest commit. Scores vary ±3 between runs.
