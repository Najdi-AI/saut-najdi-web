"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type HelpSection = { title: string; rows: { label: string; value: string }[]; note?: string };

export function PricingTooltip({ children, explanation, id, sections }: { children: ReactNode; explanation: string; id: string; sections?: HelpSection[] }) {
  const trigger = useRef<HTMLSpanElement>(null);
  const tooltip = useRef<HTMLSpanElement>(null);
  const focusHelp = useRef(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [position, setPosition] = useState<{ left: number; top?: number; bottom?: number } | null>(null);
  const keepOpen = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);
  const hideSoon = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setPosition(null), 180);
  }, []);
  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);
  useEffect(() => {
    if (position && focusHelp.current) {
      focusHelp.current = false;
      tooltip.current?.focus();
    }
  }, [position]);

  const show = useCallback(() => {
    keepOpen();
    const rect = trigger.current?.getBoundingClientRect();
    if (!rect) return;
    if (rect.bottom < 0 || rect.top > window.innerHeight) {
      setPosition(null);
      return;
    }

    const width = sections ? 320 : 256;
    const left = Math.max(8, Math.min(rect.left, document.documentElement.clientWidth - width - 8));
    setPosition(rect.top < window.innerHeight / 2
      ? { left, top: rect.bottom + 8 }
      : { left, bottom: window.innerHeight - rect.top + 8 });
  }, [keepOpen, sections]);

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
        onPointerLeave={hideSoon}
        onFocus={show}
        onBlur={hideSoon}
        onClick={show}
        onKeyDown={(event) => {
          if (event.key === "Escape") setPosition(null);
          if (event.key === "Enter" || event.key === "ArrowDown") {
            event.preventDefault(); focusHelp.current = true; show();
          }
        }}
      >
        {children}
      </span>
      <span id={id} hidden>{explanation}</span>
      {position && createPortal(
        <span
          role="tooltip"
          ref={tooltip}
          tabIndex={0}
          onPointerEnter={keepOpen}
          onPointerLeave={hideSoon}
          onFocus={keepOpen}
          onBlur={hideSoon}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              trigger.current?.focus();
              setPosition(null);
            }
          }}
          style={position}
          className={`fixed z-50 ${sections ? "w-80" : "w-64"} max-w-[calc(100vw-16px)] max-h-[50vh] overflow-y-auto rounded-xl bg-ink p-4 text-start text-sm leading-relaxed text-canvas shadow-lg`}
        >
          {sections ? sections.map((section, index) => <span key={section.title} className={`block ${index ? "mt-3 border-t border-canvas/20 pt-3" : ""}`}>
            <span className="mb-2 block text-xs font-semibold text-canvas/70">{section.title}</span>
            <span className="grid gap-2">{section.rows.map(row => <span key={row.label} className="flex items-start justify-between gap-4">
              <span className="min-w-0">{row.label}</span><bdi className="shrink-0 whitespace-nowrap font-semibold tabular-nums">{row.value}</bdi>
            </span>)}</span>
            {section.note && <span className="mt-2 block text-xs text-canvas/70">{section.note}</span>}
          </span>) : explanation.split(/[;؛]/).map((line, index) => <span key={index} className={index ? "mt-2 block" : "block"}>{line.trim()}</span>)}
        </span>,
        document.body,
      )}
    </>
  );
}
