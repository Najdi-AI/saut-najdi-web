"use client";

import { track } from "@vercel/analytics";
import { CAL_LINK_QUICK } from "./site";
import { BOOKER_DARK_VARS } from "./bookerTheme";

/**
 * Cal.com embed loader (blueprint §2.4): nothing Cal-related loads until the
 * first click — protecting Core Web Vitals — and the conversion event fires
 * on the actual booking, not the click. Script-load failures reject so the
 * new-tab fallback actually runs, and quick-call bookings are tracked
 * separately from demo bookings.
 *
 * The loader below is the OFFICIAL Cal snippet, namespace-aware, rather than
 * the condensed one it replaces. The site now needs two embeds wearing two
 * different skins:
 *
 *   - the DEFAULT namespace stays light. It powers every modal on the site,
 *     and a dark modal thrown over a light page reads as a bug.
 *   - the `booker` namespace is dark. It powers the single inline booker on
 *     /demo, which sits inside a dark band.
 *
 * `ui` config in Cal is per-namespace, and that is the only reason the two
 * can disagree. Collapse the namespace and the modal follows the booker
 * into dark everywhere.
 */

type CalApi = {
  (...args: unknown[]): void;
  loaded?: boolean;
  ns?: Record<string, CalApi>;
  q?: unknown[];
};

declare global {
  interface Window {
    Cal?: CalApi;
  }
}

const CAL_ORIGIN = "https://cal.com";
const EMBED_SRC = "https://app.cal.com/embed/embed.js";
const BOOKER_NS = "booker";

let bootPromise: Promise<void> | null = null;

/** A namespace stub: queues calls until embed.js adopts the queue. */
function newNamespaceApi(): CalApi {
  const api = function (...args: unknown[]) {
    api.q!.push(args);
  } as CalApi;
  api.q = [];
  return api;
}

/**
 * Install the Cal stub and start the real script.
 *
 * The stub is installed SYNCHRONOUSLY, before the returned promise settles,
 * so callers may queue `init`/`ui`/`inline` immediately and only await the
 * promise to learn whether the script actually arrived. That ordering is
 * what the official snippet relies on: once embed.js loads it adopts the
 * queues in place rather than replacing `window.Cal`.
 */
function bootCal(): Promise<void> {
  if (bootPromise) return bootPromise;
  bootPromise = new Promise<void>((resolve, reject) => {
    if (window.Cal?.loaded) {
      resolve();
      return;
    }
    const d = document;
    const cal = function (...args: unknown[]) {
      const self = window.Cal as CalApi;
      if (!self.loaded) {
        self.ns = {};
        self.q = self.q || [];
        const s = d.createElement("script");
        s.src = EMBED_SRC;
        s.onload = () => resolve();
        s.onerror = () => {
          bootPromise = null; // allow a later retry
          reject(new Error("cal embed script failed to load"));
        };
        d.head.appendChild(s);
        self.loaded = true;
      }
      // `init` with a string second argument opens a namespace; everything
      // else goes onto the default queue. This branch is the entire reason
      // the official snippet is longer than the condensed one.
      if (args[0] === "init" && typeof args[1] === "string") {
        const name = args[1];
        const api = (self.ns![name] ??= newNamespaceApi());
        api.q!.push(args);
        self.q!.push(["initNamespace", name]);
        return;
      }
      self.q!.push(args);
    } as CalApi;
    cal.q = [];
    window.Cal = cal;
    cal("init", { origin: CAL_ORIGIN });
    cal("ui", {
      theme: "light",
      cssVarsPerTheme: { light: { "cal-brand": "#0D1326" } },
    });
  });
  return bootPromise;
}

/** The last-opened link decides the analytics event on booking success. */
let activeCalLink = "";

function onBooked(thankYouPath: string) {
  return () => {
    try {
      track(activeCalLink === CAL_LINK_QUICK ? "quick_call_booked" : "demo_booked");
    } catch {
      /* analytics unavailable — never block the redirect */
    }
    window.location.assign(thankYouPath);
  };
}

let modalListenerBound = false;
let bookerListenerBound = false;

/** Open a Cal.com event as a modal; falls back to a new tab if embed fails. */
export async function openCalModal(calLink: string, thankYouPath: string) {
  try {
    await bootCal();
    activeCalLink = calLink;
    if (!modalListenerBound) {
      modalListenerBound = true;
      window.Cal!("on", { action: "bookingSuccessful", callback: onBooked(thankYouPath) });
    }
    window.Cal!("modal", { calLink });
  } catch {
    window.open(`${CAL_ORIGIN}/${calLink}`, "_blank", "noopener");
  }
}

/**
 * Mount the dark inline booker into the element with the given id.
 * Returns false if the embed script could not load (caller shows a link).
 */
export async function mountCalInline(
  elementId: string,
  calLink: string,
  thankYouPath: string,
): Promise<boolean> {
  try {
    /**
     * Queue `init`/`ui`/`inline` on the stub and await the script after, as
     * the official snippet does — embed.js adopts the queues in place rather
     * than replacing `window.Cal`, so these calls run in order once it
     * lands. Awaiting the script FIRST and calling against the loaded API
     * was tried and reverted: it made no difference to the intermittent
     * cold-load stall it was meant to fix, and it delays the iframe by a
     * round trip.
     */
    const booted = bootCal();
    const Cal = window.Cal!;
    Cal("init", BOOKER_NS, { origin: CAL_ORIGIN });
    const ns = Cal.ns?.[BOOKER_NS];
    if (!ns) throw new Error("cal namespace unavailable");

    ns("ui", {
      theme: "dark",
      layout: "month_view",
      /**
       * Cal's own event panel is dropped and DemoPage renders the left
       * column instead. Three reasons, in order of weight: the event is
       * titled "demo" with an empty description upstream; one Cal
       * description cannot serve both /demo and /en/demo; and our panel is
       * in the server-rendered HTML, where the embed contributes nothing.
       * The cost is Cal's timezone picker — slots still follow the
       * visitor's browser timezone, they just cannot override it here.
       */
      hideEventTypeDetails: true,
      cssVarsPerTheme: { dark: BOOKER_DARK_VARS },
    });
    /**
     * No locale here. The booker takes its language from the VISITOR's
     * `navigator.languages`, not from the page it is embedded in, so an
     * Arabic-first browser gets an Arabic right-to-left month grid even on
     * /en/demo. That is the visitor's own language, so it is right for them
     * — and it is not ours to override: `?locale=en` does ride along to the
     * booker URL as a query param, but Cal ignores it (verified 2026-08-10).
     */
    ns("inline", {
      elementOrSelector: `#${elementId}`,
      calLink,
      config: { layout: "month_view", theme: "dark" },
    });
    if (!bookerListenerBound) {
      bookerListenerBound = true;
      ns("on", { action: "bookingSuccessful", callback: onBooked(thankYouPath) });
    }
    activeCalLink = calLink;
    await booted;
    return true;
  } catch {
    return false;
  }
}
