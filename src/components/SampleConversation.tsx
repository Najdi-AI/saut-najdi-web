"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import { MediaGlyph, useVoiceClip, type ClipTimings, type Span } from "./VoiceClip";

/**
 * The genuinely interactive module (blueprint §7): a sample call played
 * as chat bubbles with an escalation moment. All text is server-rendered;
 * motion only reveals it in sequence. Content is illustrative dialogue,
 * clearly presented as an example — no metrics, no real customer data.
 *
 * It can also be heard: «اسمع المكالمة» plays the call in generated voices
 * (public/audio/clinic-call.m4a, the product's agent voice for the agent),
 * and the bubbles follow it — each one sharpens into focus as its line is
 * spoken, and the escalation card lands on the chime. Without playing, the
 * scroll reveal is unchanged. The audio is Arabic on both locales.
 */

type Turn =
  | { who: "caller" | "agent"; text: string }
  | { who: "handoff"; title: string; lines: string[] }
  | { who: "human"; text: string };

type Copy = {
  title: string;
  note: string;
  play: string;
  pause: string;
  resume: string;
  again: string;
  restart: string;
  error: string;
  turns: Turn[];
};

const script: Record<Locale, Copy> = {
  ar: {
    title: "مثال: مكالمة عيادة… وفيها لحظة تصعيد",
    note: "حوار توضيحي بأصوات مولّدة — هذا شكل المكالمة، مو تسجيل حقيقي.",
    play: "اسمع المكالمة",
    pause: "إيقاف مؤقت",
    resume: "كمّل المكالمة",
    again: "اسمعها مرة ثانية",
    restart: "من البداية",
    error: "ما قدرنا نشغّل الصوت — جرّب مرة ثانية.",
    turns: [
      { who: "caller", text: "السلام عليكم، أبغى أحجز موعد أسنان بكرة." },
      { who: "agent", text: "هلا وغلا! أبشر. بكرة عندنا فاضي الساعة 4:30 العصر — يناسبك؟" },
      { who: "caller", text: "يناسبني. بس عندي سؤال عن ألم بعد حشوة سويتها عندكم…" },
      {
        who: "handoff",
        title: "سؤال طبي — تصعيد فوري لموظف بشري",
        lines: ["النص الكامل للمكالمة", "ملخص: حجز 4:30 + سؤال عن ألم بعد حشوة", "تاريخ العميل عندكم"],
      },
      { who: "human", text: "معك أحمد من العيادة، قريت ملخص كلامك — خلني أطمنك على موضوع الحشوة…" },
    ],
  },
  en: {
    title: "Example: a clinic call — with an escalation moment",
    note: "Illustrative dialogue in generated voices, spoken in Arabic — this is what a call looks like, not a real recording.",
    play: "Hear the call (in Arabic)",
    pause: "Pause",
    resume: "Resume the call",
    again: "Hear it again",
    restart: "From the start",
    error: "The audio could not play. Try again.",
    turns: [
      { who: "caller", text: "Hi, I'd like to book a dental appointment for tomorrow." },
      { who: "agent", text: "Of course! Tomorrow we have 4:30 PM free — does that work?" },
      { who: "caller", text: "Works. But I have a question about pain after a filling you did…" },
      {
        who: "handoff",
        title: "Medical question — instant escalation to a human",
        lines: ["Full call transcript", "Summary: 4:30 booking + post-filling pain question", "The caller's history with you"],
      },
      { who: "human", text: "This is Ahmed from the clinic — I've read the summary. Let me put your mind at ease about that filling…" },
    ],
  },
};

/**
 * The five bubbles against the clip: caller, agent, caller, the escalation
 * card on the chime (it holds until Ahmed speaks), then Ahmed. An unexpected
 * shape returns nothing, which shows every bubble rather than a wrong sync.
 */
const callSpans = (timings: ClipTimings): Span[] => {
  const [a, b, c, d] = timings.turns;
  if (!a || !b || !c || !d || timings.escalationMs === undefined) return [];
  return [a, b, c, { startMs: timings.escalationMs, endMs: d.startMs }, d];
};

