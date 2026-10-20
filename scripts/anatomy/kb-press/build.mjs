/**
 * Standalone verification build for the knowledge press (NAJ-897).
 *
 * It imports the SAME modules the site renders (geometry.ts, model.ts,
 * motion.ts under src/components/anatomy/kb-press), writes standalone pages
 * for the anatomy skill's capture, drive and lines checks, and with --audit
 * runs the kit's geometry audit over the rest pose and every pose the live
 * figure passes through.
 *
 *   node scripts/anatomy/kb-press/build.mjs [--out <dir>] [--audit]
 *
 * Pages: kb-press-ar.html, kb-press-ar-light.html, kb-press-en.html,
 * kb-press-en-light.html (dark pages set <html data-theme="dark"> exactly as
 * the site's ThemeScript does).
 */
import { registerHooks, stripTypeScriptTypes } from "node:module";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { gzipSync } from "node:zlib";

// The site's modules use extension-less imports (Next resolves them); teach Node the same.
registerHooks({
  resolve(specifier, context, next) {
    try {
      return next(specifier, context);
    } catch (error) {
      if (!specifier.startsWith(".")) throw error;
      for (const ext of [".ts", ".tsx", ".mjs"]) {
        try {
          return next(specifier + ext, context);
        } catch {}
      }
      throw error;
    }
  },
  load(url, context, next) {
    if (url.endsWith(".ts")) return next(url, { ...context, format: "module-typescript" });
    return next(url, context);
  },
});

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../../..");
const FIG = join(ROOT, "src/components/anatomy/kb-press");
const ISO = join(ROOT, "src/components/iso");
const argv = process.argv.slice(2);
const flag = (name, fallback) => (argv.includes(name) ? argv[argv.indexOf(name) + 1] : fallback);
const OUT = resolve(flag("--out", "C:/Users/Asus/AppData/Local/Temp/claude/C--Users-Asus/5654639c-1df3-4753-827b-e43692e22d39/scratchpad/anatomy/kb-press"));
mkdirSync(OUT, { recursive: true });

const G = await import(pathToFileURL(join(FIG, "geometry.ts")).href);
const M = await import(pathToFileURL(join(FIG, "model.ts")).href);
const V = await import(pathToFileURL(join(FIG, "view.ts")).href);
const K = await import(pathToFileURL(join(ISO, "iso-kit.ts")).href);

/* ------------------------------------------------------------ the pages */

const esc = (text) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
/** The same frameless tree figure.tsx renders, as a string, with the drawing inline where the site fetches it lazily. */
function figureHtml(locale) {
  const W = M.WORDS[locale];
  const asks = M.QUESTIONS.map((_, index) => `<button type="button" class="kbp-ask" data-kb-ask="${index}" aria-pressed="false">${esc(W.questions[index])}</button>`).join("");
  return (
    `<div class="iso kbp-theme"><div class="iso kbp anx" data-theme="light" dir="${locale === "ar" ? "rtl" : "ltr"}" lang="${locale}">` +
    `<figure class="iso-figure"><div class="iso-plate">` +
    `<div class="kbp-stage" tabindex="0" role="group" aria-label="${esc(W.stage)}">` +
    `<div class="anx-art" role="img" aria-label="${esc(W.svg)}" style="aspect-ratio:${G.VIEW.width} / ${G.VIEW.height}" data-art="ready">` +
    `<svg class="iso-svg" viewBox="0 0 ${G.VIEW.width} ${G.VIEW.height}" aria-hidden="true" focusable="false">${G.BODY}</svg></div></div>` +
    `<span class="anx-sr" data-readout="">${esc(W.ready)}</span></div>` +
    `<div class="kbp-asks" role="group" aria-label="${esc(W.asks)}"><span class="kbp-asks-label" aria-hidden="true">${esc(W.asks)}</span>${asks}</div>` +
    `<span class="kbp-sr" role="status" aria-live="polite" data-kb-status=""></span></figure></div></div>`
  );
}

const strip = (file) =>
  stripTypeScriptTypes(readFileSync(join(FIG, file), "utf8"), { mode: "strip" })
    .replace(/^import[^;]*;\s*$/gm, "")
    .replace(/^export /gm, "");
const SCRIPT = strip("model.ts") + "\n" + strip("motion.ts");

