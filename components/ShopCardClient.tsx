"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Languages, MapPin } from "lucide-react";
import type { Shop } from "@/lib/types";
import { CRAFT_NAMES } from "@/lib/content/meta";
import { formatKm, haversine, openStatus } from "@/lib/geo";
import { useStore } from "@/lib/store";
import { useNow } from "@/lib/useNow";
import { Chip, OpenChip } from "./ui/Chip";
import { SampleRibbon } from "./ui/SampleRibbon";
import { VerifiedSeal } from "./motifs/VerifiedSeal";
import { SaveButton } from "./ItemActions";

export function useDistance(lat: number, lng: number): string | null {
  const coords = useStore((s) => s.coords);
  if (!coords) return null;
  return formatKm(haversine(coords.lat, coords.lng, lat, lng));
}

/** Interactive shop card (open-now, distance, save). `tile` is the server-rendered craft illustration. */
export function ShopCardClient({ shop, tile }: { shop: Shop; tile: ReactNode }) {
  const now = useNow();
  const status = now ? openStatus(shop.hours, now) : null;
  const dist = useDistance(shop.lat, shop.lng);
  const craft = CRAFT_NAMES[shop.craft];
  return (
    <article className="card relative overflow-hidden">
      <Link href={`/shop/rajasthan/${shop.craft}/${shop.slug}`} className="grid grid-cols-[96px_1fr] gap-0 sm:grid-cols-[120px_1fr]">
        {tile}
        <div className="min-w-0 p-3 pr-14">
          <SampleRibbon className="mb-1" />
          <h3 className="text-xl leading-tight">{shop.name}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-muted">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {shop.market}
            {dist && <span className="font-semibold text-indigo"> · {dist}</span>}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {status && <OpenChip open={status.open} label={status.open ? "Open now" : "Closed now"} />}
            <Chip tone="sand">
              <Languages className="h-3.5 w-3.5" aria-hidden="true" /> {shop.languages.slice(0, 2).join(", ")}
            </Chip>
          </div>
          <p className="mt-1.5 text-sm text-ink/80">
            Makers: {shop.makers.map((m) => m.name).join(", ")}
          </p>
        </div>
      </Link>
      <div className="absolute right-2 top-2">
        <SaveButton item={{ kind: "shop", slug: shop.slug }} title={shop.name} compact />
      </div>
      <div className="pointer-events-none absolute bottom-1 right-1">
        <VerifiedSeal size={52} date={new Date(shop.visitedOn).toLocaleDateString("en-IN", { month: "short", year: "numeric" })} label={`Visited · ${craft?.name ?? ""}`.trim()} />
      </div>
    </article>
  );
}

