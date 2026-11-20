import { useId, type ReactNode } from "react";

/** Kaarvaan block-print palette. Illustrations use only these colours. */
export const C = {
  indigo: "#1F2A5C",
  indigoDark: "#141B3D",
  rani: "#C2185B",
  marigold: "#E8A33D",
  leaf: "#2E7D5B",
  haldi: "#F2C14E",
  terracotta: "#B5462F",
  ivory: "#FBF6EC",
  sand: "#EFE3CF",
  blue: "#2F5DA8",
  blueLight: "#9DB8E3",
} as const;

export type IllustrationProps = { className?: string; title?: string };

type SvgProps = IllustrationProps & {
  viewBox?: string;
  preserveAspectRatio?: string;
  children: ReactNode;
};

/**
 * Shared <svg> shell: sets the viewBox, the accessible name (or hides it), and
 * the default 2px indigo outline with round joins inherited by every shape.
 * Size it with className (e.g. "w-full h-auto").
 */
export function Svg({ className, title, viewBox = "0 0 200 160", preserveAspectRatio, children }: SvgProps) {
  const titleId = `${useId()}-title`;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      className={className}
      role={title ? "img" : undefined}
      aria-labelledby={title ? titleId : undefined}
      aria-hidden={title ? undefined : true}
      focusable={title ? undefined : "false"}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <g fill="none" stroke={C.indigo} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round">
        {children}
      </g>
    </svg>
  );
}

/** Rows of tiny dots (block-print texture). Odd rows are staggered by half a step. */
export function Dots({
  x,
  y,
  cols,
  rows = 1,
  dx = 6,
  dy = 6,
  r = 1,
  fill = C.ivory,
  stagger = true,
  opacity,
}: {
  x: number;
  y: number;
  cols: number;
  rows?: number;
  dx?: number;
  dy?: number;
  r?: number;
  fill?: string;
  stagger?: boolean;
  opacity?: number;
}) {
  return (
    <g fill={fill} stroke="none" opacity={opacity}>
      {Array.from({ length: rows }, (_, j) =>
        Array.from({ length: cols }, (_, i) => (
          <circle key={`${i}-${j}`} cx={x + i * dx + (stagger && j % 2 ? dx / 2 : 0)} cy={y + j * dy} r={r} />
        )),
      )}
    </g>
  );
}

/** Bandhani tie-dye marks: little rings with a dot in the middle, in a staggered grid. */
export function BandhaniMarks({
  x,
  y,
  cols,
  rows,
  gap = 8,
  r = 2.4,
  color = C.ivory,
  accent = C.haldi,
}: {
  x: number;
  y: number;
  cols: number;
  rows: number;
  gap?: number;
  r?: number;
  color?: string;
  accent?: string;
}) {
  return (
    <g stroke="none">
      {Array.from({ length: rows }, (_, j) =>
        Array.from({ length: cols }, (_, i) => {
          const cx = x + i * gap + (j % 2 ? gap / 2 : 0);
          const cy = y + j * gap * 0.9;
          const special = (i + j * 2) % 5 === 0;
          return (
            <g key={`${i}-${j}`}>
              <circle cx={cx} cy={cy} r={r} fill="none" stroke={special ? accent : color} strokeWidth={1} />
              <circle cx={cx} cy={cy} r={r * 0.35} fill={special ? accent : color} />
            </g>
          );
        }),
      )}
    </g>
  );
}

/** A small block-print flower (buti): ellipse petals around a centre dot. */
export function Buti({
  cx,
  cy,
  r = 8,
  petals = 8,
  fill = C.rani,
  center = C.haldi,
  outline = true,
}: {
  cx: number;
  cy: number;
  r?: number;
  petals?: number;
  fill?: string;
  center?: string;
  outline?: boolean;
}) {
  return (
    <g stroke={outline ? C.indigo : "none"} strokeWidth={1.2}>
      {Array.from({ length: petals }, (_, i) => (
        <ellipse
          key={i}
          cx={cx}
          cy={cy - r * 0.55}
          rx={r * 0.28}
          ry={r * 0.5}
          fill={fill}
          transform={`rotate(${(360 / petals) * i} ${cx} ${cy})`}
        />
      ))}
      <circle cx={cx} cy={cy} r={r * 0.28} fill={center} />
    </g>
  );
}

/** A thick outlined stroke: indigo edge with a coloured core. Good for arms, ropes, straps. */
export function Limb({ d, color, w = 6 }: { d: string; color: string; w?: number }) {
  return (
    <g fill="none">
      <path d={d} stroke={C.indigo} strokeWidth={w + 4} />
      <path d={d} stroke={color} strokeWidth={w} />
    </g>
  );
}

/** Soft sand ground shadow. */
export function Shadow({ cx, cy, rx, ry = 6 }: { cx: number; cy: number; rx: number; ry?: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={C.sand} stroke="none" />;
}

/** A Rajasthani chhatri (domed kiosk). (x, y) is the centre of its base. */
export function Chhatri({
  x,
  y,
  s = 1,
  dome = C.haldi,
  body = C.ivory,
}: {
  x: number;
  y: number;
  s?: number;
  dome?: string;
  body?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-11} y={-3} width={22} height={3} fill={body} />
      <rect x={-8} y={-13} width={3} height={10} fill={body} />
      <rect x={5} y={-13} width={3} height={10} fill={body} />
      <rect x={-1.5} y={-13} width={3} height={10} fill={body} />
      <path d="M-13 -13 H13 L10 -17 H-10 Z" fill={body} />
      <path d="M-9 -17 C-9 -28 9 -28 9 -17 Z" fill={dome} />
      <path d="M0 -25 V-31" />
      <circle cx={0} cy={-32} r={1.5} fill={dome} />
    </g>
  );
}

/** Hand-drawn rupee sign as a path (no font needed). (x, y) is its top-left, size ~10x14 at s=1. */
export function Rupee({ x, y, s = 1, color = C.indigo, w = 2 }: { x: number; y: number; s?: number; color?: string; w?: number }) {
  return (
    <path
      d="M0 0 H10 M0 4 H10 M2 0 C8 0 8 8 2 8 L8 14"
      transform={`translate(${x} ${y}) scale(${s})`}
      stroke={color}
      strokeWidth={w / s}
      fill="none"
    />
  );
}
