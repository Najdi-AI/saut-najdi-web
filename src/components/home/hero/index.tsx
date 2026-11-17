import type { CSSProperties } from "react";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { withDigits } from "../ui/Words";
import { CLIP_TURNS, heroCopy, scriptCopy } from "./copy";
import { DialectChip, HandoffChip, PlayChip } from "./HeroChips";
import s from "./Hero.module.css";

/**
 * The play chip's transcript (WCAG 1.2.1): the clip's three turns word for
 * word, with an English rendering on the English page. A native popover
 * opened by a button in the chip, so it works without JavaScript, never
 * moves the hero, and closes with Escape, a click outside or its own close
 * button. Server markup, so none of it ships in the page's JavaScript.
 */
function Transcript({ locale }: { locale: Locale }) {
  const t = heroCopy[locale];
  const sc = scriptCopy[locale];
  return (
    <>
      <button type="button" className={s.scriptOpen} popoverTarget="hero-script">
        {sc.open}
      </button>
      <div id="hero-script" popover="auto" role="dialog" aria-labelledby="hero-script-title" className={s.script}>
        <div className={s.scriptTop}>
          <b id="hero-script-title">{sc.title}</b>
          <button type="button" className={s.scriptClose} popoverTarget="hero-script" popoverTargetAction="hide">
            {sc.close}
          </button>
        </div>
        <ol>
          {CLIP_TURNS.map((turn, i) => (
            <li key={turn.text}>
              <b>{t.who[turn.who]}</b>
              <span lang="ar" dir="rtl">
                {withDigits(turn.text)}
              </span>
              {sc.lines && <span className={s.render}>{withDigits(sc.lines[i])}</span>}
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

/**
 * The home hero (Try 1, mockups/index.html and en-hero.html): the sentence
 * on Charcoal with three product chips set on it. A .on-dark band marked
 * data-hero="dark", which turns the global header Charcoal while the hero
 * is under it; Home renders it first in main so that hook holds.
 *
 * The H1 is two display lines that rise one after the other (CSS only); its
 * accessible name is the whole sentence. The lines, lead and chips carry
 * data-reveal, so without JavaScript NoScriptReveal shows them at rest, and
 * reduced motion shows them still.
 */
export function Hero({ locale }: { locale: Locale }) {
  const t = heroCopy[locale];
  return (
    <section
      data-hero="dark"
      aria-labelledby="hero-title"
      className={cn("on-dark", s.hero, locale === "en" && s.en)}
    >
      <div className={s.stage}>
        <DialectChip locale={locale} />
        <h1 id="hero-title" className={s.h1} aria-label={t.h1.join(" ")}>
          {t.h1.map((line, i) => (
            <span key={line} className={s.line}>
              <span data-reveal="" style={{ "--i": i } as CSSProperties}>
                {line}
              </span>{" "}
            </span>
          ))}
        </h1>
        <div className={s.pair}>
          <PlayChip locale={locale}>
            <Transcript locale={locale} />
          </PlayChip>
          <HandoffChip locale={locale} />
        </div>
        <p className={`${s.lead} ${s.rise}`} data-reveal="" style={{ "--d": "440ms" } as CSSProperties}>
          {t.lead}
        </p>
      </div>
    </section>
  );
}
