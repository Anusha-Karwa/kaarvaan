"use client";

import { useSyncExternalStore } from "react";

let snap: Date | null = null;
let timer: ReturnType<typeof setInterval> | undefined;
const subs = new Set<() => void>();
const notify = () => subs.forEach((f) => f());

function subscribe(cb: () => void) {
  subs.add(cb);
  if (!timer) {
    snap = new Date();
    timer = setInterval(() => {
      snap = new Date();
      notify();
    }, 60_000);
    queueMicrotask(notify);
  }
  return () => {
    subs.delete(cb);
    if (!subs.size && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

/** Current time, refreshed every minute. Null during server render and hydration (avoids mismatches). */
export function useNow(): Date | null {
  return useSyncExternalStore(subscribe, () => snap, () => null);
}
