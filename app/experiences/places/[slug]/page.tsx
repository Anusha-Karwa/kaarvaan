import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, Hourglass, MapPin, Sunrise, Users } from "lucide-react";
import { getArea, getDish, getPlace, places } from "@/lib/data";
import { hoursLabel } from "@/lib/geo";
import { DishCard, PlaceCard, ShopCard } from "@/components/Cards";
import { AddToPlanButton, DirectionsButton, SaveButton, StickyActions } from "@/components/ItemActions";
import { Chip } from "@/components/ui/Chip";
import { LiveOpen } from "@/components/experiences/LiveOpen";
import {
  ArchFrame,
  BackLink,
  ButiList,
  Callout,
  DetailSection,
  Divider,
  FactTile,
  PaperNote,
} from "@/components/experiences/DetailParts";
import { nearestPlace, shopsNear } from "@/components/experiences/nearby";

export const dynamicParams = false;

export function generateStaticParams() {
  return places.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPlace(slug);
  if (!p) return { title: "Place" };
  return { title: p.name, description: p.why };
}

export default async function PlacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPlace(slug);
  if (!p) notFound();

  const area = getArea(p.area);
  const ref = { kind: "place" as const, slug: p.slug };
  const food = getDish(p.nearbyFood);
  const shops = shopsNear(p.nearbyCrafts, p.area, 3);
  const otherPlace = nearestPlace(p.lat, p.lng, p.area, p.slug);

  return (
    <div className="container-k pb-20 pt-4 md:pb-6">
      <BackLink tab="places" label="Places" />

      <header className="mt-2 grid items-center gap-6 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-10">
        <ArchFrame name={p.illustration} tint="#EAF0F8" title={`${p.name} illustration`} className="max-w-[17rem] md:max-w-[20rem]" />
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-wide text-leaf-dark">
            Place · {area?.name}
            {p.dayTrip ? " · day trip" : ""}
          </p>
          <h1 className="mt-1 text-[34px] leading-tight sm:text-[42px]">{p.name}</h1>
          <p lang="hi" className="deva text-xl text-muted">
            {p.nameHi}
          </p>
          <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-ink/90">{p.why}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <LiveOpen hours={p.hours} />
            <Chip tone="sand">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {area?.name}
            </Chip>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <FactTile icon={Sunrise} label="Best time">
              {p.bestTime}
            </FactTile>
            <FactTile icon={Hourglass} label="Time needed">
              {p.timeNeeded}
            </FactTile>
            <FactTile icon={Clock} label="Open hours">
              {hoursLabel(p.hours)}
            </FactTile>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <AddToPlanButton item={ref} title={p.name} variant="leaf" />
            <SaveButton item={ref} title={p.name} />
          </div>
        </div>
      </header>

      <Divider />

      <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[1fr_22rem]">
        <div className="min-w-0 space-y-10">
          <DetailSection id="why-go" title="Why go">
            <p className="text-[17px] leading-relaxed">{p.why}</p>
          </DetailSection>
          <DetailSection id="history" title="A little history" hi="थोड़ा इतिहास">
            <p className="leading-relaxed text-ink/90">{p.history}</p>
          </DetailSection>
          <DetailSection id="dont-miss" title="Don't miss">
            <ButiList items={p.mustSee} />
          </DetailSection>
        </div>
        <aside className="space-y-7" aria-label="Local tips">
          <Callout icon={Users} title="Beat the crowd" tone="leaf">
            {p.crowdTip}
          </Callout>
          <PaperNote label="Instagram-free angle">{p.angleTip}</PaperNote>
        </aside>
      </div>

      <Divider />

      <DetailSection id="nearby" title="Nearby" hi="आस-पास">
        <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {food && (
            <div>
              <h3 className="mb-3 font-sans text-lg font-bold text-indigo">Food stop</h3>
              <DishCard d={food} />
            </div>
          )}
          {otherPlace && (
            <div>
              <h3 className="mb-3 font-sans text-lg font-bold text-indigo">Also close by</h3>
              <PlaceCard p={otherPlace} />
            </div>
          )}
        </div>

        <h3 className="mb-3 mt-8 font-sans text-lg font-bold text-indigo">Genuine shops nearby</h3>
        {shops.length ? (
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {shops.map((s) => (
              <li key={s.slug}>
                <ShopCard shop={s} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl border border-dashed border-sand bg-white/70 p-4">
            No craft shops out here, just village life. Save your shopping for the city:{" "}
            <Link href="/shop/rajasthan" className="link-wavy">
              see Jaipur&apos;s genuine crafts
            </Link>
            .
          </p>
        )}
      </DetailSection>

      <StickyActions>
        <DirectionsButton lat={p.lat} lng={p.lng} variant="secondary" />
        <AddToPlanButton item={ref} title={p.name} variant="leaf" />
        <SaveButton item={ref} title={p.name} compact />
      </StickyActions>
    </div>
  );
}
