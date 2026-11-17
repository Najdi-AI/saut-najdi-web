"use client";

import { useEffect } from "react";

/**
 * Lands a direct load with a #fragment on its target once the page has
 * settled. The browser starts its (smooth) fragment scroll at load, toward
 * where the target sits in the server HTML; the pinned sections (pricing
 * walk, the how pin, the day track) then grow as they hydrate, and the
 * scroll finishes at that stale offset, up to ~3,500px from the target.
 *
 * On the first load only, and only when the hash names an element: wait for
 * the fonts, then for a few frames in which neither body nor main changes
 * size (capped at 1.5s), and scroll the target into view once, instantly, so
 * html's scroll-padding-top (and any scroll-margin) applies as it would for
 * the browser's own jump. Without a hash it does nothing; without JavaScript
 * the browser's native jump is all there is.
 *
 * The reader wins: if the page scrolls while the target stays put in the
 * document and the target moves away from its landing line, someone is
 * scrolling (the browser's own fragment scroll only ever closes on the
 * target, and scroll anchoring moves the page with the content), so it
 * stops and leaves the page where the reader took it.
 */
export function HashSettle() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.length < 2) return;
    let id = "";
    try {
      id = decodeURIComponent(hash.slice(1));
    } catch {
      return;
    }
    const target = document.getElementById(id);
    if (!target) return;

    const line = () => parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const read = () => {
      const top = target.getBoundingClientRect().top;
      return { y: window.scrollY, doc: top + window.scrollY, gap: Math.abs(top - line()) };
    };
    const started = performance.now();
    let prev = read();
    let quiet = 0;
    let fonts = !document.fonts;
    let frame = 0;
    let done = false;
    const sizes = new ResizeObserver(() => {
      quiet = 0;
    });
    sizes.observe(document.body);
    const main = document.getElementById("main");
    if (main) sizes.observe(main);
    document.fonts?.ready.then(() => {
      fonts = true;
    });

    const stop = () => {
      done = true;
      cancelAnimationFrame(frame);
      sizes.disconnect();
    };
    const tick = () => {
      if (done) return;
      const now = read();
      const readerMoved = Math.abs(now.y - prev.y) > 1 && Math.abs(now.doc - prev.doc) < 1 && now.gap > prev.gap + 1;
      if (readerMoved || window.location.hash !== hash) {
        stop();
        return;
      }
      prev = now;
      quiet += 1;
      if ((fonts && quiet > 3) || performance.now() - started > 1500) {
        stop();
        if (now.gap > 1) target.scrollIntoView({ block: "start", behavior: "instant" });
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return stop;
  }, []);

  return null;
}
