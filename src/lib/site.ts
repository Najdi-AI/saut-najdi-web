/**
 * Single source of truth for site-wide constants.
 * Domain decision (2026-07-28): sautnajdi.com is the ONLY site domain.
 */
export const SITE_URL = "https://sautnajdi.com";
export const SITE_NAME_AR = "صوت نجدي";
export const SITE_NAME_EN = "Saut Najdi";
export const APP_URL = "https://app.najdiai.com";

// TODO(owner): confirm this mailbox exists before launch (stationery shows
// info@sautnajdi.ai — domain decision moved the site to .com).
export const SUPPORT_EMAIL = "info@sautnajdi.com";

// Cal.com — all demo booking runs through these (blueprint §2.4)
export const CAL_LINK_DEMO = "saut-najdi/demo";
export const CAL_LINK_QUICK = "saut-najdi/quick-call";

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
  "صوت نجدي وكيل صوتي سعودي بالذكاء الاصطناعي يرد على عملائك باللهجة اللي يفهمونها — نجدي، حجازي، خليجي، بالعربية أو الإنجليزية — وموظفك البشري يستلم المكالمة بكامل سياقها في أي لحظة.";
export const POSITIONING_EN =
  "Saut Najdi is a Saudi AI voice agent that answers your customers in the dialect they understand — Najdi, Hijazi, Khaleeji, in Arabic or English — with your human employee able to take over any call with full context.";

export const TAGLINE_EN = "AI Voice. Human Care. Najdi by Heart.";
export const TAGLINE_AR = "نحجي. نفهم. ننجز";
