"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotionAfterHydration } from "./useReducedMotionAfterHydration";

/**
 * Scroll-entrance wrapper (blueprint §7). The copy is always in the
 * server-rendered HTML — this only animates it after hydration, and
 * respects prefers-reduced-motion: it hydrates the server's hidden frame,
 * then lands at its end state at once. It stays one motion.div either way,
 * so the children are never remounted (a lazy figure keeps its drawing).
 * data-reveal lets the no-JavaScript sheet show it (NoScriptReveal).
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotionAfterHydration();
  return (
    <motion.div
      className={className}
      data-reveal=""
      initial={reduced ? false : { opacity: 0, y: 18 }}
      animate={reduced ? { opacity: 1, y: 0 } : undefined}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={reduced ? { duration: 0 } : { duration: 0.45, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
