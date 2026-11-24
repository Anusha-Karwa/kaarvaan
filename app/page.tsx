import { allItems } from "@/lib/data";
import { Hero } from "@/components/home/Hero";
import { LocationStrip, ModeSections, type NearItem } from "@/components/home/HomeClientParts";
import { AnanyaStory, DontGetFooled, Featured, OneLineFacts, OptionCards } from "@/components/home/HomeServer";
import { RangoliDivider } from "@/components/motifs/RangoliDivider";

// Only what "Near you" needs, computed at build time (keeps the full content out of the client bundle).
const nearItems: NearItem[] = allItems()
  .filter((i) => i.kind !== "workshop")
  .map(({ kind, slug, title, subtitle, href, lat, lng, hours }) => ({ kind, slug, title, subtitle, href, lat, lng, hours }));

export default function HomePage() {
  return (
    <>
      <Hero />
      <LocationStrip />
      <OptionCards />
      <ModeSections nearItems={nearItems} />
      <DontGetFooled />
      <RangoliDivider className="mt-6" />
      <AnanyaStory />
      <Featured />
      <OneLineFacts />
    </>
  );
}
