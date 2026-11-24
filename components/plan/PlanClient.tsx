"use client";

import Link from "next/link";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  ArrowDown,
  ArrowRightLeft,
  ArrowUp,
  CalendarPlus,
  GripVertical,
  Link2,
  ListOrdered,
  Plus,
  Share2,
  ShoppingBag,
  Trash2,
  Wand2,
  X,
} from "lucide-react";
import { useCallback, useState, useSyncExternalStore, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { KIND_META, itemInfo, type ItemInfo } from "@/lib/data";
import { useActiveTrip, useStore } from "@/lib/store";
import { copyText } from "@/lib/share";
import type { ItemRef, PlanStop, Trip } from "@/lib/types";
import { DayTimeline, StopStamp } from "@/components/DayTimeline";
import { Button, ButtonLink } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { Buti, RangoliDivider } from "@/components/motifs";
import { useT } from "@/lib/i18n";
import { Checklist } from "./Checklist";
import { Countdown } from "./Countdown";
import type { PickerTarget } from "./DaySheets";
import { JournalNote } from "./JournalNote";
import { TripSwitcher } from "./TripSwitcher";
import { KIND_ICON, dayDate, orderStops, planLink, sameRef, shortDate } from "./planUtils";

// Sheets load only when first opened, keeping the planner's first render light.
const DayPickerSheet = dynamic(() => import("./DaySheets").then((m) => m.DayPickerSheet), { ssr: false });
const ShareDaySheet = dynamic(() => import("./DaySheets").then((m) => m.ShareDaySheet), { ssr: false });
const PlanMyDaySheet = dynamic(() => import("./PlanMyDaySheet").then((m) => m.PlanMyDaySheet), { ssr: false });
const TripFormSheet = dynamic(() => import("./TripSwitcher").then((m) => m.TripFormSheet), { ssr: false });

const desktopQuery = "(min-width: 1024px)";
function useIsDesktop() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(desktopQuery);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(desktopQuery).matches,
    () => false,
  );
}

type DragData = { type: "tray"; ref: ItemRef; title: string } | { type: "stop"; stopId: string; from: number; title: string };

const iconBtn =
  "flex h-11 w-11 items-center justify-center rounded-full text-indigo transition-colors hover:bg-sand disabled:cursor-not-allowed disabled:opacity-30";

// ---------- Mutations (all with undo where it matters) ----------

function activeDays(): PlanStop[][] {
  const s = useStore.getState();
  return (s.trips.find((t) => t.id === s.activeTripId) ?? s.trips[0]).days;
}

function undoTo(before: PlanStop[][], message: string) {
  useStore.getState().showToast({ message, actionLabel: "Undo", onAction: () => useStore.getState().setDays(before) });
}

function addFromTray(ref: ItemRef, day: number, title: string) {
  const before = activeDays();
  const d = useStore.getState().addToPlan(ref, day);
  undoTo(before, `Added ${title} to Day ${d + 1}`);
}

function moveStop(stopId: string, toDay: number, title: string) {
  const before = activeDays();
  let moved: PlanStop | undefined;
  const days = before.map((d) =>
    d.filter((x) => {
      if (x.id === stopId) moved = x;
      return x.id !== stopId;
    }),
  );
  if (!moved) return;
  while (days.length <= toDay) days.push([]);
  days[toDay] = [...days[toDay], moved];
  useStore.getState().setDays(days);
  undoTo(before, `Moved ${title} to Day ${toDay + 1}`);
}

function nudge(day: number, index: number, dir: -1 | 1) {
  const stops = [...activeDays()[day]];
  const j = index + dir;
  if (j < 0 || j >= stops.length) return;
  [stops[index], stops[j]] = [stops[j], stops[index]];
  useStore.getState().setDay(day, stops);
}

function removeStop(day: number, stopId: string, title: string) {
  const before = activeDays();
  useStore.getState().setDay(
    day,
    before[day].filter((x) => x.id !== stopId),
  );
  undoTo(before, `Removed ${title} from Day ${day + 1}`);
}

