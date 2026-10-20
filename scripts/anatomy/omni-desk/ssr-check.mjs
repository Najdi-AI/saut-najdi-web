/**
 * Server-render check for the "one desk" figure, without a route:
 *
 *   node scripts/anatomy/omni-desk/ssr-check.mjs [--out <file.html>]
 *
 * Renders <OmniDeskFigure> for both locales with React's server renderer
 * (JSX compiled on the fly with sucrase, which ships with the site's
 * toolchain; CSS imports stubbed), then checks that the server HTML is the
 * frameless shell with no drawing in it, that the lazy SVG in public/figures
 * is exactly the drawing the standalone page verifies, that it carries the
 * theme hooks, and reports the weight it adds to the HTML.
 */
import { registerHooks } from "node:module";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { gzipSync, brotliCompressSync } from "node:zlib";

process.removeAllListeners("warning");
const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..", "..", "..");
const require = createRequire(join(ROOT, "package.json"));
const { transform } = require("sucrase");

registerHooks({
  resolve(specifier, context, next) {
    if (specifier.endsWith(".css")) return { url: "data:text/javascript,export default {}", shortCircuit: true };
    try {
      return next(specifier, context);
    } catch (error) {
      if (/^\.{1,2}\//.test(specifier) && !/\.[cm]?[jt]sx?$/.test(specifier)) {
        for (const ext of [".ts", ".tsx"]) {
          try {
            return next(specifier + ext, context);
          } catch {}
        }
      }
      throw error;
    }
  },
  load(url, context, next) {
    if (url.endsWith(".tsx")) {
      const source = readFileSync(fileURLToPath(url), "utf8");
      const { code } = transform(source, { transforms: ["typescript", "jsx"], jsxRuntime: "automatic", production: true, filePath: fileURLToPath(url) });
      return { format: "module", source: code, shortCircuit: true };
    }
    return next(url, context);
  },
});

const React = require("react");
const { renderToString } = require("react-dom/server");
const FIG = join(ROOT, "src", "components", "anatomy", "omni-desk");
const { OmniDeskFigure } = await import(pathToFileURL(join(FIG, "figure.tsx")).href);
const markup = await import(pathToFileURL(join(FIG, "markup.ts")).href);
const { FIGURE_ART } = await import(pathToFileURL(join(ROOT, "src", "components", "anatomy", "lazy", "assets.ts")).href);

let problems = 0;
const check = (ok, line) => {
  console.log(`${ok ? "ok  " : "FAIL"} ${line}`);
  if (!ok) problems++;
};

for (const locale of ["ar", "en"]) {
  const html = renderToString(React.createElement(OmniDeskFigure, { locale, fig: 5 }));
  const art = readFileSync(join(ROOT, "public", FIGURE_ART["omni-desk"][locale]), "utf8").split("\r\n").join("\n");
  check(art === `${markup.artOf(locale, "ANXUID")}\n`, `${locale}: the lazy art ${FIGURE_ART["omni-desk"][locale]} is the drawing the standalone page verifies (${(art.length / 1024).toFixed(1)} KB)`);
  check(!html.includes("<path") && !html.includes("data-od="), `${locale}: lazy: no drawing in the server HTML`);
  check(/class="iso od anx" dir="(rtl|ltr)" lang="(ar|en)" data-theme="light" data-od-sync=""/.test(html), `${locale}: wrapper carries class iso od anx, dir, lang, data-theme and the theme sync hook`);
  check(!html.includes("iso-plate-corner") && !html.includes("iso-legend"), `${locale}: frameless: no corners, no legend`);
  check(html.includes(`<p class="od-note">${markup.partsOf(locale).note}</p>`), `${locale}: one honest line under the buttons`);
  check(html.includes(`dir="${locale === "ar" ? "rtl" : "ltr"}"`), `${locale}: direction ${locale === "ar" ? "rtl" : "ltr"}`);
  check(/class="anx-art od-art" role="img" aria-label="[^"]{40,}"/.test(html), `${locale}: the art slot is role="img" with a real label`);
  check((html.match(/<button type="button" class="od-pick"/g) ?? []).length === 6, `${locale}: six channel buttons`);
  check(!/[٠-٩]/.test(html), `${locale}: no Arabic-Indic digits`);
  const gz = gzipSync(html).length;
  const br = brotliCompressSync(html).length;
  console.log(`     ${locale}: figure HTML ${(html.length / 1024).toFixed(1)} KB · gzip ${(gz / 1024).toFixed(1)} KB · brotli ${(br / 1024).toFixed(1)} KB`);
  const out = process.argv.includes("--out") ? process.argv[process.argv.indexOf("--out") + 1] : null;
  if (out && locale === "ar") writeFileSync(out, html);
}

console.log(problems ? `ssr check failed: ${problems}` : "ssr check passed");
if (problems) process.exitCode = 1;
