/**
 * Single source of truth for site-wide constants.
 *
 * sautnajdi.ai is the canonical public domain. Every canonical, hreflang,
 * sitemap URL, OG URL and schema @id derives from SITE_URL. An explicit
 * NEXT_PUBLIC_SITE_URL can still override this default for an environment.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sautnajdi.ai";
export const SITE_NAME_AR = "صوت نجدي";
export const SITE_NAME_EN = "Saut Najdi";
export const SELLER_NAME = "SAUT NAJDI Company (شركة صوت نجدي)";
export const SELLER_NAME_AR = "شركة صوت نجدي (SAUT NAJDI Company)";
export const SELLER_CR = "7054897538";
export const SELLER_ADDRESS_AR =
  "مبنى 3848، شارع عبدالله العنقري، حي الورود، الرياض 12254، الرقم الإضافي 7427، المملكة العربية السعودية";
export const SELLER_ADDRESS_EN =
  "Building 3848, Abdullah Al-Anqari St., Al Woroud District, Riyadh 12254, Additional No. 7427, Saudi Arabia";
export const BILLING_EMAIL = "billing@sautnajdi.ai";
export const VAT_NUMBER = "314931940900003";
export const APP_URL = "https://app.najdiai.com";

/**
 * The public support mailbox, confirmed by the owner (2026-08-09) alongside
 * the .ai domain cutover. Every rendered address derives from here — footer,
 * contact page, chat fallback, and the Organization/ContactPoint schema — so
 * there is one string to change if it ever moves.
 */
export const SUPPORT_EMAIL = "ai@sautnajdi.ai";

// Cal.com — all demo booking runs through these (blueprint §2.4).
// The handle is `sautnajdi`, NO hyphen: the account was renamed and the old
// `saut-najdi/*` links 404, which silently kills every booking CTA on the
// site. Verify with the public API before changing these — a 200 on
// cal.com/<user>/<slug> proves nothing, Cal soft-404s unknown slugs:
//   curl 'https://cal.com/api/trpc/public/event?input={"json":{"username":"sautnajdi","eventSlug":"demo","isTeamEvent":false,"org":null}}'
// A missing event returns {"json":null}.
export const CAL_LINK_DEMO = "sautnajdi/demo";
export const CAL_LINK_QUICK = "sautnajdi/quick-call";

/**
 * The platform's embeddable web-chat widget key (dashboard → Integrations
 * → Web chat). Set NEXT_PUBLIC_WEBCHAT_KEY in Vercel to activate the AI
 * chat launcher; empty = launcher shows the contact fallback panel.
 * The widget's frame-ancestors CSP must allow sautnajdi.ai.
 */
export const WEBCHAT_KEY = process.env.NEXT_PUBLIC_WEBCHAT_KEY ?? "";
export const WEBCHAT_FRAME_URL = (key: string) =>
  `${APP_URL}/widget/frame?k=${encodeURIComponent(key)}`;

/**
 * The canonical PDPL trust line (blueprint §2.5) — identical every time it
 * appears. Never escalate the wording.
 */
export const PDPL_LINE_AR =
  "مصمّم بما يتوافق مع نظام حماية البيانات الشخصية السعودي (PDPL) — بياناتك مخزّنة في منطقة الخليج، مع إفصاح كامل عن أماكن المعالجة.";
export const PDPL_LINE_EN =
  "Designed to comply with Saudi Arabia's Personal Data Protection Law (PDPL) — your data stored in the Gulf region, with full disclosure of where processing happens.";

/** The §1 canonical positioning sentence — identical every time it appears. */
export const POSITIONING_AR =
  "صوت نجدي وكيل صوتي سعودي بالذكاء الاصطناعي يرد على عملائك باللهجة اللي يفهمونها — نجدي، حجازي، شامي، بالعربية أو الإنجليزية — وموظفك البشري يستلم المكالمة بكامل سياقها في أي لحظة.";
export const POSITIONING_EN =
  "Saut Najdi is a Saudi AI voice agent that answers your customers in the dialect they understand — Najdi, Hijazi, Levantine, in Arabic or English — with your human employee able to take over any call with full context.";

/**
 * Google Tag Manager container. Lives here so both root layouts read one
 * value; set NEXT_PUBLIC_GTM_ID to override (or to "" to switch GTM off
 * entirely, which the component treats as "render nothing").
 */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-KCWP33MC";

export const TAGLINE_EN = "AI Voice. Human Care. Najdi by Heart.";
export const TAGLINE_AR = "نحجي. نفهم. ننجز";
