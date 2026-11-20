"use client";

import { useId, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { KIND_META, allItems } from "@/lib/data";
import { useStore } from "@/lib/store";
import type { PhotoMeta } from "@/lib/types";
import { Sheet } from "@/components/ui/Sheet";
import { KIND_ICON, sameRef } from "@/components/plan/planUtils";

export function TagSheet({ photo, onClose }: { photo: PhotoMeta | null; onClose: () => void }) {
  return (
    <Sheet open={!!photo} onClose={onClose} title="Tag this photo" full>
      {photo && <TagPicker key={photo.id} photo={photo} onDone={onClose} />}
    </Sheet>
  );
}

function TagPicker({ photo, onDone }: { photo: PhotoMeta; onDone: () => void }) {
  const id = useId();
  const [q, setQ] = useState("");
  const items = useMemo(() => allItems(), []);
  const terms = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const hits = items.filter((i) => terms.every((t) => `${i.title} ${i.subtitle} ${i.area}`.toLowerCase().includes(t)));

  const pick = (ref: PhotoMeta["tag"]) => {
    useStore.getState().updatePhoto(photo.id, { tag: ref });
    useStore.getState().showToast({ message: ref ? "Tagged. It's in your trip passport too." : "Tag removed" });
    onDone();
  };

  return (
    <div className="pb-2">
      <p className="mb-3 text-muted">Link it to where you were. Tagged photos add a stamp to your passport.</p>
      <label htmlFor={id} className="sr-only">
        Search shops, workshops, places and food
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input
          id={id}
          data-autofocus
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Hawa Mahal, kachori, bandhani…"
          className="block min-h-11 w-full rounded-full border-2 border-sand bg-white pl-11 pr-4 focus:border-marigold"
        />
      </div>
      {photo.tag && (
        <button type="button" onClick={() => pick(undefined)} className="mt-3 inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-sm font-semibold text-terracotta hover:bg-terracotta/10">
          <X className="h-4 w-4" aria-hidden="true" />
          Remove the tag
        </button>
      )}
      <ul className="mt-3 divide-y divide-sand" aria-label={`${hits.length} results`}>
        {hits.map((i) => {
          const Icon = KIND_ICON[i.kind];
          const meta = KIND_META[i.kind];
          const current = !!photo.tag && sameRef(photo.tag, i);
          return (
            <li key={`${i.kind}:${i.slug}`}>
              <button
                type="button"
                onClick={() => pick({ kind: i.kind, slug: i.slug })}
                aria-current={current || undefined}
                className={`flex min-h-14 w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-white ${current ? "bg-marigold/15" : ""}`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white" style={{ background: meta.color }} aria-hidden="true">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold leading-snug text-indigo">{i.title}</span>
                  <span className="block truncate text-sm text-muted">{i.subtitle}</span>
                </span>
              </button>
            </li>
          );
        })}
        {!hits.length && <li className="py-6 text-center text-muted">Nothing matches. Try another word.</li>}
      </ul>
    </div>
  );
}
