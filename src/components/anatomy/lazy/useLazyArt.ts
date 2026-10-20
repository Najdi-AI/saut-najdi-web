"use client";

import { useEffect, useId, useRef } from "react";

/**
 * Lazy figure art (NAJ-897, page weight). A section figure's drawing is a
 * static, content-hashed SVG in public/figures/ (scripts/anatomy/export.mjs
 * writes it from the same geometry the verification pages draw), so its
 * markup is neither in the page's HTML nor in the React server payload.
 *
 * The figure renders an empty art slot with the drawing's aspect ratio (no
 * layout shift) and its real role="img" label. When the slot comes within
 * `margin` of the viewport, this hook fetches the SVG, inserts it into the
 * slot, and only then calls `mount`, which loads and starts the figure's live
 * controller. Reduced motion and offscreen pausing stay with each controller.
 *
 * The slot must have no React children: React never touches the inserted
 * nodes, so the controller can hold on to them across re-renders.
 *
 * The asset is built from our own geometry and served from our origin; no
 * visitor input reaches it. `UID_TOKEN` marks the clip and mask ids, and each
 * instance swaps it for its own id so two figures on a page never share one.
 */
export const UID_TOKEN = "ANXUID";

export type Teardown = () => void;

export function useLazyArt(
  src: string,
  mount: (slot: HTMLElement, uid: string) => Promise<Teardown | void> | Teardown | void,
  { margin = "600px 0px" }: { margin?: string } = {},
) {
  const slot = useRef<HTMLDivElement>(null);
  const run = useRef(mount);
  run.current = mount;
  const uid = `a${useId().replace(/[^A-Za-z0-9_-]/g, "")}`;

  useEffect(() => {
    const node = slot.current;
    if (!node) return;
    let dead = false;
    let teardown: Teardown | void;
    const abort = new AbortController();

    const load = async () => {
      try {
        if (!node.querySelector("svg")) {
          const response = await fetch(src, { signal: abort.signal });
          if (!response.ok) throw new Error(`figure art ${response.status}`);
          const text = await response.text();
          if (dead) return;
          if (!text.trimStart().startsWith("<svg")) throw new Error("figure art is not an SVG");
          node.innerHTML = text.split(UID_TOKEN).join(uid);
        }
        node.setAttribute("data-art", "ready");
        const done = await run.current(node, uid);
        if (dead) done?.();
        else teardown = done;
      } catch (error) {
        if (!dead && !(error instanceof DOMException && error.name === "AbortError")) node.setAttribute("data-art", "failed");
      }
    };

    if (typeof IntersectionObserver === "undefined") {
      void load();
    } else {
      const watch = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          watch.disconnect();
          void load();
        },
        { rootMargin: margin },
      );
      watch.observe(node);
      abort.signal.addEventListener("abort", () => watch.disconnect());
    }

    return () => {
      dead = true;
      abort.abort();
      teardown?.();
    };
  }, [src, uid, margin]);

  return slot;
}
