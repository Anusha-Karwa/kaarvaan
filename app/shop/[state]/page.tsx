import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { crafts, states } from "@/lib/data";
import { CraftCard } from "@/components/Cards";
import { Illustration } from "@/components/illustrations";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Mandala } from "@/components/motifs/Mandala";
import { RangoliDivider } from "@/components/motifs/RangoliDivider";
import { Handnote } from "@/components/ui/Handnote";

export const dynamicParams = false;

export function generateStaticParams() {
  return states.map((s) => ({ state: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state } = await params;
  const s = states.find((x) => x.slug === state);
  if (!s) return {};
  return s.live
    ? { title: `Makers of ${s.name}`, description: `Genuine ${s.name} crafts, how to spot the real thing, fair prices and the makers behind them.` }
    : { title: `${s.name}: coming soon` };
}

export default async function StatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const s = states.find((x) => x.slug === state);
  if (!s) notFound();

  if (!s.live) {
    return (
      <div className="container-k pt-10">
        <div className="relative mx-auto flex max-w-lg flex-col items-center overflow-hidden rounded-3xl border-2 border-dashed border-sand bg-white/70 px-6 py-12 text-center">
          <Mandala size={160} className="opacity-60" />
          <p lang="hi" className="deva mt-4 text-2xl text-muted">
            {s.nameHi}
          </p>
          <h1 className="text-4xl">{s.name}</h1>
          <p className="mt-3 font-display text-2xl text-rani">Aa rahe hain! (Coming soon)</p>
          <p className="mt-2 text-muted">
            Kaarvaan is coming to {s.name} soon. We visit every maker in person before listing them, so it takes a little time. Explore Rajasthan meanwhile.
          </p>
          <ButtonLink href="/shop/rajasthan" className="mt-6">
            Explore Rajasthan
          </ButtonLink>
          <ButtonLink href="/shop" variant="ghost" className="mt-2">
            All states
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="relative overflow-hidden bg-indigo-dark">
        <Illustration priority name="desert-dusk" className="h-40 w-full object-cover! sm:h-48" />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-dark/90 via-indigo-dark/40 to-transparent" />
        <div className="container-k absolute inset-x-0 bottom-0 pb-4">
          <p className="font-hand text-lg text-haldi">{s.name} · Jaipur</p>
          <h1 className="text-[34px] leading-tight text-ivory sm:text-[42px]">
            Rajasthan ke kaarigar
          </h1>
          <p className="text-ivory/90">Makers of Rajasthan</p>
        </div>
      </section>
      <div className="container-k pt-8">
        <SectionHeader title="Five crafts to know" color="#C2185B" sub="Each one with its story, how to spot the real thing, a fair price and the shops where makers work." />
        <ul className="grid gap-6 pt-2 sm:grid-cols-2 lg:grid-cols-3">
          {crafts.map((c) => (
            <li key={c.slug}>
              <CraftCard craft={c} />
            </li>
          ))}
          <li className="flex flex-col justify-center rounded-2xl border-2 border-dashed border-sand p-6">
            <Handnote>Not sure where to start?</Handnote>
            <p className="mt-1 text-muted">Bandhani and block print make light, packable gifts. Blue pottery needs bubble wrap!</p>
            <ButtonLink href="/price-check" variant="secondary" className="mt-4 self-start">
              Try the price check
            </ButtonLink>
          </li>
        </ul>
        <RangoliDivider className="mt-6" />
      </div>
    </div>
  );
}
