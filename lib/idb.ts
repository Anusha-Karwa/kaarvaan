"use client";

import { clear, createStore, del, get, keys, set } from "idb-keyval";

let store: ReturnType<typeof createStore> | null = null;
const photos = () => (store ??= createStore("kaarvaan", "photos"));

export const savePhotoBlob = (id: string, blob: Blob) => set(id, blob, photos());
export const getPhotoBlob = (id: string) => get<Blob>(id, photos());
export const deletePhotoBlob = (id: string) => del(id, photos());
export const clearPhotos = () => clear(photos());
export const photoKeys = () => keys(photos());

/** Downscale to max 1600px on the long edge and re-encode as JPEG. */
export async function compressImage(file: File, max = 1600, quality = 0.82): Promise<{ blob: Blob; w: number; h: number }> {
  const bitmap = await createImageBitmap(file).catch(async () => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    await img.decode();
    URL.revokeObjectURL(url);
    return img;
  });
  const bw = "width" in bitmap ? bitmap.width : 0;
  const bh = "height" in bitmap ? bitmap.height : 0;
  const scale = Math.min(1, max / Math.max(bw, bh));
  const w = Math.round(bw * scale);
  const h = Math.round(bh * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap as CanvasImageSource, 0, 0, w, h);
  const blob = await new Promise<Blob>((res, rej) =>
    canvas.toBlob((b) => (b ? res(b) : rej(new Error("encode failed"))), "image/jpeg", quality),
  );
  return { blob, w, h };
}
