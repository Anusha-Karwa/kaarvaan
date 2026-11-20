import type { ReactNode } from "react";

type Tone = "haldi" | "sand" | "leaf" | "rani" | "indigo" | "marigold" | "terracotta" | "muted";

const tones: Record<Tone, string> = {
  haldi: "bg-haldi/90 text-ink",
  sand: "bg-sand text-ink",
  leaf: "bg-leaf/12 text-leaf-dark ring-1 ring-leaf/30",
  rani: "bg-rani/10 text-rani-dark ring-1 ring-rani/25",
  indigo: "bg-indigo text-ivory",
  marigold: "bg-marigold/20 text-marigold-ink ring-1 ring-marigold/40",
  terracotta: "bg-terracotta/10 text-terracotta ring-1 ring-terracotta/30",
  muted: "bg-ink/5 text-muted",
};

export function Chip({ children, tone = "sand", className = "" }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-semibold leading-6 ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}

/** Toggleable filter chip */
export function ChipButton({
  children,
  active,
  onClick,
  className = "",
  color = "#C2185B",
}: {
  children: ReactNode;
  active: boolean;
  onClick: () => void;
  className?: string;
  color?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 px-4 text-sm font-semibold transition-colors ${
        active ? "text-white" : "border-sand bg-white text-ink hover:border-marigold"
      } ${className}`}
      style={active ? { background: color, borderColor: color } : undefined}
    >
      {children}
    </button>
  );
}

export function OpenChip({ open, label }: { open: boolean; label?: string }) {
  return (
    <Chip tone={open ? "leaf" : "muted"}>
      <span className={`h-2 w-2 rounded-full ${open ? "bg-leaf" : "bg-muted"}`} aria-hidden="true" />
      {label ?? (open ? "Open now" : "Closed now")}
    </Chip>
  );
}

/** Indian veg / non-veg mark: green or red square with a dot. */
export function VegMark({ veg, className = "" }: { veg: boolean; className?: string }) {
  const c = veg ? "#2E7D5B" : "#B5462F";
  return (
    <span role="img" aria-label={veg ? "Vegetarian" : "Non-vegetarian"} className={`inline-flex ${className}`}>
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <rect x="1" y="1" width="14" height="14" fill="#fff" stroke={c} strokeWidth="1.6" rx="1.5" />
        {veg ? <circle cx="8" cy="8" r="3.6" fill={c} /> : <path d="M8 4 L12 11.5 H4 Z" fill={c} />}
      </svg>
    </span>
  );
}

export function Chillies({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span role="img" aria-label={`Spice level ${level} of 3`} className="inline-flex gap-0.5">
      {[1, 2, 3].map((i) => (
        <svg key={i} width="14" height="16" viewBox="0 0 14 16" aria-hidden="true">
          <path d="M7 3 C11 5 12 10 4 15 C7 10 5 6 7 3 Z" fill={i <= level ? "#B5462F" : "#EFE3CF"} />
          <path d="M7 3 C7 1.5 8 1 9.5 1" stroke={i <= level ? "#2E7D5B" : "#d9cbb3"} strokeWidth="1.4" fill="none" />
        </svg>
      ))}
    </span>
  );
}
