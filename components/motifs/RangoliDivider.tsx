/** Small symmetric dotted rangoli between sections. */
export function RangoliDivider({ className = "" }: { className?: string }) {
  const side = (dir: 1 | -1) =>
    [6, 16, 25, 33, 40].map((d, i) => (
      <circle key={`${dir}-${i}`} cx={70 + dir * (16 + d)} cy="14" r={2.8 - i * 0.45} fill={i % 2 ? "#C2185B" : "#E8A33D"} />
    ));
  return (
    <div className={`flex justify-center py-6 ${className}`} aria-hidden="true">
      <svg width="140" height="28" viewBox="0 0 140 28" focusable="false">
        {side(1)}
        {side(-1)}
        <path d="M70 1 L83 14 L70 27 L57 14 Z" fill="none" stroke="#1F2A5C" strokeWidth="1.2" strokeDasharray="2 2" />
        {Array.from({ length: 8 }, (_, i) => (
          <ellipse key={i} cx="70" cy="9" rx="1.8" ry="3.6" fill="#E8A33D" transform={`rotate(${i * 45} 70 14)`} />
        ))}
        <circle cx="70" cy="14" r="2.2" fill="#C2185B" />
      </svg>
    </div>
  );
}
