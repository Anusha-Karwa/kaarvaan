"use client";

import { useStore } from "@/lib/store";
import { RangoliDivider } from "../motifs/RangoliDivider";
import { Skeleton } from "../ui/Skeleton";
import { Hero } from "./Hero";
import {
  AnanyaStory,
  BeforeYouGo,
  DontGetFooled,
  Featured,
  LocationStrip,
  NearYou,
  OneLineFacts,
  OptionCards,
  PriceCheckQuick,
  YourTrip,
} from "./HomeSections";

export function HomeClient() {
  const hydrated = useStore((s) => s.hydrated);
  const mode = useStore((s) => s.mode);
  return (
    <>
      <Hero />
      <LocationStrip />
      <OptionCards />
      {!hydrated ? (
        <div className="container-k mt-10 grid gap-4">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-44" />
        </div>
      ) : mode === "here" ? (
        <>
          <NearYou />
          <PriceCheckQuick />
        </>
      ) : (
        <>
          <YourTrip />
          <BeforeYouGo />
        </>
      )}
      <DontGetFooled />
      <RangoliDivider className="mt-6" />
      <AnanyaStory />
      <Featured />
      <OneLineFacts />
    </>
  );
}
