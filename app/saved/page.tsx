import type { Metadata } from "next";
import { SavedClient } from "@/components/saved/SavedClient";

export const metadata: Metadata = { title: "Mera thela" };

export default function SavedPage() {
  return <SavedClient />;
}
