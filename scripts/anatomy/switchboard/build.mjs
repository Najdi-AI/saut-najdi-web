// Verification build for the hero switchboard figure.
// It imports the SAME geometry, model and motion modules the site uses and writes
// standalone pages (dark and --light, ar and --en) for the anatomy checks:
//   node scripts/anatomy/switchboard/build.mjs [--light] [--en] [--audit] [--out DIR]
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as A from "../../../src/components/iso/audit.mjs";
import { P, WIDTH, HEIGHT } from "../../../src/components/anatomy/switchboard/view.mjs";
import { POSES, REST, artOf, buildScene, liveData } from "../../../src/components/anatomy/switchboard/geometry.mjs";
import { TEXT, readoutOf } from "../../../src/components/anatomy/switchboard/model.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..", "..", "..");
const SRC = join(ROOT, "src", "components");
const argv = process.argv.slice(2);
const theme = argv.includes("--light") ? "light" : "dark";
const locale = argv.includes("--en") ? "en" : "ar";
const outAt = argv.indexOf("--out");
const OUT = outAt >= 0 ? argv[outAt + 1] : join(tmpdir(), "anatomy", "switchboard");
mkdirSync(OUT, { recursive: true });

// ------------------------------------------------------------------ audit every resting pose
if (argv.includes("--audit")) {
  const rest = buildScene(REST);
  const restKeys = new Map(rest.items.map((item) => [item.name, item.key]));
  let failed = 0;
  for (const [name, pose] of Object.entries(POSES)) {
    const { R } = buildScene(pose);
    console.log(`\n== pose ${name}`);
    const result = A.audit(R, P, {});
    console.log(A.report(result));
    const count = A.failures(result);
    // the page draws every pose in the REST order (live parts sit in fixed slots): prove that order here too
    const items = R.items.map((item) => ({ ...item, key: restKeys.get(item.name) ?? item.key }));
    const overlaps = A.overlapsOf(items, P, { states: [0], skip: A.sameRun });
    const order = A.depthOrder(items, P, { overlaps, rest: [0] });
    console.log(`page order in this pose: ${order.problems.length} problems`);
    for (const p of order.problems.slice(0, 12)) console.log(`  order  ${p.front} is in front of ${p.back} but drawn first (${p.area.toFixed(2)} px²)`);
    failed += count + order.problems.length;
    console.log(count + order.problems.length ? `pose ${name}: failed ${count + order.problems.length}` : `pose ${name}: passed`);
  }
  console.log(failed ? `\naudit failed: ${failed} problems` : "\naudit passed");
  process.exitCode = failed ? 1 : 0;
}

// ------------------------------------------------------------------ the standalone page
const t = TEXT[locale];
const data = liveData();
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const PLAY = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 5.9v12.2a.9.9 0 0 0 1.37.77l9.6-6.1a.9.9 0 0 0 0-1.53l-9.6-6.1A.9.9 0 0 0 8 5.9Z" fill="currentColor"/></svg>`;
const plain = argv.includes("--plain");
const loose = argv.includes("--loose");
const art = artOf({ reuse: !plain, compact: !loose });
// the same frameless tree live.tsx renders: no corners, legend or dial chips; the readout off screen
const markup = `<figure class="iso-figure sb iso anx" data-theme="light" dir="${locale === "ar" ? "rtl" : "ltr"}" lang="${locale}">
<div class="iso-plate sb-plate">
<div class="iso-stage sb-stage" dir="ltr"><svg class="iso-svg" viewBox="${data.frame.join(" ")}" role="img" aria-label="${esc(t.label)}">${art}</svg>
<button type="button" class="sb-play" style="left:${data.hub[0]}%;top:${data.hub[1]}%" aria-label="${esc(t.play)}" aria-pressed="false" aria-describedby="sb-clip"><span class="sb-play-chip">${PLAY}</span></button></div>
<span class="anx-sr" data-readout>${esc(readoutOf(locale, "idle"))}</span>
</div>
<figcaption class="sb-clip" id="sb-clip">${esc(t.clipCaption)}</figcaption>
<span class="sb-say" data-say="" aria-live="polite"></span>
</figure>`;

