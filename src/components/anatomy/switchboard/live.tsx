"use client";

import { memo, useCallback, useEffect, useId, useMemo, useRef } from "react";
import type { Locale } from "@/lib/i18n";
import { MediaGlyph, useVoiceClip, type ClipTimings } from "@/components/VoiceClip";
import type { liveData } from "./geometry.mjs";
import { mountSwitchboard } from "./motion.mjs";
import { TEXT, readoutOf } from "./model.mjs";

type LiveData = ReturnType<typeof liveData>;
type Board = ReturnType<typeof mountSwitchboard>;

/**
 * The drawing. Memoised, with a stable innerHTML object: React 19 re-sets
 * innerHTML whenever the dangerouslySetInnerHTML object changes, which would
 * swap out the nodes the motion holds on every re-render of the figure.
 * The art is built on the server from numbers and one fixed word
 * (geometry.mjs): no visitor input reaches it.
 */
const Art = memo(function Art({ art, frame, label }: { art: string; frame: number[]; label: string }) {
  const html = useMemo(() => ({ __html: art }), [art]);
  return <svg className="iso-svg" viewBox={frame.join(" ")} role="img" aria-label={label} focusable="false" dangerouslySetInnerHTML={html} />;
});

/**
 * The live switchboard, frameless (Sultan, 2026-10-20): the machine stands on
 * the hero's own background with its halo, under the headline. The SVG art
 * arrives as a finished string; this component mounts the framework-free
 * motion (motion.mjs) on it and drives the play control on the speaker's hub
 * with the hero clip (useVoiceClip). The dial turns with the tour and the
 * clip; the hero's one dialect line is the «سعودي · عربي · إنجليزي» line
 * under the CTAs (HomePage), so the figure carries no second one.
 *
 * The readout the motion writes stays in the DOM off screen; `sb-say` is the
 * polite live region for what the visitor causes. The one line under the
 * machine is the clip's honest caption.
 */
export function SwitchboardLive({ locale, art, data }: { locale: Locale; art: string; data: LiveData }) {
  const t = TEXT[locale];
  const stage = useRef<HTMLDivElement>(null);
  const board = useRef<Board | null>(null);
  const who = useRef<string[]>([]);
  const captionId = useId();

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
    const mounted = mountSwitchboard(node, data, { locale, lines: [...t.lines] });
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

  return (
    <figure className="iso-figure sb iso anx" data-theme="light" dir={locale === "ar" ? "rtl" : "ltr"} lang={locale}>
      <div className="iso-plate sb-plate">
        <div ref={stage} className="iso-stage sb-stage" dir="ltr">
          <Art art={art} frame={data.frame} label={t.label} />
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
              <MediaGlyph name={clip.active ? "pause" : "play"} size={14} />
            </span>
          </button>
        </div>
        {/* written by the motion (phases, and each spoken line while the clip plays); off screen */}
        <span className="anx-sr" data-readout="">
          {readoutOf(locale, "idle")}
        </span>
      </div>
      <figcaption className="sb-clip" id={captionId}>
        {t.clipCaption}
        <span role="status" className="sb-error">
          {clip.status === "error" ? t.error : ""}
        </span>
      </figcaption>
      {/* written by the motion when the visitor plays the clip, arrives, or the call ends */}
      <span className="sb-say" data-say="" aria-live="polite" />
      <audio ref={clip.audioRef} src={clip.src} preload="none" />
    </figure>
  );
}
