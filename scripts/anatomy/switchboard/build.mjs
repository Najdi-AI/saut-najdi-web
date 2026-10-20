// Verification build for the hero switchboard figure.
// It imports the SAME geometry, model and motion modules the site uses and writes
// standalone pages (dark and --light, ar and --en) for the anatomy checks:
//   node scripts/anatomy/switchboard/build.mjs [--light] [--en] [--audit] [--out DIR]
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as A from "../../../src/components/iso/audit.mjs";
import { P, WIDTH, HEIGHT } from "../../../src/components/anatomy/switchboard/view.mjs";
import { POSES, REST, artOf, buildScene, liveData } from "../../../src/components/anatomy/switchboard/geometry.mjs";
import { DIALECTS, DIALECT_WORDS, TEXT, readoutOf } from "../../../src/components/anatomy/switchboard/model.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..", "..", "..");
const SRC = join(ROOT, "src", "components");
const argv = process.argv.slice(2);
const theme = argv.includes("--light") ? "light" : "dark";
const locale = argv.includes("--en") ? "en" : "ar";
const outAt = argv.indexOf("--out");
const OUT = outAt >= 0 ? argv[outAt + 1] : "C:/Users/Asus/AppData/Local/Temp/claude/C--Users-Asus/5654639c-1df3-4753-827b-e43692e22d39/scratchpad/anatomy/switchboard";
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
const swatch = (mark) =>
  mark === "lit" || mark === "raised"
    ? `<svg class="iso-swatch" data-mark="${mark}" viewBox="0 0 16 10" aria-hidden="true"><path d="M2 4.5 8 1.5 14 4.5 14 6 8 9 2 6Z"/><path class="iso-swatch-crease" d="M2 4.5 8 7.5 14 4.5"/></svg>`
    : `<svg class="iso-swatch" data-mark="${mark}" viewBox="0 0 16 10" aria-hidden="true"><path d="M1.5 5h13"/></svg>`;
const PLAY = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 5.9v12.2a.9.9 0 0 0 1.37.77l9.6-6.1a.9.9 0 0 0 0-1.53l-9.6-6.1A.9.9 0 0 0 8 5.9Z" fill="currentColor"/></svg>`;
const plain = argv.includes("--plain");
const art = artOf({ reuse: !plain });
const markup = `<figure class="sb iso" data-theme="light" dir="${locale === "ar" ? "rtl" : "ltr"}" lang="${locale}">
<div class="iso-plate sb-plate">
<div class="iso-plate-corners" aria-hidden="true"><span class="iso-plate-corner" data-corner="fig">${esc(t.fig)}</span><span class="iso-plate-corner" data-corner="title">${esc(t.title)}</span><span class="iso-plate-corner" data-corner="hint">${esc(t.hint)}</span><span class="iso-plate-corner" data-corner="readout" data-readout>${esc(readoutOf(locale, "idle"))}</span></div>
<div class="iso-stage sb-stage" dir="ltr"><svg class="iso-svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="${esc(t.label)}">${art}</svg>
<button type="button" class="sb-play" style="left:${data.hub[0]}%;top:${data.hub[1]}%" aria-label="${esc(t.play)}" aria-pressed="false" aria-describedby="sb-clip"><span class="sb-play-chip">${PLAY}</span></button></div>
</div>
<figcaption class="iso-legend sb-legend">
<span class="sb-dial" role="radiogroup" aria-label="${esc(t.dialGroup)}"><span class="sb-dial-name" aria-hidden="true">${esc(t.dialGroup)}</span>${DIALECTS.map((d) => `<button type="button" role="radio" data-dialect="${d}" aria-checked="${d === "arabic"}" tabindex="${d === "arabic" ? 0 : -1}">${esc(DIALECT_WORDS[locale][d])}</button>`).join("")}</span>
<span class="iso-keys">${t.keys.map((key) => `<span class="iso-key">${swatch(key.mark)}${esc(key.label)}</span>`).join("")}</span>
<span class="iso-caption">${esc(t.caption)}</span>
<span class="sb-clip" id="sb-clip">${esc(t.clipCaption)}</span>
</figcaption>
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
const dialButtons = [...figure.querySelectorAll("[data-dialect]")];
const showDial = (dialect) => dialButtons.forEach((b) => { const on = b.dataset.dialect === dialect; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
const board = MO.mountSwitchboard(stage, DATA, { locale: ${JSON.stringify(locale)}, lines: ${JSON.stringify(t.lines)}, onDial: showDial });
window.__board = board;
// the dial's three words
const pick = (button, focus) => {
  showDial(button.dataset.dialect);
  if (focus) button.focus();
  board.setDial(button.dataset.dialect);
};
dialButtons.forEach((button, index) => {
  button.addEventListener("click", () => pick(button, false));
  button.addEventListener("keydown", (event) => {
    const forward = ${locale === "ar" ? '"ArrowLeft"' : '"ArrowRight"'};
    const backward = ${locale === "ar" ? '"ArrowRight"' : '"ArrowLeft"'};
    let next = null;
    if (event.key === forward || event.key === "ArrowDown") next = dialButtons[(index + 1) % dialButtons.length];
    if (event.key === backward || event.key === "ArrowUp") next = dialButtons[(index + dialButtons.length - 1) % dialButtons.length];
    if (next) { event.preventDefault(); pick(next, true); }
  });
});
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

const css = readFileSync(join(SRC, "iso", "iso.css"), "utf8") + readFileSync(join(SRC, "anatomy", "switchboard", "switchboard.css"), "utf8");
const pageCss = `
*{box-sizing:border-box}
:root{--c-ink:13 19 38;--c-canvas:247 248 250;--c-line:229 231 235;--c-surface:255 255 255;--shadow-rgb:13 19 38;--c-brand-magenta:226 12 58;color-scheme:light}
html[data-theme="dark"]{--c-ink:238 241 248;--c-canvas:8 13 28;--c-line:35 44 73;--c-surface:15 23 48;--shadow-rgb:0 0 0;--c-brand-magenta:255 92 122;color-scheme:dark}
body{margin:0;background:rgb(var(--c-canvas));color:rgb(var(--c-ink));font:14px/1.6 "Segoe UI",Tahoma,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
main{width:min(560px,100% - 32px);margin:48px auto 72px}
button{border:0;font:inherit}
`;
const html = `<!doctype html><html lang="${locale}" dir="${locale === "ar" ? "rtl" : "ltr"}"${theme === "dark" ? ' data-theme="dark"' : ""}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Najdi switchboard</title><style>${css}${pageCss}</style></head><body><main>${markup}</main><script type="module">${script.replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;
const name = `switchboard${locale === "en" ? "-en" : ""}${plain ? "-plain" : ""}${theme === "light" ? "-light" : ""}.html`;
writeFileSync(join(OUT, name), html);
console.log("wrote", join(OUT, name), `${(html.length / 1024).toFixed(0)} KB`, `art ${(art.length / 1024).toFixed(0)} KB`, `scale ${G_scale()}`);
function G_scale() {
  return (P.scale * Math.sqrt(1.6)).toFixed(3);
}
