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

  useEffect(() => {
    let cancelled = false;
    mountCalInline(id, calLink, localePath(locale, "demo/thank-you")).then(
      (ok) => {
        if (!cancelled && !ok) setFailed(true);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [calLink, locale]);

  /**
   * Retire the loading line the moment Cal inserts its <cal-inline> element.
   * Cal APPENDS to the host rather than replacing its children, so without
   * this the label sits above the finished calendar forever — which it has
   * been doing in production. Watching for the element (rather than
   * resolving off the script promise) means the label survives exactly as
   * long as there is nothing else in the box.
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
        setMounted(true);
        observer.disconnect();
      }
    });
    observer.observe(host, { childList: true });
    return () => observer.disconnect();
  }, []);

  // The min-height only holds the card open until Cal reports its own size.
  // Set it above the booker's settled height and the card keeps a strip of
  // dead space under the calendar forever.
  return (
    <div id={id} dir="ltr" className="min-h-[540px] w-full overflow-hidden">
      {mounted ? null : failed ? (
        <p
          className="p-8 text-center text-body-lg"
          dir={locale === "ar" ? "rtl" : "ltr"}
        >
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
        </p>
      ) : (
        <p className="p-8 text-center text-body text-white/45">{loadingLabel}</p>
      )}
    </div>
  );
}
