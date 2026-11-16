"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import s from "./PlanWalk.module.css";

/**
 * The walk's client island: the tier index, the four sentinels and the
 * announcement. The tiers themselves are server markup passed as children;
 * this only says which one is on (data-active), and the CSS module shows it.
 *
 * One IntersectionObserver watches a line across the middle of the window:
 * the sentinel on that line is the active tier. There are no scroll, pointer
 * or key listeners and nothing blocks a default action, so the page scrolls
 * as it always does and the tiers follow. A tier name scrolls to its step.
 */
export function PlanSteps({
  label,
  names,
  prices,
  said,
  children,
}: {
  label: string;
  names: string[];
  /** Each tier's figure in words, read after its name on the tier button. */
  prices: string[];
  /** What the polite live region reads for each tier. */
  said: string[];
  children: ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(0);
  const [heard, setHeard] = useState("");
  const last = useRef(0);

  useEffect(() => {
    const el = box.current;
    // No observer, no walk: the tiers stay stacked.
    if (!el || typeof IntersectionObserver === "undefined") return;
    const on = new Set<number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const i = Number((e.target as HTMLElement).dataset.mark);
          if (e.isIntersecting) on.add(i);
          else on.delete(i);
        }
        // Two sentinels share the line only at a boundary; the later one wins.
        if (on.size) return setActive(Math.max(...on));
        // Off the line after a jump: first tier below it, last above it, unread (the
        // panel is off screen). Hidden sentinels (stacked cards) have no box.
        const e = entries.find((x) => x.rootBounds && x.boundingClientRect.height);
        if (!e?.rootBounds) return;
        last.current = e.boundingClientRect.top > e.rootBounds.top ? 0 : names.length - 1;
        setActive(last.current);
        setHeard("");
      },
      { rootMargin: "-50% 0px -49% 0px" },
    );
    el.querySelectorAll("[data-mark]").forEach((m) => io.observe(m));
    setReady(true);
    return () => io.disconnect();
  }, [names.length]);

  // Announce a tier once it has held for 450ms, so scrolling past one never reads it.
  useEffect(() => {
    if (active === last.current) return;
    const id = setTimeout(() => {
      if (active === last.current) return; // reset off screen meanwhile
      last.current = active;
      setHeard(said[active]);
    }, 450);
    return () => clearTimeout(id);
  }, [active, said]);

  const go = (i: number) => {
    const mark = box.current?.querySelector(`[data-mark="${i}"]`);
    if (!mark) return;
    const r = mark.getBoundingClientRect();
    window.scrollTo({
      top: window.scrollY + r.top + r.height / 2 - window.innerHeight / 2,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };

  return (
    <div ref={box} className={s.walk} data-ready={ready || undefined} data-active={active}>
      <div className={s.panel}>
        <ol className={s.index} aria-label={label}>
          {names.map((name, i) => (
            <li key={name}>
              <Button
                variant="ghost"
                className={s.tier}
                aria-current={i === active ? "step" : undefined}
                onClick={() => go(i)}
              >
                {name}
                <span className="sr-only">{prices[i]}</span>
              </Button>
            </li>
          ))}
        </ol>
        <div className={s.stage}>{children}</div>
      </div>
      {names.map((name, i) => (
        <div key={name} className={s.mark} data-mark={i} aria-hidden style={{ "--i": i } as CSSProperties} />
      ))}
      <p className="sr-only" aria-live="polite">
        {heard}
      </p>
    </div>
  );
}
