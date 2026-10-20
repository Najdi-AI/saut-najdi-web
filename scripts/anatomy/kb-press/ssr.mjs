/**
 * Server-render check for the knowledge press React component (NAJ-897).
 *
 * Nothing in the site imports the figure yet (the integration step wires it),
 * so `next build` never renders it. This renders <KbPressFigure> for both
 * locales with react-dom/server, transpiling the .ts/.tsx sources with the
 * repo's own TypeScript, and checks the markup the browser will get: the theme
 * wrappers, dir/lang, the plate words, the question buttons, the SVG body
 * (byte-identical to what the verification pages use) and the live hooks.
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
  check("plate is light by default, follows <html data-theme> through kb-press.css", html.includes('class="iso kbp" data-theme="light"'));
  check(`dir and lang set for ${locale}`, html.includes(`dir="${locale === "ar" ? "rtl" : "ltr"}" lang="${locale}"`));
  check("Fig, title, hint and resting readout in the corners", [`${W.fig} 3`, W.title, W.hint, W.ready].every((text) => html.includes(text)));
  check("readout slot is the kit's [data-readout]", /data-corner="readout" data-readout="">/.test(html));
  check("four question buttons, keyboard reachable", (html.match(/<button type="button" class="kbp-ask" data-kb-ask="\d" aria-pressed="false">/g) ?? []).length === 4);
  check("polite status region for announcements", html.includes('role="status" aria-live="polite" data-kb-status=""'));
  check("focusable stage with its label", html.includes(`class="kbp-stage" tabindex="0" role="group" aria-label="${attr(W.stage)}"`));
  check("svg is role=img with the locale's label", html.includes(`role="img" aria-label="${attr(W.svg)}"`));
  const ids = [...html.matchAll(/id="(kbp-drop-[A-Za-z0-9_-]+)"/g)].map((match) => match[1]);
  check("svg body is byte-identical to the verified pages (apart from its per-instance clip id)", ids.length === 1 && html.replaceAll(ids[0], G.CLIP_ID).includes(G.BODY));
  check("the drop clip is referenced by its own id", ids.length === 1 && html.includes(`clip-path="url(#${ids[0]})"`));
  check("live groups present (arm, head, platen, transit, 4 drawers, 4 lifts, 3 files, lift slot)", ["arm", "head", "platen", "transit", "drawer.0", "drawer.3", "lift.0", "lift.3", "doc.0", "doc.2"].every((name) => html.includes(`data-kb="${name}"`)) && html.includes('data-kb-slot="lift"'));
  check("caption keeps the claim on text chat, not calls", W.caption.includes(locale === "ar" ? "المحادثة النصية" : "text chat"));
}

/* two figures on one page: every clip id is unique, and each reference finds its own */
{
  const html = renderToString(React.createElement(React.Fragment, null, React.createElement(KbPressFigure, { locale: "ar", fig: 3 }), React.createElement(KbPressFigure, { locale: "en", fig: 4 })));
  const ids = [...html.matchAll(/id="(kbp-drop-[A-Za-z0-9_-]+)"/g)].map((match) => match[1]);
  const refs = [...html.matchAll(/clip-path="url\(#([^)]+)\)"/g)].map((match) => match[1]);
  console.log(`\ntwo instances: clip ids ${ids.join(", ")}`);
  check("two instances get two distinct clip ids, each referenced once", ids.length === 2 && new Set(ids).size === 2 && refs.length === 2 && refs.every((ref, index) => ref === ids[index]));
}

/* client weight: the only code that ships is live.tsx + motion.ts + model.ts */
const terserPath = join(ROOT, "node_modules/next/dist/compiled/terser/bundle.min.js");
const client = ["model.ts", "motion.ts", "live.tsx"]
  .map((file) => ts.transpileModule(readFileSync(join(FIG, file), "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText.replace(/^import[^;]*;\s*$/gm, ""))
  .join("\n");
let minified = client;
try {
  const terser = require(terserPath);
  minified = (await terser.minify(client, { module: true, compress: true, mangle: true })).code;
} catch (error) {
  console.log(`(terser unavailable: ${error.message}; reporting unminified)`);
}
console.log(`\nclient code (model + motion + live): ${(Buffer.byteLength(minified) / 1024).toFixed(1)} KB minified, ${(gzipSync(minified).length / 1024).toFixed(1)} KB gzip`);
console.log(failed ? `\nssr check failed: ${failed}` : "\nssr check passed");
if (failed) process.exitCode = 1;
