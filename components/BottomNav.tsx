"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarRange, Camera, Home, ShoppingBag, Sparkles } from "lucide-react";
import { StampIcon } from "./motifs/StampIcon";
import { useT } from "@/lib/i18n";

const TABS = [
  { href: "/", key: "nav.home", icon: Home, color: "#1F2A5C" },
  { href: "/shop", key: "nav.shopping", icon: ShoppingBag, color: "#C2185B" },
  { href: "/experiences", key: "nav.experiences", icon: Sparkles, color: "#2E7D5B" },
  { href: "/plan", key: "nav.plan", icon: CalendarRange, color: "#1F2A5C" },
  { href: "/memories", key: "nav.memories", icon: Camera, color: "#B5462F" },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const t = useT();
  return (
    <nav
      aria-label="Bottom"
      className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-sand bg-ivory/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="grid grid-cols-5">
        {TABS.map((tab) => {
          const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href) || (tab.href === "/shop" && pathname.startsWith("/price-check"));
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className="flex min-h-16 flex-col items-center justify-center gap-0.5 pt-1.5 pb-1"
              >
                <StampIcon
                  icon={tab.icon}
                  size={active ? 38 : 34}
                  color={active ? (tab.key === "nav.memories" ? "#E8A33D" : tab.color) : "#EFE3CF"}
                  iconColor={active ? (tab.key === "nav.memories" ? "#141B3D" : "#FBF6EC") : "#1F2A5C"}
                  ring={active ? "#E8A33D" : "transparent"}
                  className="transition-all"
                />
                <span className={`text-xs leading-tight ${active ? "font-bold text-indigo" : "font-medium text-muted"}`}>{t(tab.key)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
