"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AreaSlug, CheckIn, ItemRef, Lang, Mode, PhotoMeta, PlanStop, Trip } from "./types";
import { tripDayCount, uid } from "./plan";

export interface ToastData {
  id: number;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export interface SavedItem extends ItemRef {
  at: number;
}

const DEFAULT_TRIP_ID = "my-jaipur-trip";

function defaultTrip(): Trip {
  return { id: DEFAULT_TRIP_ID, name: "My Jaipur trip", days: [[], []], journal: {}, createdAt: Date.now() };
}

interface PersistedState {
  onboarded: boolean;
  mode: Mode;
  stateSlug: string;
  area: AreaSlug | null;
  interests: string[];
  name: string;
  lang: Lang;
  reduceMotion: boolean;
  saved: SavedItem[];
  trips: Trip[];
  activeTripId: string;
  checkIns: CheckIn[];
  photos: PhotoMeta[];
  checklist: Record<string, boolean>;
  favPhrases: string[];
  recentSearches: string[];
  bannerDismissed: boolean;
  offlineReady: boolean;
}

interface EphemeralState {
  hydrated: boolean;
  /** Coordinates live only in memory for this session. Never persisted. */
  coords: { lat: number; lng: number } | null;
  confettiKey: number;
  toast: ToastData | null;
  searchOpen: boolean;
}

interface Actions {
  set: (patch: Partial<PersistedState>) => void;
  setCoords: (c: { lat: number; lng: number } | null) => void;
  setSearchOpen: (open: boolean) => void;
  completeOnboarding: (p: { stateSlug: string; mode: Mode; interests: string[]; start?: string; end?: string; area?: AreaSlug | null }) => void;
  toggleSave: (ref: ItemRef) => boolean; // returns new saved state
  removeSaved: (refs: ItemRef[]) => void;
  createTrip: (name: string, start?: string, end?: string) => string;
  updateTrip: (id: string, patch: Partial<Omit<Trip, "id">>) => void;
  deleteTrip: (id: string) => void;
  addToPlan: (ref: ItemRef, day?: number, extra?: Partial<PlanStop>) => number;
  setDay: (day: number, stops: PlanStop[]) => void;
  setDays: (days: PlanStop[][]) => void;
  addDay: () => void;
  removeDay: (day: number) => void;
  checkIn: (ref: ItemRef) => void;
  addPhoto: (p: PhotoMeta) => void;
  updatePhoto: (id: string, patch: Partial<PhotoMeta>) => void;
  removePhoto: (id: string) => void;
  toggleChecklist: (key: string) => void;
  toggleFavPhrase: (id: string) => void;
  addRecentSearch: (q: string) => void;
  celebrate: () => void;
  showToast: (t: Omit<ToastData, "id">) => void;
  hideToast: () => void;
  resetAll: () => void;
}

export type Store = PersistedState & EphemeralState & Actions;

const initial: PersistedState = {
  onboarded: false,
  mode: "planning",
  stateSlug: "rajasthan",
  area: null,
  interests: [],
  name: "",
  lang: "en",
  reduceMotion: false,
  saved: [],
  trips: [defaultTrip()],
  activeTripId: DEFAULT_TRIP_ID,
  checkIns: [],
  photos: [],
  checklist: {},
  favPhrases: ["how-much", "best-price", "thank-you"],
  recentSearches: [],
  bannerDismissed: false,
  offlineReady: false,
};

const same = (a: ItemRef, b: ItemRef) => a.kind === b.kind && a.slug === b.slug;

export const useStore = create<Store>()(
  persist(
    (set, get) => {
      const patchTrip = (fn: (t: Trip) => Trip) =>
        set((s) => ({ trips: s.trips.map((t) => (t.id === s.activeTripId ? fn(t) : t)) }));

      return {
        ...initial,
        hydrated: false,
        coords: null,
        confettiKey: 0,
        toast: null,
        searchOpen: false,

        set: (patch) => set(patch),
        setCoords: (coords) => set({ coords }),
        setSearchOpen: (searchOpen) => set({ searchOpen }),

        completeOnboarding: ({ stateSlug, mode, interests, start, end, area }) =>
          set((s) => ({
            onboarded: true,
            stateSlug,
            mode,
            interests,
            area: area ?? s.area,
            trips: s.trips.map((t) =>
              t.id === DEFAULT_TRIP_ID && (start || end)
                ? { ...t, start, end, days: Array.from({ length: tripDayCount(start, end) }, (_, i) => t.days[i] ?? []) }
                : t,
            ),
          })),

        toggleSave: (ref) => {
          const exists = get().saved.some((x) => same(x, ref));
          set((s) => ({
            saved: exists ? s.saved.filter((x) => !same(x, ref)) : [{ ...ref, at: Date.now() }, ...s.saved],
          }));
          return !exists;
        },
        removeSaved: (refs) => set((s) => ({ saved: s.saved.filter((x) => !refs.some((r) => same(r, x))) })),

        createTrip: (name, start, end) => {
          const id = uid("trip");
          const trip: Trip = {
            id,
            name: name || "New trip",
            start,
            end,
            days: Array.from({ length: tripDayCount(start, end) }, () => []),
            journal: {},
            createdAt: Date.now(),
          };
          set((s) => ({ trips: [...s.trips, trip], activeTripId: id }));
          return id;
        },
        updateTrip: (id, patch) => set((s) => ({ trips: s.trips.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
        deleteTrip: (id) =>
          set((s) => {
            let trips = s.trips.filter((t) => t.id !== id);
            if (!trips.length) trips = [defaultTrip()];
            return {
              trips,
              activeTripId: s.activeTripId === id ? trips[0].id : s.activeTripId,
              photos: s.photos.filter((p) => p.tripId !== id),
              checkIns: s.checkIns.filter((c) => c.tripId !== id),
            };
          }),

        addToPlan: (ref, day, extra) => {
          const trip = get().trips.find((t) => t.id === get().activeTripId)!;
          let target = day ?? -1;
          if (target < 0) {
            // first day without this item, else day 1
            target = trip.days.findIndex((d) => d.length < 6);
            if (target < 0) target = 0;
          }
          patchTrip((t) => {
            const days = t.days.length ? t.days.map((d) => [...d]) : [[]];
            while (days.length <= target) days.push([]);
            days.forEach((d, i) => (days[i] = d.filter((x) => !same(x, ref))));
            days[target].push({ ...ref, id: uid("stop"), ...extra });
            return { ...t, days };
          });
          return target;
        },
        setDay: (day, stops) =>
          patchTrip((t) => ({ ...t, days: t.days.map((d, i) => (i === day ? stops : d)) })),
        setDays: (days) => patchTrip((t) => ({ ...t, days })),
        addDay: () => patchTrip((t) => ({ ...t, days: [...t.days, []] })),
        removeDay: (day) =>
          patchTrip((t) => ({ ...t, days: t.days.length > 1 ? t.days.filter((_, i) => i !== day) : [[]] })),

        checkIn: (ref) =>
          set((s) => ({
            checkIns: [
              ...s.checkIns.filter((c) => !(same(c, ref) && c.tripId === s.activeTripId)),
              { ...ref, tripId: s.activeTripId, at: Date.now() },
            ],
          })),

        addPhoto: (p) => set((s) => ({ photos: [p, ...s.photos] })),
        updatePhoto: (id, patch) => set((s) => ({ photos: s.photos.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
        removePhoto: (id) => set((s) => ({ photos: s.photos.filter((p) => p.id !== id) })),

        toggleChecklist: (key) => set((s) => ({ checklist: { ...s.checklist, [key]: !s.checklist[key] } })),
        toggleFavPhrase: (id) =>
          set((s) => ({
            favPhrases: s.favPhrases.includes(id) ? s.favPhrases.filter((x) => x !== id) : [...s.favPhrases, id],
          })),
        addRecentSearch: (q) =>
          set((s) => ({
            recentSearches: [q, ...s.recentSearches.filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, 6),
          })),

        celebrate: () => set((s) => ({ confettiKey: s.confettiKey + 1 })),
        showToast: (t) => set({ toast: { ...t, id: Date.now() } }),
        hideToast: () => set({ toast: null }),
        resetAll: () => set({ ...initial, trips: [defaultTrip()], onboarded: true }),
      };
    },
    {
      name: "kaarvaan-v1",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s): PersistedState => ({
        onboarded: s.onboarded,
        mode: s.mode,
        stateSlug: s.stateSlug,
        area: s.area,
        interests: s.interests,
        name: s.name,
        lang: s.lang,
        reduceMotion: s.reduceMotion,
        saved: s.saved,
        trips: s.trips,
        activeTripId: s.activeTripId,
        checkIns: s.checkIns,
        photos: s.photos,
        checklist: s.checklist,
        favPhrases: s.favPhrases,
        recentSearches: s.recentSearches,
        bannerDismissed: s.bannerDismissed,
        offlineReady: s.offlineReady,
      }),
      onRehydrateStorage: () => () => {
        useStore.setState({ hydrated: true });
      },
    },
  ),
);

export function useActiveTrip(): Trip {
  return useStore((s) => s.trips.find((t) => t.id === s.activeTripId) ?? s.trips[0]);
}

export function useIsSaved(ref: ItemRef): boolean {
  return useStore((s) => s.saved.some((x) => x.kind === ref.kind && x.slug === ref.slug));
}
