/** Fixed paper-grain overlay at ~3% opacity. Pure CSS background, no layout impact. */
const NOISE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.17 0 0 0 0 0.13 0 0 0 0 0.2 0 0 0 1 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`,
  );

export function PaperGrain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] opacity-[0.035] mix-blend-multiply"
      style={{ backgroundImage: `url("${NOISE}")` }}
    />
  );
}
