"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Waveform } from "@/components/Waveform";
import type { Locale } from "@/lib/i18n";
import { dirOf, localePath } from "@/lib/i18n";

/**
 * Styled real 404 (blueprint §8.5). With multiple root layouts, Next
 * synthesizes the 404 document shell without lang/dir — we set them on
 * the client, since the status code + noindex (what crawlers need) are
 * already correct in the raw response.
 */
const t = {
  ar: {
    h1: "الصفحة غير موجودة",
    body: "يمكن الرابط تغيّر أو انكتب غلط. تقدر ترجع للرئيسية أو تشوف كيف يشتغل صوت نجدي.",
    home: "الرئيسية",
    how: "كيف يشتغل",
    demo: "احجز عرضاً",
  },
  en: {
    h1: "Page not found",
    body: "The link may have changed or been mistyped. Head back home or see how Saut Najdi works.",
    home: "Home",
    how: "How it works",
    demo: "Book a demo",
  },
} as const;

export function NotFoundView({ locale }: { locale: Locale }) {
  const s = t[locale];
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dirOf(locale);
  }, [locale]);
  return (
    <div
      dir={dirOf(locale)}
      className="container flex min-h-[70vh] flex-col items-center justify-center py-20 text-center font-sans"
    >
      <Waveform bars={24} maxHeight={48} animate={false} className="opacity-60" />
      <h1 className="mt-6 text-h2">{s.h1}</h1>
      <p className="mt-3 max-w-md text-body-lg text-ink/65">{s.body}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href={localePath(locale, "")} className="btn-primary">{s.home}</Link>
        <Link href={localePath(locale, "how-it-works")} className="btn-secondary">{s.how}</Link>
        <Link href={localePath(locale, "demo")} className="btn-secondary">{s.demo}</Link>
      </div>
    </div>
  );
}
