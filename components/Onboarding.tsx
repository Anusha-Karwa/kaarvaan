"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Compass, Heart, MapPinned } from "lucide-react";
import { useStore } from "@/lib/store";
import { states } from "@/lib/data";
import { useMotionOK } from "@/lib/motion";
import { RouteLine } from "./motifs/RouteLine";
import { BlockPrintPattern } from "./motifs/BlockPrintPattern";
import { Buti } from "./motifs/Buti";
import { ChipButton } from "./ui/Chip";
import { Button } from "./ui/Button";
import { LocationButton } from "./LocationButton";
import type { Mode } from "@/lib/types";

export const INTERESTS = [
  "Textiles",
  "Jewellery",
  "Pottery",
  "Food",
  "Forts and palaces",
  "Workshops",
  "Photography",
  "Shopping for gifts",
];

export function Onboarding() {
  const complete = useStore((s) => s.completeOnboarding);
  const ok = useMotionOK();
  const [step, setStep] = useState(0);
  const [stateSlug, setStateSlug] = useState("rajasthan");
  const [soon, setSoon] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode | null>(null);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dialog.current?.querySelector<HTMLElement>("h2")?.focus();
  }, [step]);

  const finish = (skip = false) =>
    complete({
      stateSlug: "rajasthan",
      mode: skip ? "planning" : mode ?? "planning",
      interests: skip ? [] : interests,
      start: start || undefined,
      end: end || start || undefined,
    });

  const others = states.filter((s) => !s.live);
  return (
    <div className="fixed inset-0 z-[90] overflow-y-auto bg-indigo text-ivory" role="dialog" aria-modal="true" aria-label="Welcome to Kaarvaan">
      <BlockPrintPattern color="#E8A33D" opacity={0.07} />
      <div ref={dialog} className="relative mx-auto flex min-h-full max-w-lg flex-col px-5 pb-8 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-display text-2xl">
            <Buti size={22} /> Kaarvaan
          </span>
          <button onClick={() => finish(true)} className="min-h-11 rounded-full px-4 font-semibold text-haldi hover:bg-white/10">
            Skip
          </button>
        </div>
        <div className="mt-4 rounded-2xl bg-ivory/95 px-2 pt-3 pb-1 text-ink">
          <RouteLine
            ariaLabel="Onboarding progress"
            active={step}
            compact
            stops={[
              { label: "Where", icon: MapPinned },
              { label: "When", icon: CalendarDays },
              { label: "Loves", icon: Heart },
            ]}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.section
            key={step}
            initial={ok ? { opacity: 0, x: 24 } : false}
            animate={{ opacity: 1, x: 0 }}
            exit={ok ? { opacity: 0, x: -24 } : undefined}
            transition={{ duration: 0.22 }}
            className="mt-6 flex-1"
          >
            {step === 0 && (
              <>
                <p className="font-hand text-xl text-haldi">Namaste! Chalo, shuru karte hain.</p>
                <h2 tabIndex={-1} className="mt-1 text-[34px] text-ivory outline-none">
                  Where are you headed?
                </h2>
                <button
                  onClick={() => {
                    setStateSlug("rajasthan");
                    setStep(1);
                  }}
                  className="mt-5 flex w-full items-center justify-between rounded-2xl border-2 border-marigold bg-marigold/15 p-4 text-left"
                  aria-pressed={stateSlug === "rajasthan"}
                >
                  <span>
                    <span className="block font-display text-2xl text-ivory">Rajasthan</span>
                    <span lang="hi" className="deva block text-haldi">
                      राजस्थान
                    </span>
                    <span className="text-sm text-ivory/80">Live now, starting with Jaipur</span>
                  </span>
                  <span className="rounded-full bg-haldi px-3 py-1 text-sm font-bold text-ink">Live</span>
                </button>
                <div className="mt-3">
                  <LocationButton dark onResult={(r) => r.kind === "rajasthan" && setStep(1)} />
                  <p className="text-sm text-ivory/70">We only use it to open the right state and show what&apos;s near you. Never stored.</p>
                </div>
                <p className="mt-5 text-sm font-semibold text-ivory/80">Other states · Aa rahe hain (Coming soon)</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {others.slice(0, 12).map((s) => (
                    <button
                      key={s.slug}
                      onClick={() => setSoon(s.name)}
                      className="min-h-10 rounded-full border border-ivory/25 px-3 text-sm text-ivory/70 hover:border-haldi"
                    >
                      {s.name}
                    </button>
                  ))}
                  <span className="self-center text-sm text-ivory/60">+{others.length - 12} more</span>
                </div>
                {soon && (
                  <p className="mt-3 rounded-xl bg-white/10 p-3 text-sm" role="status">
                    <strong>Aa rahe hain!</strong> Kaarvaan is coming to {soon} soon. Explore Rajasthan meanwhile.
                  </p>
                )}
              </>
            )}

            {step === 1 && (
              <>
                <h2 tabIndex={-1} className="text-[34px] text-ivory outline-none">
                  When?
                </h2>
                <div className="mt-5 grid gap-3">
                  {(
                    [
                      { id: "planning", icon: Compass, title: "Planning a trip", sub: "Save, plan days, share with friends" },
                      { id: "here", icon: MapPinned, title: "I'm here now", sub: "Near me, open now, fair prices" },
                    ] as const
                  ).map((o) => (
                    <button
                      key={o.id}
                      onClick={() => {
                        setMode(o.id);
                        if (o.id === "here") setStep(2);
                      }}
                      aria-pressed={mode === o.id}
                      className={`flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-colors ${
                        mode === o.id ? "border-marigold bg-marigold/15" : "border-ivory/25 hover:border-haldi"
                      }`}
                    >
                      <o.icon className="h-8 w-8 shrink-0 text-haldi" aria-hidden="true" />
                      <span>
                        <span className="block text-xl font-semibold">{o.title}</span>
                        <span className="text-sm text-ivory/75">{o.sub}</span>
                      </span>
                    </button>
                  ))}
                </div>
                {mode === "planning" && (
                  <div className="mt-4 rounded-2xl bg-white/10 p-4">
                    <p className="text-sm font-semibold">Dates (optional)</p>
                    <div className="mt-2 grid grid-cols-2 gap-3">
                      <label className="text-sm">
                        From
                        <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="mt-1 block min-h-11 w-full rounded-xl bg-ivory px-3 text-ink" />
                      </label>
                      <label className="text-sm">
                        To
                        <input type="date" value={end} min={start} onChange={(e) => setEnd(e.target.value)} className="mt-1 block min-h-11 w-full rounded-xl bg-ivory px-3 text-ink" />
                      </label>
                    </div>
                    <Button className="mt-4 w-full" onClick={() => setStep(2)}>
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}

            {step === 2 && (
              <>
                <h2 tabIndex={-1} className="text-[34px] text-ivory outline-none">
                  What do you love?
                </h2>
                <p className="text-ivory/75">Pick any. We&apos;ll shape your home page around them.</p>
                <div className="mt-5 flex flex-wrap gap-2 text-ink">
                  {INTERESTS.map((i) => (
                    <ChipButton
                      key={i}
                      active={interests.includes(i)}
                      color="#C2185B"
                      onClick={() => setInterests((x) => (x.includes(i) ? x.filter((y) => y !== i) : [...x, i]))}
                    >
                      {i}
                    </ChipButton>
                  ))}
                </div>
              </>
            )}
          </motion.section>
        </AnimatePresence>

        <div className="mt-8 flex items-center gap-3">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="min-h-11 rounded-full px-4 font-semibold text-ivory/85 hover:bg-white/10">
              Back
            </button>
          )}
          <div className="flex-1" />
          {step === 0 && <Button onClick={() => setStep(1)}>Next</Button>}
          {step === 1 && mode === null && (
            <Button variant="light" onClick={() => setStep(2)}>
              Decide later
            </Button>
          )}
          {step === 2 && (
            <Button size="lg" onClick={() => finish()}>
              Chalo!
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
