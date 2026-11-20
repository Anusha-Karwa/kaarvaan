import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, Gift, IndianRupee, MapPin, Shirt, ShieldAlert, Sun, Users } from "lucide-react";
import { getArea, getCraft, getWorkshop, workshops } from "@/lib/data";
import { hoursLabel } from "@/lib/geo";
import { formatINR } from "@/lib/price";
import { Illustration } from "@/components/illustrations";
import { DishCard, PlaceCard, ShopCard } from "@/components/Cards";
import { AddToPlanButton, DirectionsButton, SaveButton, StickyActions } from "@/components/ItemActions";
import { Chip } from "@/components/ui/Chip";
import { Handnote } from "@/components/ui/Handnote";
import { SampleRibbon } from "@/components/ui/SampleRibbon";
import { StampIcon } from "@/components/motifs";
import { RequestSlot } from "@/components/experiences/RequestSlot";
import { LiveOpen } from "@/components/experiences/LiveOpen";
import { ArchFrame, BackLink, Callout, DetailSection, Divider, FactTile, Steps } from "@/components/experiences/DetailParts";
import { nearestDishes, nearestPlace, shopsNear } from "@/components/experiences/nearby";

export const dynamicParams = false;

export function generateStaticParams() {
  return workshops.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const w = getWorkshop(slug);
  if (!w) return { title: "Workshop" };
  return { title: w.title, description: w.summary };
}

