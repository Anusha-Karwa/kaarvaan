"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { useId, type ReactNode } from "react";
import { Camera, Stamp } from "lucide-react";
import { useActiveTrip, useStore } from "@/lib/store";
import { useMotionOK } from "@/lib/motion";
import { useT } from "@/lib/i18n";
import { BlockPrintPattern, Buti, Mandala } from "@/components/motifs";
import { ButtonLink } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { TripSwitcher } from "@/components/plan/TripSwitcher";
import { KIND_ICON, tripDatesLabel } from "@/components/plan/planUtils";
import { tripStamps, type PassportStamp } from "@/components/memories/stamps";

/** Circular rubber stamp with a rough inked edge and text running round the rim. */
export function RubberStamp({ stamp, size = 132 }: { stamp: PassportStamp; size?: number }) {
  const id = useId().replace(/:/g, "");
  const Icon = KIND_ICON[stamp.ref.kind];
  const text = `${stamp.text} · `;
  const fontSize = Math.min(9, 238 / (text.length * 0.64));
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label={`Stamp: ${stamp.info.title}, ${stamp.text.split(" · ").pop()}`}
      className="overflow-visible mix-blend-multiply"
    >
      <defs>
        <filter id={`ink-${id}`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={stamp.key.length} result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="2.4" result="d" />
          <feTurbulence type="fractalNoise" baseFrequency="2.2" numOctaves="1" seed="3" result="speck" />
          <feColorMatrix in="speck" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.6" result="mask" />
          <feComposite in="d" in2="mask" operator="in" />
        </filter>
        <path id={`rim-${id}`} d="M60,60 m-41,0 a41,41 0 1,1 82,0 a41,41 0 1,1 -82,0" />
      </defs>
      <g filter={`url(#ink-${id})`} fill={stamp.color} stroke={stamp.color} opacity="0.9">
        <circle cx="60" cy="60" r="55" fill="none" strokeWidth="3.4" />
        <circle cx="60" cy="60" r="50" fill="none" strokeWidth="1.2" />
        <circle cx="60" cy="60" r="31" fill="none" strokeWidth="1.6" strokeDasharray="2 2.6" />
        <text fontSize={fontSize} fontWeight="700" letterSpacing="0.4" stroke="none" fontFamily="var(--font-mukta), sans-serif">
          <textPath href={`#rim-${id}`} startOffset="0">
            {text}
          </textPath>
        </text>
        <Icon x={47} y={36} width={26} height={26} strokeWidth={2.2} fill="none" />
        <text x="60" y="76" textAnchor="middle" fontSize="10" stroke="none" fontFamily="var(--font-rozha), serif" letterSpacing="0.6">
          {stamp.centre.toUpperCase()}
        </text>
      </g>
    </svg>
  );
}

/** Faint guilloche-style wavy dotted lines, like security printing. */
function Guilloche() {
  const id = useId().replace(/:/g, "");
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <pattern id={`g-${id}`} width="120" height="28" patternUnits="userSpaceOnUse">
          <path d="M0,14 C20,2 40,2 60,14 S100,26 120,14" fill="none" stroke="#E8A33D" strokeOpacity=".35" strokeWidth="1" strokeDasharray="0.1 3.5" strokeLinecap="round" />
          <path d="M0,14 C20,26 40,26 60,14 S100,2 120,14" fill="none" stroke="#1F2A5C" strokeOpacity=".12" strokeWidth="0.8" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#g-${id})`} />
    </svg>
  );
}

function InnerPage({ children, n, title }: { children: ReactNode; n: number; title: string }) {
  return (
    <section
      aria-label={`Passport page ${n}: ${title}`}
      className="relative flex min-h-[26rem] flex-col overflow-hidden rounded-2xl border border-sand bg-[#fbf3e1] p-5 shadow-[inset_14px_0_18px_-14px_rgba(31,42,92,0.25),0_4px_14px_rgba(31,42,92,0.08)]"
    >
      <Guilloche />
      <div className="relative flex items-center justify-between border-b border-dashed border-marigold/60 pb-2 text-xs font-bold uppercase tracking-[0.18em] text-marigold-ink">
        <span>{title}</span>
        <span>
          <span lang="hi" className="deva normal-case tracking-normal">
            पृष्ठ
          </span>{" "}
          {n}
        </span>
      </div>
      <div className="relative flex-1">{children}</div>
    </section>
  );
}

function StampSlot({ stamp, i }: { stamp: PassportStamp; i: number }) {
  const ok = useMotionOK();
  return (
    <li className="flex flex-col items-center text-center">
      <m.div
        initial={ok ? { scale: 1.8, opacity: 0, rotate: stamp.rotate - 12 } : { rotate: stamp.rotate }}
        whileInView={{ scale: 1, opacity: 1, rotate: stamp.rotate }}
        viewport={{ once: true, margin: "-40px" }}
        transition={ok ? { type: "spring", stiffness: 420, damping: 16, delay: (i % 6) * 0.12 } : { duration: 0 }}
      >
        <Link href={stamp.info.href} className="block rounded-full" aria-label={`${stamp.info.title}: open`}>
          <RubberStamp stamp={stamp} />
        </Link>
      </m.div>
      <span className="mt-1 line-clamp-1 font-hand text-sm text-ink/80">
        {stamp.info.title}
        {stamp.source === "photo" && <Camera className="ml-1 inline h-3 w-3" aria-label="from a photo tag" />}
      </span>
    </li>
  );
}

