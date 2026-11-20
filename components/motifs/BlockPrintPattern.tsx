import { useId } from "react";

interface Props {
  color?: string;
  opacity?: number;
  className?: string;
  scale?: number;
}

/** Tiled background of 6-petal butis and dots in staggered rows. Place inside a `relative` parent. */
export function BlockPrintPattern({ color = "#1F2A5C", opacity = 0.05, className = "", scale = 1 }: Props) {
  const id = useId().replace(/:/g, "");
  const petal = (cx: number, cy: number) =>
    Array.from({ length: 6 }, (_, i) => (
      <ellipse key={`${cx}-${i}`} cx={cx} cy={cy - 4} rx="1.7" ry="3.4" transform={`rotate(${i * 60} ${cx} ${cy})`} />
    ));
  return (
    <svg className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <pattern id={`bp-${id}`} width={48 * scale} height={48 * scale} patternUnits="userSpaceOnUse">
          <g fill={color} transform={`scale(${scale})`}>
            {petal(12, 12)}
            <circle cx="12" cy="12" r="1.4" />
            {petal(36, 36)}
            <circle cx="36" cy="36" r="1.4" />
            <circle cx="36" cy="12" r="1.6" />
            <circle cx="12" cy="36" r="1.6" />
            <circle cx="24" cy="24" r="0.9" />
            <circle cx="0" cy="24" r="0.9" />
            <circle cx="24" cy="0" r="0.9" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#bp-${id})`} opacity={opacity} />
    </svg>
  );
}
