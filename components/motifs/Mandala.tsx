interface Props {
  size?: number;
  className?: string;
  color?: string;
  accent?: string;
  spin?: boolean;
}

/** Concentric petal and dot rings. Rotates slowly (60s) unless reduced motion is on. */
export function Mandala({ size = 200, className = "", color = "#E8A33D", accent = "#C2185B", spin = true }: Props) {
  const ring = (n: number, r: number, rx: number, ry: number, fill: string, offset = 0) =>
    Array.from({ length: n }, (_, i) => (
      <ellipse key={`${r}-${i}`} cx="100" cy={100 - r} rx={rx} ry={ry} fill={fill} transform={`rotate(${(360 / n) * i + offset} 100 100)`} />
    ));
  const dots = (n: number, r: number, rad: number, fill: string) =>
    Array.from({ length: n }, (_, i) => {
      const a = ((Math.PI * 2) / n) * i;
      return <circle key={`d${r}-${i}`} cx={100 + r * Math.sin(a)} cy={100 - r * Math.cos(a)} r={rad} fill={fill} />;
    });
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={`${spin ? "animate-spin-slow" : ""} ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="100" cy="100" r="96" fill="none" stroke={color} strokeWidth="1" strokeDasharray="1 5" strokeLinecap="round" />
      {dots(36, 90, 2, accent)}
      {ring(24, 74, 5, 12, color)}
      <circle cx="100" cy="100" r="60" fill="none" stroke={color} strokeWidth="1.5" />
      {dots(24, 54, 1.8, color)}
      {ring(12, 38, 7, 13, accent, 15)}
      {ring(12, 38, 3, 7, color, 15)}
      <circle cx="100" cy="100" r="22" fill="none" stroke={color} strokeWidth="1" strokeDasharray="2 3" />
      {ring(8, 12, 4, 8, color)}
      <circle cx="100" cy="100" r="5" fill={accent} />
    </svg>
  );
}
