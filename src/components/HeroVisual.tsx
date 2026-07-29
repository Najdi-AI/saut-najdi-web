"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import { AnimatedIcon } from "./icons";

/**
 * The brand-guideline hero visual (p18): a Saudi professional at a laptop
 * carrying the Saut Najdi logo, with the mockup's floating conversation
 * rebuilt as live animated elements. The photo is official brand imagery
 * extracted from the guideline PDF; bubbles float over its blank zone
 * (physical left of the photo), so positions are physical, not logical.
 */

const t = {
  ar: {
    alt: "موظف سعودي يبتسم أمام جهاز لابتوب يحمل شعار صوت نجدي",
    agent: "هلا! كيف أقدر أساعدك؟",
    caller: "أبغى أحجز موعد بكرة",
  },
  en: {
    alt: "A smiling Saudi professional at a laptop carrying the Saut Najdi logo",
    agent: "Hello! How can I help?",
    caller: "I'd like to book for tomorrow",
  },
} as const;

export function HeroVisual({ locale }: { locale: Locale }) {
  const reduced = useReducedMotion();
  const s = t[locale];

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

  return (
    <div className="relative mx-auto w-full max-w-[440px] lg:max-w-[520px]">
      <Image
        src="/brand/hero-person.jpg"
        alt={s.alt}
        width={1161}
        height={1160}
        priority
        sizes="(min-width: 1024px) 40vw, 90vw"
        className="w-full [mask-image:linear-gradient(to_bottom,black_88%,transparent_100%)]"
      />

      {/* Agent voice-note bubble */}
      <motion.div {...enter(0.3)} className="absolute left-[1%] top-[10%]">
        <motion.div
          {...float(0.3, 4.2)}
          dir="rtl"
          className="flex items-center gap-2.5 rounded-2xl rounded-br-md border border-line bg-white/95 px-4 py-2.5 shadow-card-hover backdrop-blur"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gradient-soft text-brand-blue">
            <AnimatedIcon name="wave" size={18} delay={0.5} />
          </span>
          <span className="text-body font-medium text-ink" dir="auto">
            {s.agent}
          </span>
        </motion.div>
      </motion.div>

      {/* Caller bubble */}
      <motion.div {...enter(0.55)} className="absolute left-0 top-[41%]">
        <motion.div
          {...float(1.1, 4.8)}
          dir="rtl"
          className="flex items-center gap-2.5 rounded-2xl rounded-bl-md bg-ink px-4 py-2.5 shadow-card-hover"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
            <AnimatedIcon name="human" size={16} delay={0.75} />
          </span>
          <span className="text-body font-medium text-white" dir="auto">
            {s.caller}
          </span>
        </motion.div>
      </motion.div>

      {/* Pulsing mic button */}
      <motion.div {...enter(0.8)} className="absolute left-[4%] top-[56%]">
        <motion.div {...float(1.8, 5.4)} className="relative">
          {!reduced && (
            <>
              <span aria-hidden className="absolute inset-0 animate-pulse-ring rounded-full bg-brand-blue/25" />
              <span
                aria-hidden
                className="absolute inset-0 animate-pulse-ring rounded-full bg-brand-magenta/20"
                style={{ animationDelay: "0.9s" }}
              />
            </>
          )}
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand-gradient text-white shadow-card-hover">
            <AnimatedIcon name="mic" size={26} delay={1} strokeWidth={2} />
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
