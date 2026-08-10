import type { Locale } from "@/lib/i18n";

/**
 * Mega-menu content (navbar ported from the haroon911 reference).
 *
 * THE RULE — COLUMNS ARE CLOSED SETS. The Product menu's columns hold all
 * five /product/* pages and nothing else; the Industries menu's columns hold
 * all five /solutions/* pages and nothing else. Anything that is neither a
 * product surface nor a sector — the explainer, the trust page, the utility
 * pages, the demo — lives in the top row, the rails or the CTAs, and appears
 * exactly ONCE across the whole header.
 *
 * That rule is what the previous structure violated in four different ways:
 * a «المنصة» column mixing a feature with an explainer and a trust page, the
 * top row repeating three items that were already inside a menu, a blank " "
 * heading used as a layout hack, and a /demo call-to-action sitting in the
 * sector grid dressed as a page. Keep the rule and those defects cannot
 * come back; a new /product/* page has exactly one obvious home.
 *
 * Three destinations deliberately appear twice, each at a different rank
 * carrying a different message: product/voice-agent (column = dialect,
 * featured = outbound), product/agent-builder (Product column; Industries
 * featured = the "not on this list" answer), and demo (the one conversion
 * action). Nothing appears twice at peer rank inside one panel.
 *
 * `path: null` is the escape hatch for an item whose page is not built yet —
 * it renders as a non-link with a «قريباً»/"Soon" badge, honoring the
 * no-dead-links rule. Nothing is null today; keep the shape for the next
 * unbuilt item, and never flip an item to a real path before its route
 * file exists.
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
        // The split states the hybrid pitch in two words: what the agent is,
        // and what your people get. The menu argues while it navigates.
        columns: [
          {
            heading: "وكيلك",
            items: [
              { label: "الوكيل الصوتي", blurb: "يفهم لهجة عميلك ويرد بصوت طبيعي", icon: "wave", path: "product/voice-agent" },
              // «في المحادثات النصية» is not optional: KB grounding ships on
              // chat channels only, and the nav must never out-claim the page.
              { label: "قاعدة المعرفة", blurb: "ملفاتك يجاوب منها — في المحادثات النصية", icon: "book", path: "product/knowledge-base" },
              { label: "بناء الوكيل", blurb: "من قالب قطاعك لوكيل منشور، بدون كود", icon: "builder", path: "product/agent-builder" },
            ],
          },
          {
            heading: "فريقك",
            items: [
              { label: "التحويل لموظفك", blurb: "يستلم ومعه النص والملخص وتاريخ العميل", icon: "handoff", path: "product/human-handoff" },
              { label: "لوحة التحكم", blurb: "تسجيل ونص وملخص عربي لكل مكالمة", icon: "chart", path: "product/dashboard" },
            ],
          },
        ],
        featured: {
          eyebrow: "مكالمات صادرة",
          title: "الوكيل ما يرد بس — يتصل بعد",
          body: "فريقك يبدأ المكالمة من اللوحة والوكيل يمسك الحوار، وتنسجّل وتتلخّص زي أي مكالمة. وما فيه اتصال آلي على قائمة أرقام.",
          cta: "شوف الوكيل الصوتي ←",
          path: "product/voice-agent",
        },
        rail: [
          { label: "الأسئلة الشائعة", path: "faq" },
          { label: "من نحن", path: "about" },
        ],
        railCta: { label: "احجز عرضاً", path: "demo" },
      },
      sectors: {
        // The split is the honest boundary the sector pages themselves draw:
        // where the agent CLOSES the job on the line, and where it CAPTURES
        // the request and routes it. It also retires the blank-heading hack.
        columns: [
          {
            heading: "حجوزات ومواعيد",
            items: [
              { label: "عيادات ومستشفيات", blurb: "يحجز في تقويم عيادتك فعلاً", icon: "clinic", path: "solutions/clinics" },
              { label: "مطاعم", blurb: "يثبّت الطاولة حتى وقت الذروة", icon: "restaurant", path: "solutions/restaurants" },
              { label: "فنادق", blurb: "يشوف المتاح ويثبّت الحجز — 24 ساعة", icon: "hotel", path: "solutions/hotels" },
            ],
          },
          {
            heading: "استفسارات ومتابعة",
            items: [
              { label: "عقارات", blurb: "يرد على كل مستفسر ويحجز المعاينة", icon: "estate", path: "solutions/real-estate" },
              { label: "تجزئة", blurb: "الإرجاع والشحن والفروع — من سياساتك", icon: "retail", path: "solutions/retail" },
            ],
          },
        ],
        featured: {
          eyebrow: "نشاطك مو في القائمة؟",
          title: "فيه قالب عام — ونضبطه على شغلك",
          body: "القوالب الخمسة فوق جاهزة في المنصة، ومعها قالب عام لأي نشاط ثاني. تعدّله بنفسك بدون كود، وفريقنا يجهّزه معك.",
          cta: "شوف بناء الوكيل ←",
          path: "product/agent-builder",
        },
        rail: [
          // The site has no pricing page by design, so this anchor is the
          // nav's only answer to the price question. The `pricing` group id
          // exists in both locales and its section carries scroll-mt.
          { label: "الأسعار والبداية", path: "faq#pricing" },
          { label: "تواصل معنا", path: "contact" },
        ],
        railCta: { label: "احجز عرضاً", path: "demo" },
      },
    };
  }
  return {
    products: {
      columns: [
        {
          heading: "Your agent",
          items: [
            { label: "Voice agent", blurb: "Understands Saudi dialect, answers in a natural voice", icon: "wave", path: "product/voice-agent" },
            { label: "Knowledge base", blurb: "Your own files answer for you — on chat channels", icon: "book", path: "product/knowledge-base" },
            { label: "Agent builder", blurb: "Your sector's template to a live agent — no code", icon: "builder", path: "product/agent-builder" },
          ],
        },
        {
          heading: "Your team",
          items: [
            { label: "Human handoff", blurb: "Your employee takes over with transcript and summary", icon: "handoff", path: "product/human-handoff" },
            { label: "Dashboard", blurb: "Recording, transcript and Arabic summary, every call", icon: "chart", path: "product/dashboard" },
          ],
        },
      ],
      featured: {
        eyebrow: "Outbound calls",
        title: "It doesn't only answer — it calls out too",
        body: "Your team starts the call from the dashboard and the agent holds the conversation, recorded and summarised like any other call. No auto-dialling a list.",
        cta: "See the voice agent →",
        path: "product/voice-agent",
      },
      rail: [
        { label: "FAQ", path: "faq" },
        { label: "About us", path: "about" },
      ],
      railCta: { label: "Book a demo", path: "demo" },
    },
    sectors: {
      columns: [
        {
          heading: "Bookings & appointments",
          items: [
            { label: "Clinics & hospitals", blurb: "Books real appointments in your calendar", icon: "clinic", path: "solutions/clinics" },
            { label: "Restaurants", blurb: "Holds the table, even at peak service", icon: "restaurant", path: "solutions/restaurants" },
            { label: "Hotels", blurb: "Checks availability and confirms, 24/7", icon: "hotel", path: "solutions/hotels" },
          ],
        },
        {
          heading: "Enquiries & follow-up",
          items: [
            { label: "Real estate", blurb: "Answers every enquiry and books the viewing", icon: "estate", path: "solutions/real-estate" },
            { label: "Retail", blurb: "Returns, shipping and branch hours, from your policies", icon: "retail", path: "solutions/retail" },
          ],
        },
      ],
      featured: {
        eyebrow: "Not on this list?",
        title: "There's a general template — shaped around your work",
        body: "The five templates above are live in the platform, and a general one covers everything else. You edit it without code, and our team sets it up with you.",
        cta: "See the agent builder →",
        path: "product/agent-builder",
      },
      rail: [
        { label: "Pricing & getting started", path: "faq#pricing" },
        { label: "Contact us", path: "contact" },
      ],
      railCta: { label: "Book a demo", path: "demo" },
    },
  };
}
