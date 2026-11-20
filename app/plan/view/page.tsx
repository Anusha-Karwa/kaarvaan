import type { Metadata } from "next";
import { PlanViewClient } from "@/components/plan/PlanViewClient";

export const metadata: Metadata = { title: "A shared plan" };

export default function PlanViewPage() {
  return (
    <div className="container-k pt-6">
      <PlanViewClient />
    </div>
  );
}
