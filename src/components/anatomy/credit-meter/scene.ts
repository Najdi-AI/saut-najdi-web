/**
 * The finished credit-meter drawing for one locale, as SVG markup, and the
 * plain data the client controller needs. Shared by the server art (art.tsx)
 * and the verification build, so both draw exactly the same figure.
 */
import { faceTextSvg } from "../../iso/iso-kit";
import { compactSvg } from "./compact";
import type { MeterLive } from "./controller";
import { COPY } from "./copy";
import { BACK, HITS, ITEMS, LABEL_SPOT, METER } from "./geometry";
import { READINGS, readoutOf, spokenOf, type Locale } from "./model";

export const START = { plan: 1, outlet: "calls" as const };

export function sceneSvg(locale: Locale) {
  const label = faceTextSvg(`translate(${LABEL_SPOT.x} ${LABEL_SPOT.y})`, COPY[locale].engraved, { size: LABEL_SPOT.size, tone: "lo", anchor: "middle" }).replace(
    'class="iso-face-text"',
    'class="iso-face-text cm-engraved"',
  );
  const svg = compactSvg(BACK + ITEMS.join("").replace('<g data-part="label"></g>', label));
  /* Single-quoted attributes: the React server payload carries this string as JSON, which escapes every double quote. */
  return svg.replace(/="([^"]*)"/g, "='$1'");
}

export function liveData(locale: Locale): MeterLive {
  const copy = COPY[locale];
  return {
    projection: METER.projection,
    lever: METER.lever,
    leverAngle: METER.leverAngle,
    detents: METER.detents,
    sweep: METER.sweep,
    shares: METER.shares,
    counters: METER.counters,
    column: METER.column,
    drum: METER.drum,
    rtl: locale === "ar",
    readouts: READINGS.map((reading) => ({ calls: readoutOf(reading, "calls", locale), text: readoutOf(reading, "text", locale) })),
    spoken: READINGS.map((reading) => ({ calls: spokenOf(reading, "calls", locale), text: spokenOf(reading, "text", locale) })),
    planButton: READINGS.map((reading) => copy.planButton(reading.name[locale])),
    valveButton: { calls: copy.valveButton(copy.calls), text: copy.valveButton(copy.text) },
    start: START,
  };
}

export { HITS, METER };

/** Where a hit area sits, as CSS for the stage box (physical left/top, so RTL does not mirror it). */
export const hitStyle = (hit: { x: number; y: number; r: number }) => ({
  left: `${(hit.x * 100).toFixed(2)}%`,
  top: `${(hit.y * 100).toFixed(2)}%`,
  width: `${(hit.r * 200).toFixed(2)}%`,
});
