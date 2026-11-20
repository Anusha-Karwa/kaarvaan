"use client";

import { Ban, Hand, MapPinned, RefreshCw, Users } from "lucide-react";
import { RouteLine, type RouteStop } from "@/components/motifs/RouteLine";

export const CHOOSE_STOPS: RouteStop[] = [
  { label: "Visited in person", sub: "We go, we watch, we listen", icon: MapPinned, color: "#1F2A5C", href: "#step-1" },
  { label: "Handmade", sub: "By hand, start to finish", icon: Hand, color: "#C2185B", href: "#step-2" },
  { label: "Makers named", sub: "Real people, real names", icon: Users, color: "#2E7D5B", href: "#step-3" },
  { label: "No driver commission", sub: "Nobody pays to be here", icon: Ban, color: "#B5462F", href: "#step-4" },
  { label: "Fair prices", sub: "Re-checked regularly", icon: RefreshCw, color: "#1F2A5C", href: "#step-5" },
];

/** The 5-step RouteLine: vertical on mobile, horizontal from md up. */
export function ChooseRoute() {
  return (
    <>
      <RouteLine
        stops={CHOOSE_STOPS}
        orientation="vertical"
        ariaLabel="Our five checks"
        className="md:hidden [--seg:4.75rem]"
      />
      <RouteLine stops={CHOOSE_STOPS} orientation="horizontal" ariaLabel="Our five checks" className="hidden md:block" />
    </>
  );
}
