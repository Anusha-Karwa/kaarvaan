import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Gauge, Gift, MapPin } from "lucide-react";
import { crafts, getPhrase, getWorkshop, shopsForCraft, workshops } from "@/lib/data";
import { formatINR } from "@/lib/price";
import type { Budget, Craft } from "@/lib/types";
import { Illustration } from "@/components/illustrations";
import { BandhaniDots } from "@/components/motifs/BandhaniDots";
import { BlockPrintPattern } from "@/components/motifs/BlockPrintPattern";
import { RangoliDivider } from "@/components/motifs/RangoliDivider";
import { StampIcon } from "@/components/motifs/StampIcon";
import { Jharokha } from "@/components/motifs/Jharokha";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Chip } from "@/components/ui/Chip";
import { Handnote } from "@/components/ui/Handnote";
import { ButtonLink } from "@/components/ui/Button";
import { CRAFT_TINT, WorkshopCard } from "@/components/Cards";
import { Quiz, RealVsCopy, ShopList } from "@/components/shop/CraftInteractive";

export const dynamicParams = false;

export function generateStaticParams() {
  return crafts.map((c) => ({ state: "rajasthan", craft: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ craft: string }> }): Promise<Metadata> {
  const { craft } = await params;
  const c = crafts.find((x) => x.slug === craft);
  if (!c) return {};
  return { title: `${c.name}: spot the real thing`, description: `${c.hook} How it's made, real vs copy, fair prices and genuine shops in Jaipur.` };
}

function Swirls() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <pattern id="swirl" width="64" height="64" patternUnits="userSpaceOnUse">
          <path d="M8 32 C8 16 32 16 32 32 C32 44 18 44 18 34 C18 28 26 28 26 33" fill="none" stroke="#2F5DA8" strokeWidth="2" strokeLinecap="round" />
          <path d="M40 8 C56 8 56 30 44 30" fill="none" stroke="#2F5DA8" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="50" cy="50" r="3" fill="#2F5DA8" />
          <circle cx="58" cy="44" r="1.6" fill="#2F5DA8" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#swirl)" opacity="0.14" />
    </svg>
  );
}

function CraftPattern({ craft }: { craft: Craft["slug"] }) {
  if (craft === "bandhani") return <BandhaniDots color="#C2185B" opacity={0.4} />;
  if (craft === "blue-pottery") return <Swirls />;
  if (craft === "kundan-meenakari") return <BlockPrintPattern color="#B5462F" opacity={0.12} scale={0.8} />;
  if (craft === "mojari") return <BlockPrintPattern color="#C2185B" opacity={0.1} />;
  return <BlockPrintPattern color="#1F2A5C" opacity={0.14} scale={1.4} />;
}

const BUDGET: Record<Budget, string> = { "under-1000": "Under ₹1,000", "1000-3000": "₹1,000–3,000", "3000-plus": "₹3,000+" };

