import { HEIGHT, WIDTH } from "./view";
import { bodyFor, type Item } from "./geometry";
import { FIRST_LINE, WORDS, type Locale } from "./model";

const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** The words the frameless figure carries outside its drawing: the stage's label, the drawing's label and the resting readout. */
export function shellWords(locale: Locale) {
  const w = WORDS[locale];
  return { stage: w.stage, label: w.label, rest: w.rest(FIRST_LINE) };
}

/**
 * The frameless figure as one string, for the standalone verification page:
 * the same structure VaultLive renders on the site (no corners, no legend;
 * the readout and the status off screen), with the drawing inline where the
 * site fetches it lazily (public/figures, scripts/anatomy/export.mjs). `uid`
 * keeps the drawing's clipPath ids unique on the page; `list` lets the
 * verification build draw the items it has just settled.
 */
export function figureHtml(locale: Locale, { uid = "", list }: { uid?: string; list?: Item[] } = {}) {
  const words = shellWords(locale);
  const svg = `<svg class="iso-svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" aria-hidden="true" focusable="false">${bodyFor(locale, list, uid)}</svg>`;
  return (
    `<figure class="iso-figure vlt-figure"><div class="iso-plate">` +
    `<div class="iso-stage vlt-stage" tabindex="0" role="group" aria-label="${escape(words.stage)}">` +
    `<div class="anx-art" role="img" aria-label="${escape(words.label)}" style="aspect-ratio:${WIDTH} / ${HEIGHT}" data-art="ready">${svg}</div>` +
    `<span class="vlt-sr" role="status" aria-live="polite" data-status></span></div>` +
    `<span class="anx-sr" data-readout>${escape(words.rest)}</span>` +
    `</div></figure>`
  );
}

export { WIDTH, HEIGHT };
