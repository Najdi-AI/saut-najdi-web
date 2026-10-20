/**
 * Standalone verification build for the "one desk" figure.
 *
 *   node scripts/anatomy/omni-desk/build.mjs [--light] [--en] [--audit] [--out <dir>]
 *
 * Imports the SAME modules the site renders (model, geometry, markup,
 * controller) and writes one self-contained page per run, with the kit CSS,
 * the figure CSS, the site's Thmanyah faces and the real controller inlined
 * (types stripped by Node), so capture.mjs, drive.mjs and lines.mjs see what
 * the site serves. --audit runs the kit's geometry audit, plus a check of the
 * moving parts against every static part in every pose they pass through.
 *
 * Taking over from the tour is checked on the built page with the skill's
 * drive.mjs and the two files beside this script (every line must say PASS):
 *
 *   node <anatomy>/scripts/drive.mjs <out>/omni-desk.html --actions scripts/anatomy/omni-desk/takeover.json --preload scripts/anatomy/omni-desk/takeover.js --height 1300
 */
import { registerHooks, stripTypeScriptTypes } from "node:module";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";

process.removeAllListeners("warning");

/* The site's modules import each other without extensions (TypeScript style); resolve those to .ts here. */
registerHooks({
  resolve(specifier, context, next) {
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
});

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..", "..", "..");
const FIG = join(ROOT, "src", "components", "anatomy", "omni-desk");
const KIT = join(ROOT, "src", "components", "iso");
const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const option = (name, fallback) => {
  const index = argv.indexOf(name);
  return index >= 0 && argv[index + 1] ? argv[index + 1] : fallback;
};
const THEME = flag("--light") ? "light" : "dark";
/* --site: mimic the site, which keeps its theme on <html data-theme="dark"> and server-renders the figure light. */
const SITE = flag("--site");
const LOCALE = flag("--en") ? "en" : "ar";
const OUT = resolve(option("--out", join(tmpdir(), "anatomy", "omni-desk")));

const started = Date.now();
const model = await import(pathToFileURL(join(FIG, "model.ts")).href);
const geometry = await import(pathToFileURL(join(FIG, "geometry.ts")).href);
const markup = await import(pathToFileURL(join(FIG, "markup.ts")).href);
const view = await import(pathToFileURL(join(FIG, "view.ts")).href);
const A = await import(pathToFileURL(join(KIT, "audit.mjs")).href);
const built = Date.now() - started;

/* ------------------------------------------------------------ the page */

const strip = (file) =>
  stripTypeScriptTypes(readFileSync(join(FIG, file), "utf8"))
    .replace(/^import[\s\S]*?from\s+["'][^"']+["'];?\s*$/gm, "")
    .replace(/^export\s+(?=(const|function|let|class)\b)/gm, "")
    .replace(/^export\s*\{[^}]*\};?\s*$/gm, "");

const font = (file, weight) => `@font-face{font-family:"Thmanyah";src:url("${pathToFileURL(join(ROOT, "src", "fonts", file)).href}") format("woff2");font-weight:${weight};font-display:block}`;
const fonts = font("thmanyahsans-Regular.woff2", 400) + font("thmanyahsans-Medium.woff2", 500) + font("thmanyahsans-Bold.woff2", "600 700");
const kitCss = readFileSync(join(KIT, "iso.css"), "utf8");
const figCss = readFileSync(join(FIG, "..", "lazy", "frameless.css"), "utf8") + readFileSync(join(FIG, "omni-desk.css"), "utf8");
const pageCss = `*{box-sizing:border-box}html,body{margin:0}body{background:var(--page);color:#4b5468;font:15px/1.6 "Thmanyah",system-ui,sans-serif;font-feature-settings:"lnum" 1;-webkit-font-smoothing:antialiased}
body[data-page="light"]{--page:#f7f8fa;color-scheme:light}body[data-page="dark"]{--page:#080d1c;color-scheme:dark}
main{width:min(720px,100% - 32px);margin:56px auto 96px}`;

