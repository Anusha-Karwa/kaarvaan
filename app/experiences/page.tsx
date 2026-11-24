import type { Metadata } from "next";
import { Hammer, Landmark, UtensilsCrossed } from "lucide-react";
import { BlockPrintPattern, Buti, StampIcon } from "@/components/motifs";
import { Handnote } from "@/components/ui/Handnote";
import { ExperiencesTabs } from "@/components/experiences/ExperiencesTabs";
import { DishCard, PlaceCard, WorkshopCard } from "@/components/Cards";
import { dishes as allDishes, places as allPlaces, workshops as allWorkshops } from "@/lib/content/experiences";

const cards = Object.fromEntries([
  ...allWorkshops.map((w) => [`w:${w.slug}`, <WorkshopCard key={w.slug} w={w} className="w-full" />]),
  ...allPlaces.map((p) => [`p:${p.slug}`, <PlaceCard key={p.slug} p={p} className="w-full" />]),
  ...allDishes.map((d) => [`d:${d.slug}`, <DishCard key={d.slug} d={d} className="w-full" />]),
]);
import { dishes, places, workshops } from "@/lib/data";

export const metadata: Metadata = {
  title: "Experiences",
  description: "Hands-on craft workshops, Jaipur's best places with honest tips, and what to eat where.",
};

export default function ExperiencesPage() {
  const counts = [
    { icon: Hammer, n: workshops.length, label: "workshops" },
    { icon: Landmark, n: places.length, label: "places" },
    { icon: UtensilsCrossed, n: dishes.length, label: "dishes" },
  ];
  return (
    <div>
      <section className="relative overflow-hidden border-b border-sand bg-[#E3F1EA]">
        <BlockPrintPattern color="#2E7D5B" opacity={0.08} />
        <div className="container-k relative pb-7 pt-6 sm:pb-9 sm:pt-9">
          <div className="flex items-center gap-2">
            <Buti size={26} color="#2E7D5B" center="#F2C14E" />
            <h1 className="text-[34px] leading-none text-leaf-dark sm:text-[42px]">Experiences</h1>
            <span lang="hi" className="deva mt-1 text-xl text-leaf-dark/80">
              अनुभव
            </span>
          </div>
          <p className="mt-3 max-w-xl text-[17px] leading-relaxed text-ink/90">
            Make something with your hands, see the city&apos;s grand old corners at the right hour, and eat like you live
            here.
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2" aria-label="What's inside">
            {counts.map(({ icon, n, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm font-semibold text-leaf-dark">
                <StampIcon icon={icon} color="#2E7D5B" size={34} />
                {n} {label}
              </li>
            ))}
          </ul>
          <Handnote color="text-rani" className="mt-3 -rotate-1">
            Chalo! Pick one of each for a perfect day.
          </Handnote>
        </div>
      </section>
      <div className="container-k pb-6 pt-4">
        <ExperiencesTabs cards={cards} />
      </div>
    </div>
  );
}
