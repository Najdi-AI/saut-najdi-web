import type { CSSProperties, ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Num } from "../ui/Num";
import { SectionHead } from "../ui/SectionHead";
import { dayCopy, type DayCopy } from "./copy";
import { DayTrack } from "./DayTrack";
import s from "./Day.module.css";

/** Deterministic bar heights for the after-hours call's waveform (Try 1 site.js). */
const BARS = [0.35, 0.6, 0.85, 0.5, 0.95, 0.7, 0.4, 0.8, 1, 0.55, 0.75, 0.45, 0.9, 0.65, 0.3, 0.7, 0.95, 0.6, 0.4, 0.85];

const Top = ({ title, end }: { title: string; end: ReactNode }) => (
  <div className={s.uiTop}>
    <span className={s.uiTitle}>{title}</span>
    {end}
  </div>
);

/** A figure inside running text: the digits as an LTR island between their words. */
const Run = ({ parts }: { parts: string[] }) => (
  <>
    {parts[0]}
    {parts[1] && <Num>{parts[1]}</Num>}
    {parts[2]}
  </>
);

/** The product fragment each moment shows, in moment order (the 10 pm moment has none). */
function fragments(t: DayCopy): (ReactNode | null)[] {
  const { status, call, chat, handoff, night, log } = t;
  return [
    <>
      <Top title={status.title} end={<span className={s.live}>{status.live}</span>} />
      <ul className={s.rows}>
        {status.rows.map(([k, v]) => (
          <li key={k}>
            <span>{k}</span>
            <b>{v}</b>
          </li>
        ))}
      </ul>
    </>,
    <>
      <Top title={call.title} end={<Num className={s.note}>00:38</Num>} />
      <div className={s.thread}>
        <p className={cn(s.bubble, s.caller)}>{call.caller}</p>
        <p className={cn(s.bubble, s.agent)}>
          <small>{t.agent}</small>
          <Run parts={call.agent} />
        </p>
        <div className={s.card}>
          <p className={s.cardTitle}>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="10" cy="10" r="9" fill="#2EC4E6" />
              <path d="M6 10.3l2.6 2.6L14.2 7" fill="none" stroke="#0D1326" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {call.booked}
          </p>
          <ul>
            {call.items.map((parts) => (
              <li key={parts[0]}>
                <Run parts={parts} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>,
    <>
      <Top title={chat.title} end={<span className={cn(s.tag, s.tagCyan)}>{chat.tag}</span>} />
      <div className={s.thread}>
        <p className={cn(s.bubble, s.caller)}>{chat.caller}</p>
        <p className={cn(s.bubble, s.agent)}>
          <small>{t.agent}</small>
          <Run parts={chat.agent} />
        </p>
        <p className={s.sent}>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M1.5 8.5l3 3 6-7M7.5 11.5l1 0 6-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {chat.sent}
        </p>
      </div>
    </>,
    <>
      <Top
        title={handoff.title}
        end={
          <span className={cn(s.tag, s.tagPurple)}>
            <i />
            {handoff.tag}
          </span>
        }
      />
      <div className={s.ticket}>
        <div className={s.to}>
          <span className={s.avatar} aria-hidden="true">
            {handoff.initial}
          </span>
          <div>
            <b>{handoff.name}</b>
            <span>{handoff.role}</span>
          </div>
        </div>
        <ul>
          {handoff.rows.map(([k, v]) => (
            <li key={k}>
              <b>{k}</b>
              <span>{v}</span>
            </li>
          ))}
        </ul>
        <div>
          <span className={s.take}>{handoff.take}</span>
        </div>
      </div>
    </>,
    null,
    <>
      <Top
        title={night.title}
        end={
          <span className={cn(s.tag, s.tagBlue)}>
            <i />
            {night.tag}
          </span>
        }
      />
      <div className={s.ring}>
        <span className={s.live}>{night.live}</span>
        <span className={s.wave} aria-hidden="true">
          {BARS.map((h, k) => (
            <i key={k} style={{ height: Math.max(4, Math.round(28 * h)), "--k": k } as CSSProperties} />
          ))}
        </span>
        <Num>01:12</Num>
      </div>
      <div className={s.card}>
        <p className={s.cardTitle}>{night.summary}</p>
        <p className={s.cardP}>
          <Run parts={night.text} />
        </p>
      </div>
    </>,
    <>
      <Top
        title={log.title}
        end={
          <span className={s.note}>
            <Num value={log.count} />
            {log.unit}
          </span>
        }
      />
      <ul className={s.log}>
        {log.rows.map(([time, half, channel, result]) => (
          <li key={time}>
            <span className={s.logT}>
              <Num>{time}</Num>
              {half}
            </span>
            <span>{channel}</span>
            <b>{result}</b>
          </li>
        ))}
      </ul>
    </>,
  ];
}

/**
 * A day on the board (Try 3 capabilities, mockups/try-3 `#day`): seven
 * moments from 8 am to 2 am, each with the product fragment it shows.
 *
 * This server markup is the vertical timeline that phones, reduced motion
 * and no JavaScript get, every moment visible. On a wide screen with motion
 * allowed, DayTrack pins the board under the header and lets the page's own
 * scroll run the clock and slide the moments past the "now" line. The night
 * moments are .on-dark bands; their fragments stay light (.on-light).
 */
export function Day({ locale }: { locale: Locale }) {
  const t = dayCopy[locale];
  const ui = fragments(t);
  return (
    <section id="day" aria-labelledby="day-title" className={cn(s.day, "pt-24 lg:pt-40")}>
      <DayTrack parts={t.parts}>
        <div className={s.pin}>
          <div className={s.top}>
            <SectionHead id="day-title" title={t.title} lead={t.lead} className={s.head} />
            <p className={s.clock} aria-hidden="true">
              <bdi dir="ltr" className={s.fig} data-clock="">
                8:00
              </bdi>
              <span className={s.part} data-part="">
                {t.parts[0]}
              </span>
            </p>
          </div>
          <div className={s.band} data-band="">
            <ol className={s.strip} data-strip="" aria-label={t.strip}>
              {t.moments.map((m, i) => (
                <li
                  key={m.t}
                  className={cn(s.mo, i === 4 && s.dusk, i >= 4 && cn(s.night, "on-dark"))}
                  data-t={m.t}
                  data-on={i === 0 ? "" : undefined}
                >
                  <p className={s.time}>
                    <Num>{m.time}</Num> {m.part}
                  </p>
                  <p className={s.say}>{m.say}</p>
                  {ui[i] && <div className={cn(s.ui, "on-light")}>{ui[i]}</div>}
                </li>
              ))}
              <li className={cn(s.fill, "on-dark")} aria-hidden="true" />
            </ol>
            <span className={s.now} data-now="" aria-hidden="true" />
          </div>
          <div className={s.meter} aria-hidden="true">
            <span>
              <Num>{t.meter[0][0]}</Num> {t.meter[0][1]}
            </span>
            <span className={s.bars} data-bars="">
              {Array.from({ length: 18 }, (_, k) => (
                <i key={k}>
                  <b />
                </i>
              ))}
            </span>
            <span>
              <Num>{t.meter[1][0]}</Num> {t.meter[1][1]}
            </span>
          </div>
        </div>
      </DayTrack>
      <div className={s.foot}>
        <p>{t.foot}</p>
        <p className={s.note}>{t.note}</p>
      </div>
    </section>
  );
}
