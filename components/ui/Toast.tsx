"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { Buti } from "../motifs/Buti";

/** Global toast. Actions (Undo) stay for 5 seconds. */
export function Toast() {
  const toast = useStore((s) => s.toast);
  const hide = useStore((s) => s.hideToast);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(hide, toast.onAction ? 5000 : 3200);
    return () => clearTimeout(t);
  }, [toast, hide]);
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[75] flex justify-center px-4 md:bottom-8" aria-live="polite" role="status">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl bg-indigo px-4 py-3 text-ivory shadow-xl"
          >
            <Buti size={18} />
            <span className="text-[15px]">{toast.message}</span>
            {toast.onAction && (
              <button
                onClick={() => {
                  toast.onAction?.();
                  hide();
                }}
                className="ml-1 min-h-11 shrink-0 rounded-full px-3 font-bold text-haldi underline decoration-wavy underline-offset-4 hover:bg-white/10"
              >
                {toast.actionLabel ?? "Undo"}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
