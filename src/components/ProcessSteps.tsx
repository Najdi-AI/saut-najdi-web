"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AnimatedIcon, type IconName } from "./icons";
import type { Locale } from "@/lib/i18n";

/**
 * The «كيف يشتغل؟» process: icon nodes joined by connectors that fill
 * phase-to-phase, with a pulse travelling along each segment — showing the
 * call being handed from stage to stage. RTL-aware via logical classes.
 */

const STEP_ICONS: IconName[] = ["phone", "chat", "calendar", "human"];
const STAGE = 0.85; // seconds per stage

export function ProcessSteps({
  steps,
  locale,
}: {
  steps: readonly { title: string; body: string }[];
  locale: Locale;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.ol
      className="relative mt-12 grid gap-10 md:grid-cols-4 md:gap-6"
      initial={reduced ? undefined : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {steps.map((step, i) => (
        <li key={step.title} className="relative flex flex-col items-center text-center md:items-center">
          {/* Connector to the next step (desktop) — fills after this stage */}
          {i < steps.length - 1 && (
            <motion.span
              aria-hidden
              className="absolute top-7 hidden h-0.5 w-full origin-left rounded-full bg-brand-gradient rtl:origin-right md:block"
              style={{ insetInlineStart: "50%" }}
              variants={{
                hidden: { scaleX: 0 },
                show: {
                  scaleX: 1,
                  transition: { duration: 0.5, delay: STAGE * i + 0.45, ease: "easeInOut" },
                },
              }}
            />
          )}
          {/* Connector (mobile, vertical) */}
          {i < steps.length - 1 && (
            <motion.span
              aria-hidden
              className="absolute top-14 h-[calc(100%+1rem)] w-0.5 origin-top rounded-full bg-brand-gradient md:hidden"
              variants={{
                hidden: { scaleY: 0 },
                show: {
                  scaleY: 1,
                  transition: { duration: 0.5, delay: STAGE * i + 0.45, ease: "easeInOut" },
                },
              }}
            />
          )}

          {/* Icon node */}
          <motion.span
            className="ring-spectrum relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl text-brand-purple shadow-card"
            variants={{
              hidden: { scale: 0.6, opacity: 0 },
              show: {
                scale: 1,
                opacity: 1,
                transition: { type: "spring", stiffness: 260, damping: 18, delay: STAGE * i },
              },
            }}
          >
            <AnimatedIcon name={STEP_ICONS[i]} size={26} delay={STAGE * i + 0.15} />
            {/* Handoff pulse ring when this stage receives the call */}
            {!reduced && (
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-2xl border-2 border-brand-blue/50"
                variants={{
                  hidden: { opacity: 0, scale: 1 },
                  show: {
                    opacity: [0, 0.8, 0],
                    scale: [1, 1.45, 1.6],
                    transition: { duration: 0.9, delay: STAGE * i + 0.05, ease: "easeOut" },
                  },
                }}
              />
            )}
          </motion.span>

          <motion.div
            className="mt-4 max-w-[240px]"
            variants={{
              hidden: { opacity: 0, y: 10 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.4, delay: STAGE * i + 0.2 },
              },
            }}
          >
            <h3 className="text-h5">{step.title}</h3>
            <p className="mt-1.5 text-body leading-relaxed text-ink/70">{step.body}</p>
          </motion.div>
        </li>
      ))}
      <span className="sr-only">
        {locale === "ar" ? "أربع مراحل متتابعة للمكالمة" : "Four sequential call stages"}
      </span>
    </motion.ol>
  );
}
