"use client";

import { useSyncExternalStore } from "react";

const STILLNESS = "(prefers-reduced-motion: reduce)";
const watchStillness = (changed: () => void) => {
  const query = window.matchMedia(STILLNESS);
  query.addEventListener("change", changed);
  return () => query.removeEventListener("change", changed);
};
const readStillness = () => window.matchMedia(STILLNESS).matches;
const serverStillness = () => false;

/**
 * prefers-reduced-motion, safe to branch on in a server-rendered component.
 * framer-motion's useReducedMotion() is null on the server but already true
 * on the client's first render, so a component that branched on it hydrated
 * a different tree under reduced motion (React #418), or kept the server's
 * opacity:0 style on a node the client thought was plain (React does not
 * patch attributes while hydrating). This answers false while hydrating, as
 * the server did, then re-renders with the real value; a component mounted
 * after hydration reads it at once.
 *
 * So a motion component renders its hidden first frame while hydrating and
 * must then settle at its end state when this turns true: pass
 * `initial={reduced ? false : "hidden"}` (initial is read once, at mount, so
 * this only matters for later mounts), animate to the end state while
 * reduced, and make that transition `{ duration: 0 }` so nothing moves.
 */
export function useReducedMotionAfterHydration() {
  return useSyncExternalStore(watchStillness, readStillness, serverStillness);
}
