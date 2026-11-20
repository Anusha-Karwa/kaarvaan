"use client";

import { useEffect, useRef, useState } from "react";
import { CircleCheck, Download, LoaderCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "working" | "done" | "nosw" | "error";

/** "Download Jaipur for offline": asks the service worker to pre-cache every page and picture. */
export function OfflineDownload() {
  const offlineReady = useStore((s) => s.offlineReady);
  const [status, setStatus] = useState<Status>("idle");
  const [count, setCount] = useState(0);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const cleanup = useRef<(() => void) | null>(null);

  useEffect(() => () => cleanup.current?.(), []);

  const start = () => {
    const sw = typeof navigator !== "undefined" ? navigator.serviceWorker : undefined;
    const ctrl = sw?.controller;
    if (!sw || !ctrl) {
      setStatus("nosw");
      return;
    }
    cleanup.current?.();
    setStatus("working");
    setProgress(null);
    const onMsg = (e: MessageEvent) => {
      const d = e.data as { type?: string; count?: number; done?: number; total?: number } | null;
      if (!d?.type) return;
      if (d.type === "PRECACHE_PROGRESS" && typeof d.done === "number" && typeof d.total === "number") {
        setProgress({ done: d.done, total: d.total });
      }
      if (d.type === "PRECACHE_DONE") {
        finish();
        setCount(d.count ?? 0);
        setStatus("done");
        const st = useStore.getState();
        st.set({ offlineReady: true });
        if (!st.checklist.offline) st.toggleChecklist("offline");
        st.showToast({ message: "Jaipur is saved for offline. Chalo!" });
      }
    };
    const timer = setTimeout(() => {
      finish();
      setStatus("error");
    }, 120_000);
    const finish = () => {
      sw.removeEventListener("message", onMsg);
      clearTimeout(timer);
      cleanup.current = null;
    };
    cleanup.current = finish;
    sw.addEventListener("message", onMsg);
    ctrl.postMessage({ type: "PRECACHE_ALL" });
  };

  const pct = progress && progress.total ? Math.round((progress.done / progress.total) * 100) : null;

  return (
    <div>
      <p className="text-[15px]">
        Markets have weak signal. Save every guide, phrase, price range and picture to this phone, about a minute on Wi-Fi.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button onClick={start} disabled={status === "working"} variant={offlineReady || status === "done" ? "secondary" : "primary"}>
          {status === "working" ? (
            <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
          ) : (
            <Download className="h-5 w-5" aria-hidden="true" />
          )}
          {status === "working" ? "Saving…" : offlineReady || status === "done" ? "Update offline copy" : "Download Jaipur for offline"}
        </Button>
        {offlineReady && status !== "working" && (
          <span className="flex items-center gap-1.5 text-sm font-semibold text-leaf-dark">
            <CircleCheck className="h-4 w-4" aria-hidden="true" /> Ready offline
          </span>
        )}
      </div>
      <div aria-live="polite" className="mt-3 text-sm">
        {status === "working" && (
          <div>
            <div
              className="h-3 overflow-hidden rounded-full bg-sand"
              role="progressbar"
              aria-label="Offline download"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct ?? undefined}
            >
              <div
                className={`h-full rounded-full bg-marigold transition-[width] duration-300 ${pct === null ? "w-1/3 animate-pulse" : ""}`}
                style={pct !== null ? { width: `${pct}%` } : undefined}
              />
            </div>
            <p className="mt-1 text-muted">{pct !== null ? `${progress!.done} of ${progress!.total} saved…` : "Packing your bags…"}</p>
          </div>
        )}
        {status === "done" && <p className="font-semibold text-leaf-dark">Done! {count ? `${count} pages and pictures` : "Everything"} saved on this phone.</p>}
        {status === "error" && <p className="text-terracotta">That took too long. Check your connection and try again.</p>}
        {status === "nosw" && (
          <p className="rounded-xl bg-haldi/25 px-3 py-2 text-ink ring-1 ring-haldi">
            Offline saving works in the installed app or the live website, where Kaarvaan&apos;s offline helper (service worker) runs. It
            isn&apos;t running here yet. Try reloading the page once, or open Kaarvaan from your home screen.
          </p>
        )}
      </div>
    </div>
  );
}
