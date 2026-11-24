"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { m } from "framer-motion";
import type { AreaSlug, Dish } from "@/lib/types";
import { getArea } from "@/lib/content/areas";
import { dishes, places, workshops } from "@/lib/content/experiences";
import { useMotionOK } from "@/lib/motion";
import { Tabs } from "@/components/ui/Tabs";
import { Chillies, ChipButton, VegMark } from "@/components/ui/Chip";
import { Handnote } from "@/components/ui/Handnote";
import { EmptyState } from "@/components/ui/EmptyState";

type TabId = "workshops" | "places" | "food";
const TABS: { id: TabId; label: string; hi: string }[] = [
  { id: "workshops", label: "Workshops", hi: "कार्यशाला" },
  { id: "places", label: "Places", hi: "जगहें" },
  { id: "food", label: "Food", hi: "खाना" },
];
const isTab = (x: string | null): x is TabId => !!x && TABS.some((t) => t.id === x);

const LEAF = "#2E7D5B";
const scrollKey = (t: TabId) => `kv-exp-scroll-${t}`;

function readScroll(t: TabId): number | null {
  try {
    const v = sessionStorage.getItem(scrollKey(t));
    return v === null ? null : Number(v) || 0;
  } catch {
    return null;
  }
}
function writeScroll(t: TabId, y: number) {
  try {
    sessionStorage.setItem(scrollKey(t), String(Math.round(y)));
  } catch {
    /* private mode etc. — scroll memory is a nicety */
  }
}

type FoodFilter = "all" | "veg" | "breakfast" | "evening";
const FOOD_FILTERS: { id: FoodFilter; label: string; test: (d: Dish) => boolean }[] = [
  { id: "all", label: "All", test: () => true },
  { id: "veg", label: "Veg only", test: (d) => d.veg },
  { id: "breakfast", label: "Breakfast", test: (d) => d.bestTime === "breakfast" },
  { id: "evening", label: "Evening snacks", test: (d) => d.bestTime === "evening" },
];

const PLACE_AREAS = Array.from(new Set(places.map((p) => p.area)));

