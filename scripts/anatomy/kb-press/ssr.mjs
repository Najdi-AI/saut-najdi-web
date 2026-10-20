/**
 * Server-render check for the knowledge press React component (NAJ-897).
 *
 * This renders <KbPressFigure> for both
 * locales with react-dom/server, transpiling the .ts/.tsx sources with the
 * repo's own TypeScript, and checks the markup the browser will get: the theme
 * wrappers, dir/lang, the frameless shell (no corners or legend, the readout
 * off screen), the question buttons, the empty lazy art slot, and that the
 * lazy SVG in public/figures is the verified body with its live hooks.
 * It also reports the HTML weight and a minified size of the client code.
 *
 *   node scripts/anatomy/kb-press/ssr.mjs
 */
import { registerHooks } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { gzipSync } from "node:zlib";
import { createRequire } from "node:module";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../../..");
const FIG = join(ROOT, "src/components/anatomy/kb-press");
const require = createRequire(join(ROOT, "package.json"));
const ts = require("typescript");

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
    if (url.endsWith(".css")) return { format: "module", source: "export default {};", shortCircuit: true };
    if (url.endsWith(".ts") || url.endsWith(".tsx")) {
      const source = readFileSync(fileURLToPath(url), "utf8");
      const out = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, verbatimModuleSyntax: false } });
      return { format: "module", source: out.outputText, shortCircuit: true };
    }
    return next(url, context);
  },
});

const { renderToString } = await import(pathToFileURL(require.resolve("react-dom/server")).href);
const React = await import(pathToFileURL(require.resolve("react")).href);
const { KbPressFigure } = await import(pathToFileURL(join(FIG, "index.ts")).href);
const G = await import(pathToFileURL(join(FIG, "geometry.ts")).href);
const M = await import(pathToFileURL(join(FIG, "model.ts")).href);
const { FIGURE_ART } = await import(pathToFileURL(join(ROOT, "src/components/anatomy/lazy/assets.ts")).href);

let failed = 0;
const check = (label, ok) => {
  console.log(`${ok ? "ok  " : "FAIL"} ${label}`);
  if (!ok) failed++;
};

for (const locale of ["ar", "en"]) {
  const html = renderToString(React.createElement(KbPressFigure, { locale, fig: 3 }));
  const W = M.WORDS[locale];
  const attr = (text) => text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  console.log(`\n${locale}: ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB HTML (${(gzipSync(html).length / 1024).toFixed(1)} KB gzip)`);
  check("outer wrapper carries the kit's dark tokens", html.startsWith('<div class="iso kbp-theme">'));
  check("figure is light by default, frameless (anx), follows <html data-theme> through kb-press.css", html.includes('class="iso kbp anx" data-theme="light"'));
  check(`dir and lang set for ${locale}`, html.includes(`dir="${locale === "ar" ? "rtl" : "ltr"}" lang="${locale}"`));
  check("frameless: no corner labels, no legend, no caption", !html.includes("iso-plate-corner") && !html.includes("iso-legend") && !html.includes(W.caption) && !html.includes(W.hint));
  check("resting readout kept off screen in the kit's [data-readout]", html.includes(`<span class="anx-sr" data-readout="">${W.ready}</span>`));
  check("four question buttons, keyboard reachable", (html.match(/<button type="button" class="kbp-ask" data-kb-ask="\d" aria-pressed="false">/g) ?? []).length === 4);
  check("polite status region for announcements", html.includes('role="status" aria-live="polite" data-kb-status=""'));
  check("focusable stage with its label", html.includes(`class="kbp-stage" tabindex="0" role="group" aria-label="${attr(W.stage)}"`));
  check("art slot is role=img with the locale's label and the drawing's aspect ratio", html.includes(`class="anx-art" role="img" aria-label="${attr(W.svg)}" style="aspect-ratio:${G.VIEW.width} / ${G.VIEW.height}"`));
  check("lazy: no drawing in the server HTML", !html.includes("<path") && !html.includes("data-kb="));
  check("the chips' label keeps the claim on text chat, and illustrative", W.asks.includes(locale === "ar" ? "المحادثة النصية" : "text chat") && W.asks.includes(locale === "ar" ? "توضيحية" : "Illustrative"));
  const file = join(ROOT, "public", FIGURE_ART["kb-press"][locale]);
  const art = readFileSync(file, "utf8").split("\r\n").join("\n");
  check(`lazy art ${FIGURE_ART["kb-press"][locale]} is the verified body (byte-identical apart from its per-instance clip token)`, art.replaceAll(`${G.CLIP_ID}-ANXUID`, G.CLIP_ID).includes(G.BODY) && art.split(`${G.CLIP_ID}-ANXUID`).length === 3);
  check("live groups present in the lazy art", ["arm", "head", "platen", "transit", "drawer.0", "drawer.3", "lift.0", "lift.3", "doc.0", "doc.2"].every((name) => art.includes(`data-kb="${name}"`)) && art.includes('data-kb-slot="lift"'));
}

/* client weight: the only code that ships is live.tsx + motion.ts + model.ts */
const terserPath = join(ROOT, "node_modules/next/dist/compiled/terser/bundle.min.js");
const client = ["model.ts", "motion.ts", "live.tsx", "../lazy/useLazyArt.ts"]
  .map((file) => ts.transpileModule(readFileSync(join(FIG, file), "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText.replace(/^import[^;]*;\s*$/gm, ""))
  .join("\n");
let minified = client;
try {
  const terser = require(terserPath);
  minified = (await terser.minify(client, { module: true, compress: true, mangle: true })).code;
} catch (error) {
  console.log(`(terser unavailable: ${error.message}; reporting unminified)`);
}
console.log(`\nclient code (model + motion + live + useLazyArt): ${(Buffer.byteLength(minified) / 1024).toFixed(1)} KB minified, ${(gzipSync(minified).length / 1024).toFixed(1)} KB gzip`);
console.log(failed ? `\nssr check failed: ${failed}` : "\nssr check passed");
if (failed) process.exitCode = 1;
