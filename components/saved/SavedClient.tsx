"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarPlus, Check, Trash2, X } from "lucide-react";
import { useState } from "react";
import { KIND_META, itemInfo, type ItemInfo } from "@/lib/data";
import { useActiveTrip, useStore, type SavedItem } from "@/lib/store";
import { useMotionOK } from "@/lib/motion";
import { useT } from "@/lib/i18n";
import type { ItemKind, ItemRef } from "@/lib/types";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { SampleRibbon } from "@/components/ui/SampleRibbon";
import { StampIcon } from "@/components/motifs";
import { KIND_ICON, refKey, sameRef } from "@/components/plan/planUtils";

const GROUP_ORDER: ItemKind[] = ["shop", "workshop", "place", "dish"];

function restoreSaved(before: SavedItem[]) {
  useStore.getState().set({ saved: before });
}

export function SavedClient() {
  const t = useT();
  const hydrated = useStore((s) => s.hydrated);
  return (
    <div className="container-k pt-6">
      <SectionHeader as="h1" title={t("saved.title")} hi="मेरा थैला" sub={t("saved.subtitle")} color="#C2185B" />
      {hydrated ? (
        <SavedList />
      ) : (
        <div className="space-y-3" aria-busy="true" aria-label="Loading your thela">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      )}
    </div>
  );
}