export default async function CraftPage({ params }: { params: Promise<{ state: string; craft: string }> }) {
  const { state, craft: slug } = await params;
  const craft = state === "rajasthan" ? crafts.find((c) => c.slug === slug) : undefined;
  if (!craft) notFound();
  const shops = shopsForCraft(craft.slug);
  const wk = workshops.filter((w) => w.craft === craft.slug);
  const phrases = craft.phrases.map(getPhrase).filter((p): p is NonNullable<typeof p> => !!p);
  const others = crafts.filter((c) => c.slug !== craft.slug);

  return (
    <article>
      {/* Header */}
      <header className="relative overflow-hidden border-b border-sand" style={{ background: CRAFT_TINT[craft.slug] }}>
        <CraftPattern craft={craft.slug} />
        <div className="container-k relative grid items-end gap-4 py-8 sm:grid-cols-[1fr_auto]">
          <div>
            <nav aria-label="Breadcrumb" className="text-sm text-muted">
              <Link href="/shop" className="hover:underline">Shopping</Link> ›{" "}
              <Link href="/shop/rajasthan" className="hover:underline">Rajasthan</Link> › <span aria-current="page">{craft.name}</span>
            </nav>
            <h1 className="mt-2 text-[40px] leading-none sm:text-[52px]">{craft.name}</h1>
            <p lang="hi" className="deva mt-1 text-2xl text-rani-dark">
              {craft.nameHi}
            </p>
            <p className="mt-3 max-w-xl text-lg">{craft.hook}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Chip tone="haldi">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {craft.timePerPiece}
              </Chip>
              <Chip tone="rani">{shops.length} genuine shops</Chip>
            </div>
          </div>
          <div className="relative mx-auto h-48 w-40 sm:h-56 sm:w-48">
            <Jharokha fill="#FBF6EC" stroke="#1F2A5C" aspect={1.2} rise={0.34} />
            <div className="absolute inset-x-3 bottom-3 top-12 flex items-end justify-center">
              <Illustration name={craft.slug} className="h-full w-auto" title={`Illustration of ${craft.name}`} />
            </div>
          </div>
        </div>
      </header>

      {/* In-page nav */}
      <nav aria-label="On this page" className="sticky top-[5.6rem] z-20 border-b border-sand bg-ivory/95 backdrop-blur sm:top-[6.1rem]">
        <ul className="container-k flex gap-1 overflow-x-auto py-1 text-sm font-semibold [scrollbar-width:none]">
          {[
            ["story", "Story"],
            ["spot", "Spot the real"],
            ["quiz", "Quiz"],
            ["price", "Fair price"],
            ["shops", "Shops"],
            ["gifts", "Gifts"],
          ].map(([id, l]) => (
            <li key={id}>
              <a href={`#${id}`} className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-3 text-indigo hover:bg-sand">
                {l}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="container-k">
        {/* Story */}
        <section id="story" className="pt-10" aria-labelledby="story-h">
          <SectionHeader id="story-h" title="The story" color="#C2185B" />
          <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="flex gap-2 text-muted">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-rani" aria-hidden="true" /> {craft.origin}
              </p>
              <ol className="mt-4 space-y-3 border-l-2 border-dashed border-marigold pl-5">
                {craft.story.map((line, i) => (
                  <li key={i} className="text-[17px]">
                    {line}
                  </li>
                ))}
              </ol>
              <Handnote className="mt-4">One piece: {craft.timePerPiece}.</Handnote>
            </div>
            <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
              {craft.process.map((p, i) => (
                <li key={i} className="card relative overflow-hidden p-4">
                  <span className="absolute -right-2 -top-3 font-display text-6xl text-sand" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="relative block font-display text-xl text-rani">{p.title}</span>
                  <p className="relative mt-1 text-sm leading-snug">{p.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <RangoliDivider />

        {/* Spot the real thing */}
        <section id="spot" aria-labelledby="spot-h">
          <SectionHeader id="spot-h" title="How to spot the real thing" color="#2E7D5B" sub="Five checks you can do in ten seconds at the counter." />
          <RealVsCopy craft={craft} />
        </section>

        <section id="quiz" className="pt-10" aria-labelledby="quiz-h">
          <SectionHeader id="quiz-h" title="Test yourself" sub="Three questions. Get all three for a little shower of petals." />
          <Quiz craft={craft} />
        </section>

        <RangoliDivider />

        {/* Fair price */}
        <section id="price" aria-labelledby="price-h">
          <SectionHeader id="price-h" title="Fair price guide" color="#E8A33D" sub="Indicative range for handmade pieces in Jaipur, 2026. Fine work and silk cost more." />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-sand bg-white shadow-[var(--shadow-card)]">
              <table className="w-full text-left">
                <caption className="sr-only">Indicative prices for {craft.name}</caption>
                <thead className="bg-indigo text-ivory">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">Item</th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">Indicative range</th>
                  </tr>
                </thead>
                <tbody>
                  {craft.prices.map((p) => (
                    <tr key={p.item} className="border-t border-sand odd:bg-ivory/50">
                      <th scope="row" className="px-4 py-3 font-medium">
                        {p.item}
                      </th>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-indigo">
                        {formatINR(p.min)} – {formatINR(p.max)}
                        {p.unit && <span className="block text-xs font-normal text-muted">{p.unit}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between gap-3 border-t border-sand bg-ivory px-4 py-3">
                <span className="text-sm text-muted">Quoted something else?</span>
                <ButtonLink href="/price-check" size="sm">
                  <Gauge className="h-4 w-4" aria-hidden="true" /> Price check
                </ButtonLink>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-indigo p-5 text-ivory">
              <BlockPrintPattern color="#E8A33D" opacity={0.08} />
              <h3 className="relative text-2xl text-ivory">Bargain politely</h3>
              <ul className="relative mt-3 space-y-3">
                {phrases.map((p) => (
                  <li key={p.id} className="rounded-xl bg-white/10 p-3">
                    <p lang="hi" className="deva text-xl text-haldi">
                      {p.hi}
                    </p>
                    <p className="font-semibold">{p.translit}</p>
                    <p className="text-sm text-ivory/80">{p.en}</p>
                  </li>
                ))}
              </ul>
              <p className="relative mt-4 font-hand text-lg text-haldi">✎ {craft.tip}</p>
              <Link href="/phrases" className="relative mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-ivory underline decoration-marigold decoration-wavy underline-offset-4">
                Hear them aloud in the phrasebook
              </Link>
            </div>
          </div>
        </section>

        <RangoliDivider />

        {/* Shops */}
        <section id="shops" aria-labelledby="shops-h">
          <SectionHeader id="shops-h" title="Genuine shops" color="#C2185B" sub="Sample listings while we complete our visits. Each will show the makers, hours and a fair-price promise." />
          <ShopList shops={shops} />
        </section>

        {wk.length > 0 && (
          <section className="pt-10" aria-labelledby="wk-h">
            <SectionHeader id="wk-h" title="Try it yourself" color="#2E7D5B" />
            <ul className="grid gap-5 sm:grid-cols-2">
              {wk.map((w) => (
                <li key={w.slug}>
                  <WorkshopCard w={getWorkshop(w.slug)!} className="h-full" />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Gifts */}
        <section id="gifts" className="pt-10" aria-labelledby="gifts-h">
          <SectionHeader id="gifts-h" title="What to buy as a gift" />
          <ul className="grid gap-4 sm:grid-cols-3">
            {craft.gifts.map((g) => (
              <li key={g.name} className="card flex gap-3 p-4">
                <StampIcon icon={Gift} color="#C2185B" size={44} />
                <div>
                  <Chip tone="haldi">{BUDGET[g.budget]}</Chip>
                  <h3 className="mt-2 text-xl">{g.name}</h3>
                  <p className="text-[15px] text-ink/85">{g.why}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <RangoliDivider />

        <section aria-labelledby="more-h">
          <SectionHeader id="more-h" title="More crafts" />
          <ul className="flex flex-wrap gap-2">
            {others.map((c) => (
              <li key={c.slug}>
                <Link href={`/shop/rajasthan/${c.slug}`} className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-sand bg-white px-4 font-semibold hover:border-rani">
                  {c.name}{" "}
                  <span lang="hi" className="deva font-normal text-muted">
                    {c.nameHi}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}
