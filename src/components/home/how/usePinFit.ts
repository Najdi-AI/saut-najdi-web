"use client";

import { useEffect, useState, type RefObject } from "react";

/** The stage's padding around the tallest card, and its clearance from the header and the window's bottom edge. */
const PAD = 24;
const CLEAR = 16;
/** Spare room pinning needs before it turns on; it turns off only once the card no longer fits. */
const SLACK = 32;
/** The mockup's fragment height: the cards are never shorter. */
const FRAG = 392;

/** A card's own content height (first child's top to last child's bottom, plus padding), whatever its minimum. */
function natural(card: HTMLElement) {
  const first = card.firstElementChild as HTMLElement | null;
  const last = card.lastElementChild as HTMLElement | null;
  if (!first || !last) return 0;
  const cs = getComputedStyle(card);
  // offset* ignore the hidden cards' transform, which getBoundingClientRect would include.
  return last.offsetTop + last.offsetHeight - first.offsetTop + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
}

/**
 * Whether the pinned stage can hold the tallest state (WCAG 1.4.12 text
 * spacing): the stage, the card plus PAD above and below, must fit between
 * the header and the window's bottom edge at the current fonts, zoom and
 * text settings, or the statements and states stay stacked. The CSS gate
 * (900px wide, 600px tall, no reduced motion, read from --can-pin) comes
 * first. It re-checks whenever a card's content or the window changes size,
 * so fonts loading, zoom and spacing applied after load are caught, and it
 * needs SLACK spare to turn on, so a switch never undoes itself. The tallest
 * card's height goes to --card-h, so every state is that tall and the stage
 * grows to hold it. The browser's scroll anchoring keeps the reader's place
 * across a switch.
 */
export function usePinFit(box: RefObject<HTMLDivElement | null>) {
  const [fit, setFit] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el || typeof ResizeObserver === "undefined" || typeof IntersectionObserver === "undefined") return;
    const cards = [...el.querySelectorAll<HTMLElement>("figure")];
    let frame = 0;
    const check = () => {
      frame = 0;
      const cs = getComputedStyle(el);
      const pinned = el.hasAttribute("data-pin");
      const tallest = Math.ceil(Math.max(FRAG, ...cards.map(natural)));
      el.style.setProperty("--card-h", `${tallest}px`);
      const room = window.innerHeight - parseFloat(cs.getPropertyValue("--header-h")) - 2 * CLEAR;
      const next = cs.getPropertyValue("--can-pin").trim() === "1" && tallest + 2 * PAD <= room - (pinned ? 0 : SLACK);
      if (next !== pinned) setFit(next);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    const ro = new ResizeObserver(schedule);
    for (const card of cards) for (const part of card.children) ro.observe(part);
    window.addEventListener("resize", schedule);
    document.fonts?.ready.then(schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, [box]);

  return fit;
}
