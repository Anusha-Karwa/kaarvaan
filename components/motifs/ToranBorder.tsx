"use client";

import { useId } from "react";
import { m } from "framer-motion";
import { useMotionOK } from "@/lib/motion";

interface Props {
  className?: string;
  animate?: boolean;
  flip?: boolean;
  band?: string;
}

/** Block-print border band: indigo band, marigold butis, rani dots, scalloped edge. */
export function ToranBorder({ className = "", animate = false, flip = false, band = "#1F2A5C" }: Props) {
  const id = useId().replace(/:/g, "");
  const ok = useMotionOK();
  const svg = (
    <svg
      className="block h-[26px] w-full"
      style={flip ? { transform: "scaleY(-1)" } : undefined}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id={`toran-${id}`} width="40" height="26" patternUnits="userSpaceOnUse">
          <rect width="40" height="13" fill={band} />
          <path d="M0,12.5 A20,11 0 0 0 40,12.5 Z" fill={band} />
          <path d="M3,13 A17,8.5 0 0 0 37,13" fill="none" stroke="#E8A33D" strokeWidth="1" strokeDasharray="0.1 3" strokeLinecap="round" />
          <circle cx="20" cy="22" r="1.8" fill="#E8A33D" />
          <line x1="0" y1="1.8" x2="40" y2="1.8" stroke="#E8A33D" strokeWidth="1" strokeDasharray="0.1 2.6" strokeLinecap="round" />
          {Array.from({ length: 6 }, (_, i) => (
            <ellipse key={i} cx="20" cy="4.4" rx="1.3" ry="2.6" fill="#E8A33D" transform={`rotate(${i * 60} 20 7.4)`} />
          ))}
          <circle cx="20" cy="7.4" r="1.2" fill="#C2185B" />
          <circle cx="0" cy="7.4" r="1.6" fill="#C2185B" />
          <circle cx="40" cy="7.4" r="1.6" fill="#C2185B" />
        </pattern>
      </defs>
      <rect width="100%" height="26" fill={`url(#toran-${id})`} />
    </svg>
  );
  if (!animate || !ok) return <div className={className}>{svg}</div>;
  return (
    <m.div
      className={className}
      initial={{ clipPath: "inset(0 100% 0 0)" }}
      animate={{ clipPath: "inset(0 0% 0 0)" }}
      transition={{ duration: 0.9, ease: [0.3, 0.7, 0.2, 1] }}
    >
      {svg}
    </m.div>
  );
}
