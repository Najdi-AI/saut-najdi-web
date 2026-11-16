import type { Locale } from "@/lib/i18n";

export type Dialect = "sa" | "ar" | "en";
export const DIALECTS: Dialect[] = ["sa", "ar", "en"];

/**
 * What the agent says first in each reply dialect (Try 1 site.js). Each line
 * carries its own language, so the English one reads left to right on the
 * Arabic page and the Arabic ones right to left on the English page. The
 * «عربي» line is formal on purpose: it demonstrates that dialect.
 */
export const SAMPLE: Record<Dialect, { text: string; lang: Locale }> = {
  sa: { text: "«هلا والله، وش أقدر أخدمك؟»", lang: "ar" },
  ar: { text: "«أهلاً بك، كيف يمكنني مساعدتك؟»", lang: "ar" },
  en: { text: "“Hello, how can I help you today?”", lang: "en" },
};

/** Hero copy (mockups/index.html and en-hero.html). The H1 is split into its two display lines. */
export const heroCopy = {
  ar: {
    h1: ["ما عاد تفوتك", "مكالمة"],
    lead: "وكيل صوتي يرد على عملائك بلهجتهم على مدار الساعة، ويحوّل لموظفك مع ملخص كامل لما يحتاج الموضوع إنسان.",
    dialect: "لهجة الرد",
    dialects: { sa: "سعودي", ar: "عربي", en: "English" },
    play: "اسمع الرد",
    pause: "إيقاف",
    handoff: "تحويل لموظف",
    handoffOn: "أحمد يستلم لما يلزم",
    handoffOff: "الوكيل يكمل المكالمة",
  },
  en: {
    h1: ["Never miss", "a call again"],
    lead: "A voice agent that answers your customers in their own dialect, around the clock, and hands over to your team with a full summary when a person is needed.",
    dialect: "Dialect",
    dialects: { sa: "Saudi", ar: "Arabic", en: "English" },
    play: "Hear the reply",
    pause: "Pause",
    handoff: "Hand off to staff",
    handoffOn: "Ahmed takes over",
    handoffOff: "The agent stays on the call",
  },
} satisfies Record<Locale, unknown>;
