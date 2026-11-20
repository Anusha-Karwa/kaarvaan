import Link from "next/link";
import type { ReactNode } from "react";
import { ArchTop } from "../motifs/Jharokha";
import { Buti } from "../motifs/Buti";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`card ${className}`}>{children}</div>;
}

interface ArchCardProps {
  href?: string;
  children: ReactNode;
  className?: string;
  /** Top-band colour behind the illustration */
  tint?: string;
  accent?: string;
  archHeight?: number;
  ariaLabel?: string;
}

/**
 * Arch-topped card: jharokha arch top, lifts 4px on hover/press,
 * arch outline turns marigold, small buti rotates 45°.
 */
export function ArchCard({ href, children, className = "", tint = "#FBF6EC", accent = "#C2185B", archHeight = 40, ariaLabel }: ArchCardProps) {
  const inner = (
    <>
      <ArchTop height={archHeight} fill={tint} className="text-sand transition-colors duration-200 group-hover:text-marigold group-focus-visible:text-marigold" />
      <div
        className="relative -mt-px flex flex-1 flex-col rounded-b-2xl border border-t-0 border-sand transition-colors duration-200 group-hover:border-marigold"
        style={{ background: `linear-gradient(${tint} 0, ${tint} 7.5rem, #fff 7.5rem)` }}
      >
        <span
          className="absolute -top-5 right-4 transition-transform duration-300 group-hover:rotate-45"
          aria-hidden="true"
        >
          <Buti size={20} color={accent} center="#F2C14E" />
        </span>
        {children}
      </div>
    </>
  );
  const cls = `group relative flex flex-col drop-shadow-[0_4px_10px_rgba(31,42,92,0.08)] transition-transform duration-200 hover:-translate-y-1 active:-translate-y-1 ${className}`;
  return href ? (
    <Link href={href} className={cls} aria-label={ariaLabel}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}
