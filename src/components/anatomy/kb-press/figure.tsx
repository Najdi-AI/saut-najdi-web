import "../../iso/iso.css";
import "../lazy/frameless.css";
import "./kb-press.css";
import { FIGURE_ART } from "../lazy/assets";
import { LIVE, VIEW } from "./geometry";
import { KbPressLive } from "./live";
import { QUESTIONS, WORDS, type Locale } from "./model";

/**
 * «مكبس المعرفة» / The knowledge press — the anatomy figure for the
 * knowledge base capability.
 *
 * Frameless and lazy (NAJ-897): no card, corners or legend. The server sends
 * the stage with an empty art slot (the drawing's aspect ratio and its
 * label), the off-screen readout, and the question chips, whose label also
 * carries the one honest line the figure needs (illustrative, text chat
 * only: the VOICE_KB_RETRIEVAL gate). The drawing is
 * public/figures/kb-press.<hash>.svg (scripts/anatomy/export.mjs), fetched
 * near the viewport; motion.ts loads after it.
 *
 *   <KbPressFigure locale={locale} />
 *
 * It reads the site theme from <html data-theme> and sets its own dir and
 * lang. `fig` is kept for the mount points' API; nothing prints it.
 */
export function KbPressFigure({ locale }: { locale: Locale; fig?: number | string }) {
  const W = WORDS[locale];
  return (
    <div className="iso kbp-theme">
      <div className="iso kbp anx" data-theme="light" dir={locale === "ar" ? "rtl" : "ltr"} lang={locale}>
        <figure className="iso-figure">
          <div className="iso-plate">
            <KbPressLive data={LIVE} locale={locale} label={W.stage} art={W.svg} src={FIGURE_ART["kb-press"][locale]} width={VIEW.width} height={VIEW.height} />
            <span className="anx-sr" data-readout="">
              {W.ready}
            </span>
          </div>
          <div className="kbp-asks" role="group" aria-label={W.asks}>
            <span className="kbp-asks-label" aria-hidden="true">
              {W.asks}
            </span>
            {QUESTIONS.map((_, index) => (
              <button key={index} type="button" className="kbp-ask" data-kb-ask={index} aria-pressed="false">
                {W.questions[index]}
              </button>
            ))}
          </div>
          <span className="kbp-sr" role="status" aria-live="polite" data-kb-status="" />
        </figure>
      </div>
    </div>
  );
}