/** Natural deceleration for arrivals (impeccable animate: confident arrival). */
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export function SampleConversation({ locale }: { locale: Locale }) {
  const reduced = useReducedMotion() ?? false;
  const s = script[locale];
  const listRef = useRef<HTMLDivElement>(null);
  const inView = useInView(listRef, { once: true, margin: "-40px" });
  const clip = useVoiceClip("clinic-call", callSpans);
  const playRef = useRef<HTMLButtonElement>(null);
  const restartRef = useRef<HTMLButtonElement>(null);
  const showRestart = clip.status === "playing" || clip.status === "paused" || clip.status === "loading";

  // The restart control leaves when the call ends or fails. If it holds
  // focus, hand focus to the play button during the audio event itself,
  // while the restart button is still in the page, so focus never falls
  // to the body (React re-renders only after this handler returns).
  useEffect(() => {
    const audio = clip.audioRef.current;
    if (!audio) return;
    const handOff = () => {
      if (restartRef.current && document.activeElement === restartRef.current) {
        playRef.current?.focus({ preventScroll: true });
      }
    };
    audio.addEventListener("ended", handOff);
    audio.addEventListener("error", handOff);
    return () => {
      audio.removeEventListener("ended", handOff);
      audio.removeEventListener("error", handOff);
    };
  }, [clip.audioRef]);

  // Following the voice once the visitor has pressed play, unless the
  // timings could not be read (then the audio plays over the full call).
  const following = clip.status !== "idle" && clip.status !== "error" && clip.sync !== "failed";

  const variants: Variants = {
    hidden: reduced ? { opacity: 1 } : { opacity: 0, y: 14, scale: 0.98, filter: "blur(0px)" },
    shown: (i: number) =>
      reduced
        ? { opacity: 1, transition: { duration: 0.2 } }
        : {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            transition: following
              ? { duration: 0.45, ease: EASE_OUT }
              : { duration: 0.4, delay: i * 0.5, ease: "easeOut" },
          },
    // Not yet spoken: still there, out of focus, so the call keeps its shape.
    pending: reduced
      ? { opacity: 0.2, transition: { duration: 0.2 } }
      : { opacity: 0.16, y: 0, scale: 1, filter: "blur(3px)", transition: { duration: 0.25, ease: "easeOut" } },
  };

  const stateOf = (i: number) => (following ? (i < clip.reached ? "shown" : "pending") : inView ? "shown" : "hidden");
  const label =
    clip.status === "playing" || clip.status === "loading"
      ? s.pause
      : clip.status === "paused"
        ? s.resume
        : clip.status === "ended"
          ? s.again
          : s.play;
  const landed = following && clip.reached > 3;

  return (
    <div className="mx-auto max-w-xl">
      <h3 className="text-center text-h4">{s.title}</h3>

      {/* The restart control hangs off the inline end, absolutely placed, so
          it never pushes the play/pause button out from under the cursor. */}
      <div className="mt-4 flex justify-center">
        <div className="relative">
          <button
            ref={playRef}
            type="button"
            onClick={clip.toggle}
            aria-busy={clip.status === "loading"}
            className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface py-1.5 pe-5 ps-1.5 text-body-lg font-medium text-ink shadow-card transition-colors duration-200 hover:border-brand-blue/60 hover:text-brand-blue"
          >
            <span className="ring-spectrum flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-brand-purple dark:text-brand-cyan">
              <MediaGlyph name={clip.active ? "pause" : "play"} size={14} />
            </span>
            {label}
          </button>
          {showRestart && (
            <button
              ref={restartRef}
              type="button"
              onClick={clip.restart}
              aria-label={s.restart}
              title={s.restart}
              className="absolute start-full top-1/2 ms-2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-ink/75 transition-colors duration-200 hover:bg-surface hover:text-brand-blue"
            >
              <MediaGlyph name="replay" size={18} />
            </button>
          )}
        </div>
      </div>

      <div ref={listRef} className="mt-6 space-y-3">
        {s.turns.map((turn, i) => {
          const motionProps = {
            custom: i,
            variants,
            initial: reduced ? false : ("hidden" as const),
            animate: stateOf(i),
          };
          const speaking = clip.speaking === i;
          if (turn.who === "handoff") {
            return (
              <motion.div
                key={i}
                {...motionProps}
                className="relative rounded-2xl border-2 border-brand-blue/30 bg-brand-gradient-soft p-4"
              >
                {/* Lands on the chime: one ring flash, opacity only. */}
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute -inset-0.5 rounded-2xl border-2 border-brand-blue"
                  initial={false}
                  animate={landed ? { opacity: [0, 1, 0] } : { opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
                <p className="flex items-center gap-2 text-body-lg font-bold text-brand-purple">
                  <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden fill="none" className="shrink-0">
                    <path d="M10 3v8m0 0l-3-3m3 3l3-3M4 15h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {turn.title}
                </p>
                <ul className="mt-2 space-y-1">
                  {turn.lines.map((l) => (
                    <li key={l} className="flex items-center gap-2 text-body text-ink/70">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-blue" aria-hidden />
                      {l}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          }
          const isCaller = turn.who === "caller";
          return (
            <motion.div key={i} {...motionProps} className={`flex ${isCaller ? "justify-start" : "justify-end"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-body-lg leading-relaxed shadow-card transition-shadow duration-200 ${
                  speaking ? "ring-2 ring-brand-blue/55" : "ring-0 ring-transparent"
                } ${
                  isCaller
                    ? "rounded-es-md bg-surface text-ink"
                    : turn.who === "human"
                      ? "rounded-ee-md bg-brand-purple text-canvas"
                      : "rounded-ee-md bg-ink text-canvas"
                }`}
              >
                {/* Both non-caller bubbles sit on grounds that go LIGHT on
                    night — bg-ink inverts, and brand-purple lightens so the
                    icon hues stay legible — so both labels use text-canvas,
                    which is near-white on day and near-black on night.
                    14px at 85%: the critique found 12px at 55-60% too faint
                    for Arabic (now about 5.4:1 on purple, 12.6:1 on ink by
                    day, 5.9:1 on the lightened purple by night). */}
                {turn.who !== "caller" && (
                  <span className="mb-1 block text-body font-medium text-canvas/85">
                    {turn.who === "human"
                      ? locale === "ar" ? "موظفك" : "Your employee"
                      : locale === "ar" ? "وكيل صوت نجدي" : "Saut Najdi agent"}
                  </span>
                )}
                {turn.text}
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="mt-4 text-center text-body text-ink/70">{s.note}</p>
      <p role="status" className="mt-1 text-center text-body font-medium text-brand-magenta">
        {clip.status === "error" ? s.error : ""}
      </p>
      <audio ref={clip.audioRef} src={clip.src} preload="none" />
    </div>
  );
}
