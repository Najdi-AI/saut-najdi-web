"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { localePath, type Locale } from "@/lib/i18n";
import {
  CAL_LINK_QUICK,
  SUPPORT_EMAIL,
  WEBCHAT_KEY,
  WEBCHAT_FRAME_URL,
} from "@/lib/site";
import { AnimatedIcon } from "./icons";
import { CalButton } from "./CalButton";

/**
 * Floating AI-chat launcher. With a widget key configured it embeds the
 * platform's own web-chat frame (the same agent tech the site sells —
 * app.najdiai.com/widget/frame). Without a key it opens an honest
 * contact panel instead — never a dead chat box.
 */

const t = {
  ar: {
    open: "اسأل عن صوت نجدي",
    close: "إغلاق الدردشة",
    title: "اسأل صوت نجدي",
    sub: "وكيلنا يجاوبك — نفس التقنية اللي نقدمها لك",
    fallbackTitle: "الدردشة الذكية على وشك التفعيل",
    fallbackBody: "لين ما تجهز، نجاوبك مباشرة بالطرق هذي:",
    quick: "احجز مكالمة سريعة — 15 دقيقة",
    faq: "الأسئلة الشائعة",
    frameTitle: "دردشة صوت نجدي",
  },
  en: {
    open: "Ask about Saut Najdi",
    close: "Close chat",
    title: "Ask Saut Najdi",
    sub: "Our agent answers you — the same tech we sell",
    fallbackTitle: "Smart chat is almost live",
    fallbackBody: "Until it's ready, reach us directly:",
    quick: "Book a quick 15-minute call",
    faq: "FAQ",
    frameTitle: "Saut Najdi chat",
  },
} as const;

export function ChatLauncher({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const s = t[locale];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /**
   * Mirror the site theme into the widget frame. ThemeToggle fires
   * `themechange` on <html> rather than us polling, and the initial read
   * happens on mount because ThemeScript has already stamped the attribute
   * by then. Server-rendered as "light" so the markup is deterministic.
   */
  const [frameScheme, setFrameScheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const root = document.documentElement;
    const read = () =>
      setFrameScheme(root.getAttribute("data-theme") === "dark" ? "dark" : "light");
    read();
    root.addEventListener("themechange", read);
    return () => root.removeEventListener("themechange", read);
  }, []);

  return (
    <div className="fixed bottom-5 start-5 z-[90]">
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={reduced ? undefined : { opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="absolute bottom-[4.5rem] start-0 flex h-[min(560px,calc(100dvh-7rem))] w-[min(360px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card-hover"
          >
            <div className="flex items-center justify-between gap-3 border-b border-line bg-canvas px-4 py-3">
              <div>
                <p className="text-body-lg font-bold text-ink">{s.title}</p>
                <p className="text-body-sm text-ink/60">{s.sub}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={s.close}
                className="rounded-full border border-line p-2 text-ink/60 transition-colors hover:text-ink"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden fill="none">
                  <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {WEBCHAT_KEY ? (
              // `colorScheme` is the only lever we have on a cross-origin
              // frame: it decides what prefers-color-scheme reports INSIDE it,
              // and the widget themes itself off that. It used to be pinned to
              // light so the widget could not go dark under a light page;
              // now it follows the site's own theme instead, so a dark page
              // does not open a white rectangle over itself.
              <iframe
                src={WEBCHAT_FRAME_URL(WEBCHAT_KEY)}
                title={s.frameTitle}
                className="min-h-0 w-full flex-1 border-0 bg-surface"
                style={{ colorScheme: frameScheme }}
                allow="clipboard-write; microphone"
              />
            ) : (
              <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-5">
                <p className="text-body-lg font-bold text-ink">{s.fallbackTitle}</p>
                <p className="text-body-lg leading-relaxed text-ink/70">{s.fallbackBody}</p>
                <CalButton calLink={CAL_LINK_QUICK} locale={locale} variant="secondary" className="w-full">
                  {s.quick}
                </CalButton>
                <Link
                  href={localePath(locale, "faq")}
                  onClick={() => setOpen(false)}
                  className="btn-secondary w-full"
                >
                  {s.faq}
                </Link>
                <a href={`mailto:${SUPPORT_EMAIL}`} dir="ltr" className="text-center text-body-lg text-brand-blue hover:underline">
                  {SUPPORT_EMAIL}
                </a>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? s.close : s.open}
        className="ring-spectrum relative flex h-14 w-14 items-center justify-center rounded-full text-brand-purple shadow-card-hover transition-transform hover:scale-105"
      >
        {!reduced && !open && (
          <span aria-hidden className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-brand-blue/40" />
        )}
        <AnimatedIcon name="chat" size={24} />
      </button>
    </div>
  );
}
