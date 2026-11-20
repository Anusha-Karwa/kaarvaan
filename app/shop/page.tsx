import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatePicker } from "@/components/StatePicker";
import { BlockPrintPattern } from "@/components/motifs/BlockPrintPattern";

export const metadata: Metadata = { title: "Shopping: pick a state", description: "Genuine crafts and the makers behind them. Rajasthan is live; more states are coming soon." };

export default function ShopStatesPage() {
  return (
    <div className="relative overflow-hidden pt-6">
      <BlockPrintPattern color="#C2185B" opacity={0.05} />
      <div className="container-k relative">
        <SectionHeader as="h1" title="Shopping" hi="ख़रीदारी" color="#C2185B" sub="Real crafts, fair prices, and the makers behind them. Pick a state." />
        <StatePicker />
      </div>
    </div>
  );
}