export default async function WorkshopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const w = getWorkshop(slug);
  if (!w) notFound();

  const area = getArea(w.area);
  const craft = getCraft(w.craft);
  const ref = { kind: "workshop" as const, slug: w.slug };
  const shops = shopsNear([w.craft], w.area, 2);
  const place = nearestPlace(w.lat, w.lng, w.area);
  const dish = nearestDishes(w.lat, w.lng)[0];
  const hours = w.durationHours === 1 ? "1 hour" : `${w.durationHours} hours`;

  return (
    <div className="container-k pb-20 pt-4 md:pb-6">
      <BackLink tab="workshops" label="Workshops" />

      {/* Header */}
      <header className="mt-2 grid items-center gap-6 md:grid-cols-[minmax(0,19rem)_1fr] md:gap-10">
        <ArchFrame name={w.craft} tint="#E3F1EA" title={`${craft?.name ?? "Craft"} illustration`} className="max-w-[15rem] md:max-w-[19rem]">
          <SampleRibbon className="absolute -right-2 top-[30%] rotate-3" />
        </ArchFrame>
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-wide text-leaf-dark">
            Workshop · {craft?.name}
            {craft && (
              <span lang="hi" className="deva ml-1.5 normal-case tracking-normal text-muted">
                {craft.nameHi}
              </span>
            )}
          </p>
          <h1 className="mt-1 text-[34px] leading-tight sm:text-[42px]">{w.title}</h1>
          <p className="mt-2 text-[17px]">
            with <span className="font-semibold text-indigo">{w.host}</span>
            <span className="text-muted"> · {w.hostRole}</span>
          </p>
          <p className="mt-3 max-w-2xl leading-relaxed text-ink/90">{w.summary}</p>
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Key details">
            <li>
              <Chip tone="leaf">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {hours}
              </Chip>
            </li>
            <li>
              <Chip tone="sand">
                <Users className="h-3.5 w-3.5" aria-hidden="true" /> {w.groupSize[0]}–{w.groupSize[1]} people
              </Chip>
            </li>
            <li>
              <Chip tone="haldi">
                <IndianRupee className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="sr-only">Indicative range: </span>
                {formatINR(w.priceMin)}–{formatINR(w.priceMax)} per person
              </Chip>
              <span className="ml-1 font-hand text-sm text-muted" aria-hidden="true">
                Indicative range
              </span>
            </li>
            <li>
              <Chip tone="sand">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {area?.name}
              </Chip>
            </li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            <RequestSlot workshop={w} />
            <SaveButton item={ref} title={w.title} />
            <AddToPlanButton item={ref} title={w.title} />
          </div>
        </div>
      </header>

      <Divider />

      <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[1fr_22rem]">
        <div className="min-w-0 space-y-10">
          <DetailSection id="take-home" title="What you'll take home">
            <div className="flex items-start gap-4 rounded-2xl border border-sand bg-white p-4 shadow-[0_4px_14px_rgba(31,42,92,0.06)]">
              <StampIcon icon={Gift} color="#C2185B" size={48} />
              <p className="text-[17px] leading-relaxed">{w.takeHome}</p>
            </div>
          </DetailSection>

          <DetailSection id="what-happens" title="What happens" hi="क्या होता है">
            <Steps steps={w.steps} />
          </DetailSection>

          <div className="grid gap-4 sm:grid-cols-2">
            <section aria-labelledby="wear">
              <div className="h-full rounded-2xl border border-sand bg-white p-4">
                <div className="flex items-center gap-3">
                  <StampIcon icon={Shirt} color="#1F2A5C" size={40} />
                  <h2 id="wear" className="text-xl">
                    What to wear
                  </h2>
                </div>
                <p className="mt-2 leading-relaxed">{w.wear}</p>
              </div>
            </section>
            <section aria-label="Safety note">
              <Callout icon={ShieldAlert} title="Safety note: dyes, glazes & kilns">
                {w.safety}
              </Callout>
            </section>
          </div>
        </div>

        <aside className="space-y-6" aria-label="Getting there and timings">
          <section aria-labelledby="getting-there" className="relative overflow-hidden rounded-2xl border border-sand bg-white p-4">
            <div className="flex items-end justify-between gap-3">
              <h2 id="getting-there" className="text-xl">
                How to get there
              </h2>
              <Illustration name="auto-rickshaw" className="h-14 w-auto shrink-0" />
            </div>
            <p className="mt-2 leading-relaxed">{w.gettingThere}</p>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
              <MapPin className="h-4 w-4" aria-hidden="true" /> {area?.name}
              {area?.detail ? ` · ${area.detail}` : ""}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <DirectionsButton lat={w.lat} lng={w.lng} variant="secondary" />
              <Link href="/getting-around" className="link-wavy inline-flex min-h-11 items-center text-sm">
                Auto & cab tips
              </Link>
            </div>
          </section>

          <section aria-labelledby="hours" className="rounded-2xl border border-sand bg-white p-4">
            <h2 id="hours" className="text-xl">
              Hours & slots
            </h2>
            <div className="mt-2">
              <LiveOpen hours={w.hours} />
            </div>
            <div className="mt-3 grid gap-2">
              <FactTile icon={Clock} label="Studio hours">
                {hoursLabel(w.hours)}
              </FactTile>
              <FactTile icon={Sun} label="Usual slots">
                {w.slots.join(" · ")}
              </FactTile>
            </div>
          </section>

          <Handnote color="text-leaf-dark" className="-rotate-1 px-2">
            Ask before photographing the makers. Most say yes with a smile.
          </Handnote>
        </aside>
      </div>

      <Divider />

      <DetailSection id="nearby" title="Nearby" hi="आस-पास">
        {shops.length > 0 && (
          <>
            <h3 className="mb-3 font-sans text-lg font-bold text-indigo">Genuine {craft?.name} shops</h3>
            <ul className="grid gap-4 md:grid-cols-2">
              {shops.map((s) => (
                <li key={s.slug}>
                  <ShopCard shop={s} />
                </li>
              ))}
            </ul>
            {craft && (
              <p className="mt-3">
                <Link href={`/shop/rajasthan/${craft.slug}`} className="link-wavy inline-flex min-h-11 items-center">
                  All about {craft.name}: real vs copy, fair prices
                </Link>
              </p>
            )}
          </>
        )}
        <h3 className="mb-3 mt-8 font-sans text-lg font-bold text-indigo">Make a day of it</h3>
        <ul className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {place && (
            <li className="flex">
              <PlaceCard p={place} className="w-full" />
            </li>
          )}
          {dish && (
            <li className="flex">
              <DishCard d={dish} className="w-full" />
            </li>
          )}
        </ul>
      </DetailSection>

      <StickyActions>
        <DirectionsButton lat={w.lat} lng={w.lng} variant="secondary" />
        <RequestSlot workshop={w} label="Request slot" />
        <SaveButton item={ref} title={w.title} compact />
      </StickyActions>
    </div>
  );
}
