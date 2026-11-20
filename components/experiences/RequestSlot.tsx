"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, CalendarDays, MessageCircle, Minus, Plus, Send } from "lucide-react";
import type { Workshop } from "@/lib/types";
import { getArea } from "@/lib/data";
import { useStore } from "@/lib/store";
import { KAARVAAN_WHATSAPP, waLink } from "@/lib/whatsapp";
import { RouteLine } from "@/components/motifs";
import { Sheet } from "@/components/ui/Sheet";
import { Button, buttonClass } from "@/components/ui/Button";
import { SampleRibbon } from "@/components/ui/SampleRibbon";

const DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const STEPS = [
  { label: "When", sub: "Date & time" },
  { label: "Who", sub: "People & note" },
  { label: "Review", sub: "Send" },
];

function todayISO() {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60_000).toISOString().slice(0, 10);
}

function prettyDate(iso: string) {
  if (!iso) return "";
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

export function buildRequestMessage(w: Workshop, date: string, slot: string, people: number, note: string) {
  const area = getArea(w.area)?.name ?? w.area;
  return [
    "Namaste Kaarvaan! I'd like to request a workshop slot.",
    "",
    `Workshop: ${w.title}`,
    `Host: ${w.host} (${area})`,
    `Date: ${prettyDate(date)}`,
    `Time: ${slot}`,
    `People: ${people}`,
    `Note: ${note.trim() || "None"}`,
    "",
    "Sent from Kaarvaan",
  ].join("\n");
}

/**
 * "Request a slot" button + 3-step sheet (when → who → review).
 * The final step opens WhatsApp to the Kaarvaan desk and adds the workshop to the plan as "requested".
 */
export function RequestSlot({
  workshop: w,
  variant = "leaf",
  className = "",
  label = "Request a slot",
}: {
  workshop: Workshop;
  variant?: "leaf" | "primary" | "secondary";
  className?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState(w.slots[0] ?? "Flexible");
  const [people, setPeople] = useState(w.groupSize[0]);
  const [note, setNote] = useState("");
  const [min, setMin] = useState<string | undefined>(undefined);
  const headRef = useRef<HTMLHeadingElement>(null);
  const [lo, hi] = w.groupSize;

  useEffect(() => {
    if (open) setMin(todayISO()); // eslint-disable-line react-hooks/set-state-in-effect -- client-only date
  }, [open]);

  // Move focus to the step heading when the step changes (screen readers hear the new step).
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    headRef.current?.focus();
  }, [step]);

  const closedDay = useMemo(() => {
    if (!date) return null;
    const day = new Date(`${date}T12:00:00`).getDay();
    return w.hours.closedDays.includes(day) ? DAY[day] : null;
  }, [date, w.hours.closedDays]);

  const message = buildRequestMessage(w, date, slot, people, note);
  const slotOptions = [...w.slots, "Flexible, any time"];

  const close = () => setOpen(false);
  const onOpen = () => {
    setStep(0);
    setOpen(true);
  };

  const onSend = () => {
    const s = useStore.getState();
    s.addToPlan({ kind: "workshop", slug: w.slug }, undefined, { status: "requested" });
    s.showToast({ message: "Request sent. We'll confirm on WhatsApp, and it's in your plan as “requested”." });
    s.celebrate();
    setOpen(false);
  };

  return (
    <>
      <button type="button" onClick={onOpen} className={buttonClass(variant, "md", className)}>
        <CalendarDays className="h-5 w-5" aria-hidden="true" />
        {label}
      </button>
      <Sheet open={open} onClose={close} title="Request a slot">
        <div className="flex items-center gap-2">
          <SampleRibbon />
          <p className="min-w-0 truncate text-sm text-muted">
            {w.title} · {w.host}
          </p>
        </div>

        <RouteLine stops={STEPS} active={step} compact animate={false} className="my-4" ariaLabel="Request steps" />

        <div aria-live="polite" className="sr-only">
          Step {step + 1} of 3: {STEPS[step].label}
        </div>

        {step === 0 && (
          <div>
            <h3 ref={headRef} tabIndex={-1} className="text-xl outline-none">
              When would you like to come?
            </h3>
            <label htmlFor="slot-date" className="mt-3 block text-sm font-semibold text-indigo">
              Date
            </label>
            <input
              id="slot-date"
              type="date"
              min={min}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 min-h-12 w-full rounded-xl border-2 border-sand bg-white px-3 text-base text-ink focus:border-marigold"
              data-autofocus
            />
            {closedDay && (
              <p className="mt-2 flex items-start gap-2 text-sm text-terracotta">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                The studio is usually closed on {closedDay}s. Pick another day, or send anyway and we&apos;ll ask.
              </p>
            )}
            <fieldset className="mt-4">
              <legend className="text-sm font-semibold text-indigo">Time preference</legend>
              <div className="mt-2 grid gap-2">
                {slotOptions.map((s) => (
                  <label
                    key={s}
                    className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border-2 px-3 transition-colors ${
                      slot === s ? "border-leaf bg-leaf/10" : "border-sand bg-white hover:border-marigold"
                    }`}
                  >
                    <input type="radio" name="slot" value={s} checked={slot === s} onChange={() => setSlot(s)} className="h-5 w-5 accent-[#2E7D5B]" />
                    <span className="font-semibold">{s}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="mt-5 flex justify-end">
              <Button variant="leaf" onClick={() => setStep(1)} disabled={!date} aria-disabled={!date}>
                Next <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>
            {!date && <p className="mt-2 text-right text-sm text-muted">Pick a date to continue.</p>}
          </div>
        )}

        {step === 1 && (
          <div>
            <h3 ref={headRef} tabIndex={-1} className="text-xl outline-none">
              How many of you?
            </h3>
            <p className="text-sm text-muted">
              This workshop takes {lo}–{hi} people.
            </p>
            <div className="mt-3 flex items-center justify-center gap-5 rounded-2xl border border-sand bg-white p-3">
              <button
                type="button"
                onClick={() => setPeople((p) => Math.max(lo, p - 1))}
                disabled={people <= lo}
                aria-label="One person fewer"
                className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-indigo text-indigo disabled:opacity-35"
              >
                <Minus className="h-5 w-5" aria-hidden="true" />
              </button>
              <p className="min-w-24 text-center" aria-live="polite">
                <span className="block font-display text-4xl text-indigo">{people}</span>
                <span className="text-sm text-muted">{people === 1 ? "person" : "people"}</span>
              </p>
              <button
                type="button"
                onClick={() => setPeople((p) => Math.min(hi, p + 1))}
                disabled={people >= hi}
                aria-label="One more person"
                className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-indigo text-indigo disabled:opacity-35"
              >
                <Plus className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <label htmlFor="slot-note" className="mt-4 block text-sm font-semibold text-indigo">
              Note for the host <span className="font-normal text-muted">(optional)</span>
            </label>
            <textarea
              id="slot-note"
              rows={3}
              maxLength={300}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Two kids aged 8 and 11, we're vegetarian, flexible after 11 am"
              className="mt-1 w-full rounded-xl border-2 border-sand bg-white p-3 text-base text-ink placeholder:text-muted/80 focus:border-marigold"
            />
            <p className="text-right text-xs text-muted">{note.length}/300</p>
            <div className="mt-4 flex justify-between gap-2">
              <Button variant="ghost" onClick={() => setStep(0)}>
                <ArrowLeft className="h-5 w-5" aria-hidden="true" /> Back
              </Button>
              <Button variant="leaf" onClick={() => setStep(2)}>
                Review <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 ref={headRef} tabIndex={-1} className="text-xl outline-none">
              Looks good?
            </h3>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 rounded-2xl border border-sand bg-white p-4 text-[15px]">
              <dt className="text-muted">Workshop</dt>
              <dd className="font-semibold">{w.title}</dd>
              <dt className="text-muted">Host</dt>
              <dd className="font-semibold">{w.host}</dd>
              <dt className="text-muted">Date</dt>
              <dd className="font-semibold">{prettyDate(date)}</dd>
              <dt className="text-muted">Time</dt>
              <dd className="font-semibold">{slot}</dd>
              <dt className="text-muted">People</dt>
              <dd className="font-semibold">{people}</dd>
              {note.trim() && (
                <>
                  <dt className="text-muted">Note</dt>
                  <dd className="break-words">{note.trim()}</dd>
                </>
              )}
            </dl>
            <details className="mt-3 rounded-xl bg-sand/50 px-3 py-2 text-sm">
              <summary className="min-h-9 cursor-pointer py-1 font-semibold text-indigo">See the WhatsApp message</summary>
              <pre className="mt-1 whitespace-pre-wrap font-sans text-ink/90">{message}</pre>
            </details>
            <p className="mt-3 font-hand text-lg leading-snug text-leaf-dark">
              The Kaarvaan desk passes this to {w.host.split(" ")[0]} and confirms on WhatsApp. Nothing is booked or paid yet.
            </p>
            <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ArrowLeft className="h-5 w-5" aria-hidden="true" /> Back
              </Button>
              <a
                href={waLink(KAARVAAN_WHATSAPP, message)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onSend}
                className={buttonClass("leaf", "lg")}
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Send on WhatsApp
                <Send className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        )}
      </Sheet>
    </>
  );
}
