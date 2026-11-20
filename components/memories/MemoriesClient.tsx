"use client";

import { useCallback, useRef, useState } from "react";
import { BookOpen, ImagePlus, Loader2, Lock, Sparkles, Stamp, Trash2 } from "lucide-react";
import { useActiveTrip, useStore } from "@/lib/store";
import { clearPhotos, compressImage, deletePhotoBlob, savePhotoBlob } from "@/lib/idb";
import { uid } from "@/lib/plan";
import { useT } from "@/lib/i18n";
import type { PhotoMeta } from "@/lib/types";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Sheet } from "@/components/ui/Sheet";
import { Skeleton } from "@/components/ui/Skeleton";
import { RangoliDivider } from "@/components/motifs";
import { TripCardMaker } from "@/components/TripCardMaker";
import { JournalNote } from "@/components/plan/JournalNote";
import { TripSwitcher, cleanupOrphanBlobs } from "@/components/plan/TripSwitcher";
import { dayDate, shortDate } from "@/components/plan/planUtils";
import { ArchClipDefs, PhotoCard } from "./PhotoCard";
import { TagSheet } from "./TagSheet";

export function MemoriesClient() {
  const t = useT();
  const hydrated = useStore((s) => s.hydrated);
  return (
    <div className="container-k pt-6">
      <SectionHeader as="h1" title="Memories" hi="यादें" sub="Your trip album, journal and passport." color="#E8A33D" />
      <div className="relative mb-5 flex items-start gap-3 overflow-hidden rounded-2xl border-2 border-marigold/50 bg-marigold/10 px-4 py-3">
        <Lock className="mt-0.5 h-5 w-5 shrink-0 text-marigold-ink" aria-hidden="true" />
        <p>
          <span className="block font-semibold text-indigo">Private by default. Your photos stay on this phone.</span>
          <span className="block text-sm text-muted">{t("common.privateTrip")}. Nothing is uploaded, ever.</span>
        </p>
      </div>
      {hydrated ? (
        <Album />
      ) : (
        <div className="space-y-4" aria-busy="true" aria-label="Loading your memories">
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Skeleton className="h-56" />
            <Skeleton className="h-44" />
            <Skeleton className="h-52" />
          </div>
        </div>
      )}
    </div>
  );
}

