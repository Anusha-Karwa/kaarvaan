import Link from "next/link";
import { PageHero } from "@/components/tools/PageHero";
import { SettingsPanel } from "@/components/info/SettingsPanel";
import { Mandala } from "@/components/motifs/Mandala";

export const metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <>
      <PageHero title="Settings" hi="सेटिंग्स" kicker="Apne hisaab se" art={<Mandala size={130} className="opacity-80" />}>
        <p>Make Kaarvaan yours. Everything here is saved on this phone only.</p>
      </PageHero>
      <div className="container-k pt-6">
        <SettingsPanel />
        <p className="mt-6 text-sm text-muted">
          Curious how we pick the places we list?{" "}
          <Link href="/how-we-choose" className="link-wavy">
            How we choose
          </Link>{" "}
          ·{" "}
          <Link href="/about" className="link-wavy">
            About Kaarvaan
          </Link>
        </p>
      </div>
    </>
  );
}
