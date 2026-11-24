import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Buti, Jharokha, RangoliDivider, StampIcon, archPath } from "@/components/motifs";
import { Illustration, type IllustrationName } from "@/components/illustrations";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const LEAF = "#2E7D5B";
export const TERRACOTTA = "#B5462F";

/** "← Experiences · Workshops" breadcrumb-ish back link. */
export function BackLink({ tab, label }: { tab: "workshops" | "places" | "food"; label: string }) {
  return (
    <Link
      href={`/experiences?tab=${tab}`}
      className="-ml-2 inline-flex min-h-11 items-center gap-1 rounded-full px-2 text-sm font-semibold text-leaf-dark hover:bg-leaf/10"
    >
      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      Experiences <span className="text-muted">· {label}</span>
    </Link>
  );
}

/** Big illustration standing inside a jharokha arch, on a block-printed tint. */
export function ArchFrame({
  name,
  tint,
  title,
  className = "",
  children,
}: {
  name: IllustrationName;
  tint: string;
  title: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`relative mx-auto aspect-[1/1.12] w-full max-w-[19rem] ${className}`}>
      <svg viewBox="-2 -8 104 122" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
        <defs>
          <pattern id={`af-${name}`} width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="0.9" fill={LEAF} opacity="0.22" />
            <circle cx="9" cy="9" r="0.6" fill="#C2185B" opacity="0.18" />
          </pattern>
        </defs>
        <path d={archPath(100, 112, 33.6)} fill={tint} />
        <path d={archPath(100, 112, 33.6)} fill={`url(#af-${name})`} />
      </svg>
      <Jharokha rise={0.3} aspect={1.12} stroke="#1F2A5C" strokeWidth={2} />
      <div className="absolute inset-x-6 bottom-5 top-[28%] flex items-end justify-center">
        <Illustration priority name={name} title={title} className="h-full max-h-56 w-auto max-w-full" />
      </div>
      {children}
    </div>
  );
}

/** A section with the leaf-coloured buti header. */
export function DetailSection({
  title,
  hi,
  id,
  children,
  className = "",
}: {
  title: ReactNode;
  hi?: string;
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section aria-labelledby={id} className={className}>
      <SectionHeader title={title} hi={hi} id={id} color={LEAF} className="mb-4" />
      {children}
    </section>
  );
}

export function Divider() {
  return <RangoliDivider className="py-8" />;
}

/** Small fact tile: stamp icon + label + value. */
export function FactTile({ icon, label, children, color = LEAF }: { icon: LucideIcon; label: string; children: ReactNode; color?: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-sand bg-white/80 p-3">
      <StampIcon icon={icon} color={color} size={40} />
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
        <div className="text-[15px] font-semibold leading-snug text-ink">{children}</div>
      </div>
    </div>
  );
}

/** Coloured callout card (safety notes, crowd tips). */
export function Callout({
  icon,
  title,
  children,
  tone = "terracotta",
}: {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  tone?: "terracotta" | "leaf" | "indigo";
}) {
  const c = tone === "terracotta" ? TERRACOTTA : tone === "leaf" ? LEAF : "#1F2A5C";
  const bg = tone === "terracotta" ? "#FBEBDD" : tone === "leaf" ? "#E3F1EA" : "#E6E9F5";
  return (
    <div className="relative overflow-hidden rounded-2xl border-l-4 p-4 pl-4" style={{ borderColor: c, background: bg }}>
      <div className="flex items-start gap-3">
        <StampIcon icon={icon} color={c} size={40} />
        <div className="min-w-0">
          <h3 className="font-sans text-base font-bold" style={{ color: c === LEAF ? "#1F5A41" : c }}>
            {title}
          </h3>
          <div className="mt-1 text-[15px] leading-relaxed text-ink">{children}</div>
        </div>
      </div>
    </div>
  );
}

/** Numbered printing-block stamp (same look as StampIcon, with a number). */
export function NumberStamp({ n, color = LEAF, size = 40 }: { n: number; color?: string; size?: number }) {
  return (
    <span className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 44 44" className="absolute inset-0 h-full w-full" focusable="false">
        <circle cx="22" cy="22" r="20.5" fill="none" stroke="#E8A33D" strokeWidth="1.6" strokeDasharray="0.5 3.2" strokeLinecap="round" />
        <circle cx="22" cy="22" r="17" fill={color} />
        <circle cx="22" cy="22" r="15" fill="none" stroke="#FBF6EC" strokeOpacity="0.25" strokeWidth="0.8" />
      </svg>
      <span className="relative font-display text-lg leading-none text-ivory">{n}</span>
    </span>
  );
}

/** Stepped list with numbered stamps joined by a dashed thread. */
export function Steps({ steps }: { steps: { title: string; text: string }[] }) {
  return (
    <ol className="relative">
      {steps.map((s, i) => (
        <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
          {i < steps.length - 1 && (
            <span
              className="absolute bottom-0 left-5 top-11 w-0 -translate-x-1/2 border-l-2 border-dashed border-indigo/40"
              aria-hidden="true"
            />
          )}
          <NumberStamp n={i + 1} />
          <div className="min-w-0 pt-1.5">
            <h3 className="font-sans text-lg font-bold text-indigo">{s.title}</h3>
            <p className="mt-0.5 leading-relaxed text-ink/90">{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** List with little buti bullets. */
export function ButiList({ items, color = "#C2185B" }: { items: string[]; color?: string }) {
  return (
    <ul className="space-y-2.5">
      {items.map((it) => (
        <li key={it} className="flex items-start gap-3">
          <span className="mt-1 shrink-0">
            <Buti size={18} color={color} center="#F2C14E" />
          </span>
          <span className="leading-relaxed">{it}</span>
        </li>
      ))}
    </ul>
  );
}

/** Kalam note on a scrap of paper, slightly tilted. */
export function PaperNote({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <figure
      className={`relative rotate-[-1deg] rounded-md border border-sand bg-[#FFFBF2] p-4 pt-5 shadow-[0_4px_14px_rgba(31,42,92,0.08)] ${className}`}
    >
      <span
        className="absolute -top-2.5 left-6 h-5 w-16 rotate-[-4deg] rounded-sm bg-haldi/70"
        aria-hidden="true"
      />
      <figcaption className="font-sans text-xs font-bold uppercase tracking-wide text-rani-dark">{label}</figcaption>
      <p className="mt-1 font-hand text-xl leading-snug text-indigo">{children}</p>
    </figure>
  );
}
