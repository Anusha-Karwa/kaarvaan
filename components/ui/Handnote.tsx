import type { ReactNode } from "react";

/** Kalam handwritten margin note. */
export function Handnote({ children, className = "", color = "text-rani" }: { children: ReactNode; className?: string; color?: string }) {
  return <p className={`font-hand text-lg leading-snug ${color} ${className}`}>{children}</p>;
}
