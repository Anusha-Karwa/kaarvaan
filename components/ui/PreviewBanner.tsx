"use client";

import { X } from "lucide-react";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";

/** Dismissible site-wide honesty banner about sample listings. */
export function PreviewBanner() {
  const hydrated = useStore((s) => s.hydrated);
  const dismissed = useStore((s) => s.bannerDismissed);
  const set = useStore((s) => s.set);
  const t = useT();
  // Rendered on the server so it never pushes the page down; a pre-paint script hides it if dismissed.
  if (hydrated && dismissed) return null;
  return (
    <div className="preview-banner bg-haldi/90 text-ink">
      <div className="container-k flex items-center gap-3 py-1.5 text-sm">
        <span className="font-hand text-base font-bold">Preview</span>
        <p className="flex-1 leading-snug">{t("banner.preview").replace(/^Preview: /, "")}</p>
        <button
          onClick={() => set({ bannerDismissed: true })}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-black/5"
          aria-label="Dismiss preview notice"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
