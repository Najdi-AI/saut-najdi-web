"use client";

import { useEffect } from "react";

/**
 * Reading progress along the header's top edge — drives a CSS variable
 * on <html>; the bar itself is the header's ::before pseudo-element.
 * (Ported from the haroon911 reference.)
 */
export function ScrollProgress() {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;

    const apply = () => {
      frame = 0;
      const max = root.scrollHeight - root.clientHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, root.scrollTop / max)) : 0;
      root.style.setProperty("--read", String(p));
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
      root.style.removeProperty("--read");
    };
  }, []);

  return null;
}
