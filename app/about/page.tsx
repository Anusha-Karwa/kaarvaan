import Link from "next/link";
import { states } from "@/lib/data";
import { PageHero } from "@/components/tools/PageHero";
import { Illustration } from "@/components/illustrations";
import { RangoliDivider } from "@/components/motifs/RangoliDivider";
import { BlockPrintPattern } from "@/components/motifs/BlockPrintPattern";
import { Jharokha } from "@/components/motifs/Jharokha";
import { Mandala } from "@/components/motifs/Mandala";
import { Buti } from "@/components/motifs/Buti";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Handnote } from "@/components/ui/Handnote";
import { Chip } from "@/components/ui/Chip";
import { ButtonLink } from "@/components/ui/Button";

export const metadata = { title: "About" };

const STORY = [
  {
    art: "comic-planning",
    alt: "Ananya at her laptop with many browser tabs open",
    title: "Ten hours of tabs",
    text: "Meet Ananya. She's 28, lives in Bengaluru, and this is her first trip to Jaipur. She spends more than ten hours planning: blogs, reels, forty open tabs. Everyone says “buy bandhani”. Nobody says where.",
    note: "Kahaan se lein?",
  },
  {
    art: "comic-driver",
    alt: "A cab driver pointing Ananya towards a big shop",
    title: "“Very good shop, madam”",
    text: "Her driver knows a very good shop. It is very good, for him: drivers often earn a commission of around 20% on whatever you spend inside.",
    note: "Commission ka chakkar",
  },
  {
    art: "comic-shop",
    alt: "A shopkeeper showing Ananya a printed scarf",
    title: "“Pure handmade”",
    text: "The “hand-tied” dupatta is screen-printed. Copies are sold as handmade every day, and the star ratings don't help: they measure how popular a shop is, not whether its work is real.",
    note: "Asli ya nakli?",
  },
  {
    art: "comic-overpay",
    alt: "Ananya looking shocked at a receipt",
    title: "The bill",
    text: "Back at the hotel, she finds out she paid somewhere between 4 and 40 times the fair price. The real makers, a few lanes away, never saw her at all.",
    note: "Ouch.",
  },
  {
    art: "comic-happy",
    alt: "Ananya smiling with a maker in a small workshop",
    title: "With people who know the way",
    text: "Kaarvaan is the friend she wished she'd had: makers we've met, a fair price to bargain with, how to spot the real thing, and the Hindi to do it kindly.",
    note: "Ab hui na baat!",
  },
] as const;

export default function AboutPage() {
  const live = states.filter((s) => s.live);
  const soon = states.length - live.length;
  return (
    <>
      <PageHero
        title={
          <>
            About Kaarvaan{" "}
            <span lang="hi" className="deva text-haldi">
              कारवाँ
            </span>
          </>
        }
        kicker="Hum kaun hain"
        art={<Mandala size={150} className="opacity-80" />}
      >
        <p>A culture guide for first-time travellers, starting with Jaipur.</p>
      </PageHero>

      <div className="container-k pt-8">
        <section aria-labelledby="meaning" className="grid items-center gap-6 sm:grid-cols-[auto_1fr]">
          <div className="relative mx-auto flex h-52 w-40 items-end justify-center pb-6">
            <Jharokha fill="#fff" />
            <div className="relative text-center">
              <p lang="hi" className="deva text-4xl text-rani">
                कारवाँ
              </p>
              <p className="font-hand text-lg text-indigo">kaar-vaan</p>
            </div>
          </div>
          <div>
            <SectionHeader as="h2" id="meaning" title="What the name means" />
            <p className="text-lg">
              <strong>Kaarvaan</strong> means <em>caravan</em>: a journey you make with people who know the way. For centuries, caravans
              crossed Rajasthan carrying cloth, colour and stories between towns. Travelling with one meant you didn&apos;t have to guess.
            </p>
            <p className="mt-2">
              That&apos;s what we want for you in Jaipur. Not a list of &ldquo;top 10 things&rdquo;, but a friend who knows which lane the
              block-printers work in, what a fair price is, and how to tell a real piece from a copy.
            </p>
          </div>
        </section>

        <RangoliDivider />

        <section aria-labelledby="story">
          <SectionHeader as="h2" id="story" title="Ananya's story" hi="अनन्या की कहानी" sub="Why we started. Maybe it sounds familiar." color="#C2185B" />
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {STORY.map((p, i) => (
              <li key={p.art} className={`card overflow-hidden ${i === STORY.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""}`}>
                <div className="relative flex h-48 items-center justify-center overflow-hidden border-b-2 border-dashed border-sand bg-ivory">
                  <BlockPrintPattern opacity={0.05} />
                  <Illustration name={p.art} className="relative h-40 w-auto" title={p.alt} />
                  <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-indigo font-display text-lg text-ivory">
                    {i + 1}
                  </span>
                  <span className="absolute bottom-2 right-3 -rotate-3 rounded-md bg-white/90 px-2 font-hand text-lg text-rani shadow-sm">{p.note}</span>
                </div>
                <div className="p-4">
                  <h3 className="text-xl">{p.title}</h3>
                  <p className="mt-1 text-[15px]">{p.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <RangoliDivider />

        <section aria-labelledby="mission" className="relative overflow-hidden rounded-3xl bg-indigo px-6 py-10 text-center text-ivory sm:px-12">
          <BlockPrintPattern color="#E8A33D" opacity={0.08} />
          <div className="relative mx-auto max-w-2xl">
            <Buti size={34} className="mx-auto" />
            <h2 id="mission" className="mt-2 font-hand text-xl text-haldi">
              Our mission
            </h2>
            <p className="mt-2 font-display text-[28px] leading-tight text-ivory sm:text-[36px]">
              So every traveller takes home the real thing, and every maker is seen.
            </p>
            <p className="mt-4 text-ivory/85">
              We name the makers, we never take a commission from shops, and we show you a fair price before you start talking.
            </p>
          </div>
        </section>

        <section aria-labelledby="where" className="mt-10 grid items-center gap-6 sm:grid-cols-[1fr_auto]">
          <div>
            <SectionHeader as="h2" id="where" title="Rajasthan first" sub="One state, done properly, before the next." color="#2E7D5B" />
            <div className="flex flex-wrap items-center gap-2">
              {live.map((s) => (
                <Chip key={s.slug} tone="leaf">
                  <span className="h-2 w-2 rounded-full bg-leaf" aria-hidden="true" />
                  {s.name}{" "}
                  <span lang="hi" className="deva font-normal">
                    {s.nameHi}
                  </span>
                </Chip>
              ))}
              <Chip tone="sand">+{soon} more states and UTs</Chip>
            </div>
            <Handnote className="mt-3 -rotate-1 text-2xl" color="text-marigold-ink">
              More states aa rahe hain! (coming soon)
            </Handnote>
          </div>
          <Illustration name="camel" className="mx-auto h-36 w-auto" />
        </section>

        <RangoliDivider />

        <div className="flex flex-wrap justify-center gap-3">
          <ButtonLink href="/how-we-choose">How we choose places</ButtonLink>
          <ButtonLink href="/shop/rajasthan" variant="secondary">
            Meet the crafts
          </ButtonLink>
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          No accounts, no tracking of you.{" "}
          <Link href="/privacy" className="link-wavy">
            Read our privacy promise
          </Link>
        </p>
      </div>
    </>
  );
}
