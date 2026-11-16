/**
 * prefers-reduced-motion for the home sections, whose motion is CSS and a
 * little state, with no animation library. The shared hook needs none
 * either: false on the server and while hydrating, then the live media
 * query, so a component can branch on it without a hydration mismatch.
 */
export { useReducedMotionAfterHydration as useReducedMotion } from "@/components/useReducedMotionAfterHydration";
