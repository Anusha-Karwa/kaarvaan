"use client";

import Link from "next/link";
import { CalendarPlus } from "lucide-react";
import { useNow } from "@/lib/useNow";
import { BlockPrintPattern, Buti } from "@/components/motifs";
import { daysUntil } from "@/lib/plan";
import type { Trip } from "@/lib/types";
import { tripDatesLabel } from "./planUtils";

/** Planning-mode countdown, or a gentle nudge to add dates. */
export function Countdown({ trip, onAddDates }: { trip: Trip; onAddDates: () => void }) {
  const now = useNow();
  if (!trip.start) {
    return (
      <button
        type="button"
        onClick={onAddDates}
        className="flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 border-dashed border-marigold/60 bg-white/70 px-4 py-3 text-left hover:border-marigold"
      >
        <CalendarPlus className="h-6 w-6 shrink-0 text-marigold-ink" aria-hidden="true" />
        <span>
          <span className="block font-semibold text-indigo">Add your dates</span>
          <span className="block text-sm text-muted">For a countdown, and so we can check which days places are closed.</span>
        </span>
      </button>
    );
  }
  if (!now) return <div className="skeleton h-28" />;

  const d = daysUntil(trip.start, now);
  const len = trip.end ? daysUntil(trip.end, now) : d;
  let big: string;
  let line: string;
  let sub: React.ReactNode;
  if (d > 1) {
    big = String(d);
    line = "days to go";
    sub = "Jaipur is waiting. Pack light, leave space for a dupatta.";
  } else if (d === 1) {
    big = "Kal!";
    line = "Tomorrow";
    sub = "Kal milte hain (see you tomorrow). Tick off the checklist below.";
  } else if (d === 0) {
    big = "Aaj!";
    line = "Today. Day 1 starts now";
    sub = "Shubh yatra (have a lovely trip).";
  } else if (len >= 0) {
    big = String(1 - d);
    line = "Day of your trip";
    sub = "Enjoying it? Snap a photo for your yaadein (memories).";
  } else {
    big = "Done";
    line = "Trip complete";
    sub = (
      <>
        Hope it was lovely.{" "}
        <Link href="/memories" className="font-semibold text-haldi underline decoration-wavy underline-offset-4">
          Add your yaadein
        </Link>
      </>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-indigo px-5 py-4 text-ivory shadow-[0_8px_24px_rgba(31,42,92,0.25)]">
      <BlockPrintPattern color="#E8A33D" opacity={0.08} />
      <div className="relative flex items-center gap-4">
        <span className="font-display text-5xl leading-none text-marigold sm:text-6xl">{big}</span>
        <span className="min-w-0">
          <span className="block font-display text-xl leading-tight text-ivory">{line}</span>
          <span className="block text-sm text-ivory/80">{tripDatesLabel(trip)}</span>
        </span>
        <Buti size={34} className="ml-auto hidden shrink-0 sm:block" />
      </div>
      <p className="relative mt-2 text-sm text-ivory/90">{sub}</p>
    </div>
  );
}