function SavedList() {
  const t = useT();
  const ok = useMotionOK();
  const saved = useStore((s) => s.saved);
  const trip = useActiveTrip();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const items = saved.map((s) => ({ saved: s, info: itemInfo(s) })).filter((x): x is { saved: SavedItem; info: ItemInfo } => !!x.info);
  const liveSelected = new Set([...selected].filter((k) => items.some((i) => refKey(i.saved) === k)));
  const selRefs: ItemRef[] = items.filter((i) => liveSelected.has(refKey(i.saved))).map((i) => ({ kind: i.saved.kind, slug: i.saved.slug }));

  const dayOf = (r: ItemRef) => trip.days.findIndex((d) => d.some((x) => sameRef(x, r)));

  if (!items.length) {
    return (
      <EmptyState
        title={t("saved.empty")}
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <ButtonLink href="/shop">Shopping</ButtonLink>
            <ButtonLink href="/experiences" variant="leaf">
              Experiences
            </ButtonLink>
          </div>
        }
      >
        Shops, workshops, places and food you save land here, ready to drop into your plan.
      </EmptyState>
    );
  }

  const toggle = (k: string) =>
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(k)) n.delete(k);
      else n.add(k);
      return n;
    });

  const removeOne = (r: ItemRef, title: string) => {
    const before = useStore.getState().saved;
    useStore.getState().removeSaved([r]);
    useStore.getState().showToast({ message: `Removed ${title}`, actionLabel: t("act.undo"), onAction: () => restoreSaved(before) });
  };

  const bulkRemove = () => {
    const before = useStore.getState().saved;
    useStore.getState().removeSaved(selRefs);
    setSelected(new Set());
    useStore.getState().showToast({
      message: `Removed ${selRefs.length} item${selRefs.length === 1 ? "" : "s"}`,
      actionLabel: t("act.undo"),
      onAction: () => restoreSaved(before),
    });
  };

  const bulkPlan = () => {
    const s = useStore.getState();
    const tr = s.trips.find((x) => x.id === s.activeTripId) ?? s.trips[0];
    const before = tr.days;
    const fresh = selRefs.filter((r) => !before.some((d) => d.some((x) => sameRef(x, r))));
    const used = new Set<number>();
    fresh.forEach((r) => used.add(useStore.getState().addToPlan(r)));
    setSelected(new Set());
    const days = [...used].sort().map((d) => d + 1);
    s.showToast(
      fresh.length
        ? {
            message: `Added ${fresh.length} to ${days.length === 1 ? `Day ${days[0]}` : `Days ${days.join(", ")}`} of “${tr.name}”`,
            actionLabel: t("act.undo"),
            onAction: () => useStore.getState().setDays(before),
          }
        : { message: "Those are already in your plan." },
    );
  };

  const allKeys = items.map((i) => refKey(i.saved));
  const allOn = liveSelected.size === allKeys.length;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-muted">
          {items.length} saved · planning for <span className="font-semibold text-indigo">{trip.name}</span>
        </p>
        <Button variant="ghost" size="sm" onClick={() => setSelected(allOn ? new Set() : new Set(allKeys))}>
          {allOn ? "Clear selection" : "Select all"}
        </Button>
      </div>

      <div className="space-y-8">
        {GROUP_ORDER.map((kind) => {
          const group = items.filter((i) => i.saved.kind === kind);
          if (!group.length) return null;
          const meta = KIND_META[kind];
          return (
            <section key={kind} aria-labelledby={`g-${kind}`}>
              <h2 id={`g-${kind}`} className="mb-3 flex items-center gap-2 text-2xl">
                <StampIcon icon={KIND_ICON[kind]} color={meta.color} size={36} />
                {meta.plural}
                <span className="rounded-full px-2.5 text-sm font-bold leading-6 text-white" style={{ background: meta.color }}>
                  {group.length}
                </span>
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                <AnimatePresence initial={false}>
                  {group.map(({ saved: s, info }) => {
                    const k = refKey(s);
                    const on = liveSelected.has(k);
                    const day = dayOf(s);
                    return (
                      <motion.li
                        key={k}
                        layout={ok}
                        initial={ok ? { opacity: 0, y: 8 } : false}
                        animate={{ opacity: 1, y: 0 }}
                        exit={ok ? { opacity: 0, x: -24 } : { opacity: 0 }}
                        className={`relative flex items-stretch overflow-hidden rounded-2xl border-2 bg-white shadow-[0_2px_8px_rgba(31,42,92,0.06)] transition-colors ${
                          on ? "border-marigold" : "border-sand"
                        }`}
                      >
                        <span className="w-1.5 shrink-0" style={{ background: meta.color }} aria-hidden="true" />
                        <label className="flex shrink-0 cursor-pointer items-center px-3">
                          <input
                            type="checkbox"
                            checked={on}
                            onChange={() => toggle(k)}
                            className="peer sr-only"
                            aria-label={`Select ${info.title}`}
                          />
                          <span
                            className={`flex h-7 w-7 items-center justify-center rounded-lg border-2 transition-colors peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-marigold ${
                              on ? "border-marigold bg-marigold text-indigo-dark" : "border-sand bg-white"
                            }`}
                            aria-hidden="true"
                          >
                            {on && <Check className="h-4 w-4" strokeWidth={3} />}
                          </span>
                        </label>
                        <div className="min-w-0 flex-1 py-3 pr-1">
                          <Link href={info.href} className="font-semibold leading-snug text-indigo hover:text-rani hover:underline hover:decoration-wavy hover:decoration-marigold">
                            {info.title}
                          </Link>
                          {info.titleHi && (
                            <span lang="hi" className="deva ml-1.5 text-sm text-muted">
                              {info.titleHi}
                            </span>
                          )}
                          <p className="text-sm leading-snug text-muted">{info.subtitle}</p>
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            {day >= 0 && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-leaf/12 px-2 text-xs font-bold leading-6 text-leaf-dark ring-1 ring-leaf/30">
                                <CalendarPlus className="h-3 w-3" aria-hidden="true" />
                                On Day {day + 1}
                              </span>
                            )}
                            {info.isDemo && kind !== "place" && <SampleRibbon />}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeOne(s, info.title)}
                          className="flex w-12 shrink-0 items-center justify-center text-muted hover:bg-terracotta/10 hover:text-terracotta"
                          aria-label={`Remove ${info.title} from Mera thela`}
                        >
                          <X className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            </section>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <ButtonLink href="/plan" variant="leaf">
          Go to my plan
        </ButtonLink>
        <ButtonLink href="/shop" variant="ghost">
          Keep shopping
        </ButtonLink>
      </div>

      {/* Bulk bar */}
      <AnimatePresence>
        {liveSelected.size > 0 && (
          <motion.div
            initial={ok ? { y: 80, opacity: 0 } : false}
            animate={{ y: 0, opacity: 1 }}
            exit={ok ? { y: 80, opacity: 0 } : { opacity: 0 }}
            className="fixed inset-x-0 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-40 px-3 md:bottom-6"
            role="region"
            aria-label="Selected items"
          >
            <div className="mx-auto flex max-w-xl flex-wrap items-center gap-2 rounded-2xl bg-indigo p-2 pl-4 text-ivory shadow-2xl">
              <span className="mr-auto font-semibold" aria-live="polite">
                {liveSelected.size} selected
              </span>
              <Button variant="marigold" size="sm" onClick={bulkPlan}>
                <CalendarPlus className="h-4 w-4" aria-hidden="true" />
                {t("act.addPlan")}
              </Button>
              <Button variant="light" size="sm" onClick={bulkRemove}>
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                {t("act.remove")}
              </Button>
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10"
                aria-label="Clear selection"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
