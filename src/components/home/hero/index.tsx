import type { CSSProperties } from "react";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { heroCopy } from "./copy";
import { DialectChip, HandoffChip, PlayChip } from "./HeroChips";
import s from "./Hero.module.css";

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
          <PlayChip locale={locale} />
          <HandoffChip locale={locale} />
        </div>
        <p className={`${s.lead} ${s.rise}`} data-reveal="" style={{ "--d": "440ms" } as CSSProperties}>
          {t.lead}
        </p>
      </div>
    </section>
  );
}
