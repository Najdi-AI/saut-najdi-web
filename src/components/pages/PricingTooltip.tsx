"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type HelpSection = { title: string; rows: { label: string; value: string }[]; note?: string };

/** The page's one open tooltip: opening another closes it, so rows never stack tooltips. */
let closeOpenTip: (() => void) | null = null;

export function PricingTooltip({ children, explanation, id, sections }: { children: ReactNode; explanation: string; id: string; sections?: HelpSection[] }) {
  const trigger = useRef<HTMLSpanElement>(null);
  const tooltip = useRef<HTMLSpanElement>(null);
  const focusHelp = useRef(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [position, setPosition] = useState<{ left: number; top?: number; bottom?: number } | null>(null);
  const keepOpen = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);
  const close = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (closeOpenTip === close) closeOpenTip = null;
    setPosition(null);
  }, []);
  // What keeps a tooltip open (WCAG 1.4.13): the pointer on the term or the tooltip, or focus in either.
  const hovered = useCallback(() => !!(trigger.current?.matches(":hover") || tooltip.current?.matches(":hover")), []);
  const engaged = useCallback(() => {
    const active = document.activeElement;
    return hovered() || (!!active && (active === trigger.current || !!tooltip.current?.contains(active)));
  }, [hovered]);
  // The grace lets the pointer cross the gap into the tooltip; it closes only if nothing holds it then.
  const hideSoon = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      if (!engaged()) close();
    }, 180);
  }, [close, engaged]);
  // Focus leaving for anywhere but the tooltip (or the term) closes it at once unless the pointer holds it.
  const onFocusLeave = useCallback((next: EventTarget | null) => {
    const to = next instanceof Node ? next : null;
    if (to && (to === trigger.current || tooltip.current?.contains(to))) return;
    if (hovered()) hideSoon();
    else close();
  }, [close, hideSoon, hovered]);
  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (closeOpenTip === close) closeOpenTip = null;
  }, [close]);
  useEffect(() => {
    if (position && focusHelp.current) {
      focusHelp.current = false;
      tooltip.current?.focus();
    }
  }, [position]);

  // Place the tooltip by its term (below it in the top half of the viewport, above it in the bottom half).
  const place = useCallback(() => {
    const rect = trigger.current?.getBoundingClientRect();
    if (!rect) return;
    if (rect.bottom < 0 || rect.top > window.innerHeight) {
      close();
      return;
    }

    const width = sections ? 320 : 256;
    const left = Math.max(8, Math.min(rect.left, document.documentElement.clientWidth - width - 8));
    setPosition(rect.top < window.innerHeight / 2
      ? { left, top: rect.bottom + 8 }
      : { left, bottom: window.innerHeight - rect.top + 8 });
  }, [close, sections]);

  const show = useCallback(() => {
    keepOpen();
    if (closeOpenTip && closeOpenTip !== close) closeOpenTip();
    closeOpenTip = close;
    place();
  }, [close, keepOpen, place]);

  // On scroll or resize an open tooltip follows its term while something still holds it, and
  // closes otherwise; a scroll never reopens one or cancels a pending close.
  useEffect(() => {
    if (!position) return;
    const follow = () => (engaged() ? place() : close());
    window.addEventListener("scroll", follow, true);
    window.addEventListener("resize", follow);
    return () => {
      window.removeEventListener("scroll", follow, true);
      window.removeEventListener("resize", follow);
    };
  }, [position, engaged, place, close]);

  return (
    <>
      <span
        ref={trigger}
        tabIndex={0}
        aria-describedby={id}
        className="inline-flex min-h-11 cursor-help items-center underline decoration-dotted underline-offset-4 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ring"
        onPointerEnter={show}
        onPointerLeave={hideSoon}
        onFocus={show}
        onBlur={(event) => onFocusLeave(event.relatedTarget)}
        onClick={show}
        onKeyDown={(event) => {
          if (event.key === "Escape") close();
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
          onBlur={(event) => onFocusLeave(event.relatedTarget)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              trigger.current?.focus();
              close();
            }
          }}
          style={position}
          className={`fixed z-50 ${sections ? "w-80" : "w-64"} max-w-[calc(100vw-16px)] max-h-[50vh] overflow-y-auto rounded-(--radius) bg-charcoal p-4 text-start text-sm leading-relaxed text-off-white`}
        >
          {sections ? sections.map((section, index) => <span key={section.title} className={`block ${index ? "mt-3 border-t border-[#3a4566] pt-3" : ""}`}>
            <span className="mb-2 block text-xs font-semibold text-[#a3abbd]">{section.title}</span>
            <span className="grid gap-2">{section.rows.map(row => <span key={row.label} className="flex items-start justify-between gap-4">
              <span className="min-w-0">{row.label}</span><bdi className="shrink-0 whitespace-nowrap font-semibold tabular-nums">{row.value}</bdi>
            </span>)}</span>
            {section.note && <span className="mt-2 block text-xs text-[#a3abbd]">{section.note}</span>}
          </span>) : explanation.split(/[;؛]/).map((line, index) => <span key={index} className={index ? "mt-2 block" : "block"}>{line.trim()}</span>)}
        </span>,
        document.body,
      )}
    </>
  );
}
