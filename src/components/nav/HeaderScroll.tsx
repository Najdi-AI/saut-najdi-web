"use client";

import { useEffect } from "react";

/**
 * Two flags on the header, both derived from scroll position.
 *
 * `data-scrolled` — the page has moved, so the bar condenses into the
 * floating glass capsule. (Ported from the haroon911 reference.)
 *
 * `data-over-dark` — the header is currently sitting on top of a dark
 * section, so its ink, hairlines, glass scrim and logo have to invert. The
 * header is a sibling of the content, not a child, so it cannot inherit
 * `data-theme` from the section underneath; measuring is the only way it can
 * know. Only the FIRST dark section is tracked, because that is the only one
 * that can ever be under a header pinned to the top of the viewport.
 *
 * When the whole site goes dark this keeps working untouched: the dark
 * section becomes the page itself and the flag simply never turns off.
 */
const HEADER_H = 76;

export function HeaderScroll() {
  useEffect(() => {
    const el = document.querySelector(".hdr");
    if (!el) return;

    const dark = document.querySelector<HTMLElement>('main [data-theme="dark"]');

    let frame = 0;
    const apply = () => {
      frame = 0;

      const scrolled = window.scrollY > 12;
      if ((el.getAttribute("data-scrolled") === "true") !== scrolled) {
        el.setAttribute("data-scrolled", String(scrolled));
      }

      // The header rides the top edge, so "over dark" means the dark
      // section still reaches past the bar's own height.
      const overDark = dark ? dark.getBoundingClientRect().bottom > HEADER_H : false;
      if ((el.getAttribute("data-over-dark") === "true") !== overDark) {
        el.setAttribute("data-over-dark", String(overDark));
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
