"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  Compass,
  Download,
  FileDown,
  Heart,
  Languages,
  MapPinned,
  ShieldCheck,
  Smartphone,
  SquarePlus,
  Trash2,
  User,
  WifiOff,
  Accessibility,
  type LucideIcon,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { downloadBlob } from "@/lib/share";
import { clearPhotos } from "@/lib/idb";
import type { Lang, Mode } from "@/lib/types";
import { INTERESTS } from "@/components/Onboarding";
import { StampIcon } from "@/components/motifs/StampIcon";
import { BlockPrintPattern } from "@/components/motifs/BlockPrintPattern";
import { Buti } from "@/components/motifs/Buti";
import { ChipButton } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { Skeleton } from "@/components/ui/Skeleton";
import { Handnote } from "@/components/ui/Handnote";
import { OfflineDownload } from "./OfflineDownload";
import { InstallHint } from "./InstallHint";

function Panel({ icon, color, title, id, children }: { icon: LucideIcon; color: string; title: string; id: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="card p-5">
      <div className="mb-3 flex items-center gap-3">
        <StampIcon icon={icon} color={color} size={44} />
        <h2 id={id} className="text-2xl">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { id: T; label: ReactNode; sub?: ReactNode; icon?: LucideIcon }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="grid grid-cols-2 gap-2">
      {options.map((o) => {
        const on = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o.id)}
            className={`flex min-h-14 flex-col items-start justify-center rounded-2xl border-2 px-3 py-2 text-left transition-colors ${
              on ? "border-indigo bg-indigo text-ivory" : "border-sand bg-white text-ink hover:border-marigold"
            }`}
          >
            <span className="flex items-center gap-1.5 font-semibold">
              {o.icon && <o.icon className="h-4 w-4" aria-hidden="true" />}
              {o.label}
            </span>
            {o.sub && <span className={`text-xs ${on ? "text-ivory/80" : "text-muted"}`}>{o.sub}</span>}
          </button>
        );
      })}
    </div>
  );
}

function exportTrip() {
  const state = useStore.getState();
  const partialize = useStore.persist.getOptions().partialize;
  const data = partialize ? partialize(state) : {};
  const payload = {
    app: "Kaarvaan",
    format: 1,
    exportedAt: new Date().toISOString(),
    note: "Everything Kaarvaan stored on your device. Photos themselves stay on your phone; photo captions, tags and sizes are in data.photos.",
    photoCount: state.photos.length,
    data,
  };
  const day = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD, local
  downloadBlob(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }), `kaarvaan-trip-${day}.json`);
  state.showToast({ message: "Trip exported. Check your downloads." });
}

