"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export function PricingTooltip({ children, explanation, id }: { children: ReactNode; explanation: string; id: string }) {
  const trigger = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState<{ left: number; top?: number; bottom?: number } | null>(null);

  const show = useCallback(() => {
    const rect = trigger.current?.getBoundingClientRect();
    if (!rect) return;
    if (rect.bottom < 0 || rect.top > window.innerHeight) {
      setPosition(null);
      return;
    }

    const left = Math.max(8, Math.min(rect.left, window.innerWidth - 264));
    setPosition(rect.top < window.innerHeight / 2
      ? { left, top: rect.bottom + 8 }
      : { left, bottom: window.innerHeight - rect.top + 8 });
  }, []);

  useEffect(() => {
    if (!position) return;
    window.addEventListener("scroll", show, true);
    window.addEventListener("resize", show);
    return () => {
      window.removeEventListener("scroll", show, true);
      window.removeEventListener("resize", show);
    };
  }, [position, show]);

  return (
    <>
      <span
        ref={trigger}
        tabIndex={0}
        aria-describedby={id}
        className="cursor-help rounded-sm underline decoration-dotted underline-offset-4 focus:outline-2 focus:outline-offset-2 focus:outline-brand-blue"
        onPointerEnter={show}
        onPointerLeave={() => setPosition(null)}
        onFocus={show}
        onBlur={() => setPosition(null)}
      >
        {children}
      </span>
      <span id={id} hidden>{explanation}</span>
      {position && createPortal(
        <span
          role="tooltip"
          style={position}
          className="pointer-events-none fixed z-50 w-64 max-h-[50vh] overflow-y-auto rounded-lg bg-ink px-3 py-2 text-start text-sm leading-relaxed text-canvas shadow-lg"
        >
          {explanation}
        </span>,
        document.body,
      )}
    </>
  );
}
