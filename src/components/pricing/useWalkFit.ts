"use client";

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";

/** Spare room the walk needs before it turns on; it turns off only once it no longer fits. */
const SLACK = 32;

/** Where the reader was when the layout switched: the walk's box and the tier on screen. */
type Spot = { top: number; bottom: number; tier: number };

/**
 * Whether the pinned panel can hold the walk (WCAG 1.4.12 text spacing): the
 * tallest tier and the tier index must fit between the header and the chat
 * launcher's clearance at the current fonts, zoom and text settings, or the
 * tiers stay stacked. The CSS gate (768px wide, 640px tall, no reduced
 * motion, read from --can-walk) comes first. It re-checks whenever a tier,
 * the index or the window changes size, so fonts loading, zoom and spacing
 * applied after load are caught. While stacked it measures the cards, whose
 * figure is not capped by the window height, and it needs SLACK spare to
 * turn on, so a switch never undoes itself.
 *
 * A switch keeps the reader's place: past the walk, what is on screen stays
 * put; inside it, the tier being read stays in view.
 */
export function useWalkFit(box: RefObject<HTMLDivElement | null>, armed: boolean) {
  const [fit, setFit] = useState(false);
  const spot = useRef<Spot | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!armed || !el || typeof ResizeObserver === "undefined") return;
    const steps = [...el.querySelectorAll<HTMLElement>("[data-step]")];
    const index = el.querySelector("ol");
    let frame = 0;
    const check = () => {
      frame = 0;
      const cs = getComputedStyle(el);
      const header = parseFloat(cs.getPropertyValue("--header-h"));
      const gate = cs.getPropertyValue("--can-walk").trim() === "1";
      const walking = el.hasAttribute("data-ready");
      let next = false;
      if (gate && index) {
        const room = window.innerHeight - header - parseFloat(cs.getPropertyValue("--fab-clear"));
        const tiers = Math.max(...steps.map((st) => st.lastElementChild?.getBoundingClientRect().height ?? 0));
        // The index is hidden while stacked: sum the cards' tier headings, set in the same type.
        const names = walking
          ? index.getBoundingClientRect().height
          : steps.reduce((sum, st) => {
              const h = st.firstElementChild;
              if (!h) return sum;
              const em = parseFloat(getComputedStyle(h).fontSize);
              return sum + Math.max(44, h.getBoundingClientRect().height + 0.1 * em) + 6;
            }, -6);
        next = Math.max(tiers, names) <= room - (walking ? 0 : SLACK);
      }
      if (next === walking) return;
      const r = el.getBoundingClientRect();
      const tier = walking
        ? Number(el.dataset.active)
        : Math.max(0, steps.findIndex((st) => st.getBoundingClientRect().bottom > header));
      spot.current = gate ? { top: r.top, bottom: r.bottom, tier } : null;
      setFit(next);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    const ro = new ResizeObserver(schedule);
    for (const st of steps) for (const part of st.children) ro.observe(part);
    if (index) ro.observe(index);
    window.addEventListener("resize", schedule);
    document.fonts?.ready.then(schedule);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, [box, armed]);

  // After a switch, before paint: put the reader back.
  useLayoutEffect(() => {
    const el = box.current;
    const p = spot.current;
    spot.current = null;
    if (!el || !p) return;
    const header = parseFloat(getComputedStyle(el).getPropertyValue("--header-h"));
    const r = el.getBoundingClientRect();
    // (scrollBy now returns a promise in Chrome: never return it from an effect.)
    let top = 0;
    if (p.bottom <= header) top = r.bottom - p.bottom;
    else if (p.top < header) {
      const to = fit
        ? el.querySelector(`[data-mark="${p.tier}"]`)?.getBoundingClientRect()
        : el.querySelectorAll("[data-step]")[p.tier]?.getBoundingClientRect();
      if (to) top = fit ? to.top + to.height / 2 - window.innerHeight / 2 : to.top - header;
    }
    if (top) window.scrollBy({ top, behavior: "instant" });
  }, [box, fit]);

  return fit;
}
