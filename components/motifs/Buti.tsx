interface ButiProps {
  size?: number;
  color?: string;
  center?: string;
  petals?: number;
  className?: string;
  rotate?: number;
}

/** 8-petal block-print flower. Decorative. */
export function Buti({ size = 24, color = "#E8A33D", center = "#C2185B", petals = 8, className, rotate = 0 }: ButiProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <g transform={`rotate(${rotate} 12 12)`}>
        {Array.from({ length: petals }, (_, i) => (
          <ellipse key={i} cx="12" cy="6" rx="2.4" ry="4.6" fill={color} transform={`rotate(${(360 / petals) * i} 12 12)`} />
        ))}
      </g>
      <circle cx="12" cy="12" r="2.8" fill={center} />
      <circle cx="12" cy="12" r="1" fill="#FBF6EC" />
    </svg>
  );
}
