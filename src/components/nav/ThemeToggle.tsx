"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";

/**
 * Light/dark switch in the header.
 *
 * The theme is already resolved and applied by ThemeScript before paint, so
 * this reads the DOM rather than owning the value — a useState default would
 * disagree with what is on screen for one frame and flip the icon.
 *
 * Renders the icon only after mount. Before that the server and client cannot
 * agree on which icon is correct (the server has no idea what the visitor's
 * OS prefers), and guessing produces a hydration mismatch on half of all
 * loads. The button keeps its footprint either way so the header does not
 * shift when the icon lands.
 */
const label = {
  ar: { toDark: "الوضع الداكن", toLight: "الوضع الفاتح" },
  en: { toDark: "Dark mode", toLight: "Light mode" },
} as const;

export function ThemeToggle({ locale }: { locale: Locale }) {
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.getAttribute("data-theme") === "dark");
    setReady(true);
  }, []);

  const toggle = () => {
    const next = !dark;
    const root = document.documentElement;

    /**
     * Kill transitions for the duration of the swap.
     *
     * Two reasons. The cosmetic one: without it every colour on the page
     * crossfades over 400ms and the switch feels like a smear. The load-
     * bearing one: the header's glass scrim is `rgb(var(--scrim-rgb)/.72)`
     * with a transition on it, and Chrome does not restart a running
     * transition when only a custom property underneath it changes — flip the
     * theme while the capsule is showing and the scrim latches a half-faded
     * dark value and stays there, grey, over a white page.
     */
    root.classList.add("theme-switching");

    if (next) root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    // Keeps form controls, scrollbars and the ChatLauncher frame in step.
    root.style.colorScheme = next ? "dark" : "light";
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* private mode — the choice just will not survive the session */
    }
    root.dispatchEvent(new CustomEvent("themechange", { detail: next ? "dark" : "light" }));
    setDark(next);

    // Reflow so the no-transition rule is in force for this repaint, then
    // hand transitions back a frame later.
    void root.offsetWidth;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => root.classList.remove("theme-switching")),
    );
  };

  const t = label[locale];
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={dark ? t.toLight : t.toDark}
      title={dark ? t.toLight : t.toDark}
    >
      {!ready ? null : dark ? (
        // Sun — click to go light
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
          <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
            <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" />
          </g>
        </svg>
      ) : (
        // Moon — click to go dark
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M20.5 14.3A8.6 8.6 0 0 1 9.7 3.5a8.6 8.6 0 1 0 10.8 10.8Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
