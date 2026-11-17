"use client";

import { useEffect, type RefObject } from "react";
import s from "./Hero.module.css";

/** Where the play and handoff chips float beside the H1: above PR 4's 1180px tablet layout. */
const FLOAT = "(min-width: 1181px)";
/** Where the dialect chip floats above the H1 (on a phone it is in the flow). */
const ABOVE = "(min-width: 641px)";
/** A word's box reaches past its letters (the font's ascent and descent); an edge this close is not on a word. */
const TOUCH = 8;

/**
 * WCAG 1.4.12: with spaced or enlarged text the H1, the lead and the chips
 * grow, and a floating chip can land on the H1's or the lead's words. The
 * hero then adapts with the layout it already has:
 * - the dialect chip above the H1 gets the room it now needs (--chip-above,
 *   which the hero's top track already reserves), so it rises clear;
 * - if the play or handoff chip would still overlap, the hero takes
 *   data-flow, PR 4's tablet layout (chips in the flow) at any width.
 * It checks one frame after the H1, the lead or a chip changes size, only
 * once the entrance has settled (a rising line never counts), and always
 * from the default state, so an answer never depends on the last one. At
 * default text settings no chip reaches a word and nothing changes.
 */
export function useStageFit(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const hero = ref.current?.closest("section");
    const h1 = hero?.querySelector("h1");
    const lead = hero?.querySelector(`.${s.lead}`);
    const dialect = hero?.querySelector(`.${s.dialect}`);
    if (!hero || !h1 || !lead || !dialect || typeof ResizeObserver === "undefined") return;
    const pair = [...hero.querySelectorAll(`.${s.pair} > .${s.chip}`)];
    const float = matchMedia(FLOAT);
    const above = matchMedia(ABOVE);
    let frame = 0;
    let settled = false;
    let alive = true;
    // The boxes of the words themselves: a range over each text node, not over the H1's full-width line blocks.
    const words = (el: Element) => {
      const out: DOMRect[] = [];
      const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      for (let n = walk.nextNode(); n; n = walk.nextNode()) {
        const r = document.createRange();
        r.selectNodeContents(n);
        out.push(...r.getClientRects());
      }
      return out;
    };
    const depth = (a: DOMRect, b: DOMRect) =>
      Math.min(Math.min(a.right, b.right) - Math.max(a.left, b.left), Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    const onWords = (el: Element, text: DOMRect[]) => text.some((w) => depth(el.getBoundingClientRect(), w) > TOUCH);
    // The dialect chip's default reach above the stage (CSS --chip-above), read before any change of ours.
    const base = parseFloat(getComputedStyle(hero).getPropertyValue("--chip-above"));
    const stage = dialect.parentElement!;
    const check = () => {
      frame = 0;
      hero.removeAttribute("data-flow");
      if (!above.matches) {
        hero.style.removeProperty("--chip-above");
        return;
      }
      // Dialect chip: worked out in stage coordinates, where the H1 never moves, so the room it needs does not
      // depend on the room it has now: where would its bottom sit at the default reach, and does that land on a word?
      const top = stage.getBoundingClientRect().top;
      const reach = parseFloat(getComputedStyle(hero).getPropertyValue("--chip-above"));
      const chip = dialect.getBoundingClientRect();
      const bottom = chip.bottom - top + reach - base;
      const hits = words(h1).filter((w) => Math.min(chip.right, w.right) - Math.max(chip.left, w.left) > TOUCH && bottom - (w.top - top) > TOUCH);
      if (hits.length) hero.style.setProperty("--chip-above", `${Math.ceil(base + bottom - Math.min(...hits.map((w) => w.top - top)) + 16)}px`);
      else hero.style.removeProperty("--chip-above");
      if (float.matches) hero.toggleAttribute("data-flow", pair.some((c) => onWords(c, [...words(h1), ...words(lead)])));
    };
    const schedule = () => {
      if (alive && settled && !frame) frame = requestAnimationFrame(check);
    };
    const sizes = new ResizeObserver(schedule);
    for (const el of [h1, lead, dialect, ...pair]) sizes.observe(el);
    float.addEventListener("change", schedule);
    above.addEventListener("change", schedule);
    // Older browsers without element.getAnimations() just check at once.
    const entrance =
      typeof hero.getAnimations === "function"
        ? hero.getAnimations({ subtree: true }).filter((a) => a.effect?.getComputedTiming().endTime !== Infinity)
        : [];
    Promise.all(entrance.map((a) => a.finished.catch(() => {}))).then(() => {
      settled = true;
      schedule();
    });
    return () => {
      alive = false;
      sizes.disconnect();
      float.removeEventListener("change", schedule);
      above.removeEventListener("change", schedule);
      cancelAnimationFrame(frame);
    };
  }, [ref]);
}
