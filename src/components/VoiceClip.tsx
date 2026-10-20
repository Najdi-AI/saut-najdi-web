"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Playback for the homepage voice clips (public/audio, built by
 * scripts/make-home-voice.mjs). Each clip ships with a timings JSON beside it;
 * the hook fetches it on the first press, in parallel with the audio, and
 * reports which turns have been reached and which one is speaking, so the
 * bubbles can follow the voice.
 *
 * Nothing loads before the visitor asks: the <audio> element is preload="none"
 * and there is no autoplay. Only one clip plays at a time on a page.
 */

export type ClipTimings = {
  src: string;
  durationMs: number;
  turns: { who: string; startMs: number; endMs: number }[];
  escalationMs?: number;
};
export type Span = { startMs: number; endMs: number };
export type ClipStatus = "idle" | "loading" | "playing" | "paused" | "ended" | "error";
/** "failed" means the clip plays but cannot be followed: show every bubble. */
export type ClipSync = "none" | "loading" | "ready" | "failed";

/** A bubble lands this much before its voice, so the eye arrives with the ear. */
const LEAD_MS = 100;

let active: HTMLAudioElement | null = null;

export function useVoiceClip(name: string, toSpans: (t: ClipTimings) => Span[]) {
  const src = `/audio/${name}.m4a`;
  const audioRef = useRef<HTMLAudioElement>(null);
  const spansRef = useRef<Span[] | null>(null);
  const requested = useRef(false);
  const [status, setStatus] = useState<ClipStatus>("idle");
  const [sync, setSync] = useState<ClipSync>("none");
  const [pos, setPos] = useState({ reached: 0, speaking: -1 });

  const measure = useCallback(() => {
    const audio = audioRef.current;
    const spans = spansRef.current;
    if (!audio || !spans) return;
    const t = audio.currentTime * 1000;
    let reached = 0;
    let speaking = -1;
    spans.forEach((s, i) => {
      if (s.startMs <= t + LEAD_MS) {
        reached = i + 1;
        speaking = t < s.endMs ? i : -1;
      }
    });
    setPos((p) => (p.reached === reached && p.speaking === speaking ? p : { reached, speaking }));
  }, []);

  const loadTimings = useCallback(() => {
    if (requested.current) return;
    requested.current = true;
    setSync("loading");
    fetch(`/audio/${name}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json() as Promise<ClipTimings>;
      })
      .then((t) => {
        const spans = toSpans(t);
        if (!spans.length) throw new Error("no turns");
        spansRef.current = spans;
        setSync("ready");
        measure();
      })
      .catch(() => setSync("failed"));
  }, [name, toSpans, measure]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }
    loadTimings();
    if (audio.error) audio.load();
    if (audio.ended) audio.currentTime = 0;
    if (active && active !== audio) active.pause();
    active = audio;
    setStatus("loading");
    audio.play().catch((err: unknown) => {
      // A pause() while play() is pending rejects with AbortError: not a failure.
      if ((err as { name?: string } | null)?.name !== "AbortError") setStatus("error");
    });
  }, [loadTimings]);

  const restart = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setPos({ reached: 0, speaking: -1 });
    if (audio.paused) toggle();
  }, [toggle]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlaying = () => setStatus("playing");
    const onWaiting = () => setStatus("loading");
    const onPause = () => {
      if (!audio.ended) setStatus("paused");
      measure();
    };
    const onEnded = () => {
      setStatus("ended");
      setPos({ reached: spansRef.current?.length ?? 0, speaking: -1 });
      if (active === audio) active = null;
    };
    const onError = () => setStatus("error");
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.pause();
      if (active === audio) active = null;
    };
  }, [measure]);

  // Follow the voice only while it plays; state changes only when a turn
  // boundary is crossed, not on every frame.
  useEffect(() => {
    if (status !== "playing") return;
    let frame = 0;
    const tick = () => {
      measure();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [status, measure]);

  return {
    audioRef,
    src,
    status,
    sync,
    /** Turns whose voice has started (all of them once the clip has ended). */
    reached: pos.reached,
    /** The turn speaking right now, or -1. */
    speaking: status === "playing" ? pos.speaking : -1,
    /** Playing, or about to: the control's pressed state. */
    active: status === "playing" || status === "loading",
    toggle,
    restart,
  };
}

/**
 * Media glyphs, drawn in the site's stroke language. Media controls are never
 * mirrored in RTL: play points right in both directions.
 */
export function MediaGlyph({
  name,
  size = 16,
  className = "",
}: {
  name: "play" | "pause" | "replay";
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {name === "play" && (
        <path d="M8 5.9v12.2a.9.9 0 0 0 1.37.77l9.6-6.1a.9.9 0 0 0 0-1.53l-9.6-6.1A.9.9 0 0 0 8 5.9Z" fill="currentColor" />
      )}
      {name === "pause" && <path d="M9 6v12M15 6v12" strokeWidth={2.6} />}
      {name === "replay" && <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4v3.2h3.2" />}
    </svg>
  );
}
