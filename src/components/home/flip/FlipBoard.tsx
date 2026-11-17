"use client";

import { Fragment, useEffect, useId, useState, type ReactNode } from "react";
import { dirOf, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useInView } from "../ui/useInView";
import { useReducedMotion } from "../ui/useReducedMotion";
import s from "./Flip.module.css";

export type FlipCopy = {
  /** The heading as screen readers hear it. */
  title: string;
  /** The visible sentence before the plate, one entry per forced line. */
  before: string[];
  after: string;
  words: string[];
  pick: string;
  all: string;
  picks: string[];
};

const ALL = "all";

/**
 * The sentence and its picker, one island because both follow the word on
 * the plate. The word turns about every 2.2s while the section is on
 * screen and the tab is visible; choosing a business stops it there and
 * «الكل» / "All" starts it again (WCAG 2.2.2). Under reduced motion it
 * never turns by itself. The visible sentence is aria-hidden: the heading's
 * name is the sr-only sentence. The call to action comes from the server
 * as children.
 */
export function FlipBoard({ locale, t, children }: { locale: Locale; t: FlipCopy; children: ReactNode }) {
  const labelId = useId();
  const reduced = useReducedMotion();
  const [ref, inView] = useInView<HTMLSpanElement>({ once: false });
  const [choice, setChoice] = useState(ALL);
  const [word, setWord] = useState({ on: 0, out: -1 });
  const [hidden, setHidden] = useState(false);

  const show = (k: number) => setWord((w) => (w.on === k ? w : { on: k, out: w.on }));

  useEffect(() => {
    const seen = () => setHidden(document.hidden);
    seen();
    document.addEventListener("visibilitychange", seen);
    return () => document.removeEventListener("visibilitychange", seen);
  }, []);

  useEffect(() => {
    if (choice !== ALL || reduced || !inView || hidden) return;
    const id = setInterval(
      () => setWord((w) => ({ on: (w.on + 1) % t.words.length, out: w.on })),
      2200,
    );
    return () => clearInterval(id);
  }, [choice, reduced, inView, hidden, t.words.length]);

  return (
    <div className={cn(s.in, locale === "en" && s.en)}>
      <h2 id="book-title" className={s.h}>
        <span className="sr-only">{t.title}</span>
        {/* A space, so the heading's text reads as two sentences (copy, find, reader views); the
            visible line is a block, so it draws nothing. */}{" "}
        <span className={s.line} aria-hidden>
          {t.before.map((line, i) => (
            <Fragment key={line}>
              {i > 0 && [" ", <br key="br" />]}
              {line}
            </Fragment>
          ))}{" "}
          <span ref={ref} className={s.plate}>
            {/* Spaces between the words keep the heading's text readable; a grid drops them. */}
            {t.words.map((w, i) => (
              <Fragment key={w}>
                {i > 0 && " "}
                <span className={s.w} data-on={i === word.on || undefined} data-out={i === word.out || undefined}>
                  {w}
                </span>
              </Fragment>
            ))}
          </span>
          {t.after}
        </span>
      </h2>
      <div className={s.side}>
        <ToggleGroup
          dir={dirOf(locale)}
          aria-labelledby={labelId}
          value={[choice]}
          onValueChange={(v) => {
            // A single-choice group: pressing the pressed item would empty it.
            const next = v[0];
            if (!next) return;
            setChoice(next);
            if (next !== ALL) show(Number(next));
          }}
        >
          <span id={labelId} className="me-2 text-[0.9375rem] font-bold">
            {t.pick}
          </span>
          <ToggleGroupItem value={ALL}>{t.all}</ToggleGroupItem>
          {t.picks.map((p, i) => (
            <ToggleGroupItem key={p} value={String(i)}>
              {p}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        {children}
      </div>
    </div>
  );
}
