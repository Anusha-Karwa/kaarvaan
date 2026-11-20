import Link from "next/link";
import { BookOpen, Compass, IndianRupee, ShoppingBag } from "lucide-react";
import { Illustration } from "@/components/illustrations";
import { BlockPrintPattern } from "@/components/motifs/BlockPrintPattern";
import { Mandala } from "@/components/motifs/Mandala";
import { RangoliDivider } from "@/components/motifs/RangoliDivider";
import { StampIcon } from "@/components/motifs/StampIcon";
import { ButtonLink } from "@/components/ui/Button";
import { Handnote } from "@/components/ui/Handnote";

const LINKS = [
  { href: "/shop/rajasthan", label: "Shopping", sub: "Real crafts, fair prices", icon: ShoppingBag, color: "#C2185B" },
  { href: "/experiences", label: "Experiences", sub: "Workshops, places, food", icon: Compass, color: "#2E7D5B" },
  { href: "/price-check", label: "Price check", sub: "Is this a fair price?", icon: IndianRupee, color: "#1F2A5C" },
  { href: "/phrases", label: "Phrasebook", sub: "Hindi for the road", icon: BookOpen, color: "#B5462F" },
];

export default function NotFound() {
  return (
    <div className="container-k pt-8">
      <section className="relative overflow-hidden rounded-3xl bg-white px-5 py-10 text-center shadow-[var(--shadow-card)] ring-1 ring-sand sm:py-14">
        <BlockPrintPattern opacity={0.05} />
        <Mandala size={220} className="pointer-events-none absolute -right-16 -top-16 opacity-30" />
        <Mandala size={160} className="pointer-events-none absolute -bottom-12 -left-12 opacity-25" />
        <div className="relative">
          <Illustration name="camel" className="mx-auto h-44 w-auto sm:h-56" title="A camel looking around, a little lost" />
          <p className="mt-2 font-hand text-xl text-marigold-ink">404</p>
          <h1 className="text-[34px] sm:text-[42px]">Raasta bhatak gaye?</h1>
          <p lang="hi" className="deva text-xl text-rani">
            रास्ता भटक गए?
          </p>
          <p className="mt-1 text-lg text-muted">(Lost the way?)</p>
          <p className="mx-auto mt-3 max-w-md">
            This page wandered off into the desert. Even camels take a wrong turn sometimes. Let&apos;s get you back to the bazaar.
          </p>
          <ButtonLink href="/" size="lg" className="mt-6">
            Back to home
          </ButtonLink>
        </div>
      </section>

      <RangoliDivider />

      <h2 className="text-center text-2xl">Or try one of these</h2>
      <Handnote className="text-center" color="text-leaf-dark">
        Chalo, phir se!
      </Handnote>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {LINKS.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="card flex min-h-20 items-center gap-3 p-4 transition-transform hover:-translate-y-1">
              <StampIcon icon={l.icon} color={l.color} size={48} />
              <span>
                <span className="block font-display text-xl text-indigo">{l.label}</span>
                <span className="block text-sm text-muted">{l.sub}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
