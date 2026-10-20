/**
 * The figure's markup as strings, shared by the React figure (server-rendered)
 * and the standalone verification page, so both show exactly the same card.
 * Server-only: it pulls in the geometry.
 */
import { COPY } from "./copy";
import { svgOf } from "./geometry";
import { LANE_Y, STILL_CHANNEL, readoutOf, tubeOf, type Locale } from "./model";
import { EX, EZ, HEIGHT, WIDTH, at } from "./view";
import type { DeskData } from "./controller";

const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const SWATCH: Record<string, string> = {
  lit: `<svg class="iso-swatch" data-mark="lit" viewBox="0 0 16 10" aria-hidden="true"><path d="M2 4.5 8 1.5 14 4.5 14 6 8 9 2 6Z"/><path class="iso-swatch-crease" d="M2 4.5 8 7.5 14 4.5"/></svg>`,
  raised: `<svg class="iso-swatch" data-mark="raised" viewBox="0 0 16 10" aria-hidden="true"><path d="M2 4.5 8 1.5 14 4.5 14 6 8 9 2 6Z"/><path class="iso-swatch-crease" d="M2 4.5 8 7.5 14 4.5"/></svg>`,
  edge: `<svg class="iso-swatch" data-mark="edge" viewBox="0 0 16 10" aria-hidden="true"><path d="M1.5 5h13"/></svg>`,
};

export interface Parts {
  dir: "rtl" | "ltr";
  corners: string;
  svg: string;
  picks: string;
  legend: string;
  label: string;
  data: DeskData;
}

const cache = new Map<string, Parts>();

/** Every piece of the card for one locale, rendered in the still pose. */
export function partsOf(locale: Locale, fig = 5): Parts {
  const id = `${locale}|${fig}`;
  const hit = cache.get(id);
  if (hit) return hit;
  const copy = COPY[locale];
  const readout = readoutOf(STILL_CHANNEL, "answered", copy.words);
  const corner = (name: string, text: string, extra = "") => `<span class="iso-plate-corner" data-corner="${name}"${extra}>${escape(text)}</span>`;
  const corners = corner("fig", `${copy.fig} ${fig}`) + corner("title", copy.title) + corner("hint", copy.hint) + corner("readout", readout, ` data-readout=""`);
  const svg = svgOf(locale, copy.label, { lamp: tubeOf(STILL_CHANNEL, locale), uid: `${locale}-${fig}` });
  const picks =
    copy.channels
      .map((name, channel) => `<button type="button" class="od-pick" data-od-pick="${channel}" aria-pressed="${channel === STILL_CHANNEL ? "true" : "false"}">${escape(name)}</button>`)
      .join("");
  const legend =
    `<span class="iso-keys">${copy.keys.map((key) => `<span class="iso-key">${SWATCH[key.mark]}${escape(key.label)}</span>`).join("")}</span>` +
    `<span class="iso-caption">${escape(copy.caption)}</span>`;
  const parts: Parts = {
    dir: locale === "ar" ? "rtl" : "ltr",
    corners,
    svg,
    picks,
    legend,
    label: copy.group,
    data: { locale, ex: EX, ez: EZ, laneX: Math.round(at([0, LANE_Y, 0])[0] * 100) / 100, width: WIDTH, words: copy.words },
  };
  cache.set(id, parts);
  return parts;
}

/** The same card as one string, for the standalone page. */
export function figureHtml(locale: Locale, theme: "light" | "dark", { fig = 5, sync = false }: { fig?: number; sync?: boolean } = {}) {
  const parts = partsOf(locale, fig);
  return (
    `<div class="iso od" dir="${parts.dir}" lang="${locale}" data-theme="${theme}"${sync ? ` data-od-sync=""` : ""}>` +
    `<figure class="iso-figure od-figure">` +
    `<div class="iso-plate"><div class="iso-plate-corners" aria-hidden="true">${parts.corners}</div>` +
    `<div class="od-stage"><div class="od-art">${parts.svg}</div></div></div>` +
    `<div class="od-picks" role="group" aria-label="${escape(parts.label)}">${parts.picks}</div>` +
    `<span class="od-sr" role="status" aria-live="polite" data-od-status=""></span>` +
    `<figcaption class="iso-legend">${parts.legend}</figcaption>` +
    `</figure></div>`
  );
}

export { WIDTH, HEIGHT };
