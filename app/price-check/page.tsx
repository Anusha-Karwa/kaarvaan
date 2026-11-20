import { PriceCheck } from "@/components/tools/PriceCheck";
import { PageHero } from "@/components/tools/PageHero";
import { Illustration } from "@/components/illustrations";

export const metadata = { title: "Price check" };

export default function PriceCheckPage() {
  return (
    <>
      <PageHero
        title="Price check"
        hi="दाम जाँचें"
        kicker="Sahi daam, khushi se"
        art={<Illustration name="comic-overpay" className="h-28 w-auto sm:h-36" />}
      >
        <p>Standing in a shop? Pick the craft and the piece, type the price you were quoted, and see if it&apos;s fair. Works offline.</p>
      </PageHero>
      <div className="container-k pt-6">
        <PriceCheck />
      </div>
    </>
  );
}
