import type { Locale } from "./model";
import { partsOf } from "./markup";
import { OmniDeskLive } from "./live";
import "../../iso/iso.css";
import "./omni-desk.css";

/**
 * «مكتب واحد» / "One desk": every channel the site lists comes down its own
 * pneumatic tube to one desk, one stamp answers it, and it goes back up the
 * tube it came from.
 *
 * Server component. The drawing is built once on the server (geometry.ts) and
 * sent as markup; only live.tsx and controller.ts ship to the browser. Mount
 * it anywhere inside the site's layout:
 *
 *   <OmniDeskFigure locale={locale} fig={5} />
 *
 * It follows the site theme by itself (it reads <html data-theme>).
 */
export function OmniDeskFigure({ locale, fig = 5, className }: { locale: Locale; fig?: number; className?: string }) {
  const parts = partsOf(locale, fig);
  return (
    <div className={className ? `iso od ${className}` : "iso od"} dir={parts.dir} lang={locale} data-theme="light" data-od-sync="">
      <figure className="iso-figure od-figure">
        <div className="iso-plate">
          <div className="iso-plate-corners" aria-hidden="true" dangerouslySetInnerHTML={{ __html: parts.corners }} />
          <OmniDeskLive data={parts.data}>
            <div className="od-art" dangerouslySetInnerHTML={{ __html: parts.svg }} />
          </OmniDeskLive>
        </div>
        <div className="od-picks" role="group" aria-label={parts.label} dangerouslySetInnerHTML={{ __html: parts.picks }} />
        <span className="od-sr" role="status" aria-live="polite" data-od-status="" />
        <figcaption className="iso-legend" dangerouslySetInnerHTML={{ __html: parts.legend }} />
      </figure>
    </div>
  );
}
