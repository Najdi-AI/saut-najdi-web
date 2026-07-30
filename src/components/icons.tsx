"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * The site-wide animated icon system: consistent 24×24 stroke icons whose
 * paths draw themselves on first view (framer-motion pathLength), matching
 * the brand's line-icon language. Static under prefers-reduced-motion.
 */

const ICONS: Record<string, string[]> = {
  phone: [
    "M4.5 5.2c0-.9.8-1.7 1.7-1.7h2.1c.4 0 .8.3.9.7l1 3.3c.1.4 0 .8-.3 1l-1.6 1.3a12.8 12.8 0 0 0 5.9 5.9l1.3-1.6c.2-.3.6-.4 1-.3l3.3 1c.4.1.7.5.7.9v2.1c0 .9-.8 1.7-1.7 1.7C10.9 19.5 4.5 13.1 4.5 5.2z",
  ],
  chat: [
    "M12 20.5a8.5 8.5 0 1 0-7.6-4.7L3 20.5l4.7-1.4a8.5 8.5 0 0 0 4.3 1.4z",
    "M8.5 10.5v2",
    "M12 9v5",
    "M15.5 10.5v2",
  ],
  calendar: [
    "M5 6.5h14a1.5 1.5 0 0 1 1.5 1.5v11a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19V8A1.5 1.5 0 0 1 5 6.5z",
    "M8 4v4",
    "M16 4v4",
    "M3.5 11h17",
    "m9.5 15.5 1.8 1.8 3.4-3.4",
  ],
  human: [
    "M12 8a2.75 2.75 0 1 0 0-5.5A2.75 2.75 0 0 0 12 8z",
    "M6.5 20.5a5.5 5.5 0 0 1 11 0",
    "M3 11.5h4",
    "m5.5 9.5 2 2-2 2",
  ],
  shield: [
    "M12 3.5l6.5 2.6v4.6c0 4.2-2.8 7.2-6.5 8.3-3.7-1.1-6.5-4.1-6.5-8.3V6.1L12 3.5z",
    "m9.5 11.5 2 2 3.5-3.5",
  ],
  database: [
    "M12 3.5c3.6 0 6.5 1.1 6.5 2.5S15.6 8.5 12 8.5 5.5 7.4 5.5 6 8.4 3.5 12 3.5z",
    "M5.5 6v12c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5V6",
    "M5.5 12c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5",
  ],
  lock: [
    "M6.5 10.5h11a1 1 0 0 1 1 1V19a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19v-7.5a1 1 0 0 1 1-1z",
    "M8.5 10.5V7a3.5 3.5 0 0 1 7 0v3.5",
    "M12 14.5v2.5",
  ],
  people: [
    "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    "M3.5 19.5a5.5 5.5 0 0 1 11 0",
    "M15.5 5.4a3 3 0 0 1 0 5.2",
    "M17.5 14.6a5.5 5.5 0 0 1 3 4.9",
  ],
  wave: [
    "M4 10.5v3",
    "M7.5 8v8",
    "M11 5v14",
    "M14.5 8.5v7",
    "M18 10v4",
    "M21 11v2",
  ],
  mail: [
    "M4.5 5.5h15A1.5 1.5 0 0 1 21 7v10a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17V7a1.5 1.5 0 0 1 1.5-1.5z",
    "m4 7.5 8 5.5 8-5.5",
  ],
  check: ["m5 12.5 4.5 4.5L19 7.5"],
  clock: [
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
    "M12 7.5V12l3 2",
  ],
  doc: [
    "M7.5 3.5H14l4.5 4.5V19a1.5 1.5 0 0 1-1.5 1.5H7.5A1.5 1.5 0 0 1 6 19V5a1.5 1.5 0 0 1 1.5-1.5z",
    "M14 3.5V8h4.5",
    "M9.5 12.5h5",
    "M9.5 16h5",
  ],
  mic: [
    "M12 3.5A2.5 2.5 0 0 1 14.5 6v5a2.5 2.5 0 0 1-5 0V6A2.5 2.5 0 0 1 12 3.5z",
    "M6.5 11a5.5 5.5 0 0 0 11 0",
    "M12 16.5v4",
    "M9.5 20.5h5",
  ],
  sliders: [
    "M4 7.5h9",
    "M17 7.5h3",
    "M15 5.5v4",
    "M4 16.5h3",
    "M11 16.5h9",
    "M9 14.5v4",
  ],
  chart: [
    "M4 20.5h16",
    "M7 20.5v-6",
    "M12 20.5V9",
    "M17 20.5V13",
  ],
  globe: [
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
    "M3 12h18",
    "M12 3a13.5 13.5 0 0 1 0 18",
    "M12 3a13.5 13.5 0 0 0 0 18",
  ],
  badge: [
    "M6 3.5h12A1.5 1.5 0 0 1 19.5 5v14a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 19V5A1.5 1.5 0 0 1 6 3.5z",
    "M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
    "M8.5 16.5a3.5 3.5 0 0 1 7 0",
  ],
  headset: [
    "M4.5 13a7.5 7.5 0 0 1 15 0",
    "M4.5 13.5h2.8v4H6A1.5 1.5 0 0 1 4.5 16v-2.5z",
    "M19.5 13.5h-2.8v4H18a1.5 1.5 0 0 0 1.5-1.5v-2.5z",
    "M16.7 17.5v1.2a1.8 1.8 0 0 1-1.8 1.8H12",
  ],
  cost: [
    "M4 7.5h16A1.5 1.5 0 0 1 21.5 9v6a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 15V9A1.5 1.5 0 0 1 4 7.5z",
    "M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
    "M5.5 10.5v3",
    "M18.5 10.5v3",
  ],
  repeat: [
    "m17.5 3.5 3 3-3 3",
    "M20.5 6.5H8a4.5 4.5 0 0 0-4.5 4.5v.5",
    "m6.5 20.5-3-3 3-3",
    "M3.5 17.5H16a4.5 4.5 0 0 0 4.5-4.5v-.5",
  ],
  clinic: [
    "M6 4.5h12A1.5 1.5 0 0 1 19.5 6v12a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V6A1.5 1.5 0 0 1 6 4.5z",
    "M12 8.5v7",
    "M8.5 12h7",
  ],
  restaurant: [
    "M7 3.5v7.5a2.2 2.2 0 0 0 2.2 2.2v7.3",
    "M7 3.5v4.8",
    "M9.2 3.5v4.8",
    "M16.5 3.5c-1.4 1.2-2.1 3-2.1 5.1 0 1.6.7 2.6 2.1 2.8v9.1",
  ],
  hotel: [
    "M4.5 19.5v-12l7.5-3.5 7.5 3.5v12",
    "M9.5 19.5v-4.8h5v4.8",
    "M2.5 19.5h19",
  ],
  estate: [
    "M4 10.5 12 4l8 6.5",
    "M5.8 9.2V19A1.5 1.5 0 0 0 7.3 20.5h9.4A1.5 1.5 0 0 0 18.2 19V9.2",
    "M9.8 20.5v-5.4h4.4v5.4",
  ],
  retail: [
    "M4.5 8h15l-1.2 11.2a1.5 1.5 0 0 1-1.5 1.3H7.2a1.5 1.5 0 0 1-1.5-1.3L4.5 8z",
    "M8.8 10.2V7a3.2 3.2 0 0 1 6.4 0v3.2",
  ],
};

