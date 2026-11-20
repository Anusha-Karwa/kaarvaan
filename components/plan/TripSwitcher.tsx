"use client";

import { ChevronDown, Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useId, useState } from "react";
import { useActiveTrip, useStore } from "@/lib/store";
import { deletePhotoBlob } from "@/lib/idb";
import { tripDayCount } from "@/lib/plan";
import type { Trip } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";

/** After an undoable trip delete: once the undo window is gone, drop orphaned photo blobs. */
export function cleanupOrphanBlobs(ids: string[], delay = 6000) {
  setTimeout(() => {
    const live = new Set(useStore.getState().photos.map((p) => p.id));
    ids.filter((id) => !live.has(id)).forEach((id) => void deletePhotoBlob(id).catch(() => {}));
  }, delay);
}

export function deleteTripWithUndo(trip: Trip) {
  const s = useStore.getState();
  const snapshot = { trips: s.trips, activeTripId: s.activeTripId, photos: s.photos, checkIns: s.checkIns };
  const photoIds = s.photos.filter((p) => p.tripId === trip.id).map((p) => p.id);
  s.deleteTrip(trip.id);
  s.showToast({
    message: `Deleted “${trip.name}”`,
    actionLabel: "Undo",
    onAction: () => useStore.getState().set(snapshot),
  });
  cleanupOrphanBlobs(photoIds);
}

export function TripFormSheet({ open, onClose, trip }: { open: boolean; onClose: () => void; trip?: Trip }) {
  return (
    <Sheet open={open} onClose={onClose} title={trip ? "Edit trip" : "New trip"}>
      {open && <TripForm key={trip?.id ?? "new"} trip={trip} onDone={onClose} />}
    </Sheet>
  );
}

function TripForm({ trip, onDone }: { trip?: Trip; onDone: () => void }) {
  const id = useId();
  const [name, setName] = useState(trip?.name ?? "");
  const [start, setStart] = useState(trip?.start ?? "");
  const [end, setEnd] = useState(trip?.end ?? "");
  const badRange = !!start && !!end && end < start;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (badRange) return;
    const s = useStore.getState();
    const clean = name.trim() || (trip ? trip.name : "New trip");
    if (trip) {
      const patch: Partial<Trip> = { name: clean, start: start || undefined, end: end || undefined };
      // Grow the planner to fit new dates; never silently drop planned days.
      const want = start && end ? tripDayCount(start, end) : trip.days.length;
      if (want > trip.days.length) patch.days = [...trip.days, ...Array.from({ length: want - trip.days.length }, () => [])];
      s.updateTrip(trip.id, patch);
      s.showToast({ message: "Trip updated" });
    } else {
      s.createTrip(clean, start || undefined, end || undefined);
      s.showToast({ message: `Chalo! “${clean}” is ready to plan.` });
    }
    onDone();
  };

  const field = "mt-1 block min-h-11 w-full rounded-xl border-2 border-sand bg-white px-3 text-base text-ink focus:border-marigold";
  return (
    <form onSubmit={submit} className="space-y-4 pb-2">
      <div>
        <label htmlFor={`${id}-name`} className="text-sm font-semibold text-indigo">
          Trip name
        </label>
        <input
          id={`${id}-name`}
          data-autofocus
          value={name}
          maxLength={60}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Jaipur with Maa"
          className={field}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${id}-start`} className="text-sm font-semibold text-indigo">
            First day
          </label>
          <input id={`${id}-start`} type="date" value={start} onChange={(e) => setStart(e.target.value)} className={field} />
        </div>
        <div>
          <label htmlFor={`${id}-end`} className="text-sm font-semibold text-indigo">
            Last day
          </label>
          <input
            id={`${id}-end`}
            type="date"
            value={end}
            min={start || undefined}
            onChange={(e) => setEnd(e.target.value)}
            className={field}
            aria-invalid={badRange}
            aria-describedby={`${id}-hint`}
          />
        </div>
      </div>
      <p id={`${id}-hint`} className={`text-sm ${badRange ? "font-semibold text-terracotta" : "text-muted"}`}>
        {badRange ? "The last day comes before the first. Swap them?" : "Dates are optional. With dates we can check opening days for you."}
      </p>
      <Button type="submit" className="w-full" disabled={badRange}>
        {trip ? "Save changes" : "Create trip"}
      </Button>
    </form>
  );
}

/** Trip picker + new / edit / delete. */
export function TripSwitcher({ manage = true, label = "Trip" }: { manage?: boolean; label?: string }) {
  const id = useId();
  const trips = useStore((s) => s.trips);
  const trip = useActiveTrip();
  const [sheet, setSheet] = useState<"new" | "edit" | null>(null);
  const close = useCallback(() => setSheet(null), []);

  return (
    <div className="flex flex-wrap items-end gap-2">
      <div className="min-w-0 flex-1 basis-48">
        <label htmlFor={`${id}-trip`} className="block text-sm font-semibold text-muted">
          {label}
        </label>
        <div className="relative mt-1">
          <select
            id={`${id}-trip`}
            value={trip.id}
            onChange={(e) => useStore.getState().set({ activeTripId: e.target.value })}
            className="block min-h-11 w-full appearance-none truncate rounded-full border-2 border-indigo bg-white py-2 pl-4 pr-10 font-semibold text-indigo"
          >
            {trips.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo" aria-hidden="true" />
        </div>
      </div>
      {manage && (
        <div className="flex items-center gap-1">
          <Button variant="primary" size="sm" onClick={() => setSheet("new")}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            New trip
          </Button>
          <button
            type="button"
            onClick={() => setSheet("edit")}
            className="flex h-11 w-11 items-center justify-center rounded-full text-indigo hover:bg-sand"
            aria-label={`Rename or change dates of ${trip.name}`}
          >
            <Pencil className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => deleteTripWithUndo(trip)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-terracotta hover:bg-terracotta/10"
            aria-label={`Delete ${trip.name}`}
          >
            <Trash2 className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      )}
      <TripFormSheet open={sheet !== null} onClose={close} trip={sheet === "edit" ? trip : undefined} />
    </div>
  );
}
