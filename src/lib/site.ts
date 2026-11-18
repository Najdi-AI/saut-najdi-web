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
export const APP_URL = "https://app.sautnajdi.ai";

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
 * The Saut Najdi web assistant, installed with the platform's official
 * loader tag (app.sautnajdi.ai → Settings → Channels → Web). The loader
 * renders the whole widget, launcher included, inside its own frame.
 *
 * The key is public by design (like a publishable key) and is committed on
 * purpose: it used to come from a build-time env var, and a stale value
 * silently broke the chat on the live site (18 Nov 2026). The widget stays
 * hidden on any origin that is not on the dashboard's approved-websites list.
 * Keep the src and key exactly as the dashboard issues them.
 */
export const WEB_ASSISTANT_SRC = "https://app.sautnajdi.ai/widget/loader.js";
export const WEB_ASSISTANT_KEY = "huqxA55BsjIcxLNmc65V_O4LLu2H3HXHWyX1K7W-OTI";

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
