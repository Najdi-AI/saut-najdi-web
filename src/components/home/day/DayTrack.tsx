"use client";

import { useEffect, useRef, type ReactNode } from "react";
import s from "./Day.module.css";

/** Pin only on a wide, tall enough screen with motion welcome; the fit check below has the last word. */
const PIN = "(min-width: 641px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)";
/** Where each day-part word ends, in clock minutes (the last one runs on past midnight). */
const ENDS = [720, 900, 1050, 1140, 1440];
/** Spare room the board needs before it pins; once pinned it lets go only when something would be cut. */
const SLACK = 12;

type Key = { T: number; t: number; el?: HTMLElement };

/**
 * The day's client island (Try 3 try.js section 4). It renders the server
 * markup as is and marks it data-pin while the board fits: the CSS module
 * then pins the board under the header, and a passive scroll listener (one
 * frame per animation frame) slides the strip, runs the clock and meter,
 * and marks each moment data-on once the clock reaches it. Nothing captures
 * input or cancels a default, so the page scrolls as it always does; the
 * track is just tall enough for the strip's travel plus a short hold on the
 * last moment.
 *
 * The board pins only while everything on it fits between the header and
 * the bottom of the window at the current fonts, zoom and text spacing
 * (WCAG 1.4.12), measured in the pinned layout; otherwise the server's
 * vertical list stays. It checks again whenever the heading, the clock, a
 * moment's text or the window changes size, so spacing applied after load
 * is caught, and it needs SLACK spare to pin, so a switch never undoes
 * itself. A switch keeps the reader's place: past the day, what is on
 * screen stays put; inside it, the moment being read stays in view.
 *
 * Keys pair a strip offset with a clock time, measured from where each
 * moment's centre sits relative to the "now" line; the clock is linear
 * between neighbouring moments.
 */
