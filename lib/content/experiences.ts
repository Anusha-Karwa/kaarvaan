import workshopsJson from "@/data/workshops.json";
import placesJson from "@/data/places.json";
import foodJson from "@/data/food.json";
import type { Dish, Place, Workshop } from "../types";

export const workshops = workshopsJson as unknown as Workshop[];
export const places = placesJson as Place[];
export const dishes = foodJson as Dish[];
export const getWorkshop = (slug: string) => workshops.find((w) => w.slug === slug);
export const getPlace = (slug: string) => places.find((p) => p.slug === slug);
export const getDish = (slug: string) => dishes.find((d) => d.slug === slug);
