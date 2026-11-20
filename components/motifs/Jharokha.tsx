interface Props {
  /** Height of the arch part as a fraction of the total height (0–1). */
  rise?: number;
  /** Height / width. */
  aspect?: number;
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
  dotted?: boolean;
  finial?: boolean;
  className?: string;
}

/** Ogee pointed-arch path in a 100×H box. */
export function archPath(w: number, h: number, rise: number, inset = 0): string {
  const x0 = inset;
  const x1 = w - inset;
  const top = inset;
  const shoulder = top + rise;
  const mid = w / 2;
  const span = x1 - x0;
  return [
    `M${x0},${h - inset}`,
    `L${x0},${shoulder}`,
    `C${x0},${shoulder - rise * 0.55} ${mid - span * 0.12},${top + rise * 0.5} ${mid},${top}`,
    `C${mid + span * 0.12},${top + rise * 0.5} ${x1},${shoulder - rise * 0.55} ${x1},${shoulder}`,
    `L${x1},${h - inset}`,
    "Z",
  ].join(" ");
}

/** Rajasthani jharokha arch frame with a dotted inner outline. Fills its parent (absolute). */
export function Jharokha({
  rise = 0.32,
  aspect = 1.3,
  stroke = "#1F2A5C",
  fill = "none",
  strokeWidth = 2,
  dotted = true,
  finial = true,
  className = "",
}: Props) {
  const w = 100;
  const h = 100 * aspect;
  const r = h * rise;
  return (
    <svg
      viewBox={`-2 -8 ${w + 4} ${h + 10}`}
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 h-full w-full overflow-visible ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <path d={archPath(w, h, r)} fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
      {dotted && (
        <path
          d={archPath(w, h, r - 4, 4)}
          fill="none"
          stroke="#E8A33D"
          strokeWidth={2}
          strokeDasharray="0.1 6"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      )}
      {finial && (
        <g>
          <circle cx={w / 2} cy={-3.5} r={2.6} fill="#E8A33D" stroke={stroke} strokeWidth={1} vectorEffect="non-scaling-stroke" />
        </g>
      )}
    </svg>
  );
}

/** Fixed-height arch top used by ArchCard. Width stretches; stroke stays crisp. */
export function ArchTop({ className = "", stroke = "currentColor", fill = "#fff", height = 44 }: { className?: string; stroke?: string; fill?: string; height?: number }) {
  return (
    <svg
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      className={`block w-full ${className}`}
      style={{ height }}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M0.5,40 L0.5,30 C0.5,18 38,20 50,0.8 C62,20 99.5,18 99.5,30 L99.5,40"
        fill={fill}
        stroke={stroke}
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M5,40 L5,31 C5,22 40,23 50,7 C60,23 95,22 95,31 L95,40"
        fill="none"
        stroke="#E8A33D"
        strokeWidth={1.6}
        strokeDasharray="0.1 5"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/**
 * Scalable clip-path matching <Jharokha aspect rise>. Render once, then use style={{ clipPath: `url(#${id})` }}
 * on an element that fills the same box as the Jharokha.
 */
export function ArchClip({ id, aspect = 1.3, rise = 0.32 }: { id: string; aspect?: number; rise?: number }) {
  const h = 100 * aspect;
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={id} clipPathUnits="objectBoundingBox">
          <path transform={`scale(${1 / 104} ${1 / (h + 10)}) translate(2 8)`} d={archPath(100, h, h * rise)} />
        </clipPath>
      </defs>
    </svg>
  );
}
