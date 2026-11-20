"use client";

import { useState, type ReactNode } from "react";
import { RotateCw } from "lucide-react";

/** Tap/click/Enter to flip. Front = real, back = copy (or anything). */
export function FlipCard({ front, back, label, className = "" }: { front: ReactNode; back: ReactNode; label: string; className?: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      className={`group relative block text-left [perspective:1000px] ${flipped ? "is-flipped" : ""} ${className}`}
    >
      <div className="flip-inner relative h-full min-h-[inherit] w-full">
        <div className="flip-face absolute inset-0" aria-hidden={flipped}>{front}</div>
        <div className="flip-face flip-back absolute inset-0" aria-hidden={!flipped}>{back}</div>
      </div>
      <span className="sr-only">{`${label}: ${flipped ? "copy side" : "real side"}. Flip card.`}</span>
      <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-indigo shadow" aria-hidden="true">
        <RotateCw className="h-3 w-3" /> flip
      </span>
    </button>
  );
}
