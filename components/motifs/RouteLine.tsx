"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useMotionOK } from "@/lib/motion";

export interface RouteStop {
  label: string;
  sub?: string;
  href?: string;
  icon?: LucideIcon;
  color?: string;
}

interface Props {
  stops: RouteStop[];
  orientation?: "horizontal" | "vertical";
  /** For multi-step flows: index of the current step. Stops before it are "done". */
  active?: number;
  animate?: boolean;
  className?: string;
  compact?: boolean;
  ariaLabel?: string;
}

/** Dashed hand-drawn path with stops (circles with dotted marigold rings). Draws itself. */
export function RouteLine({ stops, orientation = "horizontal", active, animate = true, className = "", compact = false, ariaLabel }: Props) {
  const ok = useMotionOK() && animate;
  const n = stops.length;
  const seg = 100;
  const vertical = orientation === "vertical";
  const len = (n - 1) * seg;
  // Wobbly path through stop centres
  let d = vertical ? `M20,${seg / 2}` : `M${seg / 2},20`;
  for (let i = 1; i < n; i++) {
    const a = seg / 2 + (i - 1) * seg;
    const b = seg / 2 + i * seg;
    const wob = i % 2 ? 14 : -14;
    d += vertical ? ` C${20 + wob},${a + 35} ${20 - wob},${b - 35} 20,${b}` : ` C${a + 35},${20 + wob} ${b - 35},${20 - wob} ${b},20`;
  }
  const dur = 0.35 * n;
  const renderItem = (s: RouteStop, i: number) => {
    const done = active !== undefined && i < active;
    const current = active !== undefined && i === active;
    const Icon = s.icon;
    const body = (
      <>
        <motion.span
          className="relative flex h-10 w-10 items-center justify-center"
          initial={ok ? { scale: 0 } : false}
          whileInView={ok ? { scale: [0, 1.2, 1] } : undefined}
          viewport={{ once: true }}
          transition={{ delay: n > 1 ? (dur * i) / (n - 1) : 0, duration: 0.35 }}
        >
          <svg viewBox="0 0 40 40" className="absolute inset-0" aria-hidden="true">
            <circle cx="20" cy="20" r="18" fill="none" stroke="#E8A33D" strokeWidth="2" strokeDasharray="0.1 4.4" strokeLinecap="round" />
            <circle cx="20" cy="20" r="13" fill={current ? "#C2185B" : done ? "#2E7D5B" : s.color ?? "#1F2A5C"} />
          </svg>
          {Icon ? (
            <Icon className="relative h-4 w-4 text-ivory" strokeWidth={2.4} aria-hidden="true" />
          ) : (
            <span className="relative text-xs font-bold text-ivory">{i + 1}</span>
          )}
        </motion.span>
        <span className={vertical ? "ml-3 min-w-0" : "mt-1 block text-center"}>
          <span className={`block font-semibold leading-tight text-indigo ${compact ? "text-xs" : "text-sm"}`}>{s.label}</span>
          {s.sub && <span className="block text-xs leading-snug text-muted">{s.sub}</span>}
        </span>
      </>
    );
    const cls = vertical ? "flex items-center" : "flex flex-col items-center";
    return s.href ? (
      <Link href={s.href} className={`${cls} rounded-xl hover:opacity-90`}>
        {body}
      </Link>
    ) : (
      <div className={cls} aria-current={current ? "step" : undefined}>
        {body}
      </div>
    );
  };

  return (
    <nav aria-label={ariaLabel} className={`relative ${className}`}>
      <svg
        className="pointer-events-none absolute"
        style={
          vertical
            ? { left: 0, top: 0, width: 40, height: "100%" }
            : { left: 0, top: 0, width: "100%", height: 40 }
        }
        viewBox={vertical ? `0 0 40 ${n * seg}` : `0 0 ${n * seg} 40`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <motion.path
          d={d}
          fill="none"
          stroke="#1F2A5C"
          strokeWidth="2.2"
          strokeDasharray="7 7"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={ok ? { pathLength: 0 } : false}
          whileInView={ok ? { pathLength: 1 } : undefined}
          viewport={{ once: true }}
          transition={{ duration: dur, ease: "easeInOut" }}
          style={{ opacity: len ? 0.55 : 0 }}
        />
      </svg>
      <ol className={vertical ? "relative flex flex-col" : "relative grid"} style={vertical ? undefined : { gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
        {stops.map((s, i) => (
          <li key={i} className={vertical ? "flex h-[var(--seg,4.5rem)] items-center" : ""}>
            {renderItem(s, i)}
          </li>
        ))}
      </ol>
    </nav>
  );
}
