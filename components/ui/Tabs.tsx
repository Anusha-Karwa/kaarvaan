"use client";

import { m } from "framer-motion";
import { useId, useRef, type KeyboardEvent } from "react";

export interface TabDef {
  id: string;
  label: string;
  hi?: string;
}

/** Tabs with a sliding marigold wave underline. Keyboard: arrows/Home/End. */
export function Tabs({ tabs, value, onChange, label }: { tabs: TabDef[]; value: string; onChange: (id: string) => void; label: string }) {
  const layout = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent, i: number) => {
    let n = i;
    if (e.key === "ArrowRight") n = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = tabs.length - 1;
    else return;
    e.preventDefault();
    onChange(tabs[n].id);
    refs.current[n]?.focus();
  };
  return (
    <div role="tablist" aria-label={label} className="flex gap-1 border-b border-sand">
      {tabs.map((t, i) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={active}
            aria-controls={`panel-${t.id}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={`relative min-h-12 flex-1 px-3 pb-3 pt-2 text-base font-semibold transition-colors sm:flex-none sm:px-6 ${
              active ? "text-indigo" : "text-muted hover:text-indigo"
            }`}
          >
            {t.label}
            {t.hi && (
              <span lang="hi" className="deva ml-1.5 hidden text-sm font-normal sm:inline">
                {t.hi}
              </span>
            )}
            {active && (
              <m.svg
                layoutId={`wave-${layout}`}
                className="absolute inset-x-2 -bottom-1 h-2.5"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
                aria-hidden="true"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              >
                <path d="M0 5 Q 6.25 0 12.5 5 T 25 5 T 37.5 5 T 50 5 T 62.5 5 T 75 5 T 87.5 5 T 100 5" fill="none" stroke="#E8A33D" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
              </m.svg>
            )}
          </button>
        );
      })}
    </div>
  );
}
