"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LocateFixed, Loader2, MapPin } from "lucide-react";
import { getPosition, haversine, reverseGeocodeState, slugify } from "@/lib/geo";
import { useStore } from "@/lib/store";
import { areas } from "@/lib/content/areas";
import { states } from "@/lib/content/states";
import { useT } from "@/lib/i18n";
import { Sheet } from "./ui/Sheet";
import type { AreaSlug } from "@/lib/types";

export type LocateResult = { kind: "rajasthan" } | { kind: "other"; state: string } | { kind: "failed" };

/** Ask for location only on tap. Coordinates stay in memory. */
export async function locate(): Promise<LocateResult> {
  try {
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;
    useStore.getState().setCoords({ lat, lng });
    const name = await reverseGeocodeState(lat, lng);
    const nearJaipur = haversine(lat, lng, 26.9124, 75.7873) < 150;
    if (nearJaipur || (name && slugify(name) === "rajasthan")) {
      // pick the nearest area
      let best: AreaSlug | null = null;
      let bestD = Infinity;
      for (const a of areas) {
        const d = haversine(lat, lng, a.lat, a.lng);
        if (d < bestD) {
          bestD = d;
          best = a.slug;
        }
      }
      useStore.getState().set({ stateSlug: "rajasthan", area: bestD < 25 ? best : useStore.getState().area });
      return { kind: "rajasthan" };
    }
    if (name) return { kind: "other", state: name };
    return { kind: "failed" };
  } catch {
    return { kind: "failed" };
  }
}

export function LocationButton({ className = "", onResult, dark = false }: { className?: string; onResult?: (r: LocateResult) => void; dark?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [other, setOther] = useState<string | null>(null);
  const [picker, setPicker] = useState(false);
  const t = useT();
  const router = useRouter();
  const onClick = async () => {
    setBusy(true);
    const r = await locate();
    setBusy(false);
    onResult?.(r);
    if (r.kind === "rajasthan") useStore.getState().showToast({ message: "You're in Rajasthan. Showing what's near you." });
    else if (r.kind === "other") setOther(r.state);
    else setPicker(true);
  };
  return (
    <>
      <button
        onClick={onClick}
        disabled={busy}
        className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold ${
          dark ? "text-haldi hover:bg-white/10" : "text-indigo ring-1 ring-sand hover:bg-sand/60"
        } ${className}`}
        title="We use it to open the right state and show what's near you. It's never stored."
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <LocateFixed className="h-4 w-4" aria-hidden="true" />}
        {t("home.useLocation")}
      </button>
      <Sheet open={!!other} onClose={() => setOther(null)} title="Aa rahe hain!">
        <p className="text-lg">
          Kaarvaan is coming to <strong>{other}</strong> soon. <span className="text-muted">(Coming soon)</span>
        </p>
        <p className="mt-2 text-muted">Explore Rajasthan meanwhile: Jaipur is live, with makers, food and places mapped out.</p>
        <button
          onClick={() => {
            setOther(null);
            useStore.getState().set({ stateSlug: "rajasthan" });
            router.push("/shop/rajasthan");
          }}
          className="mt-5 min-h-11 rounded-full bg-rani px-5 font-semibold text-white"
        >
          Explore Rajasthan
        </button>
      </Sheet>
      <AreaPickerSheet open={picker} onClose={() => setPicker(false)} note="No problem. Pick where you are, or where you're headed." />
    </>
  );
}

export function AreaPickerSheet({ open, onClose, note }: { open: boolean; onClose: () => void; note?: string }) {
  const area = useStore((s) => s.area);
  const set = useStore((s) => s.set);
  const live = states.find((s) => s.live);
  return (
    <Sheet open={open} onClose={onClose} title="Where in Jaipur?">
      {note && <p className="mb-3 text-muted">{note}</p>}
      <p className="mb-2 text-sm font-semibold text-indigo">
        {live?.name} · Jaipur
      </p>
      <ul className="grid gap-2">
        {areas
          .filter((a) => a.slug !== "abhaneri")
          .map((a) => (
            <li key={a.slug}>
              <button
                onClick={() => {
                  set({ area: a.slug, stateSlug: "rajasthan" });
                  onClose();
                }}
                aria-pressed={area === a.slug}
                className={`flex min-h-12 w-full items-center gap-3 rounded-2xl border-2 px-4 py-2 text-left ${
                  area === a.slug ? "border-marigold bg-haldi/20" : "border-sand bg-white hover:border-marigold"
                }`}
              >
                <MapPin className="h-5 w-5 shrink-0 text-rani" aria-hidden="true" />
                <span>
                  <span className="block font-semibold">{a.name}</span>
                  <span className="block text-sm text-muted">{a.detail}</span>
                </span>
              </button>
            </li>
          ))}
      </ul>
    </Sheet>
  );
}
