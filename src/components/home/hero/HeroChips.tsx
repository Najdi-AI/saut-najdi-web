"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { dirOf, type Locale } from "@/lib/i18n";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Num } from "../ui/Num";
import { useReducedMotion } from "../ui/useReducedMotion";
import { Words } from "../ui/Words";
import { CLIP_TURNS, DIALECTS, SAMPLE, heroCopy, type Dialect } from "./copy";
// The clip's own timings file (scripts/make-home-voice.mjs writes both).
import clip from "../../../../public/audio/home-hero.json";
import s from "./Hero.module.css";

/*
 * The three product chips on the hero sentence. Each is a client island; the
 * H1 and lead around them stay server markup (./index.tsx). They render in
 * the .on-dark band, so the primitives' "on" states, which follow
 * --foreground there (Off-White), are set to the mockups' cyan here.
 */

/** The fade-up delay of each chip, after the H1 lines (Try 1). */
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** Reply dialect: the toggle group, and the agent's first line in a polite live region. */
export function DialectChip({ locale }: { locale: Locale }) {
  const t = heroCopy[locale];
  const labelId = useId();
  const reduced = useReducedMotion();
  const [dialect, setDialect] = useState<Dialect>("sa");
  // The line on screen: it fades out, swaps, then fades back in.
  const [shown, setShown] = useState<Dialect>("sa");

  useEffect(() => {
    if (shown === dialect) return;
    const id = setTimeout(() => setShown(dialect), reduced ? 0 : 160);
    return () => clearTimeout(id);
  }, [dialect, shown, reduced]);

  const say = SAMPLE[shown];
  return (
    <div className={`${s.chip} ${s.dialect} ${s.rise}`} data-reveal="" style={delay(520)}>
      <div className={s.row}>
        <span className={s.label} id={labelId}>
          {t.dialect}
        </span>
        <ToggleGroup
          dir={dirOf(locale)}
          aria-labelledby={labelId}
          value={[dialect]}
          // A single-choice group: pressing the pressed item would empty it.
          onValueChange={(v) => v[0] && setDialect(v[0] as Dialect)}
          spacing={0.5}
          className="rounded-(--radius) bg-background p-[3px]"
        >
          {DIALECTS.map((d) => (
            <ToggleGroupItem
              key={d}
              value={d}
              lang={d === "en" && locale === "ar" ? "en" : undefined}
              // 32px drawn as in the mockup; ::after stretches the target to 44px.
              className="relative min-h-8 min-w-0 rounded-[calc(var(--radius)-3px)] border-0 bg-transparent px-3 text-sm text-muted-foreground after:absolute after:inset-x-0 after:-inset-y-1.5 hover:not-aria-pressed:bg-transparent hover:not-aria-pressed:text-foreground aria-pressed:bg-cyan aria-pressed:text-charcoal"
            >
              {t.dialects[d]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <p
        className={s.say}
        aria-live="polite"
        lang={say.lang}
        dir={dirOf(say.lang)}
        data-fading={shown !== dialect || undefined}
      >
        {say.text}
      </p>
    </div>
  );
}

/** Deterministic bar heights (Try 1 site.js), so server and client draw the same wave. */
const BARS = [
  0.35, 0.6, 0.85, 0.5, 0.95, 0.7, 0.4, 0.8, 1, 0.55, 0.75, 0.45, 0.9, 0.65, 0.3, 0.7, 0.95, 0.6, 0.4, 0.85,
  0.5, 0.75, 0.35, 0.6, 0.9, 0.45, 0.7, 0.3,
].map((h) => Math.max(4, Math.round(24 * h)));
const LENGTH_S = clip.durationMs / 1000;
const clock = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;
/** The clip's turns with their times (home-hero.json) and word counts. */
const TURNS = CLIP_TURNS.map((turn, i) => ({ ...clip.turns[i], ...turn, words: turn.text.split(" ").length }));

/**
 * The line being spoken at a time in the clip (ms): its turn, and how many of
 * its words have been said, spread evenly over the turn. `whole` (reduced
 * motion) shows each turn at once.
 */
const lineAt = (ms: number, whole: boolean) => {
  let k = 0;
  while (k < TURNS.length - 1 && ms >= TURNS[k + 1].startMs) k++;
  const { startMs, endMs, words } = TURNS[k];
  const said = Math.floor(((ms - startMs) / Math.max(1, endMs - startMs)) * words) + 1;
  return { k, n: whole ? words : Math.min(words, Math.max(0, said)) };
};

/**
 * Hear the reply: plays the product's sample clip, pauses, and counts the
 * time left in an LTR island while the wave fills. Nothing loads before the
 * press (preload="none"), and it stops any other clip on the page.
 *
 * Under it, the line being spoken writes itself word by word in time with
 * the sound (clip A); at rest it shows the reply's first line whole. All
 * three lines share one cell, so the chip keeps its height as they change.
 * It is a picture of the sound (aria-hidden): the transcript, passed in as
 * children from the server, is the text alternative.
 */
export function PlayChip({ locale, children }: { locale: Locale; children: ReactNode }) {
  const t = heroCopy[locale];
  const reduced = useReducedMotion();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "playing">("idle");
  const playing = status === "playing";
  const [pos, setPos] = useState({ on: 0, left: LENGTH_S });
  const [line, setLine] = useState({ k: 0, n: TURNS[0].words });

  // Follow the clip only while it plays; state changes only when a bar, a
  // second or a word ticks over, not on every frame.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !playing) return;
    let frame = 0;
    const paint = () => {
      const length = Number.isFinite(audio.duration) ? audio.duration : LENGTH_S;
      const on = Math.round((audio.currentTime / length) * BARS.length);
      const left = Math.max(0, length - audio.currentTime);
      const now = lineAt(audio.currentTime * 1000, reduced);
      setPos((p) => (p.on === on && Math.floor(p.left) === Math.floor(left) ? p : { on, left }));
      setLine((l) => (l.k === now.k && l.n === now.n ? l : now));
      frame = requestAnimationFrame(paint);
    };
    paint();
    return () => cancelAnimationFrame(frame);
  }, [playing, reduced]);

  useEffect(() => {
    const audio = audioRef.current;
    return () => audio?.pause();
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) return audio.pause();
    // A failed element stays failed until reloaded (as in VoiceClip); an
    // AbortError only means a pause() came before the sound did.
    if (audio.error) audio.load();
    document.querySelectorAll("audio").forEach((other) => other !== audio && other.pause());
    setStatus("loading");
    audio.play().catch((e: unknown) => (e as Error).name !== "AbortError" && setStatus("idle"));
  };

  return (
    <div
      className={`${s.chip} ${s.playChip} ${s.rise}`}
      data-reveal=""
      data-playing={playing || undefined}
      style={delay(600)}
    >
      <button type="button" className={s.playBtn} aria-label={playing ? t.pause : t.play} aria-busy={status === "loading" || undefined} onClick={toggle}>
        {/* Media glyphs are never mirrored in RTL. */}
        <svg viewBox="0 0 16 16" aria-hidden>
          <path d={playing ? "M4 2.5h3v11H4zM9 2.5h3v11H9z" : "M4 2.5v11l9-5.5z"} fill="currentColor" />
        </svg>
      </button>
      <div className={s.playBody}>
        <span className={s.title}>{t.play}</span>
        <span className={s.wave} aria-hidden>
          {BARS.map((h, i) => (
            <span key={i} style={{ height: h, "--k": i } as CSSProperties} data-on={i < pos.on || undefined} />
          ))}
        </span>
      </div>
      <span className={s.readout}>
        <Num>{clock(pos.left)}</Num>
      </span>
      <p className={s.said} aria-hidden>
        {TURNS.map((turn, k) => (
          <span key={k} data-on={k === line.k || undefined}>
            <b>{t.who[turn.who]}:</b>{" "}
            <span lang="ar" dir="rtl">
              <Words text={turn.text} shown={k === line.k ? line.n : 0} />
            </span>
          </span>
        ))}
      </p>
      {children}
      <audio
        ref={audioRef}
        src={clip.src}
        preload="none"
        // The pause glyph and moving bars wait for sound, not for the press.
        onPlaying={() => setStatus("playing")}
        onWaiting={() => setStatus("loading")}
        onPause={() => setStatus("idle")}
        onError={() => setStatus("idle")}
        onEnded={() => setPos({ on: 0, left: LENGTH_S })}
      />
    </div>
  );
}

/** Hand off to staff: the switch, its state in words beside it. */
export function HandoffChip({ locale }: { locale: Locale }) {
  const t = heroCopy[locale];
  const id = useId();
  const [on, setOn] = useState(true);
  return (
    <div className={`${s.chip} ${s.handoff} ${s.rise}`} data-reveal="" style={delay(680)}>
      <div>
        <span className={s.title} id={`${id}-name`}>
          {t.handoff}
        </span>
        <span className={`${s.label} ${s.state}`} id={`${id}-state`}>
          {on ? t.handoffOn : t.handoffOff}
        </span>
      </div>
      <Switch
        checked={on}
        onCheckedChange={setOn}
        aria-labelledby={`${id}-name`}
        aria-describedby={`${id}-state`}
        // Cyan track and a Charcoal knob when on, an Off-White knob when off.
        className="data-checked:bg-cyan [&_[data-slot=switch-thumb]]:bg-off-white data-checked:[&_[data-slot=switch-thumb]]:bg-charcoal"
      />
    </div>
  );
}
