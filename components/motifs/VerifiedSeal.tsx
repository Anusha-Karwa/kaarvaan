import { useId } from "react";

interface Props {
  date?: string; // human text, e.g. "Oct 2026"
  size?: number;
  className?: string;
  label?: string;
}

/** Round rubber-stamp badge with a slightly rough edge. */
export function VerifiedSeal({ date = "2026", size = 76, className = "", label = "Visited by Kaarvaan" }: Props) {
  const id = useId().replace(/:/g, "");
  // Small seals are too small for legible circular text: show ring + check only.
  // Larger seals use short text sized to render at ~12px or more.
  const showText = size >= 90;
  const text = `VISITED · ${date} · `;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`-rotate-12 ${className}`}
      role="img"
      aria-label={`${label}, ${date}`}
    >
      <defs>
        <filter id={`rough-${id}`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="1.8" />
        </filter>
        <path id={`c-${id}`} d="M50,50 m-33,0 a33,33 0 1,1 66,0 a33,33 0 1,1 -66,0" />
      </defs>
      <g filter={`url(#rough-${id})`}>
        <circle cx="50" cy="50" r="47" fill="none" stroke="#E8A33D" strokeWidth="3" />
        <circle cx="50" cy="50" r="42" fill="#2E7D5B" />
        <circle cx="50" cy="50" r="24" fill="none" stroke="#FBF6EC" strokeWidth="1.2" strokeDasharray="2 2.5" />
        {showText ? (
          <text fontSize={1200 / size} fontWeight="700" letterSpacing="0.4" fill="#FBF6EC" fontFamily="var(--font-mukta), sans-serif" aria-hidden="true">
            <textPath href={`#c-${id}`} textLength="205" lengthAdjust="spacingAndGlyphs">
              {text.toUpperCase()}
            </textPath>
          </text>
        ) : (
          <circle cx="50" cy="50" r="34" fill="none" stroke="#F2C14E" strokeWidth="1.4" strokeDasharray="0.1 4.5" strokeLinecap="round" />
        )}
        <path d="M38 51 L47 60 L63 41" fill="none" stroke="#F2C14E" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