// ---------- Draggables ----------

function DraggableHandle({ id, data, label, children, className = "" }: { id: string; data: DragData; label: string; children: ReactNode; className?: string }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id, data });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      aria-label={label}
      className={`touch-manipulation cursor-grab rounded-2xl active:cursor-grabbing ${isDragging ? "opacity-40" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

function TrayItem({ info, onAddTo }: { info: ItemInfo; onAddTo: () => void }) {
  const meta = KIND_META[info.kind];
  const Icon = KIND_ICON[info.kind];
  return (
    <li className="w-[15.5rem] shrink-0 snap-start lg:w-auto">
      <div className="flex h-full items-stretch overflow-hidden rounded-2xl border border-sand bg-white shadow-[0_2px_8px_rgba(31,42,92,0.06)]">
        <span className="w-1.5 shrink-0" style={{ background: meta.color }} aria-hidden="true" />
        <DraggableHandle
          id={`tray-${info.kind}-${info.slug}`}
          data={{ type: "tray", ref: { kind: info.kind, slug: info.slug }, title: info.title }}
          label={`Drag ${info.title} onto a day`}
          className="flex shrink-0 items-center px-1.5 text-muted hover:text-indigo"
        >
          <GripVertical className="h-5 w-5" aria-hidden="true" />
        </DraggableHandle>
        <div className="min-w-0 flex-1 py-2 pr-1">
          <span className={`flex items-center gap-1 text-xs font-bold ${meta.text}`}>
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {meta.label}
          </span>
          <Link href={info.href} className="line-clamp-2 font-semibold leading-snug text-indigo hover:text-rani">
            {info.title}
          </Link>
        </div>
        <button
          type="button"
          onClick={onAddTo}
          className="flex shrink-0 flex-col items-center justify-center gap-0.5 border-l border-dashed border-sand px-2.5 text-xs font-bold text-leaf-dark hover:bg-leaf/10"
          aria-label={`Add ${info.title} to a day`}
        >
          <CalendarPlus className="h-5 w-5" aria-hidden="true" />
          Add to Day…
        </button>
      </div>
    </li>
  );
}

function Tray({ trip, onPick }: { trip: Trip; onPick: (t: PickerTarget) => void }) {
  const saved = useStore((s) => s.saved);
  const planned = trip.days.flat();
  const items = saved
    .filter((s) => !planned.some((p) => sameRef(p, s)))
    .map((s) => itemInfo(s))
    .filter((x): x is ItemInfo => !!x);

  return (
    <section aria-labelledby="tray-h" className="relative rounded-3xl border-2 border-dashed border-rani/30 bg-rani/[0.04] p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 id="tray-h" className="flex items-center gap-2 text-xl">
          <ShoppingBag className="h-5 w-5 text-rani" aria-hidden="true" />
          From your thela
        </h2>
        <Link href="/saved" className="link-wavy text-sm">
          Mera thela
        </Link>
      </div>
      {!saved.length ? (
        <p className="mt-2 text-muted">
          Your thela is empty. Tap ♡ on{" "}
          <Link href="/shop" className="link-wavy">
            shops
          </Link>{" "}
          or{" "}
          <Link href="/experiences" className="link-wavy">
            places and food
          </Link>
          , and they&apos;ll wait here to be planned.
        </p>
      ) : !items.length ? (
        <p className="mt-2 font-hand text-lg text-leaf-dark">Everything in your thela is planned. Shabash!</p>
      ) : (
        <>
          <p className="mt-1 text-sm text-muted">Drag by the grip onto a day, or tap “Add to Day…”.</p>
          <ul className="-mx-1 mt-3 flex snap-x gap-3 overflow-x-auto px-1 pb-2 lg:flex-col lg:overflow-visible">
            {items.map((info) => (
              <TrayItem
                key={`${info.kind}:${info.slug}`}
                info={info}
                onAddTo={() => onPick({ title: info.title, onPick: (d) => addFromTray({ kind: info.kind, slug: info.slug }, d, info.title) })}
              />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

// ---------- Day ----------

function DayCard({
  trip,
  day,
  onPick,
  onShare,
  onPlanForMe,
}: {
  trip: Trip;
  day: number;
  onPick: (t: PickerTarget) => void;
  onShare: (d: number) => void;
  onPlanForMe: (d: number) => void;
}) {
  const stops = trip.days[day];
  const date = dayDate(trip, day);
  const label = `Day ${day + 1}${date ? `, ${shortDate(date)}` : ""}`;
  const { setNodeRef, isOver, active } = useDroppable({ id: `day-${day}`, data: { label } });
  const dragging = !!active;

  const smart = () => {
    const before = activeDays();
    const next = orderStops(before[day]);
    if (next.every((s, i) => s.id === before[day][i].id)) {
      useStore.getState().showToast({ message: `Day ${day + 1} is already in a good order.` });
      return;
    }
    useStore.getState().setDay(day, next);
    undoTo(before, `Day ${day + 1} sorted by area: less zig-zag.`);
  };

  const removeDay = () => {
    const s = useStore.getState();
    const before = activeDays();
    const journal = trip.journal ?? {};
    const days = before.length > 1 ? before.filter((_, i) => i !== day) : [[]];
    const nextJournal: Record<number, string> = {};
    Object.entries(journal).forEach(([k, v]) => {
      const i = Number(k);
      if (i < day) nextJournal[i] = v;
      else if (i > day) nextJournal[i - 1] = v;
    });
    s.updateTrip(trip.id, { days, journal: nextJournal });
    s.showToast({
      message: `Removed Day ${day + 1}`,
      actionLabel: "Undo",
      onAction: () => useStore.getState().updateTrip(trip.id, { days: before, journal }),
    });
  };

  return (
    <section
      ref={setNodeRef}
      aria-labelledby={`day-h-${day}`}
      className={`card relative p-4 transition-[box-shadow,border-color] sm:p-5 ${
        isOver ? "border-marigold! shadow-[0_0_0_3px_rgba(232,163,61,0.45)]" : dragging ? "border-dashed border-marigold/60" : ""
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Buti size={22} color={day % 2 ? "#2E7D5B" : "#E8A33D"} />
          <h2 id={`day-h-${day}`} className="text-2xl">
            Day {day + 1}
          </h2>
          {date && <span className="text-sm font-semibold text-muted">{shortDate(date)}</span>}
        </div>
        <span className="text-sm text-muted">
          {stops.length} stop{stops.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mt-4">
        {stops.length ? (
          <DayTimeline
            stops={stops}
            weekday={date?.getDay() ?? 1}
            label={`${label} stops`}
            renderHandle={(stop, stamp, info) => (
              <DraggableHandle
                id={`stop-${stop.id}`}
                data={{ type: "stop", stopId: stop.id, from: day, title: info.title }}
                label={`Drag ${info.title} to another day`}
                className="relative"
              >
                {stamp}
              </DraggableHandle>
            )}
            renderActions={(stop, i, info) => (
              <>
                <button type="button" className={iconBtn} disabled={i === 0} onClick={() => nudge(day, i, -1)} aria-label={`Move ${info.title} earlier`}>
                  <ArrowUp className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={iconBtn}
                  disabled={i === stops.length - 1}
                  onClick={() => nudge(day, i, 1)}
                  aria-label={`Move ${info.title} later`}
                >
                  <ArrowDown className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={iconBtn}
                  onClick={() => onPick({ title: info.title, current: day, onPick: (d) => moveStop(stop.id, d, info.title) })}
                  aria-label={`Move ${info.title} to another day`}
                >
                  <ArrowRightLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={`${iconBtn} ml-auto text-terracotta hover:bg-terracotta/10`}
                  onClick={() => removeStop(day, stop.id, info.title)}
                  aria-label={`Remove ${info.title} from Day ${day + 1}`}
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </>
            )}
          />
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-sand bg-ivory/60 px-4 py-6 text-center">
            <StopStamp n="+" color="#E8A33D" />
            <p className="text-muted">{dragging ? "Drop it here" : "Nothing yet. Drag something from your thela, or let us suggest a day."}</p>
            <Button variant="leaf" size="sm" onClick={() => onPlanForMe(day)}>
              <Wand2 className="h-4 w-4" aria-hidden="true" />
              Plan my day for me
            </Button>
          </div>
        )}
      </div>

      {stops.length > 0 && !date && (
        <p className="mt-3 text-xs text-muted">Times assume a weekday. Add trip dates for exact opening-day checks.</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2 border-t border-dashed border-sand pt-3">
        {stops.length > 1 && (
          <Button variant="secondary" size="sm" onClick={smart}>
            <ListOrdered className="h-4 w-4" aria-hidden="true" />
            Smart order
          </Button>
        )}
        {stops.length > 0 && (
          <Button variant="secondary" size="sm" onClick={() => onShare(day)}>
            <Share2 className="h-4 w-4" aria-hidden="true" />
            Share this day
          </Button>
        )}
        {stops.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => onPlanForMe(day)}>
            <Wand2 className="h-4 w-4" aria-hidden="true" />
            Re-plan
          </Button>
        )}
        <Button variant="ghost" size="sm" className="ml-auto text-terracotta!" onClick={removeDay} aria-label={`Remove Day ${day + 1}`}>
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Remove day
        </Button>
      </div>

      <div className="mt-3">
        <JournalNote trip={trip} day={day} />
      </div>
    </section>
  );
}

// ---------- Page ----------

function PlanSkeleton() {
  return (
    <div className="mt-6 space-y-4" aria-busy="true" aria-label="Loading your plan">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-36 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export function PlanClient() {
  const hydrated = useStore((s) => s.hydrated);
  const t = useT();
  return (
    <div className="container-k pt-6">
      <SectionHeader as="h1" title="Plan your days" hi="योजना" sub={t("common.privateTrip")} color="#2E7D5B" />
      <p className="-mt-2 mb-5 max-w-2xl text-[17px] leading-relaxed text-ink/85">
        Drag what you&apos;ve saved into Day 1, Day 2 and so on. Smart order sorts each day by area so you don&apos;t zig-zag across
        Jaipur, and every stop gets a suggested time, with a nudge if it&apos;s closed then.
      </p>
      {hydrated ? <Planner /> : <PlanSkeleton />}
    </div>
  );
}

function Planner() {
  const trip = useActiveTrip();
  const [picker, setPicker] = useState<PickerTarget | null>(null);
  const [shareDay, setShareDay] = useState<number | null>(null);
  const [planFor, setPlanFor] = useState<number | null>(null);
  const [editTrip, setEditTrip] = useState(false);
  const [dragging, setDragging] = useState<DragData | null>(null);
  const closePicker = useCallback(() => setPicker(null), []);
  const closeShare = useCallback(() => setShareDay(null), []);
  const closePlanFor = useCallback(() => setPlanFor(null), []);
  const closeEdit = useCallback(() => setEditTrip(false), []);

  const isDesktop = useIsDesktop();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { delay: 150, tolerance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const dayLabel = (id: string | number | undefined) => (typeof id === "string" && id.startsWith("day-") ? `Day ${Number(id.slice(4)) + 1}` : "");
  const titleOf = (d: unknown) => (d as DragData | undefined)?.title ?? "item";
  const announcements: Announcements = {
    onDragStart: ({ active }) => `Picked up ${titleOf(active.data.current)}. Use the arrow keys to move over a day, then Space to drop.`,
    onDragOver: ({ active, over }) =>
      over ? `${titleOf(active.data.current)} is over ${dayLabel(over.id)}.` : `${titleOf(active.data.current)} is not over a day.`,
    onDragEnd: ({ active, over }) =>
      over ? `${titleOf(active.data.current)} dropped on ${dayLabel(over.id)}.` : `${titleOf(active.data.current)} was not moved.`,
    onDragCancel: ({ active }) => `Cancelled. ${titleOf(active.data.current)} was not moved.`,
  };

  const onDragStart = (e: DragStartEvent) => setDragging((e.active.data.current as DragData) ?? null);
  const onDragEnd = (e: DragEndEvent) => {
    setDragging(null);
    const data = e.active.data.current as DragData | undefined;
    const over = e.over?.id;
    if (!data || typeof over !== "string" || !over.startsWith("day-")) return;
    const day = Number(over.slice(4));
    if (data.type === "tray") addFromTray(data.ref, day, data.title);
    else if (data.from !== day) moveStop(data.stopId, day, data.title);
  };

  const copyLink = async () => {
    const ok = await copyText(planLink(trip));
    useStore.getState().showToast({
      message: ok ? "Link copied. Friends can view it (not edit) and copy it to their trips." : "Couldn't copy. Try again?",
    });
  };

  const addDay = () => {
    useStore.getState().addDay();
    useStore.getState().showToast({ message: `Added Day ${trip.days.length + 1}` });
  };

  const firstEmpty = Math.max(0, trip.days.findIndex((d) => !d.length));

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={() => setDragging(null)}
      accessibility={{ announcements, screenReaderInstructions: { draggable: "Press Space to pick up. Use arrow keys to move over a day. Press Space again to drop, or Escape to cancel." } }}
    >
      <div className="space-y-4">
        <TripSwitcher label="Planning for" />
        <Countdown trip={trip} onAddDates={() => setEditTrip(true)} />
        <div className="flex flex-wrap gap-2">
          <Button variant="leaf" onClick={() => setPlanFor(firstEmpty)}>
            <Wand2 className="h-5 w-5" aria-hidden="true" />
            Plan my day for me
          </Button>
          <Button variant="secondary" onClick={copyLink}>
            <Link2 className="h-5 w-5" aria-hidden="true" />
            Copy link
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="order-2 space-y-5 lg:order-1">
          {trip.days.map((_, i) => (
            <DayCard key={i} trip={trip} day={i} onPick={setPicker} onShare={setShareDay} onPlanForMe={setPlanFor} />
          ))}
          <button
            type="button"
            onClick={addDay}
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-indigo/30 font-semibold text-indigo hover:border-marigold hover:bg-white"
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
            Add a day
          </button>
          <RangoliDivider className="mx-auto" />
        </div>
        <aside className="order-1 space-y-5 lg:sticky lg:top-20 lg:order-2" aria-label="Your saved items and checklist">
          <Tray trip={trip} onPick={setPicker} />
          {isDesktop && <Checklist />}
        </aside>
      </div>
      {!isDesktop && (
        <div className="mt-6">
          <Checklist />
        </div>
      )}
      <div className="mt-6 flex flex-wrap gap-2">
        <ButtonLink href="/memories" variant="marigold">
          Your yaadein (memories)
        </ButtonLink>
        <ButtonLink href="/getting-around" variant="ghost">
          Getting around Jaipur
        </ButtonLink>
      </div>

      <DragOverlay dropAnimation={null}>
        {dragging && (
          <div className="flex items-center gap-2 rounded-full bg-indigo px-4 py-2 font-semibold text-ivory shadow-xl">
            <GripVertical className="h-4 w-4" aria-hidden="true" />
            {dragging.title}
          </div>
        )}
      </DragOverlay>

      {picker && <DayPickerSheet trip={trip} target={picker} onClose={closePicker} />}
      {shareDay !== null && <ShareDaySheet trip={trip} day={shareDay} onClose={closeShare} />}
      {planFor !== null && <PlanMyDaySheet open onClose={closePlanFor} trip={trip} initialDay={planFor} />}
      {editTrip && <TripFormSheet open onClose={closeEdit} trip={trip} />}
    </DndContext>
  );
}