export function SettingsPanel() {
  const t = useT();
  const hydrated = useStore((s) => s.hydrated);
  const mode = useStore((s) => s.mode);
  const lang = useStore((s) => s.lang);
  const name = useStore((s) => s.name);
  const interests = useStore((s) => s.interests);
  const reduceMotion = useStore((s) => s.reduceMotion);
  const counts = {
    saved: useStore((s) => s.saved.length),
    trips: useStore((s) => s.trips.length),
    photos: useStore((s) => s.photos.length),
  };
  const set = useStore((s) => s.set);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!hydrated) {
    return (
      <div className="grid gap-5 lg:grid-cols-2" aria-busy="true" aria-label="Loading your settings">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-44" />
        ))}
      </div>
    );
  }

  const deleteAll = async () => {
    setBusy(true);
    try {
      await clearPhotos();
    } catch {
      /* photo store may not exist yet */
    }
    useStore.getState().resetAll();
    setBusy(false);
    setConfirm(false);
    useStore.getState().showToast({ message: "Everything deleted. A fresh start!" });
  };

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel icon={Compass} color="#1F2A5C" title={t("mode.label")} id="set-mode">
          <Segmented<Mode>
            label={t("mode.label")}
            value={mode}
            onChange={(m) => set({ mode: m })}
            options={[
              { id: "planning", label: t("mode.planningLong"), icon: Compass, sub: "Ideas, saving and day plans" },
              { id: "here", label: t("mode.hereLong"), icon: MapPinned, sub: "Near me, open now, bigger text" },
            ]}
          />
        </Panel>

        <Panel icon={Languages} color="#C2185B" title="Language" id="set-lang">
          <Segmented<Lang>
            label="Interface language"
            value={lang}
            onChange={(l) => set({ lang: l })}
            options={[
              { id: "en", label: "English", sub: "Menus and buttons" },
              {
                id: "hi",
                label: (
                  <span lang="hi" className="deva">
                    हिन्दी
                  </span>
                ),
                sub: "Hindi menus and buttons",
              },
            ]}
          />
          <p className="mt-2 text-sm text-muted">Guides stay in English, with Hindi names alongside.</p>
        </Panel>

        <Panel icon={User} color="#2E7D5B" title="Your name" id="set-name">
          <label htmlFor="name" className="text-[15px]">
            Optional. Only used for the greeting on the home page.
          </label>
          <input
            id="name"
            type="text"
            autoComplete="given-name"
            maxLength={30}
            value={name}
            placeholder="e.g. Ananya"
            onChange={(e) => set({ name: e.target.value })}
            className="mt-2 min-h-12 w-full rounded-xl border-2 border-sand bg-white px-4 text-lg outline-none focus:border-marigold"
          />
          <Handnote className="mt-2" color="text-rani">
            Namaste, {name.trim() || "traveller"}!
          </Handnote>
        </Panel>

        <Panel icon={Heart} color="#B5462F" title="What you love" id="set-interests">
          <p className="mb-3 text-[15px]">We shape your home page around these.</p>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((i) => (
              <ChipButton
                key={i}
                active={interests.includes(i)}
                onClick={() => set({ interests: interests.includes(i) ? interests.filter((x) => x !== i) : [...interests, i] })}
              >
                {i}
              </ChipButton>
            ))}
          </div>
        </Panel>

        <Panel icon={Accessibility} color="#1F2A5C" title="Motion" id="set-motion">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p id="rm-label" className="font-semibold">
                Reduce motion
              </p>
              <p id="rm-desc" className="text-sm text-muted">
                Turns off petal confetti, spinning mandalas and drawing animations.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={reduceMotion}
              aria-labelledby="rm-label"
              aria-describedby="rm-desc"
              onClick={() => set({ reduceMotion: !reduceMotion })}
              className={`relative inline-flex h-11 w-[72px] shrink-0 items-center rounded-full p-1 transition-colors ${
                reduceMotion ? "bg-leaf" : "bg-sand"
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full bg-white shadow transition-transform ${
                  reduceMotion ? "translate-x-7" : ""
                }`}
              >
                <Buti size={18} color={reduceMotion ? "#2E7D5B" : "#E8A33D"} />
              </span>
            </button>
          </div>
          <p className="mt-2 text-sm text-muted">Your phone&apos;s own &ldquo;reduce motion&rdquo; setting is always respected too.</p>
        </Panel>

        <Panel icon={WifiOff} color="#2E7D5B" title="Offline" id="set-offline">
          <OfflineDownload />
        </Panel>

        <Panel icon={SquarePlus} color="#C2185B" title="Install Kaarvaan" id="set-install">
          <InstallHint />
        </Panel>

        <Panel icon={Download} color="#1F2A5C" title="Your data" id="set-data">
          <p className="text-[15px]">
            On this phone: {counts.saved} saved {counts.saved === 1 ? "item" : "items"}, {counts.trips} {counts.trips === 1 ? "trip" : "trips"},{" "}
            {counts.photos} {counts.photos === 1 ? "photo" : "photos"}.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="secondary" onClick={exportTrip}>
              <FileDown className="h-5 w-5" aria-hidden="true" /> Export my trip
            </Button>
            <Button variant="ghost" className="!text-terracotta ring-2 ring-terracotta/40 hover:!bg-terracotta/10" onClick={() => setConfirm(true)}>
              <Trash2 className="h-5 w-5" aria-hidden="true" /> Delete everything
            </Button>
          </div>
          <p className="mt-2 text-sm text-muted">Export saves a .json file you can keep as a backup.</p>
        </Panel>
      </div>

      <section aria-labelledby="set-privacy" className="relative mt-6 overflow-hidden rounded-3xl bg-indigo p-6 text-ivory">
        <BlockPrintPattern color="#E8A33D" opacity={0.08} />
        <div className="relative grid items-center gap-4 sm:grid-cols-[auto_1fr_auto]">
          <StampIcon icon={ShieldCheck} color="#2E7D5B" size={64} />
          <div>
            <h2 id="set-privacy" className="text-2xl text-ivory">
              {t("common.privateTrip")}
            </h2>
            <p className="mt-1 text-ivory/85">
              No account. Location only when you tap, never stored. Saved items, trips and photos live on this device only. Anonymous page
              counts, no cookies.
            </p>
          </div>
          <Link
            href="/privacy"
            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border-2 border-haldi px-5 font-semibold text-haldi hover:bg-haldi hover:text-indigo-dark"
          >
            <Smartphone className="h-4 w-4" aria-hidden="true" /> {t("nav.privacy")}
          </Link>
        </div>
      </section>

      <Sheet open={confirm} onClose={() => setConfirm(false)} title="Delete everything?">
        <p>
          This removes all your saved items, trips, day plans, journal notes, check-ins, passport stamps, photos and settings from this
          phone. <strong>It can&apos;t be undone.</strong>
        </p>
        <p className="mt-2 text-sm text-muted">Want a copy first? Export your trip, then delete.</p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row-reverse">
          <Button onClick={deleteAll} disabled={busy} className="!bg-terracotta !shadow-[inset_0_-2px_0_#7d2f1f]">
            <Trash2 className="h-5 w-5" aria-hidden="true" /> {busy ? "Deleting…" : "Yes, delete everything"}
          </Button>
          <Button variant="secondary" onClick={exportTrip}>
            <FileDown className="h-5 w-5" aria-hidden="true" /> Export first
          </Button>
          <Button variant="ghost" onClick={() => setConfirm(false)} data-autofocus>
            Keep my trip
          </Button>
        </div>
      </Sheet>
    </>
  );
}
