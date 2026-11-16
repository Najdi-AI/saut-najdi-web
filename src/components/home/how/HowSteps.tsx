"use client";

import { Fragment, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { useInView } from "../ui/useInView";
import s from "./How.module.css";
import { usePinFit } from "./usePinFit";

/**
 * The statements and their fragments, in reading order: each statement is
 * followed by its own state. That order is the layout on a phone, under
 * reduced motion and without JavaScript (every state visible). Once this has
 * hydrated on a wide, tall enough screen, and while the tallest state fits
 * the window at the current text settings (usePinFit, data-pin), the CSS
 * pins the three states over one another beside the statements, and the
 * statement crossing the middle of the viewport, seen by one
 * IntersectionObserver, sets which one shows. No scroll listeners, nothing
 * is prevented.
 */
export function HowSteps({ steps, states }: { steps: { title: string; body: string }[]; states: ReactNode[] }) {
  const [ref, inView] = useInView<HTMLDivElement>({ once: false, rootMargin: "0px", threshold: 0 });
  const [active, setActive] = useState(0);
  const pin = usePinFit(ref);

  useEffect(() => {
    const root = ref.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    const steps = root.querySelectorAll("[data-step]");
    const last = steps.length - 1;
    // A band one tenth of the viewport tall around its middle line. Past
    // either end nothing is in it: the first statement leaving below means
    // the start, the last one leaving above means the end.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const i = Number((e.target as HTMLElement).dataset.step);
          const band = e.rootBounds;
          if (e.isIntersecting) setActive(i);
          else if (band && i === 0 && e.boundingClientRect.top >= band.bottom) setActive(0);
          else if (band && i === last && e.boundingClientRect.bottom <= band.top) setActive(last);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    steps.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ref]);

  // Arriving from far away (a jump to the top or the end) crosses no band
  // edge: when the section comes into view, start from where it is.
  useEffect(() => {
    const root = ref.current;
    if (!inView || !root) return;
    const steps = root.querySelectorAll("[data-step]");
    const mid = window.innerHeight / 2;
    if (steps[0].getBoundingClientRect().top > mid) setActive(0);
    else if (steps[steps.length - 1].getBoundingClientRect().bottom < mid) setActive(steps.length - 1);
  }, [inView, ref]);

  return (
    <div ref={ref} className={s.flow} data-pin={pin || undefined} data-in-view={inView || undefined}>
      {steps.map((step, i) => (
        <Fragment key={step.title}>
          <div className={s.step} data-step={i} data-active={active === i || undefined} style={{ "--row": i + 1 } as CSSProperties}>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </div>
          <div className={s.slot} data-active={active === i || undefined} style={{ "--row": i + 1 } as CSSProperties}>
            <figure className={s.card}>{states[i]}</figure>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
