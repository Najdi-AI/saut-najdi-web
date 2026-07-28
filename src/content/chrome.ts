import type { Locale } from "@/lib/i18n";

/**
 * Header/footer strings. Nav lists only pages that exist (Wave 1) —
 * blueprint §4.1: never a nav item without a real page behind it.
 */
export const chrome = {
  ar: {
    skipToContent: "تجاوز إلى المحتوى",
    nav: [
      { label: "كيف يشتغل", path: "how-it-works" },
      { label: "التصعيد للموظف", path: "product/human-handoff" },
      { label: "الأمان والبيانات", path: "security" },
      { label: "الأسئلة الشائعة", path: "faq" },
    ],
    login: "تسجيل الدخول",
    cta: "احجز عرضاً",
    langSwitch: "EN",
    langSwitchLabel: "English",
    footer: {
      product: {
        title: "المنتج",
        links: [
          { label: "كيف يشتغل", path: "how-it-works" },
          { label: "التصعيد للموظف البشري", path: "product/human-handoff" },
          { label: "الأمان والبيانات", path: "security" },
        ],
      },
      company: {
        title: "الشركة",
        links: [
          { label: "من نحن", path: "about" },
          { label: "تواصل معنا", path: "contact" },
          { label: "الأسئلة الشائعة", path: "faq" },
          { label: "احجز عرضاً", path: "demo" },
        ],
      },
      legal: {
        title: "قانوني",
        links: [
          { label: "سياسة الخصوصية", path: "privacy" },
          { label: "شروط الخدمة", path: "terms" },
          { label: "اتفاقية معالجة البيانات", path: "dpa" },
        ],
      },
      madeIn: "صُنع في السعودية",
      rights: "© 2026 صوت نجدي",
    },
  },
  en: {
    skipToContent: "Skip to content",
    nav: [
      { label: "How it works", path: "how-it-works" },
      { label: "Human handoff", path: "product/human-handoff" },
      { label: "Security & data", path: "security" },
      { label: "FAQ", path: "faq" },
    ],
    login: "Log in",
    cta: "Book a demo",
    langSwitch: "عربي",
    langSwitchLabel: "العربية",
    footer: {
      product: {
        title: "Product",
        links: [
          { label: "How it works", path: "how-it-works" },
          { label: "Human handoff", path: "product/human-handoff" },
          { label: "Security & data", path: "security" },
        ],
      },
      company: {
        title: "Company",
        links: [
          { label: "About us", path: "about" },
          { label: "Contact", path: "contact" },
          { label: "FAQ", path: "faq" },
          { label: "Book a demo", path: "demo" },
        ],
      },
      legal: {
        title: "Legal",
        links: [
          { label: "Privacy policy", path: "privacy" },
          { label: "Terms of service", path: "terms" },
          { label: "Data processing agreement", path: "dpa" },
        ],
      },
      madeIn: "Made in Saudi Arabia",
      rights: "© 2026 Saut Najdi",
    },
  },
} satisfies Record<Locale, unknown>;
