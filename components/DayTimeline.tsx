"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, Clock, Send } from "lucide-react";
import type { ReactNode } from "react";
import { KIND_META, getArea, type ItemInfo } from "@/lib/data";
import { formatClock, hoursLabel } from "@/lib/geo";
import type { TimeWindow } from "@/lib/plan";
import { useMotionOK } from "@/lib/motion";
import type { ItemRef } from "@/lib/types";
import { KIND_ICON, windowsFor, withInfo } from "./plan/planUtils";

export interface TimelineStop extends ItemRef {
  id: string;
  status?: "requested";
}

interface Props<T extends TimelineStop> {
  stops: T[];
  /** 0 = Sunday. Used for the opening-hours check. */
  weekday?: number;
  /** Accessible name for the list, e.g. "Day 1 stops". */
  label: string;
  /** Extra controls under each stop (move / remove buttons). */
  renderActions?: (stop: T, index: number, info: ItemInfo) => ReactNode;
  /** Wrap the stamp (e.g. to turn it into a drag handle). */
  renderHandle?: (stop: T, stamp: ReactNode, info: ItemInfo) => ReactNode;
  animate?: boolean;
  compact?: boolean;
}

/** A single stop stamp: dotted marigold ring around a kind-coloured disc with the stop number. */
export function StopStamp({ n, color, size = 44 }: { n: number | string; color: string; size?: number }) {
  return (
    <span className="relative flex shrink-0 items-center justify-center" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 44 44" className="absolute inset-0 h-full w-full">
        <circle cx="22" cy="22" r="20" fill="#FBF6EC" stroke="#E8A33D" strokeWidth="2" strokeDasharray="0.1 4.6" strokeLinecap="round" />
        <circle cx="22" cy="22" r="15" fill={color} />
        <circle cx="22" cy="22" r="12.5" fill="none" stroke="#FBF6EC" strokeOpacity=".35" strokeWidth="1" strokeDasharray="1.5 2" />
      </svg>
      <span className="relative font-display text-base leading-none text-ivory">{n}</span>
    </span>
  );
}

function WindowLine({ w, info }: { w: TimeWindow; info: ItemInfo }) {
  return (
    <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink">
      <span className="inline-flex items-center gap-1 font-semibold tabular-nums">
        <Clock className="h-3.5 w-3.5 text-marigold-ink" aria-hidden="true" />
        {formatClock(w.start)} – {formatClock(w.end)}
      </span>
      {w.openAtStart === false && (
        <span
          className="inline-flex items-center gap-1 rounded-full bg-terracotta/10 px-2 text-xs font-bold leading-6 text-terracotta ring-1 ring-terracotta/30"
          title={info.hours ? `Hours: ${hoursLabel(info.hours)}` : undefined}
        >
          <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
          Open at that time?
          {info.hours && <span className="sr-only"> Hours are {hoursLabel(info.hours)}.</span>}
        </span>
      )}
    </span>
  );
}

/**
 * A day as a vertical route: dashed indigo/marigold rail, stamp stops,
 * suggested time windows and an opening-hours warning.
 */
export function DayTimeline<T extends TimelineStop>({ stops, weekday = 1, label, renderActions, renderHandle, animate = true, compact = false }: Props<T>) {
  const ok = useMotionOK() && animate;
  const joined = withInfo(stops);
  const wins = windowsFor(
    joined.map((j) => j.info),
    weekday,
  );
  if (!joined.length) return null;

  return (
    <div className="relative">
      {/* Rail */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-6 left-[20.5px] top-6 w-[3px] origin-top rounded-full"
        style={{
          background:
            "repeating-linear-gradient(to bottom, #1F2A5C 0 9px, transparent 9px 14px, #E8A33D 14px 20px, transparent 20px 25px)",
        }}
        initial={ok ? { scaleY: 0 } : false}
        animate={{ scaleY: 1 }}
        transition={{ duration: Math.min(1.6, 0.3 * joined.length), ease: "easeInOut" }}
      />
      <ol aria-label={label} className={`relative flex flex-col ${compact ? "gap-3" : "gap-4"}`}>
        {joined.map(({ stop, info }, i) => {
          const meta = KIND_META[stop.kind];
          const Icon = KIND_ICON[stop.kind];
          const w = wins[i];
          const stamp = <StopStamp n={i + 1} color={meta.color} />;
          return (
            <motion.li
              key={stop.id}
              layout={ok ? "position" : false}
              className="relative flex gap-3"
              initial={ok ? { opacity: 0, y: 8 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ok ? Math.min(i * 0.08, 0.6) : 0, duration: 0.3 }}
            >
              <div className="pt-1">{renderHandle ? renderHandle(stop, stamp, info) : stamp}</div>
              <div className="min-w-0 flex-1 rounded-2xl border border-sand bg-white px-3.5 py-2.5 shadow-[0_2px_8px_rgba(31,42,92,0.06)]">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link href={info.href} className="font-semibold leading-snug text-indigo hover:text-rani hover:underline hover:decoration-wavy hover:decoration-marigold">
                      {info.title}
                    </Link>
                    <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                      <span className={`inline-flex items-center gap-1 font-bold ${meta.text}`}>
                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        {meta.label}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{getArea(info.area)?.name ?? info.area}</span>
                      {stop.status === "requested" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-haldi/90 px-2 font-bold leading-5 text-ink">
                          <Send className="h-3 w-3" aria-hidden="true" />
                          Requested
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                <div className="mt-1.5">
                  <WindowLine w={w} info={info} />
                </div>
                {renderActions && <div className="mt-2 flex flex-wrap items-center gap-1">{renderActions(stop, i, info)}</div>}
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
