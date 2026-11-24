"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Camera, Flag, Footprints } from "lucide-react";
import type { Shop } from "@/lib/types";
import { useStore } from "@/lib/store";
import { openStatus } from "@/lib/geo";
import { compressImage, savePhotoBlob } from "@/lib/idb";
import { uid } from "@/lib/plan";
import { KAARVAAN_WHATSAPP, waLink } from "@/lib/whatsapp";
import { useT } from "@/lib/i18n";
import { Sheet } from "../ui/Sheet";
import { Button, buttonClass } from "../ui/Button";
import { OpenChip } from "../ui/Chip";
import { useNow } from "@/lib/useNow";

export function LiveOpenStatus({ shop }: { shop: Pick<Shop, "hours"> }) {
  const now = useNow();
  if (!now) return <span className="skeleton inline-block h-7 w-48" />;
  const st = openStatus(shop.hours, now);
  return <OpenChip open={st.open} label={st.label} />;
}

export function VisitedButton({ shop }: { shop: Shop }) {
  const t = useT();
  const visited = useStore((s) => s.hydrated && s.checkIns.some((c) => c.kind === "shop" && c.slug === shop.slug && c.tripId === s.activeTripId));
  const [offer, setOffer] = useState(false);
  const [busy, setBusy] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  const onVisit = () => {
    const s = useStore.getState();
    s.checkIn({ kind: "shop", slug: shop.slug });
    s.celebrate();
    s.showToast({ message: t("mem.shabash") });
    setOffer(true);
  };
  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    const s = useStore.getState();
    for (const f of Array.from(files)) {
      try {
        const { blob, w, h } = await compressImage(f);
        const id = uid("ph");
        await savePhotoBlob(id, blob);
        s.addPhoto({ id, tripId: s.activeTripId, caption: shop.name, tag: { kind: "shop", slug: shop.slug }, addedAt: Date.now(), w, h });
      } catch {
        s.showToast({ message: "Couldn't read that photo. Try another?" });
      }
    }
    setBusy(false);
    setOffer(false);
    s.showToast({ message: "Photo added to Memories" });
  };
  return (
    <>
      <button onClick={onVisit} className={buttonClass(visited ? "leaf" : "marigold", "md")}>
        <Footprints className="h-5 w-5" aria-hidden="true" />
        {visited ? "Visited ✓" : t("act.visited")}
      </button>
      <Sheet open={offer} onClose={() => setOffer(false)} title="Shabash!">
        <p className="text-lg">Added to your trip story. A new stamp is waiting in your trip passport.</p>
        <p className="mt-1 font-hand text-lg text-rani">Want to keep a photo from {shop.name}?</p>
        <input ref={file} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => onFiles(e.target.files)} tabIndex={-1} aria-hidden="true" />
        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={() => file.current?.click()} disabled={busy}>
            <Camera className="h-5 w-5" aria-hidden="true" /> {busy ? "Saving…" : "Add a photo"}
          </Button>
          <Link href="/memories/passport" className={buttonClass("secondary")}>
            See my passport
          </Link>
        </div>
        <p className="mt-4 text-sm text-muted">Photos stay on this phone.</p>
      </Sheet>
    </>
  );
}

const ISSUES = ["Copy sold as handmade", "Overcharging", "Closed / moved", "Other"] as const;

export function ReportProblem({ shop }: { shop: Shop }) {
  const [open, setOpen] = useState(false);
  const [issue, setIssue] = useState<(typeof ISSUES)[number]>("Copy sold as handmade");
  const [note, setNote] = useState("");
  const text = [
    "Namaste Kaarvaan team,",
    `Reporting a problem with: ${shop.name} (${shop.market})`,
    `Issue: ${issue}`,
    note && `Details: ${note}`,
    `Date: ${new Date().toLocaleDateString("en-IN")}`,
    "(sent from the Kaarvaan app)",
  ]
    .filter(Boolean)
    .join("\n");
  return (
    <>
      <button onClick={() => setOpen(true)} className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-terracotta hover:bg-terracotta/10">
        <Flag className="h-4 w-4" aria-hidden="true" /> Something wrong?
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Something wrong?">
        <p className="text-muted">Tell us and we&apos;ll re-check this shop. It opens WhatsApp with a message you can edit before sending.</p>
        <fieldset className="mt-4">
          <legend className="text-sm font-semibold">What happened?</legend>
          <div className="mt-2 grid gap-2">
            {ISSUES.map((i) => (
              <label key={i} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border-2 px-3 ${issue === i ? "border-marigold bg-haldi/20" : "border-sand bg-white"}`}>
                <input type="radio" name="issue" value={i} checked={issue === i} onChange={() => setIssue(i)} className="h-4 w-4 accent-[#C2185B]" />
                {i}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="mt-4 block text-sm font-semibold">
          Anything else? (optional)
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="mt-1 block w-full rounded-xl border-2 border-sand bg-white p-3 font-normal outline-none focus:border-marigold" />
        </label>
        <a href={waLink(KAARVAAN_WHATSAPP, text)} target="_blank" rel="noopener noreferrer" className={buttonClass("leaf", "md", "mt-5 w-full")} onClick={() => setOpen(false)}>
          Open WhatsApp
        </a>
        <p className="mt-3 text-center font-hand text-lg text-rani">Dhanyavaad for keeping it honest.</p>
      </Sheet>
    </>
  );
}
