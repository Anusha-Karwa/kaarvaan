import type { ReactNode } from "react";
import { BlockPrintPattern } from "@/components/motifs/BlockPrintPattern";
import { ToranBorder } from "@/components/motifs/ToranBorder";
import { Buti } from "@/components/motifs/Buti";

/**
 * Indigo block-print header band used by the tools and info pages.
 * `art` sits on the right (an illustration), `children` under the title.
 */
export function PageHero({
  title,
  hi,
  kicker,
  children,
  art,
  band = "#1F2A5C",
}: {
  title: ReactNode;
  hi?: string;
  kicker?: ReactNode;
  children?: ReactNode;
  art?: ReactNode;
  band?: string;
}) {
  return (
    <div className="no-print">
      <div className="relative overflow-hidden text-ivory" style={{ background: band }}>
        <BlockPrintPattern color="#E8A33D" opacity={0.08} />
        <div className="container-k relative grid items-center gap-4 py-7 sm:grid-cols-[1fr_auto] sm:py-10">
          <div className="min-w-0">
            {kicker && (
              <p className="flex items-center gap-1.5 font-hand text-lg text-haldi">
                <Buti size={16} color="#F2C14E" center="#C2185B" /> {kicker}
              </p>
            )}
            <h1 className="text-[34px] leading-tight text-ivory sm:text-[42px]">{title}</h1>
            {hi && (
              <p lang="hi" className="deva mt-0.5 text-xl text-haldi">
                {hi}
              </p>
            )}
            {children && <div className="mt-3 max-w-xl text-ivory/85">{children}</div>}
          </div>
          {art && <div className="justify-self-center sm:justify-self-end">{art}</div>}
        </div>
      </div>
      <ToranBorder band={band} />
    </div>
  );
}
