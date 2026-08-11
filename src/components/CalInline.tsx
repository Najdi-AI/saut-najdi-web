"use client";

import { useEffect, useState } from "react";
import { mountCalInline } from "@/lib/cal";
import { localePath, type Locale } from "@/lib/i18n";

/**
 * The inline Cal.com booker on /demo. The page copy around it is fully
 * server-rendered; only the calendar itself is script-dependent (§2.4).
 * If the embed script is blocked, a direct booking link is shown instead.
 *
 * Always `dir="ltr"`: Cal's booker lays itself out left-to-right whatever
 * the host page does, so letting the Arabic page's RTL leak in only mirrors
 * the grid against its own internal assumptions. The panel beside it — the
 * one carrying our Arabic copy — is the part that flips.
 */
export function CalInline({
  calLink,
  locale,
  loadingLabel,
}: {
  calLink: string;
  locale: Locale;
  loadingLabel: string;
}) {
  const id = "cal-inline-embed";
  const [failed, setFailed] = useState(false);
  const [mounted, setMounted] = useState(false);

  /**
   * Mount when the desk gets near the viewport, not on page load.
   *
   * On /demo the booker sits high up, so this fires immediately and nothing
   * changes. It matters on the homepage, where the desk is the LAST section:
   * eager mounting would make every visitor pay for Cal's script and iframe
   * to render a calendar most of them never scroll to, on the page whose Core
   * Web Vitals matter most. The margin is deliberately generous so the
   * calendar is already there by the time it is actually on screen.
   *
   * No IntersectionObserver (very old browser) means mount immediately —
   * failing towards a working calendar, never a missing one.
   */
  useEffect(() => {
    let cancelled = false;
    const host = document.getElementById(id);
    const start = () => {
      mountCalInline(id, calLink, localePath(locale, "demo/thank-you")).then((ok) => {
        if (!cancelled && !ok) setFailed(true);
      });
    };

    if (!host || typeof IntersectionObserver === "undefined") {
      start();
      return () => {
        cancelled = true;
      };
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          start();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(host);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [calLink, locale]);

  /**
   * Retire the loading line the moment Cal inserts its <cal-inline> element.
   * Cal APPENDS to the host rather than replacing its children, so without
   * this the label sits above the finished calendar forever — which it has
   * been doing in production.
   *
   * The trigger is the element landing, deliberately. Cal's own readiness
   * signals are not trustworthy here: the booker renders and takes bookings
   * on loads where `<cal-inline loading>` never reaches "done" and the iframe
   * keeps its placeholder `height:100%`. Gating on those would hide a working
   * calendar behind an error line.
   */
  useEffect(() => {
    const host = document.getElementById(id);
    if (!host) return;
    if (host.querySelector("cal-inline")) {
      setMounted(true);
      return;
    }
    const observer = new MutationObserver(() => {
      if (host.querySelector("cal-inline")) {
        observer.disconnect();
        setMounted(true);
      }
    });
    observer.observe(host, { childList: true });
    return () => observer.disconnect();
  }, []);

  // `relative` + an absolutely-placed label: it shares the box with Cal's own
  // skeleton rather than pushing it down, so retiring it shifts nothing. The
  // min-height only holds the card open until Cal reports its own size — set
  // it above the booker's settled height and the card keeps a strip of dead
  // space under the calendar forever.
  return (
    <div id={id} dir="ltr" className="relative min-h-[540px] w-full overflow-hidden">
      {mounted ? null : (
        <p
          className="absolute inset-x-0 top-0 z-10 p-8 text-center text-body"
          dir={locale === "ar" ? "rtl" : "ltr"}
        >
          {failed ? (
            <a
              href={`https://cal.com/${calLink}`}
              target="_blank"
              rel="noopener"
              className="font-medium text-brand-cyan underline-offset-4 hover:underline"
            >
              {locale === "ar"
                ? "التقويم ما قدر يحمّل هنا — افتح صفحة الحجز مباشرة"
                : "The calendar couldn't load here — open the booking page directly"}
            </a>
          ) : (
            <span className="text-white/45">{loadingLabel}</span>
          )}
        </p>
      )}
    </div>
  );
}