function Album() {
  const t = useT();
  const trip = useActiveTrip();
  const allPhotos = useStore((s) => s.photos);
  const photos = allPhotos.filter((p) => p.tripId === trip.id);
  const input = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [tagging, setTagging] = useState<PhotoMeta | null>(null);
  const [card, setCard] = useState(false);
  const [confirm, setConfirm] = useState<"trip" | "all" | null>(null);
  const closeTag = useCallback(() => setTagging(null), []);
  const closeCard = useCallback(() => setCard(false), []);
  const closeConfirm = useCallback(() => setConfirm(null), [setConfirm]);

  const onFiles = async (files: FileList | null) => {
    const list = [...(files ?? [])].filter((f) => f.type.startsWith("image/"));
    if (!list.length) return;
    const tripId = trip.id;
    const first = useStore.getState().photos.length === 0;
    let added = 0;
    setProgress({ done: 0, total: list.length });
    for (const f of list) {
      try {
        const { blob, w, h } = await compressImage(f);
        const id = uid("photo");
        await savePhotoBlob(id, blob);
        useStore.getState().addPhoto({ id, tripId, caption: "", addedAt: Date.now(), w, h });
        added++;
      } catch {
        // skip unreadable files (e.g. HEIC on some browsers)
      }
      setProgress({ done: added, total: list.length });
    }
    setProgress(null);
    if (input.current) input.current.value = "";
    const s = useStore.getState();
    if (!added) {
      s.showToast({ message: "Couldn't read that photo. Try a JPG or PNG?" });
      return;
    }
    if (first) s.celebrate();
    s.showToast({
      message: first ? t("mem.shabash") : `Added ${added} photo${added === 1 ? "" : "s"}${added < list.length ? ` (${list.length - added} couldn't be read)` : ""}`,
    });
  };

  const deletePhoto = (p: PhotoMeta) => {
    const s = useStore.getState();
    const before = s.photos;
    s.removePhoto(p.id);
    s.showToast({ message: "Photo deleted", actionLabel: t("act.undo"), onAction: () => useStore.getState().set({ photos: before }) });
    cleanupOrphanBlobs([p.id]);
  };

  const doDelete = async () => {
    const s = useStore.getState();
    if (confirm === "trip") {
      const ids = s.photos.filter((p) => p.tripId === trip.id).map((p) => p.id);
      s.deleteTrip(trip.id);
      await Promise.all(ids.map((id) => deletePhotoBlob(id).catch(() => {})));
      s.showToast({ message: `Deleted “${trip.name}” and its photos` });
    } else if (confirm === "all") {
      await clearPhotos().catch(() => {});
      s.resetAll();
      s.showToast({ message: "Everything cleared. A fresh start." });
    }
    setConfirm(null);
  };

  return (
    <div className="space-y-6">
      <ArchClipDefs />
      <TripSwitcher label="Album for" />

      <div className="flex flex-wrap gap-2">
        <input
          ref={input}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => void onFiles(e.target.files)}
        />
        <Button variant="marigold" onClick={() => input.current?.click()} disabled={!!progress}>
          {progress ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <ImagePlus className="h-5 w-5" aria-hidden="true" />}
          {progress ? `Adding ${Math.min(progress.done + 1, progress.total)} of ${progress.total}…` : "Add photos"}
        </Button>
        <ButtonLink href="/memories/passport" variant="secondary">
          <Stamp className="h-5 w-5" aria-hidden="true" />
          Trip passport
        </ButtonLink>
        <Button variant="secondary" onClick={() => setCard(true)}>
          <Sparkles className="h-5 w-5" aria-hidden="true" />
          Make my trip card
        </Button>
      </div>
      <p className="sr-only" aria-live="polite">
        {progress ? `Adding photos, ${progress.done} of ${progress.total} done` : ""}
      </p>

      {photos.length ? (
        <ul className="columns-2 gap-4 sm:columns-3 lg:columns-4" aria-label={`${photos.length} photos in ${trip.name}`}>
          {photos.map((p, i) => (
            <PhotoCard key={p.id} photo={p} index={i} onTag={() => setTagging(p)} onDelete={() => deletePhoto(p)} />
          ))}
        </ul>
      ) : (
        <EmptyState
          title={t("mem.empty")}
          action={
            <Button variant="marigold" onClick={() => input.current?.click()}>
              <ImagePlus className="h-5 w-5" aria-hidden="true" />
              Add the first photo
            </Button>
          }
        >
          They stay on this phone. Tag them to places you visited and they&apos;ll stamp your trip passport.
        </EmptyState>
      )}

      <RangoliDivider className="mx-auto" />

      <section aria-labelledby="journal-h">
        <h2 id="journal-h" className="mb-1 flex items-center gap-2 text-2xl">
          <BookOpen className="h-6 w-6 text-marigold-ink" aria-hidden="true" />
          Journal
        </h2>
        <p className="mb-4 text-muted">A line or two per day. Future you will thank you.</p>
        <div className="grid gap-4 md:grid-cols-2">
          {trip.days.map((_, i) => {
            const d = dayDate(trip, i);
            return (
              <div key={i} className="card p-4">
                <JournalNote trip={trip} day={i} label={`Day ${i + 1}${d ? ` · ${shortDate(d)}` : ""}`} placeholder="What made you smile today?" />
              </div>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="danger-h" className="rounded-2xl border-2 border-dashed border-terracotta/30 p-4">
        <h2 id="danger-h" className="text-xl">
          Clear things out
        </h2>
        <p className="mt-1 text-sm text-muted">Deleting removes photos from this phone for good. There&apos;s no copy anywhere else.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" className="text-terracotta!" onClick={() => setConfirm("trip")}>
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Delete this trip
          </Button>
          <Button variant="ghost" size="sm" className="text-terracotta!" onClick={() => setConfirm("all")}>
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Delete everything
          </Button>
        </div>
      </section>

      <TagSheet photo={tagging} onClose={closeTag} />
      <TripCardMaker open={card} onClose={closeCard} trip={trip} />
      <Sheet open={!!confirm} onClose={closeConfirm} title={confirm === "all" ? "Delete everything?" : "Delete this trip?"}>
        <div className="space-y-4 pb-2">
          <p>
            {confirm === "all"
              ? "All trips, photos, journal notes, check-ins, saved items and settings on this phone will be erased. This can't be undone."
              : `“${trip.name}”, its ${photos.length} photo${photos.length === 1 ? "" : "s"}, journal and stamps will be erased. This can't be undone.`}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="secondary" className="flex-1" onClick={closeConfirm} data-autofocus>
              Keep it
            </Button>
            <Button className="flex-1 bg-terracotta! shadow-[inset_0_-2px_0_#7d2f1f]!" onClick={() => void doDelete()}>
              <Trash2 className="h-5 w-5" aria-hidden="true" />
              {confirm === "all" ? "Yes, delete everything" : "Yes, delete trip"}
            </Button>
          </div>
        </div>
      </Sheet>
    </div>
  );
}
