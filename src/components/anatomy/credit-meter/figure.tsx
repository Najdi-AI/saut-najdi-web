/**
 * «عدّاد النقاط» / "The credit meter" (NAJ-897): an isometric figure made with
 * the anatomy skill. One tank holds the plan's monthly credit pool; a gauge
 * reads that one pool as call minutes or as text conversations; a two-way
 * valve sends it to either. Every number comes from content/pricing.ts.
 *
 * Usage: <CreditMeterFigure locale={locale} />. Server component, frameless
 * and lazy: no card, corners or legend; the server sends the stage with an
 * empty art slot, the two hit areas on the knob and the lever (the plan
 * selector and the valve) and the off-screen readout. The drawing is
 * public/figures/credit-meter.<hash>.svg (scripts/anatomy/export.mjs),
 * fetched near the viewport; controller.ts loads after it. Follows the site
 * theme through CSS (credit-meter.css). `fig` is kept for the mount point's
 * API; nothing prints it.
 */
import "@/components/iso/iso.css";
import "../lazy/frameless.css";
import "./credit-meter.css";
import { CreditMeterArt } from "./art";
import { COPY } from "./copy";
import type { Locale } from "./model";

export function CreditMeterFigure({ locale }: { locale: Locale; fig?: number }) {
  const copy = COPY[locale];
  return (
    <div className="iso cm anx" data-theme="light" dir={locale === "ar" ? "rtl" : "ltr"} lang={locale}>
      <figure className="iso-figure">
        <div className="iso-plate">
          <CreditMeterArt locale={locale} />
          <span className="anx-sr" data-readout="">
            {copy.readout}
          </span>
        </div>
      </figure>
    </div>
  );
}
