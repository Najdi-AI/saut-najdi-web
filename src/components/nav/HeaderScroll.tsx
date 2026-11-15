"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Hands the header back to its light tone once a dark hero has scrolled out
 * from under it. Renders nothing.
 *
 * The on-dark tone itself is pure CSS (globals.css: main's first child,
 * JSON-LD scripts aside, with data-hero="dark"), so it is right before
 * hydration and with JS off; this only adds data-past-hero="true" while the
 * hero's bottom edge is above the bar's. The header lives in the layout and
 * survives client navigation, so the hero is looked up again on every path
 * change.
 */
const HERO = 'main > [data-hero="dark"]:not(:not(script) ~ *)';

export function HeaderScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const hdr = document.querySelector<HTMLElement>(".hdr");
    if (!hdr) return;
    const hero = document.querySelector<HTMLElement>(HERO);
    if (!hero) {
      hdr.removeAttribute("data-past-hero");
      return;
    }

    let frame = 0;
    const apply = () => {
      frame = 0;
      const past = hero.getBoundingClientRect().bottom <= hdr.getBoundingClientRect().bottom;
      if ((hdr.getAttribute("data-past-hero") === "true") !== past) {
        hdr.setAttribute("data-past-hero", String(past));
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
