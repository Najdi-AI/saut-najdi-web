"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AnimatedIcon, type IconName } from "./icons";
import type { Locale } from "@/lib/i18n";

/**
 * The /how-it-works journey: seven outline icon nodes on a vertical
 * timeline, animated like the homepage «كيف يشتغل؟» flow — each step's
 * node pops in as it scrolls into view, its icon draws itself, a handoff
 * pulse fires, and the connector fills down to the next stage. Outline
 * icons only — no gradient fills (owner rule).
 */

const STEP_ICONS: IconName[] = ["phone", "wave", "chat", "mic", "calendar", "human", "chart"];

export function JourneySteps({
  steps,
  locale,
}: {
  steps: readonly { title: string; body: string }[];
  locale: Locale;
}) {
  const reduced = useReducedMotion();

  return (
    <ol className="mx-auto max-w-2xl">
      {steps.map((step, i) => (
        <motion.li
          key={step.title}
          /* The HowTo JSON-LD points each step at #step-N, so the anchor has
             to exist; scroll-mt clears the sticky header when it lands. */
          id={`step-${i + 1}`}
          className="relative flex scroll-mt-28 gap-5"
          initial={reduced ? undefined : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          {/* Node + connector column */}
          <div className="flex flex-col items-center">
            <motion.span
              className="ring-spectrum relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-brand-purple shadow-card"
              variants={{
                hidden: { scale: 0.6, opacity: 0 },
                show: {
                  scale: 1,
                  opacity: 1,
                  transition: { type: "spring", stiffness: 260, damping: 18 },
                },
              }}
            >
              <AnimatedIcon name={STEP_ICONS[i]} size={26} delay={0.15} />
              {!reduced && (
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-2xl border-2 border-brand-blue/50"
                  variants={{
                    hidden: { opacity: 0, scale: 1 },
                    show: {
                      opacity: [0, 0.8, 0],
                      scale: [1, 1.45, 1.6],
                      transition: { duration: 0.9, delay: 0.1, ease: "easeOut" },
                    },
                  }}
                />
              )}
            </motion.span>
            {i < steps.length - 1 && (
              <motion.span
                aria-hidden
                className="w-0.5 flex-1 origin-top rounded-full bg-brand-gradient"
                variants={{
                  hidden: { scaleY: 0 },
                  show: {
                    scaleY: 1,
                    transition: { duration: 0.6, delay: 0.35, ease: "easeInOut" },
                  },
                }}
              />
            )}
          </div>

          {/* Step card */}
          <motion.div
            className={`card min-w-0 flex-1 ${i < steps.length - 1 ? "mb-6" : ""}`}
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0, transition: { duration: 0.45, delay: 0.15 } },
            }}
          >
            <h2 className="text-h4">{step.title}</h2>
            <p className="mt-2 text-body-lg leading-relaxed text-ink/75">{step.body}</p>
          </motion.div>
        </motion.li>
      ))}
      <span className="sr-only">
        {locale === "ar" ? "سبع مراحل متتابعة للمكالمة" : "Seven sequential call stages"}
      </span>
    </ol>
  );
}
