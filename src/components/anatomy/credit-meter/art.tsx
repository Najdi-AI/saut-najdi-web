/**
 * Server component: the live wrapper with the lazy drawing's URL for one
 * locale, the two hit areas' places over the knob and the valve lever, and
 * the plain data the controller needs. The drawing itself is never in the
 * page: public/figures/credit-meter.<hash>.svg (scripts/anatomy/export.mjs).
 */
import { FIGURE_ART } from "../lazy/assets";
import { COPY } from "./copy";
import { CreditMeterLive } from "./live";
import type { Locale } from "./model";
import { HITS, METER, START, hitStyle, liveData } from "./scene";

export function CreditMeterArt({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  const data = liveData(locale);
  return (
    <CreditMeterLive
      data={data}
      label={copy.group}
      art={copy.label}
      src={FIGURE_ART["credit-meter"][locale]}
      width={METER.width}
      height={METER.height}
      hits={{ plan: hitStyle(HITS.plan), valve: hitStyle(HITS.valve) }}
      buttons={{ plan: data.planButton[START.plan]!, valve: data.valveButton[START.outlet] }}
    />
  );
}
