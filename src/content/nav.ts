import type { Locale } from "@/lib/i18n";

/**
 * Mega-menu content (navbar ported from the haroon911 reference).
 * Items with `path: null` are not yet built (Wave 2) — they render as
 * non-links with a «قريباً» badge, honoring the no-dead-links rule.
 */

export type MegaIcon =
  | "wave"
  | "handoff"
  | "book"
  | "builder"
  | "chart"
  | "chat"
  | "shield"
  | "clinic"
  | "restaurant"
  | "hotel"
  | "estate"
  | "retail";

export interface MegaItem {
  label: string;
  blurb: string;
  icon: MegaIcon;
  path: string | null;
  badge?: string;
}

export interface MegaMenu {
  columns: { heading: string; items: MegaItem[] }[];
  featured: { eyebrow: string; title: string; body: string; cta: string; path: string };
  rail: { label: string; path: string }[];
  railCta: { label: string; path: string };
}

export function megaMenus(locale: Locale): { products: MegaMenu; sectors: MegaMenu } {
  if (locale === "ar") {
    return {
      products: {
        columns: [
          {
            heading: "المنصة",
            items: [
              { label: "التصعيد للموظف البشري", blurb: "موظفك يستلم المكالمة بكامل سياقها", icon: "handoff", path: "product/human-handoff" },
              { label: "كيف يشتغل", blurb: "رحلة المكالمة من أول رنة", icon: "wave", path: "how-it-works" },
              { label: "الأمان والبيانات", blurb: "التوافق مع PDPL والإفصاح الكامل", icon: "shield", path: "security" },
            ],
          },
          {
            heading: "قريباً — صفحات تفصيلية",
            items: [
              { label: "الوكيل الصوتي", blurb: "يرد بلهجة عملائك", icon: "wave", path: null, badge: "قريباً" },
              { label: "قاعدة المعرفة العربية", blurb: "وكيلك يتعلم من ملفاتك", icon: "book", path: null, badge: "قريباً" },
              { label: "بناء الوكيل", blurb: "سوّه بنفسك بدون كود", icon: "builder", path: null, badge: "قريباً" },
              { label: "لوحة التحكم", blurb: "كل مكالمة قدامك", icon: "chart", path: null, badge: "قريباً" },
            ],
          },
        ],
        featured: {
          eyebrow: "الفرق الهجين",
          title: "إذا احتاجت المكالمة إنسان… موظفك يستلمها",
          body: "قواعد تصعيد واضحة، وإشراف مباشر، وسياق كامل ينتقل مع كل مكالمة.",
          cta: "شوف الصفحة ←",
          path: "product/human-handoff",
        },
        rail: [
          { label: "الأسئلة الشائعة", path: "faq" },
          { label: "من نحن", path: "about" },
          { label: "تواصل معنا", path: "contact" },
        ],
        railCta: { label: "احجز عرضاً", path: "demo" },
      },
      sectors: {
        columns: [
          {
            heading: "قوالب جاهزة لقطاعك",
            items: [
              { label: "عيادات ومستشفيات", blurb: "«أبغى أحجز موعد»", icon: "clinic", path: null, badge: "قريباً" },
              { label: "مطاعم", blurb: "«أبغى أطلب»", icon: "restaurant", path: null, badge: "قريباً" },
              { label: "فنادق", blurb: "«عندكم غرفة فاضية؟»", icon: "hotel", path: null, badge: "قريباً" },
            ],
          },
          {
            heading: " ",
            items: [
              { label: "عقارات", blurb: "«الشقة للحين متاحة؟»", icon: "estate", path: null, badge: "قريباً" },
              { label: "تجزئة", blurb: "«وصل طلبي؟»", icon: "retail", path: null, badge: "قريباً" },
              { label: "نشاط ثاني؟", blurb: "نجهز وكيلك على مقاس شغلك", icon: "chat", path: "demo" },
            ],
          },
        ],
        featured: {
          eyebrow: "جاهز اليوم",
          title: "القوالب موجودة في المنصة الآن",
          body: "صفحات القطاعات التفصيلية قادمة قريباً — والقوالب نفسها جاهزة، نوريك إياها في العرض.",
          cta: "احجز عرضاً ←",
          path: "demo",
        },
        rail: [
          { label: "كيف يشتغل", path: "how-it-works" },
          { label: "الأسئلة الشائعة", path: "faq" },
        ],
        railCta: { label: "تواصل معنا", path: "contact" },
      },
    };
  }
  return {
    products: {
      columns: [
        {
          heading: "Platform",
          items: [
            { label: "Human handoff", blurb: "Your employee takes over with full context", icon: "handoff", path: "product/human-handoff" },
            { label: "How it works", blurb: "One call's journey, from the first ring", icon: "wave", path: "how-it-works" },
            { label: "Security & data", blurb: "PDPL alignment, full disclosure", icon: "shield", path: "security" },
          ],
        },
        {
          heading: "Coming soon — deep dives",
          items: [
            { label: "Voice agent", blurb: "Answers in your customers' dialect", icon: "wave", path: null, badge: "Soon" },
            { label: "Arabic knowledge base", blurb: "Your agent learns from your files", icon: "book", path: null, badge: "Soon" },
            { label: "Agent builder", blurb: "Build it yourself, no code", icon: "builder", path: null, badge: "Soon" },
            { label: "Dashboard", blurb: "Every call in front of you", icon: "chart", path: null, badge: "Soon" },
          ],
        },
      ],
      featured: {
        eyebrow: "The hybrid difference",
        title: "When a call needs a human, your employee takes it",
        body: "Explicit escalation rules, live supervision, and full context on every transfer.",
        cta: "See the page →",
        path: "product/human-handoff",
      },
      rail: [
        { label: "FAQ", path: "faq" },
        { label: "About", path: "about" },
        { label: "Contact", path: "contact" },
      ],
      railCta: { label: "Book a demo", path: "demo" },
    },
    sectors: {
      columns: [
        {
          heading: "Sector-ready templates",
          items: [
            { label: "Clinics & hospitals", blurb: "“I'd like to book an appointment”", icon: "clinic", path: null, badge: "Soon" },
            { label: "Restaurants", blurb: "“I'd like to order”", icon: "restaurant", path: null, badge: "Soon" },
            { label: "Hotels", blurb: "“Do you have a room free?”", icon: "hotel", path: null, badge: "Soon" },
          ],
        },
        {
          heading: " ",
          items: [
            { label: "Real estate", blurb: "“Is the apartment still available?”", icon: "estate", path: null, badge: "Soon" },
            { label: "Retail", blurb: "“Has my order arrived?”", icon: "retail", path: null, badge: "Soon" },
            { label: "Something else?", blurb: "We configure your agent around your work", icon: "chat", path: "demo" },
          ],
        },
      ],
      featured: {
        eyebrow: "Ready today",
        title: "The templates already live in the platform",
        body: "Detailed sector pages are coming soon — the templates themselves are ready, and we'll show you them in the demo.",
        cta: "Book a demo →",
        path: "demo",
      },
      rail: [
        { label: "How it works", path: "how-it-works" },
        { label: "FAQ", path: "faq" },
      ],
      railCta: { label: "Contact us", path: "contact" },
    },
  };
}
