/* Kaarvaan service worker: offline app shell + "Download Jaipur for offline". */
const VERSION = "kaarvaan-v1";
const PAGES = `${VERSION}-pages`;
const ASSETS = `${VERSION}-assets`;
const SHELL = ["/", "/price-check", "/phrases", "/memories", "/plan", "/saved", "/shop/rajasthan", "/experiences", "/manifest.webmanifest"];

const ASSET_RE = /\/_next\/static\/[^"'\s)\\]+/g;

async function cachePage(url, pageCache, assetCache) {
  const res = await fetch(url, { credentials: "same-origin" });
  if (!res.ok) return false;
  const html = await res.clone().text();
  await pageCache.put(url, res);
  const assets = [...new Set(html.match(ASSET_RE) || [])];
  await Promise.all(
    assets.map(async (a) => {
      if (await assetCache.match(a)) return;
      try {
        const r = await fetch(a);
        if (r.ok) await assetCache.put(a, r);
      } catch {}
    }),
  );
  return true;
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const [p, a] = await Promise.all([caches.open(PAGES), caches.open(ASSETS)]);
      await Promise.all(SHELL.map((u) => cachePage(u, p, a).catch(() => false)));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (!event.data || event.data.type !== "PRECACHE_ALL") return;
  const source = event.source;
  event.waitUntil(
    (async () => {
      try {
        const list = await (await fetch("/precache.json", { cache: "no-store" })).json();
        const [p, a] = await Promise.all([caches.open(PAGES), caches.open(ASSETS)]);
        let done = 0;
        for (const url of list.urls) {
          try {
            if (await cachePage(url, p, a)) done++;
          } catch {}
          if (source) source.postMessage({ type: "PRECACHE_PROGRESS", done, total: list.urls.length });
        }
        if (source) source.postMessage({ type: "PRECACHE_DONE", count: done, total: list.urls.length });
      } catch (e) {
        if (source) source.postMessage({ type: "PRECACHE_ERROR", message: String(e) });
      }
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Google Fonts (if any) & same-origin static assets: cache first
  if (url.origin === self.location.origin && (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/") || url.pathname.startsWith("/_next/image"))) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) caches.open(ASSETS).then((c) => c.put(req, res.clone()));
            return res;
          }),
      ),
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  // Page navigations: network first, fall back to cache, then home
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const res = await fetch(req);
          if (res.ok) {
            const copy = res.clone();
            caches.open(PAGES).then((c) => c.put(url.pathname, copy));
          }
          return res;
        } catch {
          const cache = await caches.open(PAGES);
          return (await cache.match(url.pathname)) || (await cache.match("/")) || Response.error();
        }
      })(),
    );
    return;
  }

  // RSC payloads & other same-origin GETs: network first, cache fallback
  event.respondWith(
    (async () => {
      try {
        const res = await fetch(req);
        if (res.ok && (req.headers.get("RSC") || url.pathname.endsWith(".json") || url.pathname.endsWith(".webmanifest"))) {
          const copy = res.clone();
          caches.open(PAGES).then((c) => c.put(req, copy));
        }
        return res;
      } catch {
        return (await caches.match(req)) || Response.error();
      }
    })(),
  );
});
