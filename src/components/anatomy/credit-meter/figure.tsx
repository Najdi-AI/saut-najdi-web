/**
 * «عدّاد النقاط» / "The credit meter" (NAJ-897): an isometric figure made with
 * the anatomy skill. One tank holds the plan's monthly credit pool; a gauge
 * reads that one pool as call minutes or as text conversations; a two-way
 * valve sends it to either. Every number comes from content/pricing.ts.
 *
 * Usage: <CreditMeterFigure locale={locale} fig={4} />. Server component; the
 * only client code is live.tsx + controller.ts + lever.ts (and the kit's
 * extrude). Follows the site theme through CSS (credit-meter.css).
 */
import "@/components/iso/iso.css";
import "./credit-meter.css";
import { Plate } from "@/components/iso/react/draw";
import { CreditMeterArt } from "./art";
import { COPY } from "./copy";
import type { Locale } from "./model";

export function CreditMeterFigure({ locale, fig = 4 }: { locale: Locale; fig?: number }) {
  const copy = COPY[locale];
  return (
    <div className="iso cm" data-theme="light" dir={locale === "ar" ? "rtl" : "ltr"} lang={locale}>
      <Plate fig={copy.fig(fig)} title={copy.title} hint={copy.hint} readout={copy.readout} keys={copy.keys} caption={copy.caption}>
        <CreditMeterArt locale={locale} />
      </Plate>
    </div>
  );
}
