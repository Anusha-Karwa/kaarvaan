"use client";

import type { Hours } from "@/lib/types";
import { openStatus } from "@/lib/geo";
import { useNow } from "@/lib/useNow";
import { OpenChip } from "@/components/ui/Chip";

/** Live "Open now · closes 5:30 pm" chip. Renders a quiet placeholder until the clock is known (no hydration mismatch). */
export function LiveOpen({ hours, className = "" }: { hours: Hours; className?: string }) {
  const now = useNow();
  if (!now) return <span className={`skeleton inline-block h-7 w-36 rounded-full ${className}`} aria-hidden="true" />;
  const s = openStatus(hours, now);
  return (
    <span className={className} aria-live="polite">
      <OpenChip open={s.open} label={s.label} />
    </span>
  );
}
