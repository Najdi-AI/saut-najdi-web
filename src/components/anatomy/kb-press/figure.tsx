import "../../iso/iso.css";
import "./kb-press.css";
import { useId } from "react";
import { Plate } from "../../iso/react/draw";
import { BODY, CLIP_ID, LIVE, VIEW } from "./geometry";
import { KbPressLive } from "./live";
import { QUESTIONS, WORDS, type Locale } from "./model";

/**
 * «مكبس المعرفة» / The knowledge press — the anatomy figure for the
 * knowledge base capability. A server component: the whole drawing is
 * computed at build time and sent as markup; only live.tsx, motion.ts and
 * model.ts (about 5 KB gzipped) run in the browser.
 *
 * Mount it anywhere inside the site layout (it reads the site theme from
 * <html data-theme>, and sets its own dir and lang):
 *
 *   <KbPressFigure locale={locale} fig={3} />
 */
export function KbPressFigure({ locale, fig = 3 }: { locale: Locale; fig?: number | string }) {
  const W = WORDS[locale];
  /* One clip id per instance, so two figures on a page never share it. */
  const clip = `${CLIP_ID}-${useId().replace(/[^A-Za-z0-9_-]/g, "")}`;
  const body = BODY.replace(`id="${CLIP_ID}"`, `id="${clip}"`).replace(`url(#${CLIP_ID})`, `url(#${clip})`);
  return (
    <div className="iso kbp-theme">
      <div className="iso kbp" data-theme="light" dir={locale === "ar" ? "rtl" : "ltr"} lang={locale}>
        <Plate
          fig={`${W.fig} ${fig}`}
          title={W.title}
          hint={W.hint}
          readout={W.ready}
          keys={[
            { mark: "lit", label: W.keys.lit },
            { mark: "raised", label: W.keys.drawers },
            { mark: "flat", label: W.keys.files },
          ]}
          caption={
            <>
              <span className="kbp-asks" role="group" aria-label={W.asks}>
                <span className="kbp-asks-label" aria-hidden="true">
                  {W.asks}:
                </span>
                {QUESTIONS.map((_, index) => (
                  <button key={index} type="button" className="kbp-ask" data-kb-ask={index} aria-pressed="false">
                    {W.questions[index]}
                  </button>
                ))}
              </span>
              <span className="kbp-caption">{W.caption}</span>
              <span className="kbp-sr" role="status" aria-live="polite" data-kb-status="" />
            </>
          }
        >
          <KbPressLive data={LIVE} locale={locale} label={W.stage}>
            <svg className="iso-svg" viewBox={`0 0 ${VIEW.width} ${VIEW.height}`} role="img" aria-label={W.svg} focusable="false" dangerouslySetInnerHTML={{ __html: body }} />
          </KbPressLive>
        </Plate>
      </div>
    </div>
  );
}
