"use client";

import { useEffect } from "react";
import { mountCalInline } from "@/lib/cal";
import { localePath, type Locale } from "@/lib/i18n";

/**
 * Inline Cal.com calendar for /demo. The page copy above it is fully
 * server-rendered; only the calendar itself is script-dependent (§2.4).
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
  useEffect(() => {
    mountCalInline(id, calLink, localePath(locale, "demo/thank-you"));
  }, [calLink, locale]);
  return (
    <div
      id={id}
      dir="ltr"
      className="min-h-[560px] w-full overflow-hidden rounded-2xl border border-line bg-white shadow-card"
    >
      <p className="p-8 text-center text-body text-ink/50">{loadingLabel}</p>
    </div>
  );
}
