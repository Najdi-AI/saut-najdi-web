import type { Locale } from "@/lib/i18n";

/**
 * Header/footer strings. Nav lists only pages that exist (Wave 1) —
 * blueprint §4.1: never a nav item without a real page behind it.
 */
export const chrome = {
  ar: {
    skipToContent: "تجاوز إلى المحتوى",
    // Feeds the MOBILE sheet and the SiteNavigationElement JSON-LD — not the
    // desktop row, which Header.tsx owns. It previously listed four pages, so
    // ten of the twenty were unreachable from a phone; it now mirrors the two
    // mega menus' destinations.
    nav: [
      { label: "كيف يشتغل", path: "how-it-works" },
      { label: "الوكيل الصوتي", path: "product/voice-agent" },
      { label: "قاعدة المعرفة", path: "product/knowledge-base" },
      { label: "بناء الوكيل", path: "product/agent-builder" },
      { label: "التحويل لموظفك", path: "product/human-handoff" },
      { label: "لوحة التحكم", path: "product/dashboard" },
      { label: "عيادات ومستشفيات", path: "solutions/clinics" },
      { label: "مطاعم", path: "solutions/restaurants" },
      { label: "فنادق", path: "solutions/hotels" },
      { label: "عقارات", path: "solutions/real-estate" },
      { label: "تجزئة", path: "solutions/retail" },
      { label: "الأمان والبيانات", path: "security" },
      { label: "الباقات والأسعار", path: "pricing" },
      { label: "الأسئلة الشائعة", path: "faq" },
    ],
    login: "تسجيل الدخول",
    cta: "احجز عرضاً",
    langSwitch: "EN",
    langSwitchLabel: "English",
    footer: {
      // The footer's one heading, read by screen readers only (sr-only h2).
      title: "عن صوت نجدي",
      homeLabel: "صوت نجدي، الرئيسية",
      parent: {
        lead: "صوت نجدي من إنتاج",
        name: "نجد لحلول الأعمال",
        url: "https://najdbs.com",
      },
      product: {
        title: "المنتج",
        links: [
          { label: "كيف يشتغل", path: "how-it-works" },
          { label: "الوكيل الصوتي", path: "product/voice-agent" },
          { label: "قاعدة المعرفة", path: "product/knowledge-base" },
          { label: "بناء الوكيل", path: "product/agent-builder" },
          { label: "التحويل لموظفك", path: "product/human-handoff" },
          { label: "لوحة التحكم", path: "product/dashboard" },
          { label: "الباقات والأسعار", path: "pricing" },
        ],
      },
      company: {
        title: "الشركة",
        links: [
          { label: "من نحن", path: "about" },
          { label: "المدونة", path: "blog" },
          { label: "تواصل معنا", path: "contact" },
          { label: "الأسئلة الشائعة", path: "faq" },
          { label: "احجز عرضاً", path: "demo" },
        ],
      },
      legal: {
        title: "قانوني",
        links: [
          { label: "الأمان والبيانات", path: "security" },
          { label: "سياسة الخصوصية", path: "privacy" },
          { label: "شروط الخدمة", path: "terms" },
          { label: "اتفاقية معالجة البيانات", path: "dpa" },
          { label: "سياسة الاسترداد والإلغاء", path: "refund-policy" },
        ],
      },
      contact: "تواصل",
      language: "اللغة",
      crLabel: "السجل التجاري",
      vatLabel: "الرقم الضريبي",
      madeIn: "صُنع في السعودية",
      // Followed by the brand name (SITE_NAME_AR); the year sits in its own
      // ltr <bdi> so the © stays on the digits' side.
      copyright: "© 2026",
    },
  },
  en: {
    skipToContent: "Skip to content",
    // See the Arabic note above — mobile sheet + JSON-LD, not the desktop row.
    nav: [
      { label: "How it works", path: "how-it-works" },
      { label: "Voice agent", path: "product/voice-agent" },
      { label: "Knowledge base", path: "product/knowledge-base" },
      { label: "Agent builder", path: "product/agent-builder" },
      { label: "Human handoff", path: "product/human-handoff" },
      { label: "Dashboard", path: "product/dashboard" },
      { label: "Clinics & hospitals", path: "solutions/clinics" },
      { label: "Restaurants", path: "solutions/restaurants" },
      { label: "Hotels", path: "solutions/hotels" },
      { label: "Real estate", path: "solutions/real-estate" },
      { label: "Retail", path: "solutions/retail" },
      { label: "Security & data", path: "security" },
      { label: "Plans & pricing", path: "pricing" },
      { label: "FAQ", path: "faq" },
    ],
    login: "Log in",
    cta: "Book a demo",
    langSwitch: "عربي",
    langSwitchLabel: "العربية",
    footer: {
      title: "About Saut Najdi",
      homeLabel: "Saut Najdi, home",
      parent: {
        lead: "A product of",
        name: "Najd Business Solutions",
        url: "https://najdbs.com",
      },
      product: {
        title: "Product",
        links: [
          { label: "How it works", path: "how-it-works" },
          { label: "Voice agent", path: "product/voice-agent" },
          { label: "Knowledge base", path: "product/knowledge-base" },
          { label: "Agent builder", path: "product/agent-builder" },
          { label: "Human handoff", path: "product/human-handoff" },
          { label: "Dashboard", path: "product/dashboard" },
          { label: "Plans & pricing", path: "pricing" },
        ],
      },
      company: {
        title: "Company",
        links: [
          { label: "About us", path: "about" },
          { label: "Blog", path: "blog" },
          { label: "Contact", path: "contact" },
          { label: "FAQ", path: "faq" },
          { label: "Book a demo", path: "demo" },
        ],
      },
      legal: {
        title: "Legal",
        links: [
          { label: "Security & data", path: "security" },
          { label: "Privacy policy", path: "privacy" },
          { label: "Terms of service", path: "terms" },
          { label: "Data processing agreement", path: "dpa" },
          { label: "Refund & Cancellation Policy", path: "refund-policy" },
        ],
      },
      // Not "Contact": the Company column already has a Contact link.
      contact: "Get in touch",
      language: "Language",
      crLabel: "CR",
      vatLabel: "VAT number",
      madeIn: "Made in Saudi Arabia",
      copyright: "© 2026",
    },
  },
} satisfies Record<Locale, unknown>;