export type IconName = keyof typeof ICONS;

export function AnimatedIcon({
  name,
  size = 24,
  className = "",
  delay = 0,
  strokeWidth = 1.8,
}: {
  name: IconName;
  size?: number;
  className?: string;
  delay?: number;
  strokeWidth?: number;
}) {
  const reduced = useReducedMotion();
  const paths = ICONS[name] ?? ICONS.wave;
  if (reduced) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
        {paths.map((d, i) => (
          <path key={i} d={d} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        ))}
      </svg>
    );
  }
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
    >
      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            show: {
              pathLength: 1,
              opacity: 1,
              transition: { duration: 0.6, delay: delay + i * 0.12, ease: "easeInOut" },
            },
          }}
        />
      ))}
    </motion.svg>
  );
}

/**
 * Outline icon chip — white ground, spectrum BORDER, stroke icon.
 * Gradient fills on icons are banned site-wide (owner rule); the
 * spectrum only ever appears as an outline ring.
 */
export function IconChip({
  name,
  className = "",
  delay = 0,
}: {
  name: IconName;
  className?: string;
  delay?: number;
}) {
  return (
    <span
      className={`ring-spectrum inline-flex h-11 w-11 items-center justify-center rounded-xl text-brand-purple shadow-card transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 ${className}`}
    >
      <AnimatedIcon name={name} size={22} delay={delay} />
    </span>
  );
}
