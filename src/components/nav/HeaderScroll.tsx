"use client";

import { useEffect } from "react";

/**
 * Flags the header once the page has moved so it can condense into the
 * floating glass capsule. Renders nothing; JS-off leaves the tall bar.
 * (Ported from the haroon911 reference.)
 */
export function HeaderScroll() {
  useEffect(() => {
    const el = document.querySelector(".hdr");
    if (!el) return;

    let frame = 0;
    const apply = () => {
      frame = 0;
      const on = window.scrollY > 12;
      if ((el.getAttribute("data-scrolled") === "true") !== on) {
        el.setAttribute("data-scrolled", String(on));
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