// useLayoutEffect warns during SSR; this is a client component but still prerendered.
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** `cards` holds server-rendered cards keyed "w:slug", "p:slug", "d:slug" (keeps illustrations out of the JS bundle). */
export function ExperiencesTabs({ cards }: { cards: Record<string, ReactNode> }) {
  const [tab, setTab] = useState<TabId>("workshops");
  // Only animate panels the visitor switches to; the first panel renders visible from the server.
  const [switched, setSwitched] = useState(false);
  const [area, setArea] = useState<AreaSlug | "all">("all");
  const [food, setFood] = useState<FoodFilter>("all");
  const pendingRestore = useRef<number | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabRef = useRef<TabId>("workshops");
  const motionOK = useMotionOK();

  // Read ?tab= on mount. If the URL named a tab (e.g. coming back), restore that tab's scroll.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("tab");
    if (isTab(q)) {
      tabRef.current = q;
      const y = readScroll(q);
      if (q === "workshops") {
        // Already showing this tab: restore straight away.
        if (y !== null) requestAnimationFrame(() => window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior }));
        return;
      }
      pendingRestore.current = y;
      setTab(q); // eslint-disable-line react-hooks/set-state-in-effect -- URL is only readable on the client
    }
  }, []);

  // Remember scroll for the visible tab.
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (pendingRestore.current !== null) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => writeScroll(tabRef.current, window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // After a tab renders, jump to its remembered position.
  useIsoLayoutEffect(() => {
    const y = pendingRestore.current;
    if (y === null) return;
    const id = requestAnimationFrame(() => {
      window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
      pendingRestore.current = null;
    });
    return () => cancelAnimationFrame(id);
  }, [tab]);

  const onChange = useCallback(
    (id: string) => {
      if (!isTab(id) || id === tab) return;
      setSwitched(true);
      writeScroll(tab, window.scrollY);
      const top = tabsRef.current ? tabsRef.current.getBoundingClientRect().top + window.scrollY - 80 : 0;
      const saved = readScroll(id);
      // First visit to a tab: keep the tabs in view rather than jumping to the very top.
      pendingRestore.current = saved ?? Math.min(window.scrollY, Math.max(0, top));
      tabRef.current = id;
      setTab(id);
      try {
        const url = new URL(window.location.href);
        url.searchParams.set("tab", id);
        window.history.replaceState(window.history.state, "", url.toString());
      } catch {
        /* ignore */
      }
    },
    [tab],
  );

  const shownPlaces = area === "all" ? places : places.filter((p) => p.area === area);
  const foodTest = FOOD_FILTERS.find((f) => f.id === food)!.test;
  const shownDishes = dishes.filter(foodTest);

  return (
    <div ref={tabsRef}>
      <Tabs tabs={TABS} value={tab} onChange={onChange} label="Kinds of experiences" />

      <m.div
        key={tab}
        id={`panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        tabIndex={0}
        className="pt-6 outline-none"
        initial={motionOK && switched ? { opacity: 0, y: 6 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
      >
        <h2 className="sr-only">{TABS.find((t) => t.id === tab)?.label}</h2>
        {tab === "workshops" && (
          <>
            <p className="max-w-2xl text-[15px] text-ink/85">
              Small, hands-on sessions in real workshops. You get messy, the maker gets paid fairly, and you go home with
              something you made.
            </p>
            <Handnote color="text-leaf-dark" className="mt-1">
              Request a slot a day or two ahead. Dye baths start early!
            </Handnote>
            <ul className="mt-6 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {workshops.map((w) => (
                <li key={w.slug} className="flex">
                  {cards[`w:${w.slug}`]}
                </li>
              ))}
            </ul>
          </>
        )}

        {tab === "places" && (
          <>
            <div role="group" aria-label="Filter places by area" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
              <ChipButton active={area === "all"} onClick={() => setArea("all")} color={LEAF} className="shrink-0">
                All areas
              </ChipButton>
              {PLACE_AREAS.map((a) => (
                <ChipButton key={a} active={area === a} onClick={() => setArea(a)} color={LEAF} className="shrink-0">
                  {getArea(a)?.name ?? a}
                </ChipButton>
              ))}
            </div>
            <p className="mt-3 text-sm text-muted" aria-live="polite">
              {shownPlaces.length} {shownPlaces.length === 1 ? "place" : "places"}
              {area !== "all" ? ` in ${getArea(area)?.name ?? area}` : ""}
            </p>
            <ul className="mt-5 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {shownPlaces.map((p) => (
                <li key={p.slug} className="flex">
                  {cards[`p:${p.slug}`]}
                </li>
              ))}
            </ul>
          </>
        )}

        {tab === "food" && (
          <>
            <div role="group" aria-label="Filter dishes" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
              {FOOD_FILTERS.map((f) => (
                <ChipButton key={f.id} active={food === f.id} onClick={() => setFood(f.id)} color={LEAF} className="shrink-0">
                  {f.id === "veg" && <VegMark veg />}
                  {f.label}
                </ChipButton>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border border-dashed border-sand bg-white/70 px-4 py-3 text-sm">
              <span className="font-semibold text-indigo">How to read the cards:</span>
              <span className="inline-flex items-center gap-1.5">
                <VegMark veg /> Vegetarian
              </span>
              <span className="inline-flex items-center gap-1.5">
                <VegMark veg={false} /> Non-veg
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Chillies level={1} /> mild
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Chillies level={3} /> hot!
              </span>
            </div>
            <p className="mt-3 text-sm text-muted" aria-live="polite">
              {shownDishes.length} {shownDishes.length === 1 ? "dish" : "dishes"}
            </p>
            {shownDishes.length ? (
              <ul className="mt-5 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                {shownDishes.map((d) => (
                  <li key={d.slug} className="flex">
                    {cards[`d:${d.slug}`]}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-5">
                <EmptyState title="Nothing here yet">Try another filter. Jaipur eats all day, promise.</EmptyState>
              </div>
            )}
          </>
        )}
      </m.div>
    </div>
  );
}
