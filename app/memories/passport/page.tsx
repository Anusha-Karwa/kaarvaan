import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TripPassport } from "@/components/TripPassport";

export const metadata: Metadata = { title: "Trip passport" };

export default function PassportPage() {
  return (
    <div className="container-k pt-6">
      <SectionHeader as="h1" title="Trip passport" hi="यात्रा पासपोर्ट" sub="A stamp for every place, craft and dish you experienced." />
      <TripPassport />
    </div>
  );
}
