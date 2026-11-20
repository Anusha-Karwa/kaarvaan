"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { Tag, Trash2 } from "lucide-react";
import { KIND_META, itemInfo } from "@/lib/data";
import { getPhotoBlob } from "@/lib/idb";
import { useStore } from "@/lib/store";
import type { PhotoMeta } from "@/lib/types";
import { hash01 } from "@/components/plan/planUtils";

/** Object URL for a stored photo blob; revoked on unmount. */
function usePhotoUrl(id: string): string | null | undefined {
  const [state, setState] = useState<{ id: string; url: string | null } | null>(null);
  useEffect(() => {
    let url: string | null = null;
    let live = true;
    getPhotoBlob(id)
      .then((b) => {
        if (!live) return;
        url = b ? URL.createObjectURL(b) : null;
        setState({ id, url });
      })
      .catch(() => live && setState({ id, url: null }));
    return () => {
      live = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [id]);
  return state?.id === id ? state.url : undefined;
}

/** Arch clip path (objectBoundingBox) shared by every frame on the page. */
export function ArchClipDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="k-arch" clipPathUnits="objectBoundingBox">
          <path d="M0,1 L0,0.26 C0,0.12 0.38,0.13 0.5,0 C0.62,0.13 1,0.12 1,0.26 L1,1 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}

function ArchOutline() {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
      <path d="M0,100 L0,26 C0,12 38,13 50,0 C62,13 100,12 100,26 L100,100 Z" fill="none" stroke="#1F2A5C" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <path
        d="M4,100 L4,27.5 C4,16 40,17 50,5.5 C60,17 96,16 96,27.5 L96,100"
        fill="none"
        stroke="#E8A33D"
        strokeWidth="2.2"
        strokeDasharray="0.1 6"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function PhotoCard({ photo, index, onTag, onDelete }: { photo: PhotoMeta; index: number; onTag: () => void; onDelete: () => void }) {
  const id = useId();
  const url = usePhotoUrl(photo.id);
  const rot = ((hash01(photo.id) * 2 - 1) * 2.4).toFixed(2);
  const tag = photo.tag ? itemInfo(photo.tag) : null;
  const ratio = photo.w && photo.h ? Math.min(1.5, Math.max(0.75, photo.h / photo.w)) : 1.2;

  return (
    <li className="mb-6 break-inside-avoid">
      <figure
        className="relative rounded-sm bg-white p-2.5 pb-3 shadow-[0_6px_16px_rgba(31,42,92,0.14)] transition-transform duration-200 hover:rotate-0"
        style={{ transform: `rotate(${rot}deg)` }}
      >
        <div className="relative mt-3" style={{ aspectRatio: `1 / ${ratio}` }}>
          <div className="absolute inset-0 bg-sand" style={{ clipPath: "url(#k-arch)" }}>
            {url ? (
              // eslint-disable-next-line @next/next/no-img-element -- local blob URL from IndexedDB
              <img src={url} alt={photo.caption || tag?.title || `Trip photo ${index + 1}`} className="h-full w-full object-cover" />
            ) : url === null ? (
              <span className="flex h-full items-center justify-center px-3 text-center text-sm text-muted">Photo missing on this device</span>
            ) : (
              <span className="skeleton block h-full w-full rounded-none" />
            )}
          </div>
          <ArchOutline />
          <span className="absolute -top-3 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border border-indigo bg-marigold" aria-hidden="true" />
        </div>
        <figcaption className="mt-2">
          <label htmlFor={`${id}-cap`} className="sr-only">
            Caption for photo {index + 1}
          </label>
          <input
            id={`${id}-cap`}
            value={photo.caption}
            maxLength={80}
            placeholder="Write a caption…"
            onChange={(e) => useStore.getState().updatePhoto(photo.id, { caption: e.target.value })}
            className="block min-h-11 w-full rounded-md bg-transparent px-1 font-hand text-lg leading-tight text-ink placeholder:text-muted/70 hover:bg-ivory focus:bg-ivory"
          />
          <div className="flex items-center gap-1">
            {tag ? (
              <Link
                href={tag.href}
                className="min-w-0 truncate rounded-full px-2 text-xs font-bold leading-6 text-white"
                style={{ background: KIND_META[tag.kind].color }}
              >
                {tag.title}
              </Link>
            ) : null}
            <button
              type="button"
              onClick={onTag}
              className="ml-auto flex h-11 shrink-0 items-center gap-1 rounded-full px-2 text-sm font-semibold text-indigo hover:bg-sand"
              aria-label={tag ? `Change tag for photo ${index + 1}` : `Tag photo ${index + 1} to a place, shop or dish`}
            >
              <Tag className="h-4 w-4" aria-hidden="true" />
              {tag ? "" : "Tag"}
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-terracotta hover:bg-terracotta/10"
              aria-label={`Delete photo ${index + 1}`}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </figcaption>
      </figure>
    </li>
  );
}