// inline the modules the motion imports, as namespaces (no file:// module loading in Chrome)
function namespace(name, file, preamble = "") {
  let src = readFileSync(file, "utf8").replace(/^import [\s\S]*?;\s*$/gm, "");
  const names = [...src.matchAll(/^export (?:async )?(?:const|function|let|class) ([A-Za-z0-9_$]+)/gm)].map((m) => m[1]);
  src = src.replace(/^export /gm, "");
  return `const ${name} = (() => {${preamble}\n${src}\nreturn { ${names.join(", ")} };})();\n`;
}
const script = [
  namespace("K", join(SRC, "iso", "iso-kit.mjs")),
  namespace("GL", join(SRC, "iso", "lathe.mjs"), "const { cameraOf, iso, pathOf } = K;"),
  namespace("TB", join(SRC, "iso", "tube.mjs"), "const { iso, pathOf } = K; const G = GL;"),
  namespace("MD", join(SRC, "anatomy", "switchboard", "model.mjs")),
  namespace(
    "MO",
    join(SRC, "anatomy", "switchboard", "motion.mjs"),
    "const { tubePieces, tubeSvg } = TB; const { iso, pathOf, translateAlong } = K; const { CALL_DIALECT, DIAL_HOME, STILL, TOUR_BACK, TOUR_FIRST, cordRoute, plugTravel, readoutOf, tourAt } = MD;",
  ),
  `const DATA = ${JSON.stringify(data)};
const figure = document.querySelector(".sb");
const stage = figure.querySelector(".sb-stage");
const board = MO.mountSwitchboard(stage, DATA, { locale: ${JSON.stringify(locale)}, lines: ${JSON.stringify(t.lines)} });
window.__board = board;
// the voice clip, simulated from the real turn timings (no audio on file://)
const TURNS = ${readFileSync(join(ROOT, "public", "audio", "home-hero.json"), "utf8")}.turns.slice(0, 3);
const play = figure.querySelector(".sb-play");
let started = 0, timer = 0;
const follow = () => {
  const ms = performance.now() - started;
  const index = TURNS.findIndex((t) => ms >= t.startMs - 100 && ms < t.endMs);
  if (ms > 8507) { board.setClip({ active: false, speaking: "", turn: -1, status: "ended" }); play.setAttribute("aria-pressed", "false"); return; }
  board.setClip({ active: true, speaking: index >= 0 ? TURNS[index].who : "", turn: index, status: "playing" });
  timer = requestAnimationFrame(follow);
};
play.addEventListener("click", () => {
  if (play.getAttribute("aria-pressed") === "true") { cancelAnimationFrame(timer); board.setClip({ active: false, speaking: "", turn: -1, status: "paused" }); play.setAttribute("aria-pressed", "false"); return; }
  play.setAttribute("aria-pressed", "true"); started = performance.now(); follow();
});
`,
].join("\n");

const css = readFileSync(join(SRC, "iso", "iso.css"), "utf8") + readFileSync(join(SRC, "anatomy", "lazy", "frameless.css"), "utf8") + readFileSync(join(SRC, "anatomy", "switchboard", "switchboard.css"), "utf8");
// The site's own typeface (src/app/fonts.ts), so a width check here matches the real
// page: the corners inherit it, and Thmanyah sets wider than Segoe UI.
const FONTS = join(ROOT, "src", "fonts");
const face = (file, weight) => `@font-face{font-family:"Thmanyah Sans";src:url("${pathToFileURL(join(FONTS, file)).href}") format("woff2");font-weight:${weight};font-style:normal;font-display:block}`;
const fontCss = face("thmanyahsans-Regular.woff2", "400") + face("thmanyahsans-Medium.woff2", "500") + face("thmanyahsans-Bold.woff2", "600 700");
const pageCss = `
${fontCss}
*{box-sizing:border-box}
:root{--font-thmanyah:"Thmanyah Sans";--c-ink:13 19 38;--c-canvas:247 248 250;--c-line:229 231 235;--c-surface:255 255 255;--shadow-rgb:13 19 38;--c-brand-magenta:226 12 58;color-scheme:light}
html[data-theme="dark"]{--c-ink:238 241 248;--c-canvas:8 13 28;--c-line:35 44 73;--c-surface:15 23 48;--shadow-rgb:0 0 0;--c-brand-magenta:255 92 122;color-scheme:dark}
body{margin:0;background:rgb(var(--c-canvas));color:rgb(var(--c-ink));font:14px/1.6 var(--font-thmanyah),system-ui,sans-serif;-webkit-font-smoothing:antialiased}
main{width:min(920px,100%);margin:48px auto 72px}
button{border:0;font:inherit}
`;
const html = `<!doctype html><html lang="${locale}" dir="${locale === "ar" ? "rtl" : "ltr"}"${theme === "dark" ? ' data-theme="dark"' : ""}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Najdi switchboard</title><style>${css}${pageCss}</style></head><body><main>${markup}</main><script type="module">${script.replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;
const name = `switchboard${locale === "en" ? "-en" : ""}${plain ? "-plain" : ""}${loose ? "-loose" : ""}${theme === "light" ? "-light" : ""}.html`;
writeFileSync(join(OUT, name), html);
console.log("wrote", join(OUT, name), `${(html.length / 1024).toFixed(0)} KB`, `art ${(art.length / 1024).toFixed(0)} KB`, `scale ${G_scale()}`);
function G_scale() {
  return (P.scale * Math.sqrt(1.6)).toFixed(3);
}
