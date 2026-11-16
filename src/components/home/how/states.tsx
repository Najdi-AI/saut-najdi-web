import type { CSSProperties } from "react";
import { Num } from "../ui/Num";
import type { HowCopy } from "./copy";
import s from "./How.module.css";

/*
 * The three states of the how-it-works fragment (Try 1 states.html), as
 * server markup. Each is a light product card; the pinned layout lays them
 * over one another and shows the one its statement sets, the stacked
 * layout shows each under its statement. Illustrations only: the buttons
 * in the handoff ticket are drawn, not operable.
 */

/** Deterministic bar heights (Try 1 site.js, 22 bars up to 28px), so server and client draw the same wave. */
const BARS = [0.35, 0.6, 0.85, 0.5, 0.95, 0.7, 0.4, 0.8, 1, 0.55, 0.75, 0.45, 0.9, 0.65, 0.3, 0.7, 0.95, 0.6, 0.4, 0.85, 0.5, 0.75].map(
  (h) => Math.max(4, Math.round(28 * h)),
);

const CHECK = (
  <svg viewBox="0 0 20 20" aria-hidden>
    <circle cx="10" cy="10" r="9" fill="#2EC4E6" />
    <path d="M6 10.3l2.6 2.6L14.2 7" fill="none" stroke="#0D1326" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Latin digits in an LTR island (house rule) inside a line of either script. */
const digits = (text: string) =>
  text.split(/(\d[\d:.,]*\d|\d)/).map((part, i) => (i % 2 ? <Num key={i}>{part}</Num> : part));

export function RingState({ t }: { t: HowCopy["ring"] }) {
  return (
    <>
      <div className={s.top}>
        <span className={s.cardTitle}>{t.title}</span>
        <span className={s.tag} data-tone="blue">
          <i />
          {t.tag}
        </span>
      </div>
      <div className={s.ring}>
        <span className={s.avatar} aria-hidden>
          {t.avatar}
        </span>
        <span className={s.ringName}>{t.caller}</span>
        <span className={s.muted}>
          <Num>{t.time}</Num> {t.meridiem} · {t.line}
        </span>
      </div>
      <div className={s.status}>
        <span className={s.live}>{t.answered}</span>
        <span className={s.wave} aria-hidden>
          {BARS.map((h, i) => (
            <span key={i} style={{ height: h, "--k": i } as CSSProperties} />
          ))}
        </span>
        <Num>{t.elapsed}</Num>
      </div>
      <div className={s.top}>
        <span className={s.tag} data-tone="cyan">
          {t.dialect}
        </span>
        <span className={s.note}>{t.voice}</span>
      </div>
    </>
  );
}

export function BookState({ t }: { t: HowCopy["book"] }) {
  return (
    <>
      <div className={s.top}>
        <span className={s.cardTitle}>{t.title}</span>
        <Num className={s.note}>{t.elapsed}</Num>
      </div>
      <div className={s.thread}>
        <p className={s.bubble} data-who="caller">
          {t.caller1}
        </p>
        <p className={s.bubble} data-who="agent">
          <small>{t.agent}</small>
          {digits(t.reply)}
        </p>
        <p className={s.bubble} data-who="caller">
          {t.caller2}
        </p>
        <div className={s.booked}>
          <span className={s.bookedTitle}>
            {CHECK}
            {t.done}
          </span>
          <ul>
            {t.items.map((item) => (
              <li key={item}>
                <span>{digits(item)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export function HandoffState({ t }: { t: HowCopy["handoff"] }) {
  return (
    <>
      <div className={s.top}>
        <span className={s.cardTitle}>{t.title}</span>
        <span className={s.tag} data-tone="purple">
          <i />
          {t.tag}
        </span>
      </div>
      <div className={s.ticket}>
        <div className={s.to}>
          <span className={s.avatar} data-tone="purple" aria-hidden>
            {t.avatar}
          </span>
          <div>
            <b>{t.name}</b>
            <span>{t.role}</span>
          </div>
        </div>
        <dl>
          {t.rows.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{digits(v)}</dd>
            </div>
          ))}
        </dl>
        <div className={s.btns} aria-hidden>
          <span data-solid="">{t.take}</span>
          <span>{t.listen}</span>
        </div>
      </div>
    </>
  );
}
