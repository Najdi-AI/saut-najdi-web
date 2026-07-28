"use client";

import { track } from "@vercel/analytics";
import { CAL_LINK_QUICK } from "./site";

/**
 * Cal.com embed loader (blueprint §2.4): nothing Cal-related loads until the
 * first click — protecting Core Web Vitals — and the conversion event fires
 * on the actual booking, not the click. Script-load failures reject so the
 * new-tab fallback actually runs (review fix), and quick-call bookings are
 * tracked separately from demo bookings.
 */

type CalApi = {
  (...args: unknown[]): void;
  loaded?: boolean;
  ns?: Record<string, unknown>;
  q?: unknown[];
};

declare global {
  interface Window {
    Cal?: CalApi;
  }
}

let bootPromise: Promise<void> | null = null;

function bootCal(): Promise<void> {
  if (bootPromise) return bootPromise;
  bootPromise = new Promise<void>((resolve, reject) => {
    const w = window as Window;
    if (w.Cal?.loaded) {
      resolve();
      return;
    }
    // Official Cal.com vanilla snippet, condensed
    const C = window as unknown as Record<string, CalApi>;
    const d = document;
    const p = (a: CalApi, ar: unknown) => {
      a.q!.push(ar);
    };
    const cal: CalApi = function (...args: unknown[]) {
      const self = C.Cal as CalApi;
      if (!self.loaded) {
        self.ns = {};
        self.q = self.q || [];
        const s = d.createElement("script");
        s.src = "https://app.cal.com/embed/embed.js";
        s.onload = () => resolve();
        s.onerror = () => {
          // Allow a later retry and let callers fall back
          bootPromise = null;
          reject(new Error("cal embed script failed to load"));
        };
        d.head.appendChild(s);
        self.loaded = true;
      }
      p(self, args);
    } as CalApi;
    cal.q = [];
    C.Cal = cal;
    C.Cal("init", { origin: "https://cal.com" });
    C.Cal("ui", {
      theme: "light",
      cssVarsPerTheme: {
        light: { "cal-brand": "#0D1326" },
      },
    });
  });
  return bootPromise;
}

/** The last-opened link decides the analytics event on booking success. */
let activeCalLink = "";
let listenerBound = false;

function bindBookingListener(thankYouPath: string) {
  if (listenerBound || !window.Cal) return;
  listenerBound = true;
  window.Cal("on", {
    action: "bookingSuccessful",
    callback: () => {
      try {
        track(activeCalLink === CAL_LINK_QUICK ? "quick_call_booked" : "demo_booked");
      } catch {
        /* analytics unavailable — never block the redirect */
      }
      window.location.assign(thankYouPath);
    },
  });
}

/** Open a Cal.com event as a modal; falls back to a new tab if embed fails. */
export async function openCalModal(calLink: string, thankYouPath: string) {
  try {
    await bootCal();
    activeCalLink = calLink;
    bindBookingListener(thankYouPath);
    window.Cal!("modal", { calLink });
  } catch {
    window.open(`https://cal.com/${calLink}`, "_blank", "noopener");
  }
}

/**
 * Mount an inline Cal.com embed into the element with the given id.
 * Returns false if the embed script could not load (caller shows a link).
 */
export async function mountCalInline(
  elementId: string,
  calLink: string,
  thankYouPath: string,
): Promise<boolean> {
  try {
    await bootCal();
    activeCalLink = calLink;
    bindBookingListener(thankYouPath);
    window.Cal!("inline", {
      elementOrSelector: `#${elementId}`,
      calLink,
      config: { theme: "light" },
    });
    return true;
  } catch {
    return false;
  }
}
