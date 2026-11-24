"use client";

import { useId, useState } from "react";
import { RefreshCw, Sparkles, Wand2 } from "lucide-react";
import { areas } from "@/lib/content/areas";
import { useStore } from "@/lib/store";
import type { AreaSlug, PlanStop, Trip } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { ChipButton } from "@/components/ui/Chip";
import { Sheet } from "@/components/ui/Sheet";
import { DayTimeline } from "@/components/DayTimeline";
import { INTERESTS, dayDate, generateDay, sameRef, type Interest } from "./planUtils";

/** "Plan my day for me": area + interests + half/full day → a simple, rule-based day. */
export function PlanMyDaySheet({ open, onClose, trip, initialDay }: { open: boolean; onClose: () => void; trip: Trip; initialDay: number }) {
  return (
    <Sheet open={open} onClose={onClose} title="Plan my day for me" wide full>
      {open && <Planner trip={trip} initialDay={initialDay} onDone={onClose} />}
    </Sheet>
  );
}

function Planner({ trip, initialDay, onDone }: { trip: Trip; initialDay: number; onDone: () => void }) {
  const id = useId();
  const storeArea = useStore((s) => s.area);
  const [area, setArea] = useState<AreaSlug>(storeArea ?? "old-city");
  const [interests, setInterests] = useState<Interest[]>(["Textiles", "Food", "Forts and palaces"]);
  const [length, setLength] = useState<"half" | "full">("full");
  const [result, setResult] = useState<PlanStop[] | null>(null);
  const [day, setDay] = useState(Math.min(initialDay, trip.days.length));

  const toggle = (i: Interest) => {
    setInterests((xs) => (xs.includes(i) ? xs.filter((x) => x !== i) : [...xs, i]));
    setResult(null);
  };

  const use = () => {
    if (!result) return;
    const s = useStore.getState();
    const before = trip.days;
    const days = before.map((d) => d.filter((x) => !result.some((r) => sameRef(r, x))));
    while (days.length <= day) days.push([]);
    const replaced = days[day].length;
    days[day] = result;
    s.setDays(days);
    s.showToast({
      message: `Day ${day + 1} is planned${replaced ? " (replaced what was there)" : ""}. Change anything you like.`,
      actionLabel: "Undo",
      onAction: () => useStore.getState().setDays(before),
    });
    onDone();
  };

  const date = dayDate(trip, day);
  const legend = "mb-2 text-sm font-bold uppercase tracking-wide text-muted";

  return (
    <div className="space-y-5 pb-4">
      <p className="text-muted">Tell us a little. We&apos;ll pick a few good stops from our guide and put them in a sensible order. No magic, just simple rules.</p>

      <fieldset>
        <legend className={legend}>Which area?</legend>
        <div className="flex flex-wrap gap-2">
          {areas.map((a) => (
            <ChipButton
              key={a.slug}
              active={area === a.slug}
              color="#1F2A5C"
              onClick={() => {
                setArea(a.slug);
                setResult(null);
              }}
            >
              {a.name}
            </ChipButton>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={legend}>What do you love?</legend>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((i) => (
            <ChipButton key={i} active={interests.includes(i)} onClick={() => toggle(i)} color="#C2185B">
              {i}
            </ChipButton>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={legend}>How long?</legend>
        <div className="flex gap-2">
          {(
            [
              ["half", "Half day", "About 3 stops"],
              ["full", "Full day", "6–7 stops, with meals"],
            ] as const
          ).map(([v, l, sub]) => (
            <button
              key={v}
              type="button"
              aria-pressed={length === v}
              onClick={() => {
                setLength(v);
                setResult(null);
              }}
              className={`flex min-h-14 flex-1 flex-col items-start justify-center rounded-2xl border-2 px-4 py-2 text-left transition-colors ${
                length === v ? "border-leaf bg-leaf/10" : "border-sand bg-white hover:border-marigold"
              }`}
            >
              <span className="font-semibold text-indigo">{l}</span>
              <span className="text-xs text-muted">{sub}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <Button variant="leaf" className="w-full" onClick={() => setResult(generateDay({ area, interests, length }))}>
        {result ? <RefreshCw className="h-5 w-5" aria-hidden="true" /> : <Wand2 className="h-5 w-5" aria-hidden="true" />}
        {result ? "Make it again" : "Make my day"}
      </Button>

      {result && (
        <section aria-labelledby={`${id}-preview`} className="rounded-3xl border-2 border-dashed border-marigold/60 bg-white/70 p-4">
          <h3 id={`${id}-preview`} className="mb-3 flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-marigold" aria-hidden="true" />
            Your day, roughly
          </h3>
          {result.length ? (
            <DayTimeline stops={result} weekday={date?.getDay() ?? 1} label="Suggested stops" compact />
          ) : (
            <p className="text-muted">Hmm, nothing fits those picks. Try another area or add an interest.</p>
          )}
          {result.length > 0 && (
            <div className="mt-4 space-y-3">
              <div>
                <label htmlFor={`${id}-day`} className="text-sm font-semibold text-indigo">
                  Put it on
                </label>
                <select
                  id={`${id}-day`}
                  value={day}
                  onChange={(e) => setDay(Number(e.target.value))}
                  className="mt-1 block min-h-11 w-full rounded-xl border-2 border-sand bg-white px-3 font-semibold text-indigo"
                >
                  {trip.days.map((d, i) => (
                    <option key={i} value={i}>
                      Day {i + 1}
                      {d.length ? ` (replaces ${d.length} stop${d.length === 1 ? "" : "s"})` : " (empty)"}
                    </option>
                  ))}
                  <option value={trip.days.length}>A new day (Day {trip.days.length + 1})</option>
                </select>
              </div>
              <Button className="w-full" onClick={use}>
                Use this plan
              </Button>
              <p className="font-hand text-lg text-rani">You can drag, reorder or remove anything after.</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