export function TripPassport() {
  const hydrated = useStore((s) => s.hydrated);
  if (!hydrated) {
    return (
      <div className="grid gap-5 md:grid-cols-2" aria-busy="true" aria-label="Opening your passport">
        <Skeleton className="h-[26rem]" />
        <Skeleton className="h-[26rem]" />
      </div>
    );
  }
  return <Passport />;
}

function Passport() {
  const t = useT();
  const trip = useActiveTrip();
  const name = useStore((s) => s.name);
  const checkIns = useStore((s) => s.checkIns);
  const photos = useStore((s) => s.photos);
  const stamps = tripStamps(trip.id, checkIns, photos);
  const pages: PassportStamp[][] = [];
  for (let i = 0; i < stamps.length; i += 6) pages.push(stamps.slice(i, i + 6));
  const dates = tripDatesLabel(trip);

  return (
    <div className="space-y-5">
      <TripSwitcher manage={false} label="Passport for" />

      <div className="grid gap-5 md:grid-cols-2">
        {/* Cover */}
        <section
          aria-label="Passport cover"
          className="relative flex min-h-[26rem] flex-col items-center justify-between overflow-hidden rounded-l-lg rounded-r-3xl bg-indigo px-6 py-8 text-center shadow-[inset_10px_0_0_#141B3D,0_10px_28px_rgba(31,42,92,0.3)]"
        >
          <BlockPrintPattern color="#E8A33D" opacity={0.07} />
          <div className="relative">
            <p className="font-display text-2xl tracking-wide text-[#E9C46A]">Kaarvaan · Trip passport</p>
            <p lang="hi" className="deva text-lg text-[#E9C46A]/85">
              कारवाँ · यात्रा पासपोर्ट
            </p>
          </div>
          <div className="relative">
            <Mandala size={150} color="#E9C46A" accent="#E9C46A" spin={false} className="opacity-90" />
            <span className="absolute inset-0 flex items-center justify-center">
              <Buti size={44} color="#E9C46A" center="#C2185B" />
            </span>
          </div>
          <div className="relative">
            <p className="font-display text-2xl text-ivory">{trip.name}</p>
            <p className="text-sm text-ivory/80">{dates ?? "Jaipur · Rajasthan"}</p>
          </div>
        </section>

        {/* Holder page */}
        <InnerPage n={1} title="Holder">
          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-3">
            {[
              ["Name", name || "Traveller"],
              ["Trip", trip.name],
              ["Dates", dates ?? "Whenever you go"],
              ["Destination", "Jaipur, Rajasthan"],
              ["Stamps", String(stamps.length)],
            ].map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-xs font-bold uppercase tracking-widest text-muted">{k}</dt>
                <dd className="border-b border-dotted border-indigo/30 font-hand text-lg leading-tight text-indigo">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm text-muted">{t("common.privateTrip")}. Stamps come from “I visited” check-ins and tagged photos.</p>
          <div className="absolute bottom-0 right-0 opacity-70">
            <Buti size={40} color="#E8A33D" />
          </div>
        </InnerPage>

        {pages.length ? (
          pages.map((pg, p) => (
            <InnerPage key={p} n={p + 2} title="Stamps">
              <ul className="mt-4 grid grid-cols-2 gap-x-2 gap-y-4">
                {pg.map((s, i) => (
                  <StampSlot key={s.key} stamp={s} i={i} />
                ))}
              </ul>
            </InnerPage>
          ))
        ) : (
          <InnerPage n={2} title="Stamps">
            <div className="flex h-full flex-col items-center justify-center gap-4 py-8 text-center">
              <span className="flex h-32 w-32 items-center justify-center rounded-full border-[3px] border-dashed border-marigold/70">
                <Stamp className="h-10 w-10 text-marigold-ink" aria-hidden="true" />
              </span>
              <p className="font-display text-xl text-indigo">Your first stamp goes here</p>
              <p className="max-w-xs text-muted">
                Tap “{t("act.visited")}” on a place, shop, workshop or dish when you&apos;re there, and it gets stamped in. Tagged photos count too.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <ButtonLink href="/experiences" variant="leaf" size="sm">
                  Experiences
                </ButtonLink>
                <ButtonLink href="/shop" size="sm">
                  Shopping
                </ButtonLink>
              </div>
            </div>
          </InnerPage>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <ButtonLink href="/memories" variant="marigold">
          Back to Memories
        </ButtonLink>
        <ButtonLink href="/plan" variant="ghost">
          Your plan
        </ButtonLink>
      </div>
    </div>
  );
}
