/**
 * Verification build for the credit-meter figure (NAJ-897).
 *
 * Imports the SAME model, geometry and scene modules the site renders (Node 24
 * runs the .ts files directly; a resolve hook maps the site's extensionless
 * and "@/" imports), inlines the SAME controller.ts and lever.ts the site
 * ships, and writes standalone pages for the anatomy skill's checks:
 *
 *   node scripts/anatomy/credit-meter/build.mjs            all four pages (ar/en × dark/light)
 *   node scripts/anatomy/credit-meter/build.mjs --audit    and the geometry audit
 *   node scripts/anatomy/credit-meter/build.mjs --out DIR  write somewhere else (default: <os tmp>/anatomy/credit-meter)
 *
 * Each page mimics the site: the figure wrapper is .iso.cm[data-theme=light]
 * and dark comes from <html data-theme="dark">, exactly as ThemeScript does.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { registerHooks, stripTypeScriptTypes } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..", "..", "..");
const SRC = join(ROOT, "src");
const FIG = join(SRC, "components", "anatomy", "credit-meter");
const KIT = join(SRC, "components", "iso");

registerHooks({
  resolve(specifier, context, next) {
    let target = specifier;
    if (target.startsWith("@/")) target = pathToFileURL(join(SRC, target.slice(2))).href;
    try {
      return next(target, context);
    } catch (error) {
      const base = target.startsWith("file:") ? target : context.parentURL ? new URL(target, context.parentURL).href : target;
      for (const ext of [".ts", ".tsx", "/index.ts"]) {
        const url = base + ext;
        if (existsSync(fileURLToPath(url))) return next(url, context);
      }
      throw error;
    }
  },
});

const argv = process.argv.slice(2);
const outAt = argv.indexOf("--out");
const OUT = outAt >= 0 ? resolve(argv[outAt + 1]) : resolve(process.env.CM_OUT ?? join(tmpdir(), "anatomy", "credit-meter"));
mkdirSync(OUT, { recursive: true });

const started = Date.now();
const scene = await import(pathToFileURL(join(FIG, "scene.ts")).href);
const geometry = await import(pathToFileURL(join(FIG, "geometry.ts")).href);
const { COPY } = await import(pathToFileURL(join(FIG, "copy.ts")).href);
const k = await import(pathToFileURL(join(KIT, "iso-kit.mjs")).href);
const A = await import(pathToFileURL(join(KIT, "audit.mjs")).href);
const built = Date.now() - started;

const strip = (file) =>
  stripTypeScriptTypes(readFileSync(file, "utf8"))
    .replace(/^import [^;]*;$/gm, "")
    .replace(/^export /gm, "");
const kitSource = readFileSync(join(KIT, "iso-kit.mjs"), "utf8").replace(/^export /gm, "");
const live = `{\n${strip(join(FIG, "lever.ts"))}\n${strip(join(FIG, "controller.ts"))}\nconst DATA = __DATA__;\nmountMeter(document.querySelector(".cm-stage"), DATA);\n}`;

const ISO_CSS = readFileSync(join(KIT, "iso.css"), "utf8");
const CM_CSS = readFileSync(join(FIG, "credit-meter.css"), "utf8");
const font = (file, weight) => `@font-face{font-family:"Thmanyah";src:url("${pathToFileURL(join(SRC, "fonts", file)).href}") format("woff2");font-weight:${weight};font-display:block}`;
const PAGE_CSS = `
${font("thmanyahsans-Regular.woff2", 400)}${font("thmanyahsans-Medium.woff2", 500)}${font("thmanyahsans-Bold.woff2", "600 700")}
*{box-sizing:border-box}
:root{--font-thmanyah:"Thmanyah";color-scheme:light}
html[data-theme="dark"]{color-scheme:dark}
body{margin:0;background:#f7f8fa;color:#0d1326;font:16px/1.5 var(--font-thmanyah),system-ui,sans-serif;-webkit-font-smoothing:antialiased}
html[data-theme="dark"] body{background:#080d1c;color:#eef1f8}
main{max-width:760px;margin:0 auto;padding:40px 16px 56px}
`;

const esc = (text) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const style = (object) => Object.entries(object).map(([key, value]) => `${key}:${value}`).join(";");

function page(locale, theme) {
  const copy = COPY[locale];
  const data = scene.liveData(locale);
  const stage =
    `<div class="iso-stage cm-stage" role="group" aria-label="${esc(copy.group)}" data-outlet="${scene.START.outlet}" data-plan="${scene.START.plan}">` +
    `<div class="cm-box">` +
    `<svg class="iso-svg" viewBox="0 0 ${geometry.METER.width} ${geometry.METER.height}" role="img" aria-label="${esc(copy.label)}" focusable="false">${scene.sceneSvg(locale)}</svg>` +
    `<button type="button" class="cm-hit" data-control="plan" style="${style(scene.hitStyle(geometry.HITS.plan))}" aria-label="${esc(data.planButton[scene.START.plan])}"></button>` +
    `<button type="button" class="cm-hit" data-control="valve" style="${style(scene.hitStyle(geometry.HITS.valve))}" aria-pressed="false" aria-label="${esc(data.valveButton[scene.START.outlet])}"></button>` +
    `</div>` +
    `<span class="cm-sr" role="status" aria-live="polite" data-status></span>` +
    `</div>`;
  const plate = k.plateHtml({ fig: copy.fig(4), title: copy.title, hint: copy.hint, readout: copy.readout, keys: copy.keys, caption: copy.caption, body: stage });
  const dir = locale === "ar" ? "rtl" : "ltr";
  const script = (kitSource + "\n" + live.replace("__DATA__", JSON.stringify(data))).split("</script").join("<\\/script");
  return `<!doctype html><html lang="${locale}" dir="${dir}"${theme === "dark" ? ' data-theme="dark"' : ""}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Credit meter</title><style>${PAGE_CSS}${ISO_CSS}${CM_CSS}</style></head><body><main><div class="iso cm" data-theme="light" dir="${dir}" lang="${locale}">${plate}</div></main><script type="module">${script}</script></body></html>`;
}

const written = [];
for (const locale of ["ar", "en"]) {
  for (const theme of ["dark", "light"]) {
    const name = `credit-meter-${locale}${theme === "light" ? "-light" : ""}.html`;
    const html = page(locale, theme);
    writeFileSync(join(OUT, name), html);
    written.push(`${name} ${(html.length / 1024).toFixed(0)} KB`);
  }
}
const svgBytes = Buffer.byteLength(scene.sceneSvg("ar"));
console.log(`wrote ${written.join(", ")} to ${OUT}`);
console.log(`geometry ${built} ms · ${geometry.RECORDER.items.length} items · ${geometry.RECORDER.solids.length} solids · ${geometry.RECORDER.tubes.length} tube runs · svg ${(svgBytes / 1024).toFixed(1)} KB`);

A.auditOrExit(geometry.RECORDER, geometry.METER.projection, {});
