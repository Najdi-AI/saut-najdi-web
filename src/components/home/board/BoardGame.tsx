"use client";

import { Fragment, useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "../ui/useReducedMotion";
import type { BoardCopy } from "./copy";
import { DEFAULTS, RANGES, boardOf, clockOf, weights, type Board, type Inputs, type Knob } from "./model";
import s from "./Board.module.css";

type Phase = "idle" | "running" | "loss" | "saving" | "profit";
const KNOBS: Knob[] = ["calls", "miss", "book", "value"];
const n0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const n1 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });
/** A figure with its sign: − for a loss, + for a gain, and a bare 0. */
const signed = (v: number) => (Math.round(v) === 0 ? "0" : (v > 0 ? "+" : "−") + n0.format(Math.abs(Math.round(v))));
const fill = (text: string, vars: Record<string, string>) => text.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? "");
/** The same, with each figure in an LTR island (house rule). */
const fillBdi = (text: string, vars: Record<string, string>): ReactNode =>
  text.split(/\{(\w+)\}/).map((part, i) => (i % 2 ? <bdi key={i} dir="ltr">{vars[part]}</bdi> : <Fragment key={i}>{part}</Fragment>));
const shown = (k: Knob, v: number) => (k === "miss" || k === "book" ? `${v}%` : n0.format(v));

const PHONE = "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z";
const MISSED = "M6.5 5.5 12 11l7-7-1-1-6 6-4.5-4.5H11V3H5v6h1.5V5.5zm17.21 11.67C20.66 14.27 16.54 12.5 12 12.5S3.34 14.27.29 17.17c-.18.18-.29.43-.29.71 0 .28.11.53.29.71l2.48 2.48c.18.18.43.29.71.29.27 0 .52-.11.7-.28.79-.74 1.69-1.36 2.66-1.85.33-.16.56-.5.56-.9v-3.1c1.45-.48 3-.73 4.6-.73s3.15.25 4.6.72v3.1c0 .39.23.74.56.9.98.49 1.87 1.12 2.67 1.85.18.18.43.28.7.28.28 0 .53-.11.71-.29l2.48-2.48c.18-.18.29-.43.29-.71 0-.27-.11-.52-.29-.7z";
const Icon = ({ d, ok }: { d?: string; ok?: boolean }) => (
  <svg viewBox="0 0 24 24" aria-hidden>
    {ok ? (
      <path d="M4.5 12.5l5 5L19.5 7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    ) : (
      <path d={d} fill="currentColor" />
    )}
  </svg>
);

/**
 * Play the day (Try 3 board): the score, the day's calls as tiles, the
 * buttons and the four knobs. It opens on the played day (the loss), so the
 * server HTML carries the default figures; «أعد اليوم» starts over and
 * «شغّل اليوم» plays it again, a call at a time (at once under reduced
 * motion). The single role="status" line speaks only once the board has
 * settled: after a run ends, or after a knob stops moving. The knobs are
 * native range inputs, disabled until this hydrates.
 */
