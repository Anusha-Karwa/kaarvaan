"use client";

import { m } from "framer-motion";
import { gaugeAngle, priceVerdict, VERDICT_COPY } from "@/lib/price";
import { useMotionOK } from "@/lib/motion";

/** Semicircle gauge with a marigold needle: Fair / A bit high / Too high. */
export function PriceGauge({ quoted, min, max }: { quoted: number; min: number; max: number }) {
  const ok = useMotionOK();
  const angle = gaugeAngle(quoted, max);
  const verdict = priceVerdict(quoted, min, max);
  const arc = (from: number, to: number) => {
    const r = 80;
    const p = (deg: number) => {
      const a = ((deg - 90) * Math.PI) / 180;
      return `${100 + r * Math.cos(a)},${100 + r * Math.sin(a)}`;
    };
    return `M${p(from)} A${r},${r} 0 0 1 ${p(to)}`;
  };
  // Fair until max (angle 0), a bit high until 1.5×max (45°), too high after
  return (
    <figure className="flex flex-col items-center">
      <svg viewBox="0 0 200 120" className="w-full max-w-xs" role="img" aria-label={`Verdict: ${VERDICT_COPY[verdict].title}`}>
        <path d={arc(-90, 0)} stroke="#2E7D5B" strokeWidth="18" fill="none" />
        <path d={arc(0, 45)} stroke="#F2C14E" strokeWidth="18" fill="none" />
        <path d={arc(45, 90)} stroke="#B5462F" strokeWidth="18" fill="none" />
        <path d="M20 100 A80 80 0 0 1 180 100" stroke="#1F2A5C" strokeWidth="2" fill="none" strokeDasharray="0.1 6" strokeLinecap="round" transform="translate(0 0)" />
        <text x="34" y="116" fontSize="10" fill="#2E7D5B" fontWeight="700">Fair</text>
        <text x="100" y="12" fontSize="10" fill="#8a5a12" fontWeight="700" textAnchor="middle">A bit high</text>
        <text x="166" y="116" fontSize="10" fill="#B5462F" fontWeight="700" textAnchor="end">Too high</text>
        <m.g
          initial={ok ? { rotate: -90 } : false}
          animate={{ rotate: angle }}
          transition={ok ? { type: "spring", stiffness: 60, damping: 9 } : { duration: 0 }}
          style={{ originX: "100px", originY: "100px", transformBox: "view-box" }}
        >
          <path d="M100 100 L96 96 L100 30 L104 96 Z" fill="#E8A33D" stroke="#1F2A5C" strokeWidth="1.5" strokeLinejoin="round" />
        </m.g>
        <circle cx="100" cy="100" r="9" fill="#1F2A5C" />
        <circle cx="100" cy="100" r="3.5" fill="#E8A33D" />
      </svg>
      <figcaption className="sr-only">{VERDICT_COPY[verdict].body}</figcaption>
    </figure>
  );
}
