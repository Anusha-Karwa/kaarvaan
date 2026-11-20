import { useId } from "react";

interface Props {
  color?: string;
  opacity?: number;
  className?: string;
  size?: number;
}

/** Grid of tiny dot-in-circle tie-dye marks. Place inside a `relative` parent. */
export function BandhaniDots({ color = "#F2C14E", opacity = 0.5, className = "", size = 18 }: Props) {
  const id = useId().replace(/:/g, "");
  const s = size;
  return (
    <svg className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <pattern id={`bd-${id}`} width={s} height={s} patternUnits="userSpaceOnUse">
          <circle cx={s / 4} cy={s / 4} r={s * 0.14} fill="none" stroke={color} strokeWidth="1" />
          <circle cx={s / 4} cy={s / 4} r={s * 0.05} fill={color} />
          <circle cx={(s * 3) / 4} cy={(s * 3) / 4} r={s * 0.14} fill="none" stroke={color} strokeWidth="1" />
          <circle cx={(s * 3) / 4} cy={(s * 3) / 4} r={s * 0.05} fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#bd-${id})`} opacity={opacity} />
    </svg>
  );
}
