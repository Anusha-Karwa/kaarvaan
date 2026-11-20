"use client";

import { CalendarPlus, Check, Heart, MessageCircle, Navigation, Phone } from "lucide-react";
import type { ItemRef } from "@/lib/types";
import { useIsSaved, useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { directionsUrl } from "@/lib/maps";
import { telLink, waLink } from "@/lib/whatsapp";
import { buttonClass } from "./ui/Button";

function offlineNote(what: string) {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    useStore.getState().showToast({ message: `You're offline. ${what} may need signal: it will work once you're back online.` });
  }
}

export function SaveButton({ item, title, compact = false, className = "" }: { item: ItemRef; title: string; compact?: boolean; className?: string }) {
  const saved = useIsSaved(item);
  const hydrated = useStore((s) => s.hydrated);
  const t = useT();
  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const s = useStore.getState();
    const now = s.toggleSave(item);
    s.showToast(
      now
        ? { message: `Saved to Mera thela: ${title}` }
        : { message: `Removed ${title}`, actionLabel: t("act.undo"), onAction: () => useStore.getState().toggleSave(item) },
    );
  };
  const on = hydrated && saved;
  if (compact) {
    return (
      <button
        onClick={onClick}
        aria-pressed={on}
        aria-label={on ? `Remove ${title} from Mera thela` : `Save ${title} to Mera thela`}
        className={`flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow ring-1 ring-sand transition-transform active:scale-90 ${className}`}
      >
        <Heart className={`h-5 w-5 ${on ? "fill-rani text-rani" : "text-indigo"}`} aria-hidden="true" />
      </button>
    );
  }
  return (
    <button onClick={onClick} aria-pressed={on} className={buttonClass("secondary", "md", className)}>
      <Heart className={`h-5 w-5 ${on ? "fill-rani text-rani" : ""}`} aria-hidden="true" />
      {on ? t("act.saved") : t("act.save")}
    </button>
  );
}

export function AddToPlanButton({
  item,
  title,
  className = "",
  variant = "secondary",
  extra,
}: {
  item: ItemRef;
  title: string;
  className?: string;
  variant?: "secondary" | "leaf" | "primary";
  extra?: { status?: "requested" };
}) {
  const t = useT();
  const inPlan = useStore((s) => {
    const trip = s.trips.find((x) => x.id === s.activeTripId);
    return !!s.hydrated && !!trip?.days.some((d) => d.some((x) => x.kind === item.kind && x.slug === item.slug));
  });
  const onClick = () => {
    const s = useStore.getState();
    const before = s.trips.find((x) => x.id === s.activeTripId)!.days;
    const day = s.addToPlan(item, undefined, extra);
    s.showToast({
      message: `Added ${title} to Day ${day + 1}`,
      actionLabel: t("act.undo"),
      onAction: () => useStore.getState().setDays(before),
    });
  };
  return (
    <button onClick={onClick} className={buttonClass(variant, "md", className)}>
      {inPlan ? <Check className="h-5 w-5" aria-hidden="true" /> : <CalendarPlus className="h-5 w-5" aria-hidden="true" />}
      {inPlan ? "In your plan" : t("act.addPlan")}
    </button>
  );
}

export function DirectionsButton({ lat, lng, className = "", variant = "primary" }: { lat: number; lng: number; className?: string; variant?: "primary" | "secondary" | "leaf" }) {
  const t = useT();
  return (
    <a
      href={directionsUrl(lat, lng)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => offlineNote("Directions")}
      className={buttonClass(variant, "md", className)}
    >
      <Navigation className="h-5 w-5" aria-hidden="true" />
      {t("act.directions")}
    </a>
  );
}

export function WhatsAppButton({ number, text, className = "", label }: { number: string; text: string; className?: string; label?: string }) {
  const t = useT();
  return (
    <a
      href={waLink(number, text)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => offlineNote("WhatsApp")}
      className={buttonClass("leaf", "md", className)}
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      {label ?? t("act.whatsapp")}
    </a>
  );
}

export function CallButton({ phone, className = "", compact = false }: { phone: string; className?: string; compact?: boolean }) {
  const t = useT();
  if (compact)
    return (
      <a href={telLink(phone)} aria-label={t("act.call")} className={`flex h-11 w-11 items-center justify-center rounded-full border-2 border-indigo text-indigo hover:bg-indigo hover:text-ivory ${className}`}>
        <Phone className="h-5 w-5" aria-hidden="true" />
      </a>
    );
  return (
    <a href={telLink(phone)} className={buttonClass("secondary", "md", className)}>
      <Phone className="h-5 w-5" aria-hidden="true" />
      {t("act.call")}
    </a>
  );
}

/** Sticky bottom action bar for detail pages (sits above the bottom nav on mobile). */
export function StickyActions({ children }: { children: React.ReactNode }) {
  return (
    <div className="no-print fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-30 border-t border-sand bg-ivory/95 px-3 py-2 backdrop-blur md:sticky md:bottom-4 md:mx-auto md:mt-8 md:max-w-3xl md:rounded-full md:border md:px-4 md:shadow-lg">
      <div className="flex items-center gap-2 max-md:[&>*]:min-w-0 max-md:[&>*]:flex-1 max-md:[&>*]:px-2 max-md:[&>*]:text-[15px] max-md:[&>.w-11]:flex-none max-md:[&>.w-11]:px-0 [&>*]:shrink-0 max-md:[&>*]:shrink">{children}</div>
    </div>
  );
}
