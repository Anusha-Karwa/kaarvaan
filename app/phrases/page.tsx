import Link from "next/link";
import { Phrasebook } from "@/components/tools/Phrasebook";
import { PageHero } from "@/components/tools/PageHero";
import { Mandala } from "@/components/motifs/Mandala";
import { RangoliDivider } from "@/components/motifs/RangoliDivider";
import { ButtonLink } from "@/components/ui/Button";

export const metadata = { title: "Phrasebook" };

export default function PhrasesPage() {
  return (
    <>
      <PageHero
        title="Phrasebook"
        hi="वाक्य-पुस्तिका"
        kicker="Thoda Hindi, bahut pyaar"
        art={<Mandala size={140} className="opacity-80" />}
      >
        <p>
          A few Hindi words go a long way in Jaipur. Tap the speaker to hear a phrase, or just show the screen. Tap ♡ to keep your
          favourites handy on Price check.
        </p>
      </PageHero>
      <div className="container-k pt-2">
        <Phrasebook />
        <RangoliDivider />
        <div className="card flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl">In a shop right now?</h2>
            <p className="text-muted">Check if a price is fair, then bargain with your favourite phrases.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/price-check">Price check</ButtonLink>
            <ButtonLink href="/getting-around" variant="secondary">
              Getting around
            </ButtonLink>
          </div>
        </div>
        <p className="mt-6 text-sm text-muted">
          Speech uses your device&apos;s own voices, so it works offline once the page has loaded. Some phones don&apos;t have a Hindi
          voice; then you&apos;ll hear an English accent, which is still understood more often than you&apos;d think. Questions?{" "}
          <Link href="/about" className="link-wavy">
            About Kaarvaan
          </Link>
        </p>
      </div>
    </>
  );
}
