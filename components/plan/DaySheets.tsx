"use client";

import { CalendarDays, Copy, MessageCircle } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { useStore } from "@/lib/store";
import { shareOrCopy } from "@/lib/share";
import { waLink } from "@/lib/whatsapp";
import type { Trip } from "@/lib/types";
import { dayDate, shareDayText, shortDate } from "./planUtils";

export interface PickerTarget {
  title: string;
  /** Day the item is already on, if any (shown as "current"). */
  current?: number;
  onPick: (day: number) => void;
}

/** Non-drag fallback: choose a day from a list. */
export function DayPickerSheet({ trip, target, onClose }: { trip: Trip; target: PickerTarget | null; onClose: () => void }) {
  const n = trip.days.length;
  return (
    <Sheet open={!!target} onClose={onClose} title={target ? `Add to which day?` : "Pick a day"}>
      {target && (
        <div className="pb-2">
          <p className="mb-3 text-muted">
            <span className="font-semibold text-indigo">{target.title}</span>
          </p>
          <ul className="grid grid-cols-2 gap-2">
            {Array.from({ length: n + 1 }, (_, d) => {
              const date = d < n ? dayDate(trip, d) : null;
              const isCurrent = target.current === d;
              return (
                <li key={d}>
                  <button
                    type="button"
                    disabled={isCurrent}
                    onClick={() => {
                      target.onPick(d);
                      onClose();
                    }}
                    className="flex min-h-14 w-full flex-col items-start justify-center rounded-2xl border-2 border-sand bg-white px-4 py-2 text-left transition-colors hover:border-marigold disabled:opacity-50"
                  >
                    <span className="flex items-center gap-1.5 font-display text-lg text-indigo">
                      <CalendarDays className="h-4 w-4 text-marigold-ink" aria-hidden="true" />
                      {d < n ? `Day ${d + 1}` : "A new day"}
                    </span>
                    <span className="text-xs text-muted">
                      {isCurrent
                        ? "It's here now"
                        : d < n
                          ? `${date ? shortDate(date) + " · " : ""}${trip.days[d].length} stop${trip.days[d].length === 1 ? "" : "s"}`
                          : `Becomes Day ${n + 1}`}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Sheet>
  );
}

export function ShareDaySheet({ trip, day, onClose }: { trip: Trip; day: number | null; onClose: () => void }) {
  const text = day === null ? "" : shareDayText(trip, day);
  return (
    <Sheet open={day !== null} onClose={onClose} title={day === null ? "Share" : `Share Day ${day + 1}`}>
      {day !== null && (
        <div className="space-y-4 pb-2">
          <p className="text-muted">A neat message with times and Google Maps links. Your friend doesn&apos;t need the app.</p>
          <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-2xl border border-sand bg-white p-4 font-sans text-sm leading-relaxed text-ink">
            {text}
          </pre>
          <div className="flex flex-col gap-2 sm:flex-row">
            <ButtonLink href={waLink("", text)} variant="leaf" className="flex-1">
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Send on WhatsApp
            </ButtonLink>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={async () => {
                const r = await shareOrCopy({ title: `${trip.name} · Day ${day + 1}`, text });
                if (r === "copied") useStore.getState().showToast({ message: "Copied. Paste it anywhere." });
                if (r === "failed") useStore.getState().showToast({ message: "Couldn't share that. Try WhatsApp instead." });
              }}
            >
              <Copy className="h-5 w-5" aria-hidden="true" />
              Share or copy
            </Button>
          </div>
        </div>
      )}
    </Sheet>
  );
}
