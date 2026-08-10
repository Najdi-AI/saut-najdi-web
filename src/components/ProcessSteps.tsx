"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AnimatedIcon, type IconName } from "./icons";
import type { Locale } from "@/lib/i18n";

/**
 * The «كيف يشتغل؟» process: icon nodes joined by connectors that fill
 * phase-to-phase, with a pulse travelling along each segment — showing the
 * call being handed from stage to stage. RTL-aware via logical classes.
 *
 * Two layouts, because one does not survive both widths. DESKTOP keeps the
 * four-across row with horizontal connectors. MOBILE is a timeline: the icon
 * sits in its own narrow column with the connector running down it, and the
 * text sits beside it. The previous mobile layout centred the text under the
 * icon with the connector running full-height down the same centre line, so
 * the gradient rule drew straight through the middle of short titles
 * («ينفذ») — unreadable, and unfixable by nudging, because the collision is
 * structural: a vertical line and centred text cannot share one axis.
 * Putting the line beside the text removes the axis they were fighting over,
 * and it matches the /how-it-works JourneySteps timeline the visitor meets
 * one click later.
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
      /* Mobile: no row gap — each step's own pb-8 makes the spacing, so the
         connector can run unbroken from one node to the next. */
      className="relative mt-12 grid gap-0 md:grid-cols-4 md:gap-6"
      initial={reduced ? undefined : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {steps.map((step, i) => (
        <li
          key={step.title}
          className="relative flex gap-4 text-start md:flex-col md:items-center md:gap-0 md:text-center"
        >
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

          {/* Icon column — on mobile the connector lives INSIDE it, beside the
              text rather than behind it. flex-1 stretches the rule to the next
              node however tall this step's copy runs. */}
          <div className="flex shrink-0 flex-col items-center md:contents">
            <motion.span
              className="ring-spectrum relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-brand-purple shadow-card"
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
            {i < steps.length - 1 && (
              <motion.span
                aria-hidden
                className="mt-2 w-0.5 flex-1 origin-top rounded-full bg-brand-gradient md:hidden"
                variants={{
                  hidden: { scaleY: 0 },
                  show: {
                    scaleY: 1,
                    transition: { duration: 0.5, delay: STAGE * i + 0.45, ease: "easeInOut" },
                  },
                }}
              />
            )}
          </div>

          <motion.div
            className="min-w-0 flex-1 pb-8 md:mt-4 md:max-w-[240px] md:flex-none md:pb-0"
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
