import Link from "next/link";
import { Ban, Hand, MapPinned, MessageCircleWarning, RefreshCw, Users, type LucideIcon } from "lucide-react";
import { PageHero } from "@/components/tools/PageHero";
import { ChooseRoute } from "@/components/info/ChooseRoute";
import { Illustration, type IllustrationName } from "@/components/illustrations";
import { StampIcon } from "@/components/motifs/StampIcon";
import { RangoliDivider } from "@/components/motifs/RangoliDivider";
import { VerifiedSeal } from "@/components/motifs/VerifiedSeal";
import { BandhaniDots } from "@/components/motifs/BandhaniDots";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SampleRibbon } from "@/components/ui/SampleRibbon";
import { Handnote } from "@/components/ui/Handnote";
import { ButtonLink } from "@/components/ui/Button";
import { KAARVAAN_WHATSAPP, waLink } from "@/lib/whatsapp";

export const metadata = { title: "How we choose places" };

const STEPS: { title: string; icon: LucideIcon; color: string; art: IllustrationName; note: string; text: string }[] = [
  {
    title: "Visited in person",
    icon: MapPinned,
    color: "#1F2A5C",
    art: "village",
    note: "Pairon se, phone se nahin",
    text: "Every shop, workshop and food stall is visited by someone from Kaarvaan. We walk in like any traveller, watch the work, chat with the people, and only then write anything down. No listing comes from a search result or a review site.",
  },
  {
    title: "Handmade",
    icon: Hand,
    color: "#C2185B",
    art: "block-print",
    note: "Haath ka kaam",
    text: "Hand-tied, hand-printed, hand-painted, hand-stitched. We ask to see the work being done, the blocks, the dye vats, the kiln. If the pieces on the shelf come off a machine, the shop isn't on Kaarvaan, however nice it looks.",
  },
  {
    title: "Makers named",
    icon: Users,
    color: "#2E7D5B",
    art: "comic-happy",
    note: "Naam se pehchaan",
    text: "You'll see the names of the people who make what you buy, what they do, and how many years they've been at it. A craft is a person, not a product code. Where a maker prefers not to be named, we say so.",
  },
  {
    title: "No driver commission",
    icon: Ban,
    color: "#B5462F",
    art: "comic-driver",
    note: "Koi commission nahin",
    text: "Shops pay us nothing to be listed, and we don't list places that pay drivers or guides to bring tourists in. That commission, often around 20%, ends up on your bill. If someone insists on taking you to a shop, slow down and check here first.",
  },
  {
    title: "Fair prices, re-checked regularly",
    icon: RefreshCw,
    color: "#1F2A5C",
    art: "blue-pottery",
    note: "Sahi daam, har baar",
    text: "We note what pieces really sell for, across several makers, and publish an indicative range. We re-check on return visits so the numbers don't go stale. The range is a guide for a friendly bargain, not a rule: finer work genuinely costs more.",
  },
];

export default function HowWeChoosePage() {
  const report = waLink(KAARVAAN_WHATSAPP, "Namaste Kaarvaan! I'd like to report a problem with a listing: ");
  return (
    <>
      <PageHero
        title="How we choose places"
        hi="हम जगहें कैसे चुनते हैं"
        kicker="Paanch pakki baatein"
        art={<VerifiedSeal date="Jaipur" size={110} />}
      >
        <p>Five checks every shop, host and food stall has to pass before it appears on Kaarvaan.</p>
      </PageHero>

      <div className="container-k pt-8">
        <div className="card relative overflow-hidden px-4 py-6 sm:px-6">
          <BandhaniDots color="#E8A33D" opacity={0.25} />
          <div className="relative">
            <ChooseRoute />
          </div>
        </div>

        <ol className="mt-8 space-y-5">
          {STEPS.map((s, i) => (
            <li key={s.title} id={`step-${i + 1}`} className="card scroll-mt-4 overflow-hidden">
              <div className={`grid items-center ${i % 2 ? "sm:grid-cols-[1fr_200px]" : "sm:grid-cols-[200px_1fr]"}`}>
                <div className={`relative flex h-40 items-center justify-center bg-ivory sm:h-full ${i % 2 ? "sm:order-2" : ""}`}>
                  <Illustration name={s.art} className="h-32 w-auto" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3">
                    <StampIcon icon={s.icon} color={s.color} size={48} />
                    <div>
                      <p className="text-sm font-semibold text-muted">Step {i + 1} of 5</p>
                      <h2 className="text-2xl leading-tight">{s.title}</h2>
                    </div>
                  </div>
                  <p className="mt-3">{s.text}</p>
                  <Handnote className="mt-2 -rotate-1" color={i % 2 ? "text-leaf-dark" : "text-rani"}>
                    {s.note}
                  </Handnote>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <RangoliDivider />

        <section aria-labelledby="honest" className="rounded-3xl border-2 border-dashed border-marigold bg-haldi/10 p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-3">
            <SectionHeader as="h2" id="honest" title="An honest note" className="!mb-0" />
            <SampleRibbon />
          </div>
          <p className="mt-4">
            We&apos;re still completing our Jaipur visits. Until we do, the shop, host and food-stall listings you see are{" "}
            <strong>samples</strong>: fictional, written to show how Kaarvaan will work. Each one carries a &ldquo;Sample listing&rdquo;
            ribbon. The craft guides, real-vs-copy checks, places and price ranges are our real research.
          </p>
          <p className="mt-2">When a listing becomes real, its sample ribbon is replaced by our green &ldquo;Visited by Kaarvaan&rdquo; seal and the visit date.</p>
        </section>

        <section aria-labelledby="report" className="mt-8 grid items-center gap-5 sm:grid-cols-[auto_1fr]">
          <StampIcon icon={MessageCircleWarning} color="#B5462F" size={72} className="mx-auto" />
          <div>
            <h2 id="report" className="text-2xl sm:text-[28px]">
              Spotted a problem?
            </h2>
            <p className="mt-1">
              A shop closed, a price looks off, someone pushed you to buy, or a &ldquo;handmade&rdquo; piece wasn&apos;t? Tell us. Every shop
              page has a <strong>&ldquo;Something wrong?&rdquo;</strong> button that opens WhatsApp with a message to the Kaarvaan desk,
              already filled in with the shop&apos;s name. Add a line or a photo and send. We read every one and re-visit when needed.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <ButtonLink href={report} variant="leaf">
                Message the Kaarvaan desk
              </ButtonLink>
              <ButtonLink href="/shop/rajasthan" variant="secondary">
                Browse the crafts
              </ButtonLink>
            </div>
            <p className="mt-3 text-sm text-muted">
              WhatsApp opens in its own app, under its own privacy policy. See{" "}
              <Link href="/privacy" className="link-wavy">
                our privacy promise
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
