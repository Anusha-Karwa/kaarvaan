import type { ReactNode } from "react";
import { Mandala } from "../motifs/Mandala";

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="relative flex flex-col items-center overflow-hidden rounded-3xl border-2 border-dashed border-sand bg-white/60 px-6 py-12 text-center">
      <Mandala size={150} className="opacity-60" />
      <p className="mt-4 max-w-sm font-display text-2xl text-indigo">{title}</p>
      {children && <div className="mt-2 max-w-sm text-muted">{children}</div>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
