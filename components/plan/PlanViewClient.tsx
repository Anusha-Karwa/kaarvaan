"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { CopyPlus, Eye } from "lucide-react";
import { decodePlan, uid } from "@/lib/plan";
import { useStore } from "@/lib/store";
import { DayTimeline } from "@/components/DayTimeline";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { BlockPrintPattern, Buti, ToranBorder } from "@/components/motifs";
import { dayDate, shortDate, tripDatesLabel } from "./planUtils";

const noop = () => () => {};
const getSearch = () => window.location.search;
const getServerSearch = () => null;

/** Read-only view of a plan someone shared via link. */
export function PlanViewClient() {
  const search = useSyncExternalStore(noop, getSearch, getServerSearch);
  const hydrated = useStore((s) => s.hydrated);
  const router = useRouter();

  if (search === null) {
    return (
      <div className="space-y-4" aria-busy="true" aria-label="Opening the shared plan">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const code = new URLSearchParams(search).get("p");
  const plan = code ? decodePlan(code) : null;
  const days = plan?.days.map((d) => d.map((r) => ({ ...r, id: `${r.kind}:${r.slug}` }))) ?? [];

  if (!plan || !days.some((d) => d.length)) {
    return (
      <EmptyState
        title="Hmm, this link looks a bit torn."
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <ButtonLink href="/plan">Plan your own trip</ButtonLink>
            <ButtonLink href="/experiences" variant="secondary">
              See experiences
            </ButtonLink>
          </div>
        }
      >
        We couldn&apos;t read a plan from it. Ask your friend to tap “Copy link” again and send the whole thing.
      </EmptyState>
    );
  }

  const end = plan.start
    ? (() => {
        const d = dayDate({ start: plan.start }, days.length - 1);
        return d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}` : undefined;
      })()
    : undefined;

  const copy = () => {
    const s = useStore.getState();
    s.createTrip(plan.name, plan.start, end);
    s.setDays(plan.days.map((d) => d.map((r) => ({ ...r, id: uid("stop") }))));
    s.showToast({ message: `Copied “${plan.name}” to your trips. It's yours to edit now.` });
    router.push("/plan");
  };

  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl bg-indigo text-ivory">
        <BlockPrintPattern color="#E8A33D" opacity={0.08} />
        <ToranBorder band="#141B3D" />
        <div className="relative px-5 pb-5 pt-3">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-haldi">
            <Eye className="h-4 w-4" aria-hidden="true" />
            A shared plan · view only
          </p>
          <h1 className="mt-1 text-[34px] text-ivory sm:text-[42px]">{plan.name}</h1>
          <p className="text-ivory/85">
            {[tripDatesLabel({ start: plan.start, end }), `${days.length} day${days.length === 1 ? "" : "s"}`].filter(Boolean).join(" · ")}
          </p>
          <div className="mt-4">
            <Button variant="marigold" onClick={copy} disabled={!hydrated}>
              <CopyPlus className="h-5 w-5" aria-hidden="true" />
              Copy to my trips
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {days.map((stops, i) => {
          const date = dayDate({ start: plan.start }, i);
          return (
            <section key={i} aria-labelledby={`vday-${i}`} className="card p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-2">
                <Buti size={22} color={i % 2 ? "#2E7D5B" : "#E8A33D"} />
                <h2 id={`vday-${i}`} className="text-2xl">
                  Day {i + 1}
                </h2>
                {date && <span className="text-sm font-semibold text-muted">{shortDate(date)}</span>}
              </div>
              {stops.length ? (
                <DayTimeline stops={stops} weekday={date?.getDay() ?? 1} label={`Day ${i + 1} stops`} />
              ) : (
                <p className="font-hand text-lg text-muted">A free day. Wander, sip chai, get a little lost.</p>
              )}
            </section>
          );
        })}
      </div>

      <p className="mt-6 text-sm text-muted">
        Times are suggestions. Shops and hosts listed are samples while we finish our Jaipur visits.{" "}
        <Link href="/how-we-choose" className="link-wavy">
          How we choose places
        </Link>
      </p>
    </div>
  );
}
