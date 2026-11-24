import Link from "next/link";
import { Clock, Footprints, CarTaxiFront, Navigation, ShieldCheck, Shirt, Wallet, type LucideIcon } from "lucide-react";
import { tips } from "@/lib/data";
import type { Tip } from "@/lib/types";
import { PageHero } from "@/components/tools/PageHero";
import { StampIcon } from "@/components/motifs/StampIcon";
import { RangoliDivider } from "@/components/motifs/RangoliDivider";
import { BlockPrintPattern } from "@/components/motifs/BlockPrintPattern";
import { Handnote } from "@/components/ui/Handnote";
import { ButtonLink } from "@/components/ui/Button";
import { Illustration } from "@/components/illustrations";

export const metadata = { title: "Getting around" };

const GROUPS: { id: Tip["category"]; label: string; hi: string; icon: LucideIcon; color: string; note: string }[] = [
  { id: "auto", label: "Auto-rickshaws", hi: "ऑटो", icon: Navigation, color: "#1F2A5C", note: "Kitna lagega? Then smile. Then sit." },
  { id: "cabs", label: "App cabs and drivers", hi: "टैक्सी", icon: CarTaxiFront, color: "#2E7D5B", note: "Share the exact pin, not just the bazaar name." },
  { id: "walking", label: "On foot", hi: "पैदल", icon: Footprints, color: "#C2185B", note: "The best of the old city is at walking speed." },
  { id: "timing", label: "Good timing", hi: "सही समय", icon: Clock, color: "#B5462F", note: "Early forts, late markets. Easy rule." },
  { id: "wear", label: "What to wear", hi: "क्या पहनें", icon: Shirt, color: "#1F2A5C", note: "Cotton, comfy shoes, a scarf for the sun." },
  { id: "safety", label: "Staying safe", hi: "सुरक्षित रहें", icon: ShieldCheck, color: "#2E7D5B", note: "Friendly city. Normal city sense." },
  { id: "money", label: "Money", hi: "पैसे", icon: Wallet, color: "#C2185B", note: "UPI works almost everywhere. Keep some change for chai." },
];

export default function GettingAroundPage() {
  const groups = GROUPS.map((g) => ({ ...g, tips: tips.filter((t) => t.category === g.id) })).filter((g) => g.tips.length);
  return (
    <>
      <PageHero
        title="Getting around"
        hi="आना-जाना"
        kicker="Chalo, chalte hain"
        art={<Illustration priority name="auto-rickshaw" className="h-32 w-auto sm:h-44" title="A Jaipur auto-rickshaw" />}
      >
        <p>Simple, honest tips for moving around Jaipur: autos, app cabs, walking the bazaars, and when to go where.</p>
      </PageHero>

      <div className="container-k pt-6">
        <nav aria-label="Tip topics" className="scroll-x !gap-2">
          {groups.map((g) => (
            <a
              key={g.id}
              href={`#tips-${g.id}`}
              className="inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-full border-2 border-sand bg-white px-4 text-sm font-semibold text-ink hover:border-marigold"
            >
              <g.icon className="h-4 w-4" style={{ color: g.color }} aria-hidden="true" />
              {g.label}
            </a>
          ))}
        </nav>

        <div className="mt-4 grid gap-x-8 lg:grid-cols-2">
          {groups.map((g, i) => (
            <section key={g.id} id={`tips-${g.id}`} aria-labelledby={`tips-h-${g.id}`} className="pt-8">
              <div className="flex items-center gap-3">
                <StampIcon icon={g.icon} color={g.color} size={52} />
                <div className="min-w-0">
                  <h2 id={`tips-h-${g.id}`} className="text-2xl sm:text-[28px]">
                    {g.label}
                  </h2>
                  <p lang="hi" className="deva text-muted">
                    {g.hi}
                  </p>
                </div>
              </div>
              <Handnote className={`ml-1 mt-2 ${i % 2 ? "rotate-1" : "-rotate-1"}`} color={i % 2 ? "text-leaf-dark" : "text-rani"}>
                {g.note}
              </Handnote>
              <div className="mt-3 space-y-3">
                {g.tips.map((t) => (
                  <article key={t.id} id={t.id} className="card scroll-mt-4 p-4">
                    <h3 className="text-xl leading-snug">{t.title}</h3>
                    <p className="mt-1 text-[15px]">{t.body}</p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <RangoliDivider className="mt-6" />

        <section aria-labelledby="ga-more" className="relative overflow-hidden rounded-3xl bg-indigo p-6 text-ivory">
          <BlockPrintPattern color="#E8A33D" opacity={0.08} />
          <div className="relative">
            <h2 id="ga-more" className="text-2xl text-ivory sm:text-[28px]">
              Words for the road
            </h2>
            <p className="mt-1 max-w-xl text-ivory/85">
              &ldquo;Kitna lagega?&rdquo; (how much will it cost?), &ldquo;Seedha chaliye&rdquo; (go straight), &ldquo;Yahin rokiye&rdquo; (stop
              right here). Hear them said aloud in the phrasebook.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <ButtonLink href="/phrases#cat-directions" variant="marigold">
                Direction phrases
              </ButtonLink>
              <ButtonLink href="/price-check" variant="light">
                Price check
              </ButtonLink>
            </div>
          </div>
        </section>
        <p className="mt-6 text-sm text-muted">
          Planning the day? Put your stops in a sensible order on the{" "}
          <Link href="/plan" className="link-wavy">
            day planner
          </Link>
          .
        </p>
      </div>
    </>
  );
}
