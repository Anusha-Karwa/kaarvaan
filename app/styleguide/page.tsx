import { Styleguide } from "@/components/info/Styleguide";
import { PageHero } from "@/components/tools/PageHero";
import { Buti } from "@/components/motifs/Buti";

export const metadata = { title: "Styleguide", robots: { index: false, follow: false } };

export default function StyleguidePage() {
  return (
    <>
      <PageHero title="Styleguide" kicker="Jaipur block-print" art={<Buti size={96} />}>
        <p>Every colour, type style, motif, component and illustration in Kaarvaan, in one place.</p>
      </PageHero>
      <Styleguide />
    </>
  );
}
