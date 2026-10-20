// Standalone verification build for the Gulf vault (anatomy skill).
//
//   node scripts/anatomy/vault/build.mjs            dark pages (ar, en, navy band)
//   node scripts/anatomy/vault/build.mjs --light    light pages
//   node scripts/anatomy/vault/build.mjs --audit    also run the kit audit (must end "audit passed")
//
// It imports the SAME modules the site renders (geometry.ts, markup.ts,
// controller.ts, vault.css), records every drawn item's true shape, settles
// the painter's keys from measured depth and writes them to
// src/components/anatomy/vault/order.ts, so the site draws in the settled order.
//
// The figure has moving parts: the ratchet wheel, the crank and its knob turn
// a tooth per printed line (20 resting places round a full turn), the pawl
// lifts and clicks, and each key turns 90°. The audit's explode states only
// translate parts, so this build records every pose the page shows
// (geometry.POSES: the wheel every quarter tooth, each click from both sides,
// each hold against the pawl, each key a third, two thirds and fully turned),
// rebuilt from the same item builders the page is drawn with, measures the
// overlaps in each, settles one set of keys that holds in all of them, and
// audits every pose with those keys. It also proves the pawl never enters the
// teeth over a whole tooth of travel, in the same lift table the page reads.
import { register, stripTypeScriptTypes } from "node:module";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

register("./hook.mjs", import.meta.url);

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..", "..");
const SRC = join(ROOT, "src", "components", "anatomy", "vault");
const OUT = process.env.VAULT_OUT ?? "C:/Users/Asus/AppData/Local/Temp/claude/C--Users-Asus/5654639c-1df3-4753-827b-e43692e22d39/scratchpad/anatomy/sec";
const THEME = process.argv.includes("--light") ? "light" : "dark";
const AUDIT = process.argv.includes("--audit");

const k = await import("../../../src/components/iso/iso-kit.ts");
const A = await import("../../../src/components/iso/audit.mjs");
const geometry = await import("../../../src/components/anatomy/vault/geometry.ts");
const model = await import("../../../src/components/anatomy/vault/model.ts");
const { P } = await import("../../../src/components/anatomy/vault/view.ts");

/* ---------------------------------------------------------------- record */

const audited = (shape) => {
  const meta = { ...shape.meta };
  if (shape.kind === "slab") return A.slab(shape.plan, shape.z, shape.h, meta, shape.steps);
  if (shape.kind === "cyl") return A.cylinder(shape.cx, shape.cy, shape.r, shape.z, shape.h, meta);
  if (shape.kind === "disc") return A.disc(shape.F, shape.s0, shape.s1, shape.r, meta);
  if (shape.kind === "prism") return A.prism(shape.F, shape.poly, shape.s0, shape.s1, meta);
  if (shape.kind === "box") return A.box(shape.min, shape.max, meta);
  throw new Error(`unknown shape ${shape.kind}`);
};
function recorded(list) {
  const R = A.recorder(P);
  for (const item of list) R.put({ name: item.name, at: item.at, bias: item.bias, svg: item.svg, shapes: item.shapes.map((shape) => R.solid(audited(shape))) });
  return R;
}

/* ---------------------------------------------------------------- settle */

const started = Date.now();
const moving = new Set(geometry.MOVING);
const rest = recorded(geometry.ITEMS);
const restOverlaps = A.overlapsOf(rest.items, P, { states: [0], skip: A.sameRun });
const moved = (a, b) => A.sameRun(a, b) || (!moving.has(a.name) && !moving.has(b.name));
const poses = geometry.POSES.map((pose) => {
  const R = recorded(geometry.itemsAt(pose));
  R.items.forEach((item, index) => {
    if (item.name !== rest.items[index].name) throw new Error(`pose ${pose.label}: item ${index} is ${item.name}, not ${rest.items[index].name}`);
  });
  return { pose, R, overlaps: A.overlapsOf(R.items, P, { states: [0], skip: moved }) };
});
const combined = { ...restOverlaps, pairs: [...restOverlaps.pairs, ...poses.flatMap(({ overlaps }) => overlaps.pairs)] };
const solved = A.orderKeys(rest.items, combined);
rest.items.forEach((item, index) => (item.key = solved.keys[index]));
rest.settled = { items: rest.items.slice(), overlaps: restOverlaps, solved, states: [0] };

