import type { Locale } from "./model";
import { FIGURE_ART } from "../lazy/assets";
import { HEIGHT, WIDTH, partsOf } from "./markup";
import { OmniDeskLive } from "./live";
import "../../iso/iso.css";
import "../lazy/frameless.css";
import "./omni-desk.css";

/**
 * «مكتب واحد» / "One desk": every channel the site lists comes down its own
 * pneumatic tube to one desk, one stamp answers it, and it goes back up the
 * tube it came from.
 *
 * Frameless and lazy (NAJ-897): no card, corners or legend. The server sends
 * the stage with an empty art slot (the drawing's aspect ratio and label),
 * the off-screen readout, the channel buttons (the figure's control) and one
 * honest line (the motion is not the response time). The drawing is
 * public/figures/omni-desk.<hash>.svg (scripts/anatomy/export.mjs), fetched
 * near the viewport; the controller loads after it. Mount it anywhere inside
 * the site's layout:
 *
 *   <OmniDeskFigure locale={locale} />
 *
 * It follows the site theme by itself (it reads <html data-theme>). `fig` is
 * kept for the mount points' API; nothing prints it.
 */
export function OmniDeskFigure({ locale, className }: { locale: Locale; fig?: number; className?: string }) {
  const parts = partsOf(locale);
  return (
    <div className={className ? `iso od anx ${className}` : "iso od anx"} dir={parts.dir} lang={locale} data-theme="light" data-od-sync="">
      <figure className="iso-figure od-figure">
        <div className="iso-plate">
          <OmniDeskLive data={parts.data} src={FIGURE_ART["omni-desk"][locale]} label={parts.art} width={WIDTH} height={HEIGHT} />
          <span className="anx-sr" data-readout="">
            {parts.readout}
          </span>
        </div>
        <div className="od-picks" role="group" aria-label={parts.label}>
          {parts.picks.map((pick, channel) => (
            <button key={channel} type="button" className="od-pick" data-od-pick={channel} aria-pressed={pick.pressed ? "true" : "false"}>
              {pick.name}
            </button>
          ))}
        </div>
        <p className="od-note">{parts.note}</p>
        <span className="od-sr" role="status" aria-live="polite" data-od-status="" />
      </figure>
    </div>
  );
}
