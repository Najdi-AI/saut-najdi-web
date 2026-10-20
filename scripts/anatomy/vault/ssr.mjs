// Renders the React component (VaultFigure → VaultLive) on the server with
// react-dom/server, the way Next's server components hand it to the client,
// and checks the markup: the static card is in the HTML, lang/dir are right,
// the wrapper carries the kit's class and theme, and the weight it adds.
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

let failed = 0;
const check = (ok, label) => {
  console.log(`${ok ? "ok  " : "FAIL"} ${label}`);
  if (!ok) failed++;
};

for (const locale of ["ar", "en"]) {
  for (const ground of ["page", "navy"]) {
    const html = renderToString(React.createElement(VaultFigure, { locale, fig: 7, ground }));
    const tag = html.slice(0, 200);
    check(tag.includes('class="iso vlt"'), `${locale}/${ground} wrapper has class "iso vlt"`);
    check(tag.includes(`dir="${locale === "ar" ? "rtl" : "ltr"}"`) && tag.includes(`lang="${locale}"`), `${locale}/${ground} lang and dir`);
    check(tag.includes(`data-theme="${ground === "navy" ? "dark" : "light"}"`) && tag.includes(`data-ground="${ground}"`), `${locale}/${ground} server theme ${ground === "navy" ? "dark" : "light"} and ground`);
    check(html.includes('role="img"') && html.includes('aria-label="'), `${locale}/${ground} svg role=img with aria-label`);
    check(html.includes('tabindex="0"') && html.includes('role="group"'), `${locale}/${ground} focusable stage`);
    check(html.includes(locale === "ar" ? "خزنة الخليج" : "The Gulf vault") && html.includes(locale === "ar" ? "الدوحة" : "DOHA"), `${locale}/${ground} title and engraved label in server HTML`);
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
