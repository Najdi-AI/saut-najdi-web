"use client";

import { useId } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import { AnimatedIcon } from "./icons";
import { MediaGlyph, useVoiceClip, type ClipTimings } from "./VoiceClip";

/**
 * The brand-guideline hero visual (p18): a Saudi professional at a laptop
 * carrying the Saut Najdi logo, with the mockup's floating conversation
 * rebuilt as live animated elements. The photo is official brand imagery
 * extracted from the guideline PDF; bubbles float over its blank zone
 * (physical left of the photo), so positions are physical, not logical.
 *
 * The mic is a real control: it plays the conversation in the product's own
 * agent voice (public/audio/home-hero.m4a). The two bubbles light up as
 * their line is spoken and the agent's answer arrives beside the mic, so
 * every spoken line has its words on screen. The clip is Arabic on both
 * locales; the English caption says so.
 */

const t = {
  ar: {
    alt: "موظف سعودي يبتسم أمام جهاز لابتوب يحمل شعار صوت نجدي",
    agent: "هلا! كيف أقدر أساعدك؟",
    caller: "أبغى أحجز موعد بكرة",
    reply: "أبشر! بكرة عندنا الساعة 4:30 العصر، يناسبك؟",
    play: "اسمع وكيل صوت نجدي",
    caption: "حوار توضيحي بصوت وكيل صوت نجدي",
    error: "ما قدرنا نشغّل الصوت — جرّب مرة ثانية",
  },
  en: {
    alt: "A smiling Saudi professional at a laptop carrying the Saut Najdi logo",
    agent: "Hello! How can I help?",
    caller: "I'd like to book for tomorrow",
    reply: "Sure! Tomorrow at 4:30 PM is open. Does that suit you?",
    play: "Hear the Saut Najdi agent",
    caption: "An illustrative call in the Saut Najdi agent's voice, in Arabic",
    error: "The audio could not play. Try again.",
  },
} as const;

/** agent greeting, caller, agent answer: one span per spoken line. */
const heroSpans = (timings: ClipTimings) => timings.turns.slice(0, 3);