const parts = markup.partsOf(LOCALE);
const figure = markup.figureHtml(LOCALE, SITE ? "light" : THEME, { sync: SITE });
const live = `${strip("model.ts")}\n${strip("controller.ts")}\nconst DATA = ${JSON.stringify(parts.data)};\nmountDesk(document.querySelector(".od-stage"), DATA);\n`;
const page = `<!doctype html><html lang="${LOCALE}" dir="${parts.dir}"${SITE && THEME === "dark" ? ` data-theme="dark"` : ""}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>One desk</title><style>${fonts}${kitCss}${figCss}${pageCss}</style></head><body data-page="${THEME}"><main>${figure}</main><script type="module">${live.replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(OUT, { recursive: true });
const name = `omni-desk${SITE ? "-site" : ""}${LOCALE === "en" ? "-en" : ""}${THEME === "light" ? "-light" : ""}.html`;
writeFileSync(join(OUT, name), page);

const bytes = (text) => Buffer.byteLength(text, "utf8");
console.log(`wrote ${join(OUT, name)} · page ${(bytes(page) / 1024).toFixed(1)} KB · svg ${(bytes(markup.artOf(LOCALE, "x")) / 1024).toFixed(1)} KB · live ${(bytes(live) / 1024).toFixed(1)} KB · ${geometry.ITEMS.length} items · scale ${geometry.KS.toFixed(3)} · ${built} ms`);

/* ------------------------------------------------------------ the audit */

if (flag("--audit")) {
  const { R, ITEMS, MOVING, carriageSlot } = geometry;
  const { P } = view;
  A.auditOrExit(R, P, {});
  let problems = 0;
  const say = (line) => console.log(line);

  /** One temporary item per pose of a moving part, checked against every static item it overlaps. */
  const poseItem = (name, shapes, offset) => ({ name, key: 0, shapes: shapes.map((shape) => A.moved(shape, offset)) });
  function against(name, shapes, offsets, { own = () => false } = {}) {
    const fronts = new Set();
    const backs = new Set();
    for (const offset of offsets) {
      const item = poseItem(name, shapes, offset);
      const items = [item, ...ITEMS.filter((other) => !own(other.name, offset))];
      const { pairs, least } = A.overlapsOf(items, P, { skip: (a, b) => a !== item && b !== item });
      for (const pair of pairs) {
        const other = pair.a === 0 ? items[pair.b] : items[pair.a];
        const mine = pair.a === 0 ? 0 : 1;
        const meFront = pair.front[mine].area >= least;
        const themFront = pair.front[1 - mine].area >= least;
        if (meFront && themFront) {
          say(`moving: ${name} interlocks with ${other.name} at ${offset.map((v) => v.toFixed(1)).join(",")}`);
          problems++;
        } else if (meFront) backs.add(other.name);
        else if (themFront) fronts.add(other.name);
      }
    }
    return { fronts, backs };
  }

  const { TUBE_X, PRESS_X, CUP_TOP, HIDDEN_Z, STROKE } = model;
  const sweep = [];
  for (let x = TUBE_X[0]; x <= TUBE_X[TUBE_X.length - 1] + 0.01; x += 6.25) sweep.push(x);

  /* Carriage: drawn in one slot of the sorted art. Everything behind it must come before the slot, everything in front after. */
  {
    const { fronts, backs } = against("carriage", MOVING.carriage.shapes, sweep.map((x) => [x, 0, 0]));
    const slot = carriageSlot();
    const index = new Map(ITEMS.map((item, at) => [item.name, at]));
    for (const back of backs)
      if (index.get(back) >= slot) {
        say(`moving: carriage is in front of ${back} but ${back} is drawn after its slot`);
        problems++;
      }
    for (const front of fronts)
      if (index.get(front) < slot) {
        say(`moving: ${front} is in front of the carriage but drawn before its slot`);
        problems++;
      }
    say(`moving: carriage over ${sweep.length} poses · behind it ${[...backs].sort().join(", ") || "nothing"} · in front ${[...fronts].sort().join(", ") || "nothing"}`);
  }

  /*
   * Capsule: drawn after all the static art, under a mask of the opaque terminal parts.
   * Inside its own tube it is within the bore of every part it passes (those are
   * solid in the audit's model), so its own terminal is proved by construction:
   * the mask hides it under the opaque parts, the glass back is drawn before it
   * and the glass front after. Everything else in front of it must be masked.
   */
  {
    const masked = (name) => /^t\d\.(tube|collar|base|receiver|lip|lamp)/.test(name);
    const offsets = [];
    for (const x of TUBE_X) for (let z = CUP_TOP + 3; z <= HIDDEN_Z + 0.01; z += 3) offsets.push([x, 0, z - CUP_TOP]);
    for (const x of sweep) offsets.push([x, 0, 0]);
    const own = (other, offset) => offset[2] > 0 && other.startsWith(`t${TUBE_X.indexOf(offset[0])}.`);
    const { fronts } = against("capsule", MOVING.capsule.shapes, offsets, { own });
    for (const front of fronts)
      if (!masked(front)) {
        say(`moving: ${front} is in front of the capsule but not in its mask`);
        problems++;
      }
    say(`moving: capsule over ${offsets.length} poses · masked in front ${[...fronts].sort().join(", ") || "nothing"}`);
  }

  /* The plunger and knob only meet the press head and the capsule, all drawn late in a fixed order. */
  {
    const offsets = [0, 0.5, 1].map((share) => [PRESS_X, 0, -STROKE * share]);
    const plunger = against("plunger", MOVING.plunger.shapes, offsets);
    const knob = against("knob", MOVING.knob.shapes, offsets);
    const head = against("head", MOVING.head.shapes, [[0, 0, 0]]);
    const ahead = [...plunger.fronts, ...knob.fronts, ...head.fronts];
    for (const name of ahead) {
      say(`moving: ${name} is in front of the press, which is drawn after it`);
      problems++;
    }
    say(`moving: press over ${offsets.length} poses · drawn over ${[...new Set([...plunger.backs, ...knob.backs, ...head.backs])].sort().join(", ") || "nothing"}`);
  }

  say(problems ? `moving parts failed: ${problems} problem${problems === 1 ? "" : "s"}` : "moving parts passed");
  if (problems) process.exitCode = 1;
}
