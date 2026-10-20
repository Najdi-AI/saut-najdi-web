// Renders the React component (VaultFigure → VaultLive) on the server with
// react-dom/server, the way Next's server components hand it to the client,
// and checks the markup: the frameless shell is in the HTML and the drawing is
// not (it is the lazy SVG in public/figures), lang/dir are right, the wrapper
// carries the kit's class and theme, and the weight it adds.
//
//   node scripts/anatomy/vault/ssr.mjs
import { register } from "node:module";
import { gzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

register("./ssr-hook.mjs", import.meta.url);

const ROOT = fileURLToPath(new URL("../../../", import.meta.url));
const React = await import(pathToFileURL(`${ROOT}node_modules/react/index.js`).href);
const { renderToString } = await import(pathToFileURL(`${ROOT}node_modules/react-dom/server.node.js`).href);
const { VaultFigure } = await import(pathToFileURL(`${ROOT}src/components/anatomy/vault/VaultFigure.tsx`).href);
const { FIGURE_ART } = await import(pathToFileURL(`${ROOT}src/components/anatomy/lazy/assets.ts`).href);

let failed = 0;
const check = (ok, label) => {
  console.log(`${ok ? "ok  " : "FAIL"} ${label}`);
  if (!ok) failed++;
};

for (const locale of ["ar", "en"]) {
  for (const ground of ["page", "navy"]) {
    const html = renderToString(React.createElement(VaultFigure, { locale, fig: 7, ground }));
    const tag = html.slice(0, 200);
    check(tag.includes('class="iso vlt anx"'), `${locale}/${ground} wrapper has class "iso vlt anx" (frameless)`);
    check(tag.includes(`dir="${locale === "ar" ? "rtl" : "ltr"}"`) && tag.includes(`lang="${locale}"`), `${locale}/${ground} lang and dir`);
    check(tag.includes(`data-theme="${ground === "navy" ? "dark" : "light"}"`) && tag.includes(`data-ground="${ground}"`), `${locale}/${ground} server theme ${ground === "navy" ? "dark" : "light"} and ground`);
    check(/class="anx-art" role="img" aria-label="[^"]{40,}" style="aspect-ratio:\d+ \/ \d+"/.test(html), `${locale}/${ground} art slot role=img with a real aria-label and the drawing's aspect ratio`);
    check(html.includes('tabindex="0"') && html.includes('role="group"'), `${locale}/${ground} focusable stage`);
    check(!html.includes("iso-plate-corner") && !html.includes("iso-legend"), `${locale}/${ground} frameless: no corners, no legend`);
    check(/class="anx-sr" data-readout="">[^<]+</.test(html) && html.includes('role="status" aria-live="polite" data-status=""'), `${locale}/${ground} readout off screen, polite status region`);
    check(!html.includes("<path") && !html.includes("data-item="), `${locale}/${ground} lazy: no drawing in the server HTML`);
    const art = readFileSync(`${ROOT}public${FIGURE_ART.vault[locale]}`, "utf8");
    check(art.includes(locale === "ar" ? "الدوحة" : "DOHA") && art.includes('data-part="strip-line"'), `${locale}/${ground} lazy art ${FIGURE_ART.vault[locale]} carries the engraved label and the strip`);
    check(!/[٠-٩]/.test(html), `${locale}/${ground} Latin digits only`);
    if (ground === "page") {
      const bytes = Buffer.byteLength(html);
      console.log(`     ${locale} server HTML ${(bytes / 1024).toFixed(1)} KB · ${(gzipSync(html).length / 1024).toFixed(1)} KB gzip`);
    }
  }
}

const controller = readFileSync(`${ROOT}src/components/anatomy/vault/controller.ts`, "utf8");
const live = readFileSync(`${ROOT}src/components/anatomy/vault/VaultLive.tsx`, "utf8");
console.log(`     client source: controller.ts ${(Buffer.byteLength(controller) / 1024).toFixed(1)} KB, VaultLive.tsx ${(Buffer.byteLength(live) / 1024).toFixed(1)} KB (before minification)`);
console.log(failed ? `ssr failed: ${failed}` : "ssr passed");
if (failed) process.exitCode = 1;
