import { HEIGHT, WIDTH } from "./view";
import { bodyFor } from "./geometry";
import { FIRST_LINE, WORDS, type Locale } from "./model";

const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

type Mark = "lit" | "raised" | "edge" | "flat";

function swatch(mark: Mark) {
  if (mark === "raised" || mark === "flat" || mark === "lit") {
    const body = mark === "flat" ? "M2 6.5 8 3.5 14 6.5 8 9.5Z" : "M2 4.5 8 1.5 14 4.5 14 6 8 9 2 6Z";
    const crease = mark === "flat" ? "" : `<path class="iso-swatch-crease" d="M2 4.5 8 7.5 14 4.5"/>`;
    return `<svg class="iso-swatch" data-mark="${mark}" viewBox="0 0 16 10" aria-hidden="true" focusable="false"><path d="${body}"/>${crease}</svg>`;
  }
  return `<svg class="iso-swatch" data-mark="${mark}" viewBox="0 0 16 10" aria-hidden="true" focusable="false"><path d="M1.5 5h13"/></svg>`;
}

/**
 * The whole card as server-rendered HTML: corners, the drawing, the legend
 * and caption. The same string is used by the site and by the standalone
 * verification page, so what the checks see is what the site ships.
 */
export function figureHtml(locale: Locale, fig: number) {
  const w = WORDS[locale];
  const corner = (name: string, text: string, extra = "") => `<span class="iso-plate-corner" data-corner="${name}"${extra}>${escape(text)}</span>`;
  const keys: [Mark, string][] = [
    ["lit", w.keys.lit],
    ["raised", w.keys.raised],
    ["edge", w.keys.edge],
    ["flat", w.keys.flat],
  ];
  const svg = `<svg class="iso-svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="${escape(w.label)}" focusable="false">${bodyFor(locale)}</svg>`;
  return (
    `<figure class="iso-figure vlt-figure"><div class="iso-plate">` +
    `<div class="iso-plate-corners" aria-hidden="true">${corner("fig", w.fig(fig))}${corner("title", w.title)}${corner("hint", w.hint)}${corner("readout", w.rest(FIRST_LINE), " data-readout")}</div>` +
    `<div class="iso-stage vlt-stage" tabindex="0" role="group" aria-label="${escape(w.stage)}">${svg}<span class="vlt-sr" role="status" aria-live="polite" data-status></span></div>` +
    `</div><figcaption class="iso-legend"><span class="iso-keys">${keys.map(([mark, label]) => `<span class="iso-key">${swatch(mark)}${escape(label)}</span>`).join("")}</span><span class="iso-caption">${escape(w.caption)}</span></figcaption></figure>`
  );
}
