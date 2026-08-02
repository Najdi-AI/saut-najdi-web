"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { localePath, type Locale } from "@/lib/i18n";
import type { MegaIcon, MegaMenu } from "@/content/nav";
import { Waveform } from "@/components/Waveform";

/**
 * Mega menu (ported from the haroon911 reference): hover for pointers,
 * click/Enter for keyboard and touch, Escape closes with focus return,
 * forgiving close delay. Items with path=null render as non-links with
 * a badge — the no-dead-links rule.
 */
export function NavMenu({
  locale,
  label,
  menu,
}: {
  locale: Locale;
  label: string;
  menu: MegaMenu;
}) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelId = useId();
  const pathname = usePathname();

  const cancel = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  const openNow = () => {
    cancel();
    setOpen(true);
  };
  const closeSoon = () => {
    cancel();
    timer.current = setTimeout(() => setOpen(false), 140);
  };

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  useEffect(() => cancel, []);

  return (
    <div
      className="mega"
      ref={wrap}
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        ref={trigger}
        className="hdr-link mega-btn"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        onFocus={openNow}
      >
        {label}
        <svg width="11" height="7" viewBox="0 0 11 7" fill="none" aria-hidden="true">
          <path d="M1 1l4.5 4.5L10 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="mega-panel glass" id={panelId} data-open="true" role="group">
          <div className="mega-cols">
            {menu.columns.map((col) => (
              <div className="mega-col" key={col.heading}>
                <p className="mega-heading">{col.heading}</p>
                <ul>
                  {col.items.map((item) => {
                    const body = (
                      <>
                        <span className="mega-ico" aria-hidden="true">
                          <NavIcon name={item.icon} />
                        </span>
                        <span className="mega-txt">
                          <b>
                            {item.label}
                            {item.badge && <em className="mega-badge">{item.badge}</em>}
                          </b>
                          <small>{item.blurb}</small>
                        </span>
                      </>
                    );
                    return (
                      <li key={item.label}>
                        {item.path ? (
                          <Link href={localePath(locale, item.path)} className="mega-item">
                            {body}
                          </Link>
                        ) : (
                          <span className="mega-item" data-soon="true">
                            {body}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            <Link href={localePath(locale, menu.featured.path)} className="mega-feat">
              <span className="mega-feat-art" aria-hidden="true">
                <Waveform bars={18} maxHeight={34} />
              </span>
              <span className="mega-heading mega-heading--accent">{menu.featured.eyebrow}</span>
              <b>{menu.featured.title}</b>
              <small>{menu.featured.body}</small>
              <span className="mega-feat-cta">{menu.featured.cta}</span>
            </Link>
          </div>

          <div className="mega-rail">
            <span className="mega-rail-links">
              {menu.rail.map((r) => (
                <Link key={r.path} href={localePath(locale, r.path)}>
                  {r.label}
                </Link>
              ))}
            </span>
            <Link href={localePath(locale, menu.railCta.path)} className="mega-rail-cta">
              {menu.railCta.label}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/* Icons built from the logo's rounded bar (ported) — outline/bar only,
   never gradient-filled. */
export function NavIcon({ name }: { name: MegaIcon }) {
  const bars = (h: number[]) => (
    <>
      {h.map((v, i) => (
        <rect key={i} x={2.5 + i * 3.6} y={(20 - v) / 2} width="2.1" height={v} rx="1.05" fill="currentColor" />
      ))}
    </>
  );
  const S = (p: React.ReactNode) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      {p}
    </svg>
  );
  const stroke = {
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "wave":
      return S(bars([7, 12, 16, 10, 6]));
    case "handoff":
      return S(
        <>
          <rect x="2.4" y="6" width="2.2" height="8" rx="1.1" fill="currentColor" />
          <rect x="15.4" y="6" width="2.2" height="8" rx="1.1" fill="currentColor" />
          <path d="M7 10h6m0 0-2-2m2 2-2 2" {...stroke} />
        </>,
      );
    case "book":
      return S(
        <>
          <path d="M3.5 4.5h5a2 2 0 0 1 2 2v9a2 2 0 0 0-2-2h-5z" {...stroke} />
          <path d="M16.5 4.5h-5a2 2 0 0 0-2 2v9a2 2 0 0 1 2-2h5z" {...stroke} />
        </>,
      );
    case "builder":
      return S(
        <>
          <rect x="3" y="3.4" width="5.4" height="5.4" rx="1.6" {...stroke} />
          <rect x="11.6" y="11.2" width="5.4" height="5.4" rx="1.6" {...stroke} />
          <path d="M8.4 6.1h3.2a2 2 0 0 1 2 2v3.1" {...stroke} />
        </>,
      );
    case "chart":
      return S(bars([6, 10, 14, 18]));
    case "chat":
      return S(<path d="M3.4 5.6A2 2 0 0 1 5.4 3.6h9.2a2 2 0 0 1 2 2v5.6a2 2 0 0 1-2 2H8l-4.6 3z" {...stroke} />);
    case "clinic":
      return S(
        <>
          <rect x="3.4" y="3.4" width="13.2" height="13.2" rx="3.2" {...stroke} />
          <path d="M10 7v6M7 10h6" {...stroke} />
        </>,
      );
    case "restaurant":
      return S(
        <>
          <path d="M6 3.2v6.4a2 2 0 0 0 2 2v5.2M6 3.2v4M8 3.2v4" {...stroke} />
          <path d="M14 3.2c-1.2 1-1.8 2.6-1.8 4.4 0 1.4.6 2.2 1.8 2.4v6.8" {...stroke} />
        </>,
      );
    case "hotel":
      return S(
        <>
          <path d="M3.2 16.4V6.2l6.8-3 6.8 3v10.2" {...stroke} />
          <path d="M8 16.4v-4.2h4v4.2" {...stroke} />
        </>,
      );
    case "estate":
      return S(
        <>
          <path d="M3.4 8.6 10 3.4l6.6 5.2v7.8H3.4z" {...stroke} />
          <path d="M8.2 16.4v-4.6h3.6v4.6" {...stroke} />
        </>,
      );
    case "retail":
      return S(
        <>
          <path d="M3.6 6.6h12.8l-1 9.8H4.6z" {...stroke} />
          <path d="M7.4 8.4V6a2.6 2.6 0 0 1 5.2 0v2.4" {...stroke} />
        </>,
      );
    default:
      return S(<path d="M10 3 16.4 5.2v5.1c0 3.6-2.6 6.5-6.4 7.5-3.8-1-6.4-3.9-6.4-7.5V5.2z" {...stroke} />);
  }
}
