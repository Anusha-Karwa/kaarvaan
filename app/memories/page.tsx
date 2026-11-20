import type { Metadata } from "next";
import { MemoriesClient } from "@/components/memories/MemoriesClient";

export const metadata: Metadata = { title: "Memories" };

export default function MemoriesPage() {
  return <MemoriesClient />;
}