export function DayTrack({ parts, children }: { parts: string[]; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = ref.current;
    const pin = track?.firstElementChild as HTMLElement | null;
    const find = (sel: string) => track?.querySelector<HTMLElement>(sel);
    const band = find("[data-band]"), strip = find("[data-strip]"), now = find("[data-now]");
    const fig = find("[data-clock]"), word = find("[data-part]");
    const clock = fig?.parentElement, meter = find("[data-bars]")?.parentElement, head = find("h2")?.parentElement;
    if (!track || !pin || !band || !strip || !now || !fig || !word || !clock || !meter || !head) return;
    const items = [...strip.querySelectorAll<HTMLElement>("[data-t]")];
    const segs = [...track.querySelectorAll<HTMLElement>("[data-bars] b")];
    const mq = matchMedia(PIN);
    let keys: Key[] = [];
    let travel = 1, run = 1, top = 0, at = 0, rtl = false, pinned = false, last = -1, raf = 0, check = 0;

    const setClock = (min: number) => {
      fig.textContent = `${Math.floor(min / 60) % 12 || 12}:${String(min % 60).padStart(2, "0")}`;
      const i = ENDS.findIndex((end) => min < end);
      word.textContent = parts[i < 0 ? ENDS.length : i];
      segs.forEach((b, k) => {
        b.style.transform = `scaleX(${Math.min(1, Math.max(0, (min - 480 - k * 60) / 60))})`;
      });
    };
    const minutesAt = (T: number) => {
      for (let i = 1; i < keys.length; i++) {
        const a = keys[i - 1], b = keys[i];
        if (T <= b.T) return a.t + (b.t - a.t) * ((T - a.T) / Math.max(1, b.T - a.T));
      }
      return keys[keys.length - 1].t;
    };
    const frame = () => {
      raf = 0;
      if (!pinned) return;
      // Past 1 the board holds on the last moment.
      const p = Math.min(1, Math.max(0, (top - track.getBoundingClientRect().top) / run));
      const T = p * travel;
      strip.style.transform = `translate3d(${rtl ? T : -T}px, 0, 0)`;
      const min = Math.round(minutesAt(T));
      if (min !== last) {
        last = min;
        setClock(min);
      }
      at = 0;
      keys.forEach((k, i) => {
        const on = min >= k.t; // on the minute the clock shows it, never a frame apart
        k.el?.toggleAttribute("data-on", on);
        if (on) at = i;
      });
    };

    // The least room the pinned board has to spare, in px (below 0, something would be cut). Read with
    // data-pin on; the moments by layout boxes, so their entrance transforms don't count.
    const room = () => {
      const box = pin.getBoundingClientRect();
      // A header grown past the pin's sticky top (zoomed or spaced text) would cover the board.
      const over = (document.querySelector("header")?.getBoundingClientRect().height ?? 0) - top;
      let spare = over > 0.5 ? -over : Infinity;
      for (const el of [head, clock, meter]) {
        if (!el.getClientRects().length) continue; // the meter is off on short screens
        const r = el.getBoundingClientRect();
        spare = Math.min(spare, r.top - box.top, box.bottom - r.bottom);
        // Sideways only an overhang counts: the meter spans the pin edge to edge.
        const side = Math.min(r.left - box.left, box.right - r.right);
        if (side < -0.5) spare = Math.min(spare, side);
      }
      for (const li of items) {
        const end = li.lastElementChild as HTMLElement | null;
        if (end) spare = Math.min(spare, li.clientHeight - end.offsetTop - end.offsetHeight);
      }
      return spare;
    };
    // Sizes an element to the widest of some texts it will show, then puts its own text back.
    const hold = (el: HTMLElement, texts: string[]) => {
      const shown = el.textContent;
      let widest = 0;
      el.style.minInlineSize = "";
      for (const text of texts) {
        el.textContent = text;
        widest = Math.max(widest, el.getBoundingClientRect().width);
      }
      el.textContent = shown;
      el.style.minInlineSize = `${Math.ceil(widest)}px`;
    };
    const measure = () => {
      check = 0;
      const was = pinned;
      top = parseFloat(getComputedStyle(track).getPropertyValue("--header-h")) || 0;
      const before = track.getBoundingClientRect();
      // The moment being read in the list: the one across a line a quarter of the way down under the header.
      const line = top + (innerHeight - top) / 4;
      if (!was) {
        const i = items.findIndex((li) => li.getBoundingClientRect().bottom > line);
        at = i < 0 ? items.length - 1 : i; // the list's end above the line: the reader is past the last moment
      }
      strip.style.transform = "";
      strip.style.paddingInlineStart = "";
      track.style.removeProperty("--run");
      track.toggleAttribute("data-pin", mq.matches);
      if (mq.matches) {
        // The clock holds its widest face, so it never grows as the day runs and the fit measured now
        // holds all day: the figure at its widest times (10:00 is the widest in this face, 2.58em) and
        // the widest word («بعد نص الليل», "after midnight"), at the current text settings.
        hold(fig, ["10:00", "11:42", "12:00"]);
        hold(word, parts);
      }
      pinned = mq.matches && room() >= (was ? 0 : SLACK);
      track.toggleAttribute("data-pin", pinned);
      if (pinned) {
        rtl = getComputedStyle(track).direction === "rtl";
        const box = band.getBoundingClientRect();
        const edge = (el: Element) => {
          const r = el.getBoundingClientRect();
          const c = r.left + r.width / 2;
          return rtl ? box.right - c : c - box.left;
        };
        const ph = edge(now);
        // Lead room, so the second moment waits just past the now line when the board pins.
        strip.style.paddingInlineStart = `${Math.max(0, ph + box.width * 0.1 - edge(items[1]))}px`;
        keys = [{ T: 0, t: Number(items[0].dataset.t) }];
        for (const el of items.slice(1)) keys.push({ T: edge(el) - ph, t: Number(el.dataset.t), el });
        travel = keys[keys.length - 1].T;
        run = Math.round(travel * 0.9); // the board moves a little faster than the page
        track.style.setProperty("--run", `${pin.offsetHeight + run + Math.round(innerHeight * 0.4)}px`);
        last = -1;
      }
      if (pinned !== was) {
        const after = track.getBoundingClientRect();
        let by = 0;
        if (before.bottom <= top) by = after.bottom - before.bottom;
        else if (before.top < top) {
          by = pinned
            ? after.top - (top - ((keys[at]?.T ?? 0) / travel) * run)
            : items[at].getBoundingClientRect().top - top - 16;
        }
        if (by) window.scrollBy({ top: by, behavior: "instant" });
      }
      frame();
    };
    const schedule = () => {
      if (!check) check = requestAnimationFrame(measure);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    measure();
    const sizes = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    for (const el of [head, clock, ...items.flatMap((li) => [...li.children])]) sizes?.observe(el, { box: "border-box" });
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", schedule);
    mq.addEventListener("change", schedule);
    return () => {
      sizes?.disconnect();
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", schedule);
      mq.removeEventListener("change", schedule);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(check);
    };
  }, [parts]);

  return (
    <div ref={ref} className={s.track}>
      {children}
    </div>
  );
}
