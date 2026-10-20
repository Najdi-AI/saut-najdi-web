// Standalone verification build for the Gulf vault (anatomy skill).
//
//   node scripts/anatomy/vault/build.mjs            dark pages (ar, en, navy band)
//   node scripts/anatomy/vault/build.mjs --light    light pages
//   node scripts/anatomy/vault/build.mjs --audit    also run the kit audit (must end "audit passed")
//
// It imports the SAME modules the site renders (geometry.ts, markup.ts,
// controller.ts, vault.css), records every drawn item's true shape, settles
// the painter's keys from measured depth (audit.settle) and writes them to
// src/components/anatomy/vault/order.ts, so the site draws in the settled order.
import { register, stripTypeScriptTypes } from "node:module";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

register("./hook.mjs", import.meta.url);

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..", "..");
const SRC = join(ROOT, "src", "components", "anatomy", "vault");
const OUT = process.env.VAULT_OUT ?? "C:/Users/Asus/AppData/Local/Temp/claude/C--Users-Asus/5654639c-1df3-4753-827b-e43692e22d39/scratchpad/anatomy/vault";
const THEME = process.argv.includes("--light") ? "light" : "dark";

const k = await import("../../../src/components/iso/iso-kit.ts");
const A = await import("../../../src/components/iso/audit.mjs");
const geometry = await import("../../../src/components/anatomy/vault/geometry.ts");
const model = await import("../../../src/components/anatomy/vault/model.ts");
const { P } = await import("../../../src/components/anatomy/vault/view.ts");

/* ---------------------------------------------------------------- record */

const R = A.recorder(P);
const audited = (shape) => {
  const meta = { ...shape.meta };
  if (shape.kind === "slab") return A.slab(shape.plan, shape.z, shape.h, meta, shape.steps);
  if (shape.kind === "cyl") return A.cylinder(shape.cx, shape.cy, shape.r, shape.z, shape.h, meta);
  if (shape.kind === "disc") return A.disc(shape.F, shape.s0, shape.s1, shape.r, meta);
  if (shape.kind === "prism") return A.prism(shape.F, shape.poly, shape.s0, shape.s1, meta);
  if (shape.kind === "box") return A.box(shape.min, shape.max, meta);
  throw new Error(`unknown shape ${shape.kind}`);
};
for (const item of geometry.ITEMS) {
  R.put({ name: item.name, at: item.at, bias: item.bias, svg: item.svg, shapes: item.shapes.map((shape) => R.solid(audited(shape))) });
}

const started = Date.now();
A.settle(R, P);
const keys = Object.fromEntries(R.items.map((item) => [item.name, Math.round(item.key * 1000) / 1000]));
const orderFile = join(SRC, "order.ts");
const header = readFileSync(orderFile, "utf8").split("export const KEYS")[0];
const next = `${header}export const KEYS: Record<string, number> = ${JSON.stringify(keys, null, 2).replace(/"([^"]+)":/g, '"$1":')};\n`;
const before = readFileSync(orderFile, "utf8");
if (before !== next) {
  writeFileSync(orderFile, next);
  console.log("order.ts updated with settled painter's keys");
}
console.log(`settled ${R.items.length} items in ${((Date.now() - started) / 1000).toFixed(1)} s`);

R.items.sort((a, b) => a.key - b.key);
const sorted = R.items.map((item) => geometry.ITEMS.find((source) => source.name === item.name)).map((item, index) => ({ ...item, key: R.items[index].key }));

A.auditOrExit(R, P);

/* ------------------------------------------------------------------ page */

const css = readFileSync(join(SRC, "vault.css"), "utf8");
const font = (file, weight) => `@font-face{font-family:"Thmanyah";src:url(data:font/woff2;base64,${readFileSync(join(ROOT, "src", "fonts", file)).toString("base64")}) format("woff2");font-weight:${weight};font-display:block}`;
const fonts = font("thmanyahsans-Regular.woff2", 400) + font("thmanyahsans-Bold.woff2", "600 700");
const controller = stripTypeScriptTypes(readFileSync(join(SRC, "controller.ts"), "utf8"), { mode: "strip" }).replace(/^export /gm, "");
const { figureHtml } = await import("../../../src/components/anatomy/vault/markup.ts");

const GROUNDS = {
  page: { dark: "#080d1c", light: "#f7f8fa" },
  navy: { dark: "#16203c", light: "#112046" },
};

function page(locale, ground) {
  const html = figureHtml(locale, 7).replace(geometry.bodyFor(locale), geometry.bodyFor(locale, sorted));
  const dir = locale === "ar" ? "rtl" : "ltr";
  const wrapperTheme = ground === "navy" ? "dark" : THEME;
  const navy = THEME === "dark" ? "22 32 60" : "17 32 70";
  const script = `${controller}\nconst root = document.querySelector(".vlt");\nmountVault(root, ${JSON.stringify(geometry.LIVE)}, ${JSON.stringify(model.textFor(locale))});\n`;
  return `<!doctype html><html lang="${locale}" dir="${dir}"${THEME === "dark" ? ' data-theme="dark"' : ""}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Gulf vault · ${locale} · ${ground} · ${THEME}</title><style>${fonts}:root{--font-thmanyah:"Thmanyah";--c-navy:${navy}}*{box-sizing:border-box}body{margin:0;background:${GROUNDS[ground][THEME]};color:#888;font:14px/1.6 var(--font-thmanyah),system-ui,sans-serif;-webkit-font-smoothing:antialiased}main{width:min(680px,100% - 32px);margin:56px auto 80px}${k.ISO_CSS}${css}</style></head><body><main><div class="iso vlt" dir="${dir}" lang="${locale}" data-theme="${wrapperTheme}" data-ground="${ground}">${html}</div></main><script type="module">${script.replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;
}

mkdirSync(OUT, { recursive: true });
const suffix = THEME === "light" ? "-light" : "";
for (const locale of ["ar", "en"]) {
  writeFileSync(join(OUT, `vault-${locale}${suffix}.html`), page(locale, "page"));
  writeFileSync(join(OUT, `vault-navy-${locale}${suffix}.html`), page(locale, "navy"));
}
console.log(`wrote ${OUT}/vault-{ar,en}${suffix}.html and vault-navy-{ar,en}${suffix}.html`);
