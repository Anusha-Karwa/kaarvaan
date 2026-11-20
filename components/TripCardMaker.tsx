"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Loader2, Share2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { getPhotoBlob } from "@/lib/idb";
import { downloadBlob } from "@/lib/share";
import type { Trip } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { tripDatesLabel } from "@/components/plan/planUtils";
import { tripStamps, type PassportStamp } from "@/components/memories/stamps";

const W = 1080;
const H = 1350;
const C = {
  indigo: "#1F2A5C",
  indigoDark: "#141B3D",
  rani: "#C2185B",
  marigold: "#E8A33D",
  haldi: "#F2C14E",
  leaf: "#2E7D5B",
  ivory: "#FBF6EC",
  sand: "#EFE3CF",
  ink: "#2B2233",
  muted: "#6E626A",
};

type Ctx = CanvasRenderingContext2D;

function cssFont(varName: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return v ? `${v}, ${fallback}` : fallback;
}

function buti(ctx: Ctx, x: number, y: number, r: number, color: string, center: string, petals = 8, rot = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.fillStyle = color;
  for (let i = 0; i < petals; i++) {
    ctx.save();
    ctx.rotate(((Math.PI * 2) / petals) * i);
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.5, r * 0.2, r * 0.38, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = center;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.23, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function background(ctx: Ctx) {
  ctx.fillStyle = C.ivory;
  ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = 0.07;
  const step = 72;
  for (let row = 0, y = 20; y < H + step; y += step / 2, row++) {
    for (let x = row % 2 ? step / 2 : 0; x < W + step; x += step) {
      if (row % 2) buti(ctx, x, y, 22, C.indigo, C.indigo, 6);
      else {
        ctx.fillStyle = C.rani;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  ctx.globalAlpha = 1;
}

function toran(ctx: Ctx) {
  const band = 64;
  ctx.fillStyle = C.indigo;
  ctx.fillRect(0, 0, W, band);
  // Scalloped edge
  const sw = 60;
  for (let x = 0; x < W; x += sw) {
    ctx.beginPath();
    ctx.ellipse(x + sw / 2, band, sw / 2, 26, 0, 0, Math.PI);
    ctx.fill();
    ctx.fillStyle = C.marigold;
    ctx.beginPath();
    ctx.arc(x + sw / 2, band + 16, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.indigo;
  }
  // Dotted line + butis
  ctx.fillStyle = C.marigold;
  for (let x = 4; x < W; x += 12) {
    ctx.beginPath();
    ctx.arc(x, 8, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let x = sw / 2; x < W; x += sw) {
    buti(ctx, x, 34, 30, C.marigold, C.rani, 6);
    ctx.fillStyle = C.rani;
    ctx.beginPath();
    ctx.arc(x + sw / 2, 34, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function archPath(ctx: Ctx, x: number, y: number, w: number, h: number) {
  const rise = w * 0.42;
  const mid = x + w / 2;
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x, y + rise);
  ctx.bezierCurveTo(x, y + rise * 0.45, mid - w * 0.12, y + rise * 0.5, mid, y);
  ctx.bezierCurveTo(mid + w * 0.12, y + rise * 0.5, x + w, y + rise * 0.45, x + w, y + rise);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
}

function arch(ctx: Ctx, img: ImageBitmap | null, x: number, y: number, w: number, h: number, i: number) {
  ctx.save();
  ctx.shadowColor = "rgba(31,42,92,0.18)";
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = "#fff";
  archPath(ctx, x - 14, y - 14, w + 28, h + 28);
  ctx.fill();
  ctx.restore();

  ctx.save();
  archPath(ctx, x, y, w, h);
  ctx.clip();
  if (img) {
    const s = Math.max(w / img.width, h / img.height);
    const iw = img.width * s;
    const ih = img.height * s;
    ctx.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
  } else {
    const tints = [C.sand, "#F6E7C8", "#F3DDD8", "#DDE6DF"];
    ctx.fillStyle = tints[i % 4];
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "rgba(31,42,92,0.12)";
    for (let yy = y + 10; yy < y + h; yy += 26)
      for (let xx = x + ((yy / 26) % 2 ? 13 : 0); xx < x + w; xx += 26) {
        ctx.beginPath();
        ctx.arc(xx, yy, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    buti(ctx, x + w / 2, y + h * 0.58, 120, [C.rani, C.marigold, C.leaf, C.indigo][i % 4], C.haldi, 8);
  }
  ctx.restore();

  ctx.strokeStyle = C.indigo;
  ctx.lineWidth = 5;
  archPath(ctx, x, y, w, h);
  ctx.stroke();
  ctx.save();
  ctx.strokeStyle = C.marigold;
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.setLineDash([0.1, 16]);
  archPath(ctx, x - 7, y - 7, w + 14, h + 14);
  ctx.stroke();
  ctx.restore();
  // Finial
  ctx.fillStyle = C.marigold;
  ctx.beginPath();
  ctx.arc(x + w / 2, y - 22, 9, 0, Math.PI * 2);
  ctx.fill();
}

function circleText(ctx: Ctx, text: string, cx: number, cy: number, r: number, font: string) {
  const chars = [...text];
  const sizePx = Math.min(15, (2 * Math.PI * r) / (chars.length * 0.62));
  ctx.font = `700 ${sizePx}px ${font}`;
  const total = chars.reduce((a, ch) => a + ctx.measureText(ch).width, 0);
  const scale = (2 * Math.PI * r * 0.97) / total;
  let a = -Math.PI / 2;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const ch of chars) {
    const cw = ctx.measureText(ch).width * scale;
    a += cw / 2 / r;
    ctx.save();
    ctx.translate(cx + r * Math.cos(a), cy + r * Math.sin(a));
    ctx.rotate(a + Math.PI / 2);
    ctx.fillText(ch, 0, 0);
    ctx.restore();
    a += cw / 2 / r;
  }
}

function stamp(ctx: Ctx, s: PassportStamp, cx: number, cy: number, r: number, mukta: string, rozha: string) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((s.rotate * Math.PI) / 180);
  ctx.globalAlpha = 0.88;
  ctx.strokeStyle = s.color;
  ctx.fillStyle = s.color;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, r - 9, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([4, 5]);
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.52, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  circleText(ctx, `${s.text} · `, 0, 0, r - 20, mukta);
  ctx.font = `${Math.round(r * 0.24)}px ${rozha}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(s.centre.toUpperCase(), 0, 2);
  ctx.restore();
}

function fitText(ctx: Ctx, text: string, max: number, size: number, font: string) {
  let s = size;
  ctx.font = `${s}px ${font}`;
  while (ctx.measureText(text).width > max && s > 40) {
    s -= 4;
    ctx.font = `${s}px ${font}`;
  }
  return s;
}

async function drawCard(canvas: HTMLCanvasElement, trip: Trip, photoIds: string[], stamps: PassportStamp[]) {
  await document.fonts.ready;
  const rozha = cssFont("--font-rozha", "Georgia, serif");
  const mukta = cssFont("--font-mukta", "system-ui, sans-serif");
  await Promise.all([document.fonts.load(`64px ${rozha}`), document.fonts.load(`700 30px ${mukta}`), document.fonts.load(`30px ${mukta}`, "कारवाँ")]).catch(() => {});

  const imgs = await Promise.all(
    photoIds.slice(0, 4).map(async (id) => {
      try {
        const b = await getPhotoBlob(id);
        return b ? await createImageBitmap(b) : null;
      } catch {
        return null;
      }
    }),
  );

  const ctx = canvas.getContext("2d")!;
  canvas.width = W;
  canvas.height = H;
  background(ctx);
  toran(ctx);

  // Title
  ctx.fillStyle = C.indigo;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  fitText(ctx, trip.name, W - 140, 92, rozha);
  ctx.fillText(trip.name, W / 2, 205);
  ctx.font = `500 34px ${mukta}`;
  ctx.fillStyle = C.muted;
  ctx.fillText([tripDatesLabel(trip), "Jaipur, Rajasthan"].filter(Boolean).join("  ·  "), W / 2, 258);
  // Little dotted wave under the title
  ctx.fillStyle = C.marigold;
  for (let i = 0; i < 24; i++) {
    const x = W / 2 - 180 + i * 15.6;
    ctx.beginPath();
    ctx.arc(x, 285 + Math.sin(i / 1.6) * 5, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Four arches
  const aw = 400;
  const ah = 380;
  const gx = (W - aw * 2) / 3;
  const top = 350;
  for (let i = 0; i < 4; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    arch(ctx, imgs[i] ?? null, gx + col * (aw + gx), top + row * (ah + 70), aw, ah, i);
  }
  imgs.forEach((b) => b?.close());

  // Stamps
  const ss = stamps.slice(0, 6);
  const sr = 66;
  const sy = 1182;
  if (ss.length) {
    const span = Math.min(W - 120, ss.length * (sr * 2 + 26));
    ss.forEach((s, i) => {
      const cx = W / 2 - span / 2 + (span / ss.length) * (i + 0.5);
      stamp(ctx, s, cx, sy + (i % 2 ? 8 : -6), sr, mukta, rozha);
    });
  } else {
    ctx.font = `30px ${cssFont("--font-kalam", "cursive")}`;
    ctx.fillStyle = C.rani;
    ctx.textAlign = "center";
    ctx.fillText("Stamps from your trip go here", W / 2, sy);
  }

  // Footer
  ctx.fillStyle = C.indigo;
  ctx.fillRect(0, H - 56, W, 56);
  ctx.textBaseline = "middle";
  ctx.font = `34px ${rozha}`;
  const left = "Kaarvaan · ";
  const lw = ctx.measureText(left).width;
  ctx.font = `600 32px ${mukta}`;
  const rw = ctx.measureText("कारवाँ").width;
  const x0 = W / 2 - (lw + rw) / 2;
  ctx.textAlign = "left";
  ctx.fillStyle = C.haldi;
  ctx.font = `34px ${rozha}`;
  ctx.fillText(left, x0, H - 26);
  ctx.font = `600 32px ${mukta}`;
  ctx.fillText("कारवाँ", x0 + lw, H - 24);
}

function toBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("encode"))), "image/png"));
}

/** "Make my trip card": a 1080×1350 block-print card drawn client-side. */
export function TripCardMaker({ open, onClose, trip }: { open: boolean; onClose: () => void; trip: Trip }) {
  return (
    <Sheet open={open} onClose={onClose} title="Make my trip card" wide>
      {open && <Maker trip={trip} />}
    </Sheet>
  );
}

function Maker({ trip }: { trip: Trip }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const photos = useStore((s) => s.photos);
  const checkIns = useStore((s) => s.checkIns);
  const [ready, setReady] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const tripPhotos = photos.filter((p) => p.tripId === trip.id).sort((a, b) => a.addedAt - b.addedAt);
  const ids = tripPhotos.slice(0, 4).map((p) => p.id);
  const stamps = tripStamps(trip.id, checkIns, photos);
  const sig = `${trip.id}|${trip.name}|${trip.start}|${trip.end}|${ids.join(",")}|${stamps.map((s) => s.key).join(",")}`;

  useEffect(() => {
    let live = true;
    const el = canvas.current;
    if (!el) return;
    void drawCard(el, trip, ids, stamps).then(() => {
      if (live) setReady(sig);
    });
    return () => {
      live = false;
    };
    // sig captures everything the drawing depends on
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig]);

  const drawn = ready === sig;
  const file = `kaarvaan-${trip.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "trip"}.png`;

  const download = async () => {
    if (!canvas.current) return;
    downloadBlob(await toBlob(canvas.current), file);
  };

  const share = async () => {
    if (!canvas.current) return;
    setBusy(true);
    try {
      const blob = await toBlob(canvas.current);
      const f = new File([blob], file, { type: "image/png" });
      if (navigator.canShare?.({ files: [f] })) {
        await navigator.share({ files: [f], title: trip.name, text: "My Jaipur trip, made with Kaarvaan" });
      } else {
        downloadBlob(blob, file);
        useStore.getState().showToast({ message: "Sharing isn't available here, so we downloaded it instead." });
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") useStore.getState().showToast({ message: "Couldn't share. Try Download instead." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4 pb-2">
      <p className="text-muted">
        {tripPhotos.length >= 4
          ? "Your first four photos, in jharokha arches."
          : `Uses your first photos${tripPhotos.length ? "" : " (none yet)"}; empty arches get a block-print pattern.`}{" "}
        Made on your phone. Nothing is uploaded.
      </p>
      <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-sand bg-sand shadow-lg" style={{ aspectRatio: `${W} / ${H}` }}>
        <canvas
          ref={canvas}
          width={W}
          height={H}
          className="h-full w-full"
          role="img"
          aria-label={`Trip card for ${trip.name}, with ${Math.min(4, tripPhotos.length)} photos and ${Math.min(6, stamps.length)} stamps`}
        />
        {!drawn && (
          <div className="absolute inset-0 flex items-center justify-center bg-ivory/80">
            <Loader2 className="h-8 w-8 animate-spin text-marigold-ink" aria-hidden="true" />
            <span className="sr-only">Drawing your card…</span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button className="flex-1" onClick={download} disabled={!drawn}>
          <Download className="h-5 w-5" aria-hidden="true" />
          Download
        </Button>
        <Button variant="secondary" className="flex-1" onClick={share} disabled={!drawn || busy}>
          <Share2 className="h-5 w-5" aria-hidden="true" />
          Share
        </Button>
      </div>
    </div>
  );
}
