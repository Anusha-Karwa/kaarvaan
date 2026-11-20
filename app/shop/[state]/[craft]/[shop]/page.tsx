import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Clock, HandHeart, Languages, MapPin, Signpost } from "lucide-react";
import { dishes, getArea, getCraft, getShop, places, shops, shopsForCraft } from "@/lib/data";
import { hoursLabel, haversine } from "@/lib/geo";
import { CraftTile, DishCard, PlaceCard, ShopCard } from "@/components/Cards";
import { ArchClip, Jharokha } from "@/components/motifs/Jharokha";
import { Buti } from "@/components/motifs/Buti";
import { VerifiedSeal } from "@/components/motifs/VerifiedSeal";
import { RangoliDivider } from "@/components/motifs/RangoliDivider";
import { StampIcon } from "@/components/motifs/StampIcon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SampleRibbon } from "@/components/ui/SampleRibbon";
import { Chip } from "@/components/ui/Chip";
import { AddToPlanButton, CallButton, DirectionsButton, SaveButton, StickyActions, WhatsAppButton } from "@/components/ItemActions";
import { LiveOpenStatus, ReportProblem, VisitedButton } from "@/components/shop/ShopClient";

export const dynamicParams = false;

export function generateStaticParams() {
  return shops.map((s) => ({ state: "rajasthan", craft: s.craft, shop: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ shop: string }> }): Promise<Metadata> {
  const { shop } = await params;
  const s = getShop(shop);
  return s ? { title: `${s.name}, ${s.market}`, description: s.about } : {};
}

export default async function ShopPage({ params }: { params: Promise<{ state: string; craft: string; shop: string }> }) {
  const { state, craft: craftSlug, shop: slug } = await params;
  const shop = getShop(slug);
  if (!shop || shop.craft !== craftSlug || state !== "rajasthan") notFound();
  const craft = getCraft(shop.craft)!;
  const visited = new Date(shop.visitedOn).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const near = (lat: number, lng: number) => haversine(shop.lat, shop.lng, lat, lng);
  const nearbyPlace = [...places].filter((p) => !p.dayTrip).sort((a, b) => near(a.lat, a.lng) - near(b.lat, b.lng))[0];
  const nearbyDish = [...dishes].sort((a, b) => near(a.spots[0].lat, a.spots[0].lng) - near(b.spots[0].lat, b.spots[0].lng))[0];
  const otherShops = shopsForCraft(shop.craft).filter((s) => s.slug !== shop.slug).slice(0, 2);
  const ref = { kind: "shop" as const, slug: shop.slug };
  const waText = `Namaste ${shop.makers[0]?.name.split(" ")[0] ?? ""}ji! I found ${shop.name} on Kaarvaan. Are you open today? I'd love to see your ${craft.name.toLowerCase()} work.`;

  const checks = [
    { label: "Handmade", text: `Pieces are made by hand: ${craft.name.toLowerCase()} checks pass.` },
    { label: "Makers named", text: `${shop.makers.map((m) => m.name).join(", ")}.` },
    { label: "Fair prices", text: "Prices fall within our indicative range." },
    { label: "Visited in person", text: `Last visit: ${visited}.` },
    { label: "No driver commission", text: "They don't pay drivers or guides to bring you." },
  ];

  return (
    <article className="pb-6">
      {/* Cover */}
      <header className="container-k pt-6">
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <Link href="/shop/rajasthan" className="hover:underline">Rajasthan</Link> ›{" "}
          <Link href={`/shop/rajasthan/${craft.slug}`} className="hover:underline">{craft.name}</Link> › <span aria-current="page">{shop.name}</span>
        </nav>
        <div className="mt-4 grid gap-6 md:grid-cols-[minmax(0,320px)_1fr] md:items-end">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[320px]">
            <ArchClip id="shop-cover-arch" aspect={1.25} rise={0.3} />
            <div className="absolute inset-0 overflow-hidden" style={{ clipPath: "url(#shop-cover-arch)" }}>
              <CraftTile craft={shop.craft} className="h-full w-full" />
            </div>
            <Jharokha aspect={1.25} rise={0.3} strokeWidth={2.5} />
            <div className="absolute -bottom-3 -right-3">
              <VerifiedSeal size={96} date={visited} />
            </div>
            <SampleRibbon className="absolute left-3 top-[30%]" />
          </div>
          <div>
            <p className="font-hand text-lg text-rani">{craft.name} · {shop.market}</p>
            <h1 className="text-[34px] leading-tight sm:text-[42px]">{shop.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <LiveOpenStatus shop={shop} />
              <Chip tone="sand">
                <Languages className="h-3.5 w-3.5" aria-hidden="true" /> {shop.languages.join(", ")}
              </Chip>
            </div>
            <p className="mt-3 text-[17px]">{shop.about}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <SaveButton item={ref} title={shop.name} />
              <AddToPlanButton item={ref} title={shop.name} />
              <VisitedButton shop={shop} />
            </div>
          </div>
        </div>
      </header>

      <div className="container-k">
        <RangoliDivider className="mt-4" />

        {/* Makers */}
        <section aria-labelledby="makers-h">
          <SectionHeader id="makers-h" title="Meet the makers" color="#C2185B" />
          <ul className="grid gap-4 sm:grid-cols-3">
            {shop.makers.map((m) => (
              <li key={m.name} className="card flex items-center gap-4 p-4">
                <span className="relative flex h-16 w-16 shrink-0 items-center justify-center" aria-hidden="true">
                  <Buti size={64} petals={8} color="#F2C14E" center="#C2185B" />
                  <span className="absolute font-display text-lg text-white">
                    {m.name
                      .split(" ")
                      .map((x) => x[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                </span>
                <div>
                  <h3 className="text-xl leading-tight">{m.name}</h3>
                  <p className="text-sm text-muted">{m.role}</p>
                  <p className="font-hand text-base text-rani">{m.years} years of practice</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Visit info */}
        <section className="mt-10 grid gap-4 md:grid-cols-2" aria-label="Visit details">
          <div className="card space-y-4 p-5">
            <div className="flex gap-3">
              <StampIcon icon={Clock} size={40} />
              <div>
                <h2 className="font-sans text-base font-bold text-indigo">Hours</h2>
                <p>{hoursLabel(shop.hours)}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <StampIcon icon={MapPin} size={40} color="#C2185B" />
              <div>
                <h2 className="font-sans text-base font-bold text-indigo">Address</h2>
                <p>{shop.address}</p>
                <p className="text-sm text-muted">{getArea(shop.area)?.name}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <StampIcon icon={Signpost} size={40} color="#2E7D5B" />
              <div>
                <h2 className="font-sans text-base font-bold text-indigo">Finding it</h2>
                <p className="font-hand text-lg leading-snug text-ink">“{shop.landmark}”</p>
              </div>
            </div>
            <div className="flex gap-3">
              <StampIcon icon={HandHeart} size={40} color="#B5462F" />
              <div>
                <h2 className="font-sans text-base font-bold text-indigo">What they make</h2>
                <ul className="mt-1 flex flex-wrap gap-1.5">
                  {shop.makes.map((m) => (
                    <li key={m}>
                      <Chip tone="haldi">{m}</Chip>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="card p-5">
            <h2 className="flex items-center gap-2 text-2xl">
              <BadgeCheck className="h-6 w-6 text-leaf" aria-hidden="true" /> What we checked
            </h2>
            <ul className="mt-3 space-y-3">
              {checks.map((c) => (
                <li key={c.label} className="flex gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 -rotate-12 items-center justify-center rounded-full border-2 border-dotted border-leaf bg-leaf text-white" aria-hidden="true">
                    ✓
                  </span>
                  <span>
                    <strong className="block text-leaf-dark">{c.label}</strong>
                    <span className="text-[15px]">{c.text}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-xl bg-haldi/25 p-3 text-sm">
              <strong>Preview note:</strong> this is a sample listing. Real shops will appear here after our in-person visits.
            </p>
            <div className="mt-3">
              <ReportProblem shop={shop} />
            </div>
          </div>
        </section>

        <RangoliDivider />

        {/* Nearby */}
        <section aria-labelledby="near-h">
          <SectionHeader id="near-h" title="While you're nearby" color="#2E7D5B" />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {nearbyPlace && (
              <li>
                <PlaceCard p={nearbyPlace} className="h-full" />
              </li>
            )}
            {nearbyDish && (
              <li>
                <DishCard d={nearbyDish} className="h-full" />
              </li>
            )}
          </ul>
          {otherShops.length > 0 && (
            <>
              <h3 className="mb-3 mt-8 text-2xl">More {craft.name} makers</h3>
              <ul className="grid gap-4 lg:grid-cols-2">
                {otherShops.map((s) => (
                  <li key={s.slug}>
                    <ShopCard shop={s} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>

      <StickyActions>
        <DirectionsButton lat={shop.lat} lng={shop.lng} />
        <WhatsAppButton number={shop.whatsapp} text={waText} />
        <CallButton phone={shop.phone} compact />
        <SaveButton item={ref} title={shop.name} compact />
      </StickyActions>
    </article>
  );
}
