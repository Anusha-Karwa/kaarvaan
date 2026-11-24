import { expect, it } from "vitest";
import { crafts } from "@/lib/content/crafts";
import { CRAFT_NAMES } from "@/lib/content/meta";

it("CRAFT_NAMES stays in sync with crafts.json", () => {
  for (const c of crafts) expect(CRAFT_NAMES[c.slug]).toEqual({ name: c.name, nameHi: c.nameHi });
  expect(Object.keys(CRAFT_NAMES).length).toBe(crafts.length);
});