const font = (file, weight) => `@font-face{font-family:"Kbp Thmanyah";src:url(data:font/woff2;base64,${readFileSync(join(ROOT, "src/fonts", file)).toString("base64")}) format("woff2");font-weight:${weight};font-display:block}`;
const FONTS = font("thmanyahsans-Regular.woff2", 400) + font("thmanyahsans-Medium.woff2", 500);
const CSS = readFileSync(join(ISO, "iso.css"), "utf8") + readFileSync(join(FIG, "..", "lazy", "frameless.css"), "utf8") + readFileSync(join(FIG, "kb-press.css"), "utf8");
const SITE = `${FONTS}
*{box-sizing:border-box}
html{--font-thmanyah:"Kbp Thmanyah";color-scheme:light;background:rgb(247 248 250)}
html[data-theme="dark"]{color-scheme:dark;background:rgb(8 13 28)}
body{margin:0;font-family:var(--font-thmanyah),system-ui,sans-serif;font-feature-settings:"lnum" 1}
main{width:min(720px,100% - 32px);margin:56px auto 96px}`;

function page(locale, theme) {
  const live = `\nmountKbPress(document.querySelector(".kbp-stage"), ${JSON.stringify(G.LIVE)}, { locale: ${JSON.stringify(locale)} });\n`;
  return `<!doctype html><html lang="${locale}" dir="${locale === "ar" ? "rtl" : "ltr"}"${theme === "dark" ? ' data-theme="dark"' : ""}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Knowledge press</title><style>${SITE}${CSS}</style></head><body><main>${figureHtml(locale)}</main><script type="module">${(SCRIPT + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;
}

for (const locale of ["ar", "en"]) {
  for (const theme of ["dark", "light"]) {
    const name = `kb-press-${locale}${theme === "light" ? "-light" : ""}.html`;
    writeFileSync(join(OUT, name), page(locale, theme));
  }
}

const solids = G.ENTRIES.filter((entry) => !G.isMarker(entry));
const shapes = solids.reduce((count, item) => count + item.shapes.length, 0);
const paths = (G.BODY.match(/<path/g) ?? []).length;
const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;
const scriptBytes = Buffer.byteLength(SCRIPT);
console.log(`wrote 4 pages to ${OUT}`);
console.log(`figure: ${solids.length} items · ${shapes} solids · ${paths} paths · svg ${kb(Buffer.byteLength(G.BODY))} (${kb(gzipSync(G.BODY).length)} gzip) · live script ${kb(scriptBytes)} (${kb(gzipSync(SCRIPT).length)} gzip, unminified)`);

/* ------------------------------------------------------------ the audit */

if (argv.includes("--audit")) {
  const A = await import(pathToFileURL(join(ISO, "audit.mjs")).href);
  const { MOTION, DOCS, DRAWERS } = M;
  const smooth = (a, b, x) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };

  /** A pose: the live values the controller writes, in the same units. */
  const rest = () => ({ label: "rest", arm: G.LIVE.armPark, head: MOTION.up, drawers: Array(DRAWERS).fill(0), carrying: null, platen: 0, feeds: DOCS.map(() => 0), fades: DOCS.map(() => 1), tx: 0, tz: 0 });
  const poses = [rest()];
  for (let d = 0; d < DRAWERS; d++) {
    const at = G.LIVE.armAt[d];
    poses.push({ ...rest(), label: `arm over drawer ${d}`, arm: at });
    poses.push({ ...rest(), label: `drawer ${d} open`, arm: at, drawers: Array.from({ length: DRAWERS }, (_, i) => (i === d ? MOTION.open : 0)) });
    poses.push({ ...rest(), label: `drawer ${d} gripped`, arm: at, head: 0, drawers: Array.from({ length: DRAWERS }, (_, i) => (i === d ? MOTION.open : 0)) });
    for (const lift of [MOTION.clear * 0.5, MOTION.clear - 0.05, MOTION.clear, MOTION.up * 0.8, MOTION.up]) {
      poses.push({ ...rest(), label: `drawer ${d} lifted ${lift.toFixed(2)}`, arm: at, head: lift, carrying: d, drawers: Array.from({ length: DRAWERS }, (_, i) => (i === d ? MOTION.open : 0)) });
    }
    for (const share of [0.25, 0.5, 0.75]) poses.push({ ...rest(), label: `drawer ${d} opening ${share}`, arm: at, drawers: Array.from({ length: DRAWERS }, (_, i) => (i === d ? MOTION.open * share : 0)) });
  }
  for (const share of [0.25, 0.5, 0.75]) poses.push({ ...rest(), label: `arm travelling ${share}`, arm: G.LIVE.armPark + (G.LIVE.armAt[0] - G.LIVE.armPark) * share });
  DOCS.forEach((doc, k) => {
    const feeds = DOCS.map((_, i) => (i < k ? 1 : 0));
    const fades = DOCS.map((_, i) => (i < k ? 0 : 1));
    for (const share of [0.3, 0.7, 0.9]) poses.push({ ...rest(), label: `${doc.kind} feeding ${share}`, feeds: feeds.map((v, i) => (i === k ? share : v)), fades });
    poses.push({ ...rest(), label: `${doc.kind} under the platen`, feeds: feeds.map((v, i) => (i === k ? 1 : v)), fades });
    poses.push({ ...rest(), label: `${doc.kind} pressed`, platen: MOTION.stroke, feeds: feeds.map((v, i) => (i === k ? 1 : v)), fades });
    const to = G.LIVE.transitAt[doc.drawer];
    for (const share of [0.1, 0.3, 0.5, 0.7, 0.9, 1]) poses.push({ ...rest(), label: `${doc.kind} card on the track ${share}`, tx: to * share, feeds: feeds.map((v, i) => (i === k ? 1 : v)), fades: fades.map((v, i) => (i === k ? 0 : v)) });
  });

  function offsetsOf(pose) {
    const map = { arm: [pose.arm - G.LIVE.armPark, 0, 0], head: [0, 0, pose.head - MOTION.up], platen: [0, 0, -pose.platen], transit: [pose.tx, 0, pose.tz] };
    for (let d = 0; d < DRAWERS; d++) {
      map[`drawer.${d}`] = [0, pose.drawers[d], 0];
      map[`lift.${d}`] = [0, 0, pose.carrying === d ? pose.head : 0];
    }
    DOCS.forEach((_, k) => (map[`doc.${k}`] = [G.FEEDS[k].dx * pose.feeds[k], 0, G.FEEDS[k].dz * smooth(0.78, 1, pose.feeds[k])]));
    return map;
  }

  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const toShape = (desc, meta) => (desc.kind === "slab" ? A.slab(desc.plan, desc.z, desc.h, meta, desc.steps) : A.cylinder(desc.cx, desc.cy, desc.r, desc.z, desc.h, meta));
  const screen = ([x, y, z]) => {
    const { axes } = G.LIVE;
    return [axes.x[0] * x + axes.y[0] * y + axes.z[0] * z, axes.x[1] * x + axes.y[1] * y + axes.z[1] * z];
  };

  let failed = 0;
  const started = Date.now();
  const only = flag("--pose", null);
  const chosen = argv.includes("--quick") ? poses.filter((pose, index) => index === 0 || /drawer 0|drawer 3|pdf/.test(pose.label)) : only ? poses.filter((pose) => pose.label.includes(only)) : poses;
  for (const pose of chosen) {
    const offsets = offsetsOf(pose);
    const R = A.recorder(V.P);
    const order = [];
    let liftItem = null;
    for (const entry of G.ENTRIES) {
      if (G.isMarker(entry)) {
        if (entry.slot === "lift" && liftItem) order.push(liftItem);
        continue;
      }
      const path = entry.part ? entry.part.split("/") : [];
      if (path.some((name) => name.startsWith("doc.") && pose.fades[Number(name.slice(4))] < 0.5)) continue;
      const lifted = path.find((name) => name.startsWith("lift."));
      const offset = path.reduce((sum, name) => add(sum, offsets[name] ?? [0, 0, 0]), [0, 0, 0]);
      const item = { entry, offset };
      if (lifted && pose.carrying === Number(lifted.slice(5)) && pose.head >= MOTION.clear) liftItem = item;
      else order.push(item);
    }
    order.forEach(({ entry, offset }, index) => {
      const meta = (n) => ({ name: entry.shapes.length > 1 ? `${entry.name}.${n}` : entry.name, ...(entry.owner ? { owner: entry.owner } : {}), ...(entry.ground ? { ground: true } : {}) });
      const recorded = entry.shapes.map((desc, n) => R.solid(A.moved(toShape(desc, meta(n)), offset)));
      const [sx, sy] = screen(offset);
      const svg = sx || sy ? `<g transform="translate(${sx.toFixed(2)} ${sy.toFixed(2)})">${entry.svg}</g>` : entry.svg;
      R.put({ name: entry.name, key: index * 1000, svg, shapes: recorded });
    });
    const overlaps = A.overlapsOf(R.items, V.P, { states: [0] });
    R.settled = { items: R.items, overlaps, solved: { dropped: [], rules: 0, keys: R.items.map((item) => item.key) }, states: [0] };
    const result = A.audit(R, V.P, { frames: [], apart: false });
    const count = A.failures(result);
    if (count) {
      failed += count;
      console.log(`\n== ${pose.label}: ${count} problem${count === 1 ? "" : "s"}`);
      console.log(A.report(result));
    }
  }
  console.log(`\naudit · ${chosen.length} of ${poses.length} poses ·${solids.length} items · ${shapes} solids · ${((Date.now() - started) / 1000).toFixed(1)} s`);
  console.log(failed ? `audit failed: ${failed} problem${failed === 1 ? "" : "s"}` : chosen.length === poses.length ? "audit passed" : "audit partial: passed on the poses chosen");
  if (failed) process.exitCode = 1;
}
