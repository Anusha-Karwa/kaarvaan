import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, Hand, MapPin, Soup } from "lucide-react";
import { dishes, getArea, getDish } from "@/lib/data";
import { hoursLabel } from "@/lib/geo";
import { DishCard, PlaceCard } from "@/components/Cards";
import { AddToPlanButton, DirectionsButton, SaveButton, StickyActions } from "@/components/ItemActions";
import { Chillies, Chip, VegMark } from "@/components/ui/Chip";
import { Handnote } from "@/components/ui/Handnote";
import { SampleRibbon } from "@/components/ui/SampleRibbon";
import { StampIcon } from "@/components/motifs";
import { LiveOpen } from "@/components/experiences/LiveOpen";
import { ArchFrame, BackLink, DetailSection, Divider } from "@/components/experiences/DetailParts";
import { nearestDishes, nearestPlace } from "@/components/experiences/nearby";

export const dynamicParams = false;

export function generateStaticParams() {
  return dishes.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = getDish(slug);
  if (!d) return { title: "Food" };
  return { title: d.name, description: d.hook };
}

const SPICE = { 1: "Mild", 2: "Medium spicy", 3: "Properly hot" } as const;

export default async function DishPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = getDish(slug);
  if (!d) notFound();

  const ref = { kind: "dish" as const, slug: d.slug };
  const first = d.spots[0];
  const place = first ? nearestPlace(first.lat, first.lng, first.area) : undefined;
  // Prefer dishes eaten at the same time of day, then the closest ones.
  const near = first ? nearestDishes(first.lat, first.lng, d.slug) : dishes.filter((x) => x.slug !== d.slug);
  const others = [...near.filter((x) => x.bestTime === d.bestTime), ...near.filter((x) => x.bestTime !== d.bestTime)].slice(0, 2);

  return (
    <div className="container-k pb-20 pt-4 md:pb-6">
      <BackLink tab="food" label="Food" />

      <header className="mt-2 grid items-center gap-6 md:grid-cols-[minmax(0,19rem)_1fr] md:gap-10">
        <ArchFrame name={d.illustration} tint="#FBEBDD" title={`${d.name} illustration`} className="max-w-[15rem] md:max-w-[19rem]" />
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-wide text-leaf-dark">Food · Jaipur favourite</p>
          <h1 className="mt-1 flex items-center gap-3 text-[34px] leading-tight sm:text-[42px]">
            <VegMark veg={d.veg} className="shrink-0 scale-125" />
            {d.name}
          </h1>
          <p lang="hi" className="deva text-xl text-muted">
            {d.nameHi}
          </p>
          <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-ink/90">{d.hook}</p>
          <ul className="mt-4 flex flex-wrap items-center gap-2" aria-label="Key details">
            <li>
              <Chip tone={d.veg ? "leaf" : "terracotta"}>
                <VegMark veg={d.veg} /> {d.veg ? "Vegetarian" : "Non-veg"}
              </Chip>
            </li>
            <li>
              <Chip tone="sand">
                <Chillies level={d.spice} /> {SPICE[d.spice]}
              </Chip>
            </li>
            <li>
              <Chip tone="haldi">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {d.bestTimeLabel}
              </Chip>
            </li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            <AddToPlanButton item={ref} title={d.name} variant="leaf" />
            <SaveButton item={ref} title={d.name} />
          </div>
        </div>
      </header>

      <Divider />

      <div className="grid gap-10 md:grid-cols-2">
        <DetailSection id="what" title="What it is">
          <div className="flex items-start gap-4">
            <StampIcon icon={Soup} color="#B5462F" size={44} />
            <p className="leading-relaxed">{d.what}</p>
          </div>
        </DetailSection>
        <DetailSection id="how" title="How to eat it">
          <div className="flex items-start gap-4">
            <StampIcon icon={Hand} color="#1F2A5C" size={44} />
            <p className="leading-relaxed">{d.howToEat}</p>
          </div>
        </DetailSection>
      </div>

      <section aria-labelledby="veg" className="mt-10 rounded-2xl border border-sand bg-white p-4 sm:p-5">
        <h2 id="veg" className="flex items-center gap-2 text-2xl">
          <VegMark veg={d.veg} /> Vegetarian-friendly?
        </h2>
        <p className="mt-2 leading-relaxed">{d.vegNote}</p>
      </section>

      <Divider />

      <DetailSection id="where" title="Where to try it" hi="कहाँ खाएँ">
        <ul className="grid gap-4 md:grid-cols-2">
          {d.spots.map((s) => (
            <li key={s.name} className="card relative flex flex-col p-4">
              <SampleRibbon className="self-start" />
              <h3 className="mt-2 text-xl leading-tight">{s.name}</h3>
              <p className="mt-0.5 flex items-center gap-1 text-sm text-muted">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {getArea(s.area)?.name}
              </p>
              <div className="mt-2">
                <LiveOpen hours={s.hours} />
              </div>
              <p className="mt-1 text-sm text-muted">{hoursLabel(s.hours)}</p>
              <p className="mt-2 flex-1 leading-relaxed">{s.note}</p>
              <div className="mt-3">
                <DirectionsButton lat={s.lat} lng={s.lng} variant="secondary" />
              </div>
            </li>
          ))}
        </ul>
        <Handnote color="text-leaf-dark" className="mt-4 -rotate-1">
          Busy stall = fresh food. Follow the queue of locals.
        </Handnote>
      </DetailSection>

      <Divider />

      <DetailSection id="nearby" title="Nearby" hi="आस-पास">
        <ul className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {place && (
            <li className="flex">
              <PlaceCard p={place} className="w-full" />
            </li>
          )}
          {others.map((o) => (
            <li key={o.slug} className="flex">
              <DishCard d={o} className="w-full" />
            </li>
          ))}
        </ul>
      </DetailSection>

      <StickyActions>
        {first && <DirectionsButton lat={first.lat} lng={first.lng} variant="secondary" />}
        <AddToPlanButton item={ref} title={d.name} variant="leaf" />
        <SaveButton item={ref} title={d.name} compact />
      </StickyActions>
    </div>
  );
}
