"use client";

import { useId } from "react";
import { NotebookPen } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Trip } from "@/lib/types";

/** Short journal note for one day of a trip (trip.journal[day]). Saved as you type. */
export function JournalNote({ trip, day, label, placeholder }: { trip: Trip; day: number; label?: string; placeholder?: string }) {
  const id = useId();
  const value = trip.journal?.[day] ?? "";
  return (
    <div>
      <label htmlFor={id} className="flex items-center gap-1.5 text-sm font-semibold text-indigo">
        <NotebookPen className="h-4 w-4 text-marigold-ink" aria-hidden="true" />
        {label ?? `Journal note · Day ${day + 1}`}
      </label>
      <textarea
        id={id}
        value={value}
        maxLength={600}
        rows={2}
        onChange={(e) => useStore.getState().updateTrip(trip.id, { journal: { ...trip.journal, [day]: e.target.value } })}
        placeholder={placeholder ?? "The chai was perfect. Bought a dupatta for Maa…"}
        className="mt-1 block w-full resize-y rounded-xl border-2 border-dashed border-sand bg-[#fffdf8] px-3 py-2 font-hand text-lg leading-snug text-ink placeholder:text-muted/70 focus:border-marigold"
        style={{
          backgroundImage: "repeating-linear-gradient(transparent 0 27px, rgba(232,163,61,0.25) 27px 28px)",
          backgroundPositionY: "6px",
        }}
      />
    </div>
  );
}