const keys = Object.fromEntries(rest.items.map((item) => [item.name, Math.round(item.key * 1000) / 1000]));
const orderFile = join(SRC, "order.ts");
const header = readFileSync(orderFile, "utf8").split("export const KEYS")[0];
const next = `${header}export const KEYS: Record<string, number> = ${JSON.stringify(keys, null, 2).replace(/"([^"]+)":/g, '"$1":')};\n`;
if (readFileSync(orderFile, "utf8") !== next) {
  writeFileSync(orderFile, next);
  console.log("order.ts updated with settled painter's keys");
}
console.log(`settled ${rest.items.length} items over the rest pose and ${poses.length} moving poses (${combined.pairs.length} overlaps, ${solved.rules} order rules, ${solved.cycles.length} cycles, ${solved.dropped.length} dropped) in ${((Date.now() - started) / 1000).toFixed(1)} s`);

/* ----------------------------------------------------------------- audit */

if (AUDIT) {
  const begun = Date.now();
  const restResult = A.audit(rest, P);
  console.log("rest pose:");
  console.log(A.report(restResult));
  let problems = A.failures(restResult);

  let posed = 0;
  let depthPairs = 0;
  for (const { pose, R, overlaps } of poses) {
    R.items.forEach((item, index) => (item.key = solved.keys[index]));
    R.settled = { items: R.items.slice(), overlaps, solved, states: [0] };
    const result = A.audit(R, P);
    depthPairs += overlaps.pairs.length;
    const count = A.failures(result);
    if (count) {
      posed += count;
      console.log(`pose "${pose.label}": ${count} problem${count === 1 ? "" : "s"}`);
      console.log(A.report(result));
    }
  }
  console.log(`moving poses: ${poses.length} replayed (wheel, crank and knob every quarter tooth round a full turn, ${geometry.MOVING.length} moving items, each click from both sides, each hold, each key at 30°, 60° and 90°) · ${depthPairs} overlaps with a moving part · ${posed} problems`);
  problems += posed;

  /* The pawl in the teeth: one tooth of travel is every configuration (the wheel repeats every tooth). */
  const tooth = model.TOOTH;
  let worst = { depth: 0, at: 0 };
  let sweeps = 0;
  for (let u = 0; u < tooth; u += 0.02) {
    const theta = geometry.WHEEL_REST + u;
    const depth = geometry.meshOverlap(theta, geometry.liftOf(theta));
    sweeps++;
    if (depth > worst.depth) worst = { depth, at: u };
  }
  for (const pose of geometry.POSES) {
    const depth = geometry.meshOverlap(pose.theta, geometry.liftOf(pose.theta));
    sweeps++;
    if (depth > worst.depth) worst = { depth, at: ((pose.theta - geometry.WHEEL_REST) % tooth + tooth) % tooth };
  }
  const meshFail = worst.depth > 0.02;
  console.log(`ratchet mesh: ${meshFail ? "FAIL " : ""}pawl and teeth overlap at most ${worst.depth.toFixed(3)} world units (at +${worst.at.toFixed(2)}° from rest) over ${sweeps} wheel angles · hold ${geometry.HOLD.toFixed(2)}° · click at +${geometry.LIFT_CLICK.toFixed(2)}° · lift ${Math.min(...geometry.LIFT.map(Math.abs)).toFixed(1)}–${Math.max(...geometry.LIFT.map(Math.abs)).toFixed(1)}°`);
  if (meshFail) problems++;

  console.log(`audit · ${rest.solids.length} solids · ${rest.items.length} items · 1 rest pose + ${poses.length} moving poses · ${combined.pairs.length} overlaps · ${solved.rules} order rules · ${((Date.now() - begun) / 1000).toFixed(1)} s`);
  console.log(problems ? `audit failed: ${problems} problem${problems === 1 ? "" : "s"}` : "audit passed");
  if (problems) process.exitCode = 1;
}

/* ------------------------------------------------------------------ page */

const sorted = [...rest.items].sort((a, b) => a.key - b.key).map((item) => ({ ...geometry.ITEMS.find((source) => source.name === item.name), key: item.key }));

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
  const html = figureHtml(locale, 7, { uid: `7${ground === "navy" ? "n" : "p"}`, list: sorted });
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
