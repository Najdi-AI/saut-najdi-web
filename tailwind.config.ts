import type { Config } from "tailwindcss";

/**
 * Saut Najdi design tokens — from the official brand guideline
 * (see ../website-research.md §1).
 *
 * The dark theme is opted into per-subtree, not per-visitor: `dark:` applies
 * to anything inside an element carrying `data-theme="dark"`. That is what
 * lets the homepage hero be dark while the rest of the page stays light
 * during the evaluation — and, once the rollout lands, moving the attribute
 * up to <html> turns the same utilities on site-wide with no rewrite.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        brand: {
          cyan: "#2EC4E6",
          blue: "#5B6CE5",
          purple: "#6F3FA4",
          magenta: "#E20C3A",
          red: "#EC1B3A",
        },
        ink: "#0D1326", // Charcoal — body text, deep bands
        navy: "#112046", // Soft Navy — deep emphasis
        canvas: "#F7F8FA", // Off-White — page background
        line: "#E5E7EB", // Silver Gray — borders, dividers

        /**
         * Dark-theme ground. Navy-leaning rather than neutral black, so the
         * brand gradient still reads as the warm thing in the frame.
         * `night-surface` is deliberately the same value the Cal booker card
         * already uses (lib/bookerTheme.ts) — the two must not drift.
         */
        night: {
          DEFAULT: "#080D1C", // page ground, the recessive layer
          surface: "#0F1730", // raised: cards, chips, bubbles
          hi: "#16203C", // hover / second raise
          line: "#232C49", // hairline on dark
        },
      },
      fontFamily: {
        sans: ["var(--font-thmanyah)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Guideline p9 type scale — same for both scripts
        h1: ["3rem", { lineHeight: "3.5rem", fontWeight: "700" }],
        h2: ["2.25rem", { lineHeight: "2.75rem", fontWeight: "700" }],
        h3: ["1.75rem", { lineHeight: "2.25rem", fontWeight: "700" }],
        h4: ["1.375rem", { lineHeight: "1.75rem", fontWeight: "700" }],
        h5: ["1.125rem", { lineHeight: "1.5rem", fontWeight: "700" }],
        "body-lg": ["1rem", { lineHeight: "1.5rem", fontWeight: "500" }],
        body: ["0.875rem", { lineHeight: "1.25rem" }],
        "body-sm": ["0.75rem", { lineHeight: "1.125rem" }],
      },
      backgroundImage: {
        // The five-stop brand gradient, cyan → red
        "brand-gradient":
          "linear-gradient(90deg, #2EC4E6 0%, #5B6CE5 28%, #6F3FA4 52%, #E20C3A 78%, #EC1B3A 100%)",
        "brand-gradient-soft":
          "linear-gradient(135deg, rgba(46,196,230,0.08) 0%, rgba(91,108,229,0.06) 40%, rgba(226,12,58,0.05) 100%)",
      },
      keyframes: {
        "wave-bar": {
          "0%, 100%": { transform: "scaleY(0.35)" },
          "50%": { transform: "scaleY(1)" },
        },
        "fade-rise": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "wave-bar": "wave-bar 1.6s ease-in-out infinite",
        "fade-rise": "fade-rise 0.5s ease-out both",
      },
      boxShadow: {
        // Driven by --shadow-rgb so shadows go black on night instead of
        // staying navy, where they read as a smudge. Light values unchanged.
        card: "0 1px 2px rgb(var(--shadow-rgb) / 0.04), 0 8px 24px -12px rgb(var(--shadow-rgb) / 0.10)",
        "card-hover":
          "0 2px 4px rgb(var(--shadow-rgb) / 0.06), 0 16px 40px -12px rgb(var(--shadow-rgb) / 0.16)",
      },
    },
  },
  plugins: [],
};

export default config;
