"use client";

import Link from "next/link";
import { AnimatePresence, m } from "framer-motion";
import { useStore } from "@/lib/store";
import { useMotionOK } from "@/lib/motion";
import { Buti } from "@/components/motifs";

const ITEMS: { key: string; label: string; sub: string; link?: { href: string; label: string } }[] = [
  { key: "go-shoes", label: "Comfortable shoes", sub: "Bazaar lanes are long and fort ramps are steep. Slip-ons help at temples." },
  { key: "go-cash", label: "Cash for small shops", sub: "Carry ₹10–₹100 notes. Many stalls and autos don't take cards." },
  { key: "go-scarf", label: "A scarf for forts", sub: "Shade from the sun, and a cover for shoulders at temples." },
  { key: "go-water", label: "Water", sub: "The sun is strong even in winter. Refill at cafés." },
  { key: "go-phrases", label: "Phrases saved", sub: "“Kitne ka hai?” (How much is it?) goes a long way.", link: { href: "/phrases", label: "Open the phrasebook" } },
  { key: "go-offline", label: "Offline download done", sub: "Signal is weak inside the old bazaars.", link: { href: "/settings", label: "Save Kaarvaan for offline" } },
];

function Tick({ on }: { on: boolean }) {
  const ok = useMotionOK();
  return (
    <span
      className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 transition-colors ${
        on ? "border-leaf bg-leaf/10" : "border-sand bg-white"
      }`}
      aria-hidden="true"
    >
      <AnimatePresence initial={false}>
        {on && (
          <m.span
            key="tick"
            initial={ok ? { scale: 0, rotate: -120 } : false}
            animate={{ scale: 1, rotate: 0 }}
            exit={ok ? { scale: 0, rotate: 90, opacity: 0 } : { opacity: 0 }}
            transition={{ type: "spring", stiffness: 520, damping: 18 }}
            className="absolute"
          >
            <Buti size={24} color="#2E7D5B" center="#F2C14E" />
          </m.span>
        )}
      </AnimatePresence>
    </span>
  );
}

/** "Before you go" checklist, saved on the device. */
export function Checklist() {
  const checklist = useStore((s) => s.checklist);
  const done = ITEMS.filter((i) => checklist[i.key]).length;
  return (
    <section aria-labelledby="before-go" className="card relative overflow-hidden p-4 sm:p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="before-go" className="text-2xl">
          Before you go
        </h2>
        <span className="text-sm font-semibold text-muted" aria-live="polite">
          {done} of {ITEMS.length} done
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-sand" aria-hidden="true">
        <div className="h-full rounded-full bg-leaf transition-[width] duration-500" style={{ width: `${(done / ITEMS.length) * 100}%` }} />
      </div>
      <ul className="mt-3 divide-y divide-dashed divide-sand">
        {ITEMS.map((item) => {
          const on = !!checklist[item.key];
          return (
            <li key={item.key} className="py-2">
              <button
                type="button"
                role="checkbox"
                aria-checked={on}
                onClick={() => useStore.getState().toggleChecklist(item.key)}
                className="flex min-h-11 w-full items-center gap-3 rounded-xl text-left"
              >
                <Tick on={on} />
                <span className="min-w-0">
                  <span className={`block font-semibold ${on ? "text-leaf-dark line-through decoration-marigold decoration-2" : "text-indigo"}`}>{item.label}</span>
                  <span className="block text-sm leading-snug text-muted">{item.sub}</span>
                </span>
              </button>
              {item.link && (
                <Link href={item.link.href} className="link-wavy ml-11 inline-flex min-h-11 items-center text-sm">
                  {item.link.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
      {done === ITEMS.length && <p className="mt-2 font-hand text-xl text-leaf-dark">Sab taiyaar! (All set.) Chalo!</p>}
    </section>
  );
}
