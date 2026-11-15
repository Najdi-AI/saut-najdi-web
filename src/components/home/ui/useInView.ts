"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

type Watch = (entry: IntersectionObserverEntry) => void;
type Shared = { io: IntersectionObserver; watchers: Map<Element, Watch> };

/** One observer per distinct option set, shared by every caller on the page. */
const shared = new Map<string, Shared>();

function watch(el: Element, rootMargin: string, threshold: number, onEntry: Watch) {
  const key = `${rootMargin}|${threshold}`;
  let entry = shared.get(key);
  if (!entry) {
    const watchers = new Map<Element, Watch>();
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => watchers.get(e.target)?.(e)),
      { rootMargin, threshold },
    );
    entry = { io, watchers };
    shared.set(key, entry);
  }
  const { io, watchers } = entry;
  watchers.set(el, onEntry);
  io.observe(el);
  return () => {
    watchers.delete(el);
    io.unobserve(el);
  };
}

/**
 * Whether an element is on screen, for the home sections' entrances and for
 * pausing work off-screen. Every caller with the same options shares one
 * IntersectionObserver instead of creating its own. The defaults are the
 * mockups' entrance observer (Try 1 site.js): fire when 6% of the element
 * is in view, 8% above the bottom edge. `once` (the default) stops watching
 * after the first entry, so an entrance never replays.
 *
 * False on the server and while hydrating, so the first client render
 * matches the server HTML.
 */
export function useInView<T extends Element>({
  rootMargin = "0px 0px -8% 0px",
  threshold = 0.06,
  once = true,
}: { rootMargin?: string; threshold?: number; once?: boolean } = {}): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const stop = watch(el, rootMargin, threshold, (e) => {
      setInView(e.isIntersecting);
      if (e.isIntersecting && once) stop();
    });
    return stop;
  }, [rootMargin, threshold, once]);

  return [ref, inView];
}
