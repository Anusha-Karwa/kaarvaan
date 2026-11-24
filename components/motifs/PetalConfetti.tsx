"use client";

import { useEffect, useMemo, useState } from "react";
import { m } from "framer-motion";
import { useStore } from "@/lib/store";
import { useMotionOK } from "@/lib/motion";

const COLORS = ["#E8A33D", "#C2185B", "#F2C14E", "#E8A33D", "#B5462F"];

function Burst({ seed }: { seed: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => {
        const r = (n: number) => {
          const x = Math.sin(seed * 999 + i * 77.7 + n * 13.1) * 10000;
          return x - Math.floor(x);
        };
        return {
          left: r(1) * 100,
          delay: r(2) * 0.35,
          rot: r(3) * 720 - 360,
          drift: (r(4) - 0.5) * 140,
          size: 9 + r(5) * 9,
          color: COLORS[i % COLORS.length],
        };
      }),
    [seed],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-[80] overflow-hidden" aria-hidden="true">
      {petals.map((p, i) => (
        <m.svg
          key={i}
          width={p.size}
          height={p.size * 1.6}
          viewBox="0 0 10 16"
          className="absolute -top-6"
          style={{ left: `${p.left}%` }}
          initial={{ y: -20, x: 0, rotate: 0, opacity: 1 }}
          animate={{ y: "105vh", x: p.drift, rotate: p.rot, opacity: [1, 1, 0.7] }}
          transition={{ duration: 1.5, delay: p.delay, ease: [0.25, 0.4, 0.55, 1] }}
        >
          <ellipse cx="5" cy="8" rx="4.4" ry="7.6" fill={p.color} />
          <path d="M5 2 L5 14" stroke="#fff" strokeOpacity="0.35" strokeWidth="0.8" />
        </m.svg>
      ))}
    </div>
  );
}

/** Listens to the store and drops ~30 petals for 1.5s whenever celebrate() is called. */
export function PetalConfetti() {
  const key = useStore((s) => s.confettiKey);
  const ok = useMotionOK();
  const [doneKey, setDoneKey] = useState(0);
  useEffect(() => {
    if (!key) return;
    const t = setTimeout(() => setDoneKey(key), 2100);
    return () => clearTimeout(t);
  }, [key]);
  return key && ok && doneKey !== key ? <Burst key={key} seed={key} /> : null;
}
