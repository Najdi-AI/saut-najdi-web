/**
 * Server component: the finished drawing for one locale (computed once per
 * server process from geometry.ts), the two hit areas over the knob and the
 * valve lever, and the live wrapper that moves it.
 */
import { COPY } from "./copy";
import { CreditMeterLive } from "./live";
import type { Locale } from "./model";
import { HITS, METER, START, hitStyle, liveData, sceneSvg } from "./scene";

const SVG: Record<Locale, string> = { ar: sceneSvg("ar"), en: sceneSvg("en") };

export function CreditMeterArt({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  const data = liveData(locale);
  return (
    <CreditMeterLive data={data} label={copy.group}>
      <div key="box" className="cm-box">
        <svg
          className="iso-svg"
          viewBox={`0 0 ${METER.width} ${METER.height}`}
          role="img"
          aria-label={copy.label}
          focusable="false"
          dangerouslySetInnerHTML={{ __html: SVG[locale] }}
        />
        <button type="button" className="cm-hit" data-control="plan" style={hitStyle(HITS.plan)} aria-label={data.planButton[START.plan]} />
        <button type="button" className="cm-hit" data-control="valve" style={hitStyle(HITS.valve)} aria-label={data.valveButton[START.outlet]} />
      </div>
      <span key="status" className="cm-sr" role="status" aria-live="polite" data-status="" />
    </CreditMeterLive>
  );
}
