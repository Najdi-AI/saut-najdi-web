"use client";

import { useEffect } from "react";

/**
 * Lands a direct load with a #fragment on its target once the page has
 * settled. The browser starts its (smooth) fragment scroll at load, toward
 * where the target sits in the server HTML; the pinned sections (pricing
 * walk, the how pin, the day track) then grow or shrink as they hydrate, and
 * that scroll finishes at the stale offset, up to ~3,500px from the target.
 *
 * On the first load only, and only when the hash names an element: once the
 * fonts are in and neither body nor main has changed size for a few frames,
 * scroll the target into view, instantly, so html's scroll-padding-top (and
 * any scroll-margin) applies as it would for the browser's own jump. Then,
 * until 1.5s after mounting, keep it there: if something above it changes
 * size later and moves it (the hero re-fits its chips once its entrance has
 * run, under text spacing), put it back once the layout is quiet again, at
 * most twice. Without a hash it does nothing; without JavaScript the
 * browser's native jump is all there is.
 *
 * The reader wins. A scroll that moves the page while the target stays put
 * in the document is someone scrolling: before the landing, the browser's
 * own fragment scroll runs one way from the start (it may run past a target
 * that moved up), so only a scroll against it is surely the reader's; after
 * the landing, which ends the browser's scroll, every one is. Then it stops
 * and leaves the page where the reader took it.
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
      return { y: window.scrollY, top, doc: top + window.scrollY };
    };
    const started = performance.now();
    let prev = read();
    let quiet = 0; // frames since body or main last changed size
    let way = 0; // the direction the browser's own fragment scroll runs
    let landedTop: number | null = null; // where the landing put the target (a sticky head stays at its offset)
    let lands = 0;
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
    const land = () => {
      target.scrollIntoView({ block: "start", behavior: "instant" });
      lands += 1;
      prev = read();
      landedTop = prev.top;
    };
    const tick = () => {
      if (done) return;
      const now = read();
      const dy = now.y - prev.y;
      const scrolled = Math.abs(dy) > 1 && Math.abs(now.doc - prev.doc) < 1;
      const reader = scrolled && (landedTop !== null || (way !== 0 && Math.sign(dy) !== way));
      if (reader || window.location.hash !== hash) {
        stop();
        return;
      }
      if (scrolled && way === 0) way = Math.sign(dy);
      prev = now;
      quiet += 1;
      const late = performance.now() - started > 1500;
      if (landedTop === null) {
        if ((fonts && quiet > 3) || late) {
          if (Math.abs(now.top - line()) > 1) land();
          else landedTop = now.top;
        }
      } else if (quiet > 3 && Math.abs(now.top - landedTop) > 1 && lands < 3) {
        land();
      }
      if (late) {
        stop();
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return stop;
  }, []);

  return null;
}