export function BoardGame({ t }: { t: BoardCopy }) {
  const id = useId();
  const reduced = useReducedMotion();
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [phase, setPhase] = useState<Phase>("loss");
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);
  const ctl = useRef<HTMLDivElement>(null);
  const refocus = useRef(false);
  const b = boardOf(inputs);
  const w = weights(b);
  const missed = w.flatMap((x, i) => (x ? [i] : []));

  const statusFor = (p: Phase, m: Board) =>
    p === "loss"
      ? m.missed
        ? fill(t.status.loss, { missed: n1.format(m.missed), day: n0.format(m.day) })
        : t.status.none
      : p === "profit"
        ? fill(t.status.profit, { day: n0.format(m.day) })
        : "";
  const target = statusFor(phase, b);
  const [said, setSaid] = useState(target);

  useEffect(() => {
    setReady(true);
  }, []);

  // The status line follows the board once it has been still for a moment.
  useEffect(() => {
    const timer = window.setTimeout(() => setSaid(target), 650);
    return () => window.clearTimeout(timer);
  }, [target]);

  // A run: one call (or one saved call) per tick, then the result.
  useEffect(() => {
    if (phase !== "running" && phase !== "saving") return;
    const run = phase === "running";
    const total = run ? b.calls : missed.length;
    const tick = run ? Math.max(60, Math.min(190, 2600 / b.calls)) * 1.45 : Math.max(70, Math.min(170, 1500 / Math.max(1, total)));
    const timer = window.setTimeout(
      () => {
        if (step < total) setStep(step + 1);
        else setPhase(run ? "loss" : "profit");
      },
      step < total ? tick : 420,
    );
    return () => window.clearTimeout(timer);
  }, [phase, step, b.calls, missed.length]);

  // A button that hides or disables itself hands keyboard focus to the next one.
  useEffect(() => {
    const box = ctl.current;
    if (!refocus.current || !box) return;
    const at = document.activeElement as HTMLButtonElement | null;
    if (at && box.contains(at) && !at.disabled) return;
    box.querySelector<HTMLButtonElement>("button:not([disabled]):not([hidden])")?.focus({ preventScroll: true });
  }, [phase]);

  const go = (next: Phase) => {
    refocus.current = !!ctl.current?.contains(document.activeElement);
    setStep(0);
    // Reduced motion: the run's end state at once.
    setPhase(reduced && next === "running" ? "loss" : reduced && next === "saving" ? "profit" : next);
  };
  const turn = (k: Knob, v: number) => {
    setInputs((i) => ({ ...i, [k]: v }));
    // A knob mid-run lands the run where it was heading.
    if (phase === "running" || phase === "saving") {
      setStep(0);
      setPhase(phase === "running" ? "loss" : "profit");
    }
  };

  const landed = (i: number) => phase === "loss" || phase === "saving" || phase === "profit" || (phase === "running" && i < step);
  const saved = (i: number) => phase === "profit" || (phase === "saving" && missed.indexOf(i) > -1 && missed.indexOf(i) < step);
  const loss = phase === "idle" ? 0 : phase === "running" ? w.slice(0, step).reduce((a, x) => a + x * b.per, 0) : b.day;
  const gain = phase === "profit" ? b.day : phase === "saving" ? missed.slice(0, step).reduce((a, i) => a + w[i] * b.per, 0) : 0;
  const month = phase === "loss" ? -b.month : phase === "profit" ? b.month : 0;
  const size = b.calls <= 12 ? "s" : b.calls <= 24 ? "m" : "l";

  return (
    <>
      <div className={s.score}>
        <div className={s.box}>
          <p className={s.fig}>
            <bdi dir="ltr" data-tone={loss ? "loss" : undefined}>
              {signed(-loss)}
            </bdi>
            <small>{t.perDay}</small>
          </p>
          <span className={s.name}>{t.without}</span>
        </div>
        <div className={s.box}>
          <p className={s.fig}>
            <bdi dir="ltr" data-tone={gain ? "gain" : undefined}>
              {signed(gain)}
            </bdi>
            <small>{t.perDay}</small>
          </p>
          <span className={s.name}>{t.with}</span>
        </div>
        <div className={s.month}>
          <p className={s.monthLine}>
            {t.month[phase === "loss" || phase === "profit" ? phase : "idle"]}{" "}
            <span className={s.monthFig}>
              <bdi dir="ltr" data-tone={month < 0 ? "loss" : month > 0 ? "gain" : undefined}>
                {signed(month)}
              </bdi>{" "}
              {t.sar}
            </span>
          </p>
          <p className={s.cap}>{fillBdi(t.cap, { days: "30" })}</p>
        </div>
      </div>

      <div className={s.play}>
        <div className={s.tiles} role="list" aria-label={t.tiles} data-size={size}>
          {w.map((x, i) => {
            const c = clockOf(i, b.calls);
            const time = `${c.hm} ${c.pm ? t.pm : t.am}`;
            const v = n0.format(Math.round(x * b.per));
            const kind = !landed(i) ? undefined : !x ? "ans" : x < 1 ? "part" : "miss";
            const face = (side: "front" | "back", sign: string) => (
              <div className={s.face} data-side={side}>
                <span className={s.time}>
                  <bdi dir="ltr">{c.hm}</bdi> {c.pm ? t.pm : t.am}
                </span>
                <span className={s.mid}>
                  <span className={s.ic}>{kind === "ans" || side === "back" ? <Icon ok /> : <Icon d={kind ? MISSED : PHONE} />}</span>
                  <span className={s.val}>
                    <bdi dir="ltr">
                      {sign}
                      {v}
                    </bdi>
                  </span>
                </span>
                <span className={s.bar} style={{ "--w": x } as CSSProperties} />
              </div>
            );
            return (
              <div
                key={`${b.calls}-${i}`}
                role="listitem"
                className={s.tile}
                data-kind={kind}
                data-ring={(phase === "running" && i === step) || undefined}
                data-land={(phase === "running" && i < step) || undefined}
                data-saved={(x > 0 && saved(i)) || undefined}
              >
                <div className={s.flip} aria-hidden>
                  {face("front", "−")}
                  {face("back", "+")}
                </div>
                <span className="sr-only">
                  {fill(!kind ? t.call.idle : !x ? t.call.answered : saved(i) ? t.call.saved : t.call.missed, { t: time, v })}
                </span>
              </div>
            );
          })}
        </div>
        <p className={s.legend}>{fillBdi(t.legend, { per: n0.format(b.per), value: n0.format(b.value), book: `${b.book}%` })}</p>
        <div className={s.ctl} ref={ctl} data-ready={ready || undefined}>
          <Button hidden={phase !== "idle" && phase !== "running"} disabled={phase === "running"} onClick={() => go("running")}>
            {t.play}
          </Button>
          <Button hidden={phase !== "loss" && phase !== "saving"} disabled={phase === "saving"} onClick={() => go("saving")}>
            {t.save}
          </Button>
          <Button variant="link" size="sm" className="px-0" hidden={phase !== "loss" && phase !== "profit"} onClick={() => go("idle")}>
            {t.reset}
          </Button>
        </div>
        <p className={s.status} role="status">
          {said}
        </p>
      </div>

      <div className={s.calc} role="group" aria-labelledby={`${id}-calc`}>
        <p className={s.calcTitle} id={`${id}-calc`}>
          {t.calc}
        </p>
        {KNOBS.map((k) => (
          <div key={k} className={s.knob}>
            <label htmlFor={`${id}-${k}`}>{t.knobs[k]}</label>
            {/* The value as text, also without JavaScript; not a live region (the status line speaks). */}
            <output htmlFor={`${id}-${k}`} aria-live="off">
              <bdi dir="ltr">{shown(k, inputs[k])}</bdi>
              {k === "value" && ` ${t.sar}`}
            </output>
            <input
              id={`${id}-${k}`}
              type="range"
              {...RANGES[k]}
              value={inputs[k]}
              disabled={!ready}
              aria-valuetext={k === "value" ? fill(t.riyals, { n: n0.format(inputs[k]) }) : shown(k, inputs[k])}
              onChange={(e) => turn(k, Number(e.target.value))}
            />
          </div>
        ))}
      </div>
    </>
  );
}
