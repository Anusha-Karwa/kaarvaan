import Link from "next/link";
import type { ReactNode } from "react";
import { Buti } from "../motifs/Buti";

/** Section header: small buti, display title, hand-drawn dotted wave underline in marigold. */
export function SectionHeader({
  title,
  hi,
  sub,
  action,
  color = "#E8A33D",
  as: As = "h2",
  className = "",
  id,
}: {
  title: ReactNode;
  hi?: string;
  sub?: ReactNode;
  action?: { href: string; label: ReactNode };
  color?: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  id?: string;
}) {
  return (
    <div className={`mb-5 flex items-end justify-between gap-4 ${className}`}>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <Buti size={20} color={color} />
          <As id={id} className={As === "h1" ? "text-[34px] sm:text-[42px]" : "text-2xl sm:text-[30px]"}>
            {title}
          </As>
          {hi && (
            <span lang="hi" className="deva hidden text-lg text-muted sm:inline">
              {hi}
            </span>
          )}
        </div>
        <svg className="ml-7 mt-1 h-2 w-36" viewBox="0 0 144 8" aria-hidden="true">
          <path
            d="M1 4 Q 7 0 13 4 T 25 4 T 37 4 T 49 4 T 61 4 T 73 4 T 85 4 T 97 4 T 109 4 T 121 4 T 133 4 T 143 4"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeDasharray="0.1 4"
            strokeLinecap="round"
          />
        </svg>
        {sub && <p className="ml-7 mt-1 text-muted">{sub}</p>}
      </div>
      {action && (
        <Link href={action.href} className="link-wavy shrink-0 text-sm">
          {action.label}
        </Link>
      )}
    </div>
  );
}
