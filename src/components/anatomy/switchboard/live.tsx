"use client";

import { memo, useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { Locale } from "@/lib/i18n";
import { MediaGlyph, useVoiceClip, type ClipTimings } from "@/components/VoiceClip";
import type { liveData } from "./geometry.mjs";
import { mountSwitchboard } from "./motion.mjs";
import { DIALECTS, DIALECT_WORDS, DIAL_HOME, TEXT, readoutOf } from "./model.mjs";

type LiveData = ReturnType<typeof liveData>;
type Board = ReturnType<typeof mountSwitchboard>;
type Dialect = "saudi" | "arabic" | "english";

/** The legend swatches, as the kit draws them. */
function Swatch({ mark }: { mark: string }) {
  return (
    <svg className="iso-swatch" data-mark={mark} viewBox="0 0 16 10" aria-hidden="true" focusable="false">
      <path d="M2 4.5 8 1.5 14 4.5 14 6 8 9 2 6Z" />
      <path className="iso-swatch-crease" d="M2 4.5 8 7.5 14 4.5" />
    </svg>
  );
}

/**
 * The drawing. Memoised, with a stable innerHTML object: React 19 re-sets
 * innerHTML whenever the dangerouslySetInnerHTML object changes, which would
 * swap out the nodes the motion holds on every re-render of the card.
 * The art is built on the server from numbers and one fixed word
 * (geometry.mjs): no visitor input reaches it.
 */
const Art = memo(function Art({ art, width, height, label }: { art: string; width: number; height: number; label: string }) {
  const html = useMemo(() => ({ __html: art }), [art]);
  return <svg className="iso-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label} focusable="false" dangerouslySetInnerHTML={html} />;
});

/**
 * The live switchboard card. The SVG art arrives as a finished string; this
 * component mounts the framework-free motion (motion.mjs) on it, drives the
 * play control on the speaker's hub with the hero clip (useVoiceClip), and
 * offers the dial's three words as a radio group.
 */
export function SwitchboardLive({ locale, art, data }: { locale: Locale; art: string; data: LiveData }) {
  const t = TEXT[locale];
  const stage = useRef<HTMLDivElement>(null);
  const board = useRef<Board | null>(null);
  const who = useRef<string[]>([]);
  const captionId = useId();
  const [dial, setDial] = useState<Dialect>(DIAL_HOME as Dialect);

  // agent greeting, caller, agent answer: one span per spoken line, and who speaks it
  const toSpans = useCallback((timings: ClipTimings) => {
    const turns = timings.turns.slice(0, 3);
    who.current = turns.map((turn) => turn.who);
    return turns;
  }, []);
  const clip = useVoiceClip("home-hero", toSpans);

  useEffect(() => {
    const node = stage.current;
    if (!node) return;
    const mounted = mountSwitchboard(node, data, {
      locale,
      lines: [...t.lines],
      onDial: (dialect: string) => setDial(dialect as Dialect),
    });
    board.current = mounted;
    return () => {
      mounted.destroy();
      board.current = null;
    };
  }, [data, locale, t.lines]);

  // The machine follows the voice: the caller's line lamp on caller turns, the
  // agent's lamp and the speaker cone on agent turns. Paused is a call on hold.
  const live = clip.status === "loading" || clip.status === "playing" || clip.status === "paused";
  const speaking = clip.speaking >= 0 ? who.current[clip.speaking] ?? "" : "";
  useEffect(() => {
    board.current?.setClip({ active: live, speaking, turn: clip.speaking, status: clip.status });
  }, [live, speaking, clip.speaking, clip.status]);

  const turn = (dialect: Dialect, focus: boolean, target?: HTMLElement | null) => {
    setDial(dialect);
    board.current?.setDial(dialect);
    if (focus) target?.focus();
  };
  const onDialKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const forward = locale === "ar" ? "ArrowLeft" : "ArrowRight";
    const backward = locale === "ar" ? "ArrowRight" : "ArrowLeft";
    let next = -1;
    if (event.key === forward || event.key === "ArrowDown") next = (index + 1) % DIALECTS.length;
    if (event.key === backward || event.key === "ArrowUp") next = (index + DIALECTS.length - 1) % DIALECTS.length;
    if (next < 0) return;
    event.preventDefault();
    const buttons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[data-dialect]");
    turn(DIALECTS[next] as Dialect, true, buttons?.[next]);
  };

  return (
    <figure className="iso-figure sb iso" data-theme="light" dir={locale === "ar" ? "rtl" : "ltr"} lang={locale}>
      <div className="iso-plate sb-plate">
        <div className="iso-plate-corners" aria-hidden="true">
          <span className="iso-plate-corner" data-corner="fig">
            {t.fig}
          </span>
          <span className="iso-plate-corner" data-corner="title">
            {t.title}
          </span>
          <span className="iso-plate-corner" data-corner="hint">
            {t.hint}
          </span>
          <span className="iso-plate-corner" data-corner="readout" data-readout="">
            {readoutOf(locale, "idle")}
          </span>
        </div>
        <div ref={stage} className="iso-stage sb-stage" dir="ltr">
          <Art art={art} width={data.width} height={data.height} label={t.label} />
          <button
            type="button"
            className="sb-play"
            style={{ left: `${data.hub[0]}%`, top: `${data.hub[1]}%` }}
            onClick={clip.toggle}
            aria-label={t.play}
            aria-pressed={clip.active}
            aria-describedby={captionId}
            aria-busy={clip.status === "loading"}
          >
            <span className="sb-play-chip">
              <MediaGlyph name={clip.active ? "pause" : "play"} size={12} />
            </span>
          </button>
        </div>
      </div>
      <figcaption className="iso-legend sb-legend">
        <span className="sb-dial" role="radiogroup" aria-label={t.dialGroup}>
          <span className="sb-dial-name" aria-hidden="true">
            {t.dialGroup}
          </span>
          {DIALECTS.map((dialect, index) => (
            <button
              key={dialect}
              type="button"
              role="radio"
              data-dialect={dialect}
              aria-checked={dial === dialect}
              tabIndex={dial === dialect ? 0 : -1}
              onClick={(event) => turn(dialect as Dialect, false, event.currentTarget)}
              onKeyDown={(event) => onDialKey(event, index)}
            >
              {(DIALECT_WORDS[locale] as Record<string, string>)[dialect]}
            </button>
          ))}
        </span>
        <span className="iso-keys">
          {t.keys.map((key) => (
            <span className="iso-key" key={key.label}>
              <Swatch mark={key.mark} />
              {key.label}
            </span>
          ))}
        </span>
        <span className="iso-caption">{t.caption}</span>
        <span className="sb-clip" id={captionId}>
          {t.clipCaption}
          <span role="status" className="sb-error">
            {clip.status === "error" ? t.error : ""}
          </span>
        </span>
      </figcaption>
      <audio ref={clip.audioRef} src={clip.src} preload="none" />
    </figure>
  );
}
