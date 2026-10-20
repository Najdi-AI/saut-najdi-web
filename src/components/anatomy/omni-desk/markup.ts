/**
 * The figure's words and controls as plain data and strings, shared by the
 * React figure and the standalone verification page, so both show exactly
 * the same frameless figure. Server-only: it pulls in the geometry.
 */
import { COPY } from "./copy";
import { svgOf } from "./geometry";
import { LANE_Y, STILL_CHANNEL, readoutOf, tubeOf, type Locale } from "./model";
import { EX, EZ, HEIGHT, WIDTH, at } from "./view";
import type { DeskData } from "./controller";

const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export interface Parts {
  dir: "rtl" | "ltr";
  /** The resting readout, kept off screen. */
  readout: string;
  /** The drawing's label (the art slot is role="img"). */
  art: string;
  /** The channel buttons' group label. */
  label: string;
  picks: { name: string; pressed: boolean }[];
  note: string;
  data: DeskData;
}

const cache = new Map<Locale, Parts>();

/** Everything the frameless figure carries outside its drawing, for one locale, in the still pose. */
export function partsOf(locale: Locale): Parts {
  const hit = cache.get(locale);
  if (hit) return hit;
  const copy = COPY[locale];
  const parts: Parts = {
    dir: locale === "ar" ? "rtl" : "ltr",
    readout: readoutOf(STILL_CHANNEL, "answered", copy.words),
    art: copy.label,
    label: copy.group,
    picks: copy.channels.map((name, channel) => ({ name, pressed: channel === STILL_CHANNEL })),
    note: copy.note,
    data: { locale, ex: EX, ez: EZ, laneX: Math.round(at([0, LANE_Y, 0])[0] * 100) / 100, width: WIDTH, words: copy.words },
  };
  cache.set(locale, parts);
  return parts;
}

/** The drawing in the still pose, aria-hidden (its slot carries the label): what public/figures/omni-desk.*.svg holds. */
export const artOf = (locale: Locale, uid: string) => svgOf(locale, null, { lamp: tubeOf(STILL_CHANNEL, locale), uid });

/** The same frameless figure as one string, for the standalone page, with the drawing inline where the site fetches it lazily. */
export function figureHtml(locale: Locale, theme: "light" | "dark", { sync = false }: { sync?: boolean } = {}) {
  const parts = partsOf(locale);
  const picks = parts.picks
    .map((pick, channel) => `<button type="button" class="od-pick" data-od-pick="${channel}" aria-pressed="${pick.pressed ? "true" : "false"}">${escape(pick.name)}</button>`)
    .join("");
  return (
    `<div class="iso od anx" dir="${parts.dir}" lang="${locale}" data-theme="${theme}"${sync ? ` data-od-sync=""` : ""}>` +
    `<figure class="iso-figure od-figure">` +
    `<div class="iso-plate"><div class="od-stage"><div class="anx-art od-art" role="img" aria-label="${escape(parts.art)}" style="aspect-ratio:${WIDTH} / ${HEIGHT}" data-art="ready">${artOf(locale, `${locale}-page`)}</div></div>` +
    `<span class="anx-sr" data-readout="">${escape(parts.readout)}</span></div>` +
    `<div class="od-picks" role="group" aria-label="${escape(parts.label)}">${picks}</div>` +
    `<p class="od-note">${escape(parts.note)}</p>` +
    `<span class="od-sr" role="status" aria-live="polite" data-od-status=""></span>` +
    `</figure></div>`
  );
}

export { WIDTH, HEIGHT };
