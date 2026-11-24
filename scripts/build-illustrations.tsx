// Renders every illustration once to public/illustrations/<name>.svg plus a sizes map.
// Pages show them with <img>, which keeps thousands of SVG nodes out of the HTML,
// the hydration payload and the layout work. Runs automatically before `next build`.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { REGISTRY } from "../components/illustrations/registry";

const root = join(__dirname, "..");
const outDir = join(root, "public", "illustrations");
mkdirSync(outDir, { recursive: true });

const sizes: Record<string, [number, number]> = {};
for (const [name, Comp] of Object.entries(REGISTRY)) {
  let svg = renderToStaticMarkup(createElement(Comp, {}));
  const vb = svg.match(/viewBox="([\d.\s-]+)"/);
  if (!vb) throw new Error(`No viewBox for ${name}`);
  const [, , w, h] = vb[1].trim().split(/\s+/).map(Number);
  sizes[name] = [w, h];
  // Standalone file: drop the React-only a11y attributes (alt text lives on the <img>).
  svg = svg.replace(/ aria-hidden="true"| focusable="false"/g, "");
  writeFileSync(join(outDir, `${name}.svg`), `<?xml version="1.0" encoding="UTF-8"?>\n${svg}\n`);
}
writeFileSync(join(root, "components", "illustrations", "sizes.json"), JSON.stringify(sizes, null, 2) + "\n");
console.log(`Wrote ${Object.keys(sizes).length} illustrations to public/illustrations/`);
