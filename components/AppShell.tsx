"use client";

import { Suspense, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { WifiOff } from "lucide-react";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { PaperGrain } from "./motifs/PaperGrain";
import { PetalConfetti } from "./motifs/PetalConfetti";
import { Toast } from "./ui/Toast";
import dynamic from "next/dynamic";
import { Onboarding } from "./Onboarding";
import { LazyMotion } from "framer-motion";

const loadMotionFeatures = () => import("@/lib/motion-features").then((m) => m.default);

// Loaded only when needed, to keep the shared bundle small.
const SearchSheet = dynamic(() => import("./SearchSheet").then((m) => m.SearchSheet), { ssr: false });
import type { AreaSlug } from "@/lib/types";

const AREAS: AreaSlug[] = ["old-city", "amer", "sanganer", "bagru", "c-scheme", "mi-road", "abhaneri"];

function useOnline() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  return online;
}

export function AppShell({ children }: { children: ReactNode }) {
  const hydrated = useStore((s) => s.hydrated);
  const onboarded = useStore((s) => s.onboarded);
  const mode = useStore((s) => s.mode);
  const lang = useStore((s) => s.lang);
  const reduce = useStore((s) => s.reduceMotion);
  const searchOpen = useStore((s) => s.searchOpen);
  const online = useOnline();
  const pathname = usePathname();
  const t = useT();

  // Rehydrate persisted state once on the client, then apply QR entry params.
  useEffect(() => {
    void Promise.resolve(useStore.persist.rehydrate()).then(() => {
      const params = new URLSearchParams(window.location.search);
      if (params.get("from") === "hotel") {
        const area = params.get("area") as AreaSlug | null;
        useStore.getState().set({
          onboarded: true,
          mode: "here",
          stateSlug: "rajasthan",
          area: area && AREAS.includes(area) ? area : useStore.getState().area,
        });
      }
    });
  }, []);

  // Service worker for offline use
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("mode-here", hydrated && mode === "here");
    document.documentElement.classList.toggle("reduce-motion", reduce);
    document.documentElement.lang = hydrated && lang === "hi" ? "hi" : "en";
  }, [hydrated, mode, reduce, lang]);

  const skipOnboarding = pathname.startsWith("/plan/view") || pathname === "/privacy" || pathname === "/styleguide";

  return (
    <LazyMotion features={loadMotionFeatures}>
      {children}
      {!online && (
        <div className="fixed left-1/2 top-[calc(4.5rem+env(safe-area-inset-top))] z-[65] -translate-x-1/2" role="status">
          <span className="flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-ivory shadow-lg ring-2 ring-marigold">
            <WifiOff className="h-4 w-4" aria-hidden="true" /> {t("common.offline")}
          </span>
        </div>
      )}
      {/* Server-rendered but hidden; the pre-paint script in <head> reveals it for first-time visitors,
          so it paints without waiting for JavaScript. Unmounted once the store says onboarding is done. */}
      {!skipOnboarding && (!hydrated || !onboarded) && (
        <div className="onboarding-gate">
          <Suspense>
            <Onboarding />
          </Suspense>
        </div>
      )}
      {searchOpen && <SearchSheet />}
      <PetalConfetti />
      <Toast />
      <PaperGrain />
    </LazyMotion>
  );
}

/** Small helper for components that need "is offline" */
export function useIsOffline() {
  return !useOnline();
}
