"use client";

import { motion } from "framer-motion";
import { AnimatedIcon, type IconName } from "./icons";
import { useReducedMotionAfterHydration } from "./useReducedMotionAfterHydration";
import type { Locale } from "@/lib/i18n";

/**
 * The /how-it-works journey: seven steps on Try 3's day timeline — a 4px
 * Silver Gray rail with a square Charcoal marker at each step. Each step
 * rises into place as it scrolls into view and its line icon draws itself;
 * a plain ease-out, no spring.
 *
 * Under reduced motion it hydrates the server's hidden frame, then lands on
 * the end state at once (after hydration, so the trees still match). Every
 * step carries data-reveal, which the no-JavaScript sheet shows at rest
 * (NoScriptReveal).
 */

const STEP_ICONS: IconName[] = ["phone", "wave", "chat", "mic", "calendar", "human", "chart"];

export function JourneySteps({
  steps,
  locale,
}: {
  steps: readonly { title: string; body: string }[];
  locale: Locale;
}) {
  const reduced = useReducedMotionAfterHydration();

  return (
    <ol className="mx-auto max-w-2xl">
      {steps.map((step, i) => (
        /* The HowTo JSON-LD points each step at #step-N, so the anchor has
           to exist; the site-wide scroll-padding-top clears the sticky
           header when it lands. The id sits on this untransformed item, so
           the 16px entrance inside it can't move the target after a jump. */
        <li key={step.title} id={`step-${i + 1}`} className="group">
          <motion.div
            data-reveal=""
            className="relative pb-10 ps-10 before:absolute before:inset-y-0 before:start-1 before:w-1 before:bg-silver-gray after:absolute after:start-0 after:top-2 after:size-3 after:bg-charcoal group-last-of-type:pb-0 group-last-of-type:before:bottom-auto group-last-of-type:before:h-4"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={reduced ? { opacity: 1, y: 0 } : undefined}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={reduced ? { duration: 0 } : { duration: 0.45, ease: "easeOut" }}
          >
            <h2 className="flex items-center gap-3 text-h4">
              <span className="shrink-0 text-ink">
                <AnimatedIcon name={STEP_ICONS[i]} size={24} delay={0.15} />
              </span>
              {step.title}
            </h2>
            <p className="mt-2 text-body-lg leading-relaxed text-ink/75">{step.body}</p>
          </motion.div>
        </li>
      ))}
      <span className="sr-only">
        {locale === "ar" ? "سبع مراحل متتابعة للمكالمة" : "Seven sequential call stages"}
      </span>
    </ol>
  );
}