export function HeroVisual({ locale }: { locale: Locale }) {
  const reduced = useReducedMotion();
  const s = t[locale];
  const captionId = useId();
  const clip = useVoiceClip("home-hero", heroSpans);
  const answered = clip.sync === "failed" ? clip.status !== "idle" && clip.status !== "error" : clip.reached >= 3;

  const float = (delay: number, duration: number) =>
    reduced
      ? {}
      : {
          animate: { y: [0, -7, 0] },
          transition: { duration, delay, repeat: Infinity, ease: "easeInOut" as const },
        };

  const enter = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, scale: 0.85, y: 12 },
          whileInView: { opacity: 1, scale: 1, y: 0 },
          viewport: { once: true },
          transition: { type: "spring" as const, stiffness: 220, damping: 20, delay },
        };

  // The line being spoken gets a ring, so the voice has a place on screen.
  const speakingRing = (i: number) =>
    clip.speaking === i ? "ring-2 ring-brand-blue/55" : "ring-0 ring-transparent";

  return (
    <figure className="relative mx-auto w-full max-w-[440px] lg:max-w-[520px]">
      <div className="relative">
        {/* Dark only: a pool of brand light under the subject. The cut-out is
            transparent at the top but fully opaque across the desk, so on night
            it would otherwise read as a lit photo pasted onto black. The glow
            gives that light somewhere to come from; `.hero-photo` in globals.css
            dissolves the hard bottom edge into the ground. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden dark:block"
          style={{
            background:
              "radial-gradient(52% 42% at 54% 52%, rgba(91,108,229,0.30) 0%, transparent 72%)",
            filter: "blur(26px)",
          }}
        />
        <Image
          src="/brand/hero-man.webp"
          alt={s.alt}
          width={1100}
          height={900}
          priority
          sizes="(min-width: 1024px) 40vw, 90vw"
          className="hero-photo relative w-full"
        />

        {/* Agent voice-note bubble */}
        <motion.div {...enter(0.3)} className="absolute left-[1%] top-[10%]">
          <motion.div
            {...float(0.3, 4.2)}
            dir="rtl"
            className={`flex items-center gap-2.5 rounded-2xl rounded-br-md border border-line bg-surface/95 px-4 py-2.5 shadow-card-hover backdrop-blur transition-shadow duration-200 ${speakingRing(0)}`}
          >
            <span className="ring-spectrum flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-brand-purple dark:text-brand-cyan">
              <AnimatedIcon name="wave" size={16} delay={0.5} />
            </span>
            <span className="text-body font-medium text-ink" dir="auto">
              {s.agent}
            </span>
          </motion.div>
        </motion.div>

        {/* Caller bubble. The two bubbles are a light/dark pair — that contrast
            is what makes them read as two speakers — so on night the pair
            inverts wholesale rather than both going dark and merging. */}
        <motion.div {...enter(0.55)} className="absolute left-0 top-[41%]">
          <motion.div
            {...float(1.1, 4.8)}
            dir="rtl"
            className={`flex items-center gap-2.5 rounded-2xl rounded-bl-md bg-ink px-4 py-2.5 shadow-card-hover transition-shadow duration-200 ${speakingRing(1)}`}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-canvas/15 text-canvas">
              <AnimatedIcon name="human" size={16} delay={0.75} />
            </span>
            <span className="text-body font-medium text-canvas" dir="auto">
              {s.caller}
            </span>
          </motion.div>
        </motion.div>

        {/* The mic — outline style: spectrum ring, stroke icon (no gradient
            fill — owner rule). A real button now: it plays the clip, and the
            pulse runs only while the voice does. The agent's answer arrives
            beside it, on the physical right, in both locales. */}
        <motion.div {...enter(0.8)} className="absolute left-[4%] top-[54%]">
          <motion.div {...float(1.8, 5.4)} dir="ltr" className="flex items-center gap-3">
            <div className="relative shrink-0">
              {clip.status === "playing" && !reduced && (
                <>
                  <span aria-hidden className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-brand-blue/40" />
                  <span
                    aria-hidden
                    className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-brand-magenta/30"
                    style={{ animationDelay: "0.9s" }}
                  />
                </>
              )}
              <button
                type="button"
                onClick={clip.toggle}
                aria-label={s.play}
                aria-pressed={clip.active}
                aria-describedby={captionId}
                aria-busy={clip.status === "loading"}
                className="ring-spectrum group relative flex h-16 w-16 items-center justify-center rounded-full text-brand-purple shadow-card-hover transition-transform duration-200 hover:scale-105 active:scale-95 motion-reduce:hover:scale-100 motion-reduce:active:scale-100 dark:text-brand-cyan"
              >
                <AnimatedIcon name="mic" size={26} delay={1} strokeWidth={1.8} />
                {/* What pressing does: play, or pause while it speaks. */}
                <span
                  aria-hidden
                  className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-canvas shadow-card ring-2 ring-surface"
                >
                  <MediaGlyph name={clip.active ? "pause" : "play"} size={12} />
                </span>
              </button>
            </div>

            <motion.div
              dir="rtl"
              aria-hidden={!answered}
              initial={false}
              animate={answered ? { opacity: 1, x: 0, scale: 1 } : reduced ? { opacity: 0 } : { opacity: 0, x: -14, scale: 0.92 }}
              transition={
                answered && !reduced
                  ? { type: "spring", stiffness: 260, damping: 24 }
                  : { duration: 0.2, ease: "easeOut" }
              }
              style={{ transformOrigin: "left center" }}
              // Capped by the viewport too: on a 320px phone the bubble must end
              // inside the container (gutter + mic + gap is about 8.5rem).
              className={`pointer-events-none flex max-w-[min(15rem,calc(100vw-8.5rem))] items-center gap-2.5 rounded-2xl rounded-bl-md border border-line bg-surface/95 px-4 py-2.5 shadow-card-hover backdrop-blur transition-shadow duration-200 sm:max-w-[17rem] ${speakingRing(2)}`}
            >
              <span className="ring-spectrum flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-brand-purple dark:text-brand-cyan">
                <AnimatedIcon name="wave" size={16} />
              </span>
              <span className="text-body font-medium text-ink" dir="auto">
                {s.reply}
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Under the photo rather than over it, so it never covers the laptop
          logo on a phone; held to the physical left, under the mic, in both
          locales (end in RTL, start in LTR). */}
      <figcaption
        id={captionId}
        className={`mt-2 text-ink/70 dark:text-white/70 ${
          locale === "ar" ? "pe-[4%] text-end text-body" : "ps-[4%] text-start text-body-sm"
        }`}
      >
        {s.caption}
        <span role="status" className="block font-medium text-brand-magenta">
          {clip.status === "error" ? s.error : ""}
        </span>
      </figcaption>

      <audio ref={clip.audioRef} src={clip.src} preload="none" />
    </figure>
  );
}
