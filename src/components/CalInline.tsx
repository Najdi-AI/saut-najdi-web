"use client";

import { useEffect, useState } from "react";
import { mountCalInline } from "@/lib/cal";
import { localePath, type Locale } from "@/lib/i18n";

/**
 * Inline Cal.com calendar for /demo. The page copy above it is fully
 * server-rendered; only the calendar itself is script-dependent (§2.4).
 * If the embed script is blocked, a direct booking link is shown instead.
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
  return (
    <div
      id={id}
      dir="ltr"
      className="min-h-[560px] w-full overflow-hidden rounded-2xl border border-line bg-white shadow-card"
    >
      {failed ? (
        <p className="p-8 text-center text-body-lg" dir={locale === "ar" ? "rtl" : "ltr"}>
          <a
            href={`https://cal.com/${calLink}`}
            target="_blank"
            rel="noopener"
            className="font-medium text-brand-blue underline-offset-4 hover:underline"
          >
            {locale === "ar"
              ? "التقويم ما قدر يحمّل هنا — افتح صفحة الحجز مباشرة"
              : "The calendar couldn't load here — open the booking page directly"}
          </a>
        </p>
      ) : (
        <p className="p-8 text-center text-body text-ink/60">{loadingLabel}</p>
      )}
    </div>
  );
}
