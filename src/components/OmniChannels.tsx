import type { Locale } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";

/**
 * Omnichannel section — every customer channel, one inbox, one agent.
 *
 * Shared by the homepage and all five product pages so the story is told the
 * same way everywhere the ads land. Question-shaped H2 with the answer right
 * under it, per the site's copy style; six channel cards, each an icon in the
 * house `.ring-spectrum` chip (white ground, spectrum border, purple stroke —
 * never a gradient fill, per the brand rule).
 */
const t = {
  ar: {
    heading: "كل قنوات عملائك في منصة واحدة؟",
    answer:
      "إي — المكالمات وواتساب وتيليجرام والرسائل النصية والبريد ودردشة موقعك، كلها في صندوق وارد واحد. نفس الوكيل يرد عليها كلها من معلومات منشأتك، وموظفك يقدر يدخل على أي محادثة.",
    closing: "صندوق واحد، وكيل واحد، وسياق كامل عند التحويل للموظف.",
    channels: [
      { key: "calls", name: "المكالمات", line: "يرد بلهجة عميلك ويحجز داخل نفس المكالمة." },
      { key: "whatsapp", name: "واتساب للأعمال", line: "يجاوب ويتابع في نفس المحادثة اللي بدأها العميل." },
      { key: "telegram", name: "تيليجرام", line: "نفس الوكيل ونفس المعلومات، على تيليجرام." },
      { key: "sms", name: "الرسائل النصية", line: "تذكير وتأكيد يوصل لكل جوال." },
      { key: "email", name: "البريد الإلكتروني", line: "استفسارات البريد تدخل نفس الصندوق." },
      { key: "web", name: "دردشة الموقع", line: "زائر موقعك يكلم نفس العقل — جرّبه هنا بالأسفل." },
    ],
  },
  en: {
    heading: "Every customer channel in one platform?",
    answer:
      "Yes — phone calls, WhatsApp, Telegram, SMS, email and your website chat all land in one team inbox. The same agent answers them all from your business's own information, and your staff can step into any conversation.",
    closing: "One inbox, one agent, full context at handoff.",
    channels: [
      { key: "calls", name: "Phone calls", line: "Answers in your customer's dialect and books inside the call." },
      { key: "whatsapp", name: "WhatsApp Business", line: "Replies and follows up in the thread the customer started." },
      { key: "telegram", name: "Telegram", line: "The same agent, the same knowledge, on Telegram." },
      { key: "sms", name: "SMS", line: "Reminders and confirmations that reach every phone." },
      { key: "email", name: "Email", line: "Email enquiries land in the same inbox." },
      { key: "web", name: "Website chat", line: "Your site's visitors talk to the same brain — try it below." },
    ],
  },
} as const;

/** Small stroke icons, drawn inline; purple stroke per the icon rule. */
function ChannelGlyph({ name }: { name: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "calls":
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" {...common}>
          <path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" {...common}>
          <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3z" />
          <path d="M9 9.5c.5 2.5 3 5 5.5 5.5l1-1.5-2-1-1 .5c-.8-.5-1.5-1.2-2-2l.5-1-1-2z" />
        </svg>
      );
    case "telegram":
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" {...common}>
          <path d="M21 4 3 11.5l5.5 2M21 4l-3 15.5-6.5-5M21 4 8.5 13.5m0 0V19l3-3.5" />
        </svg>
      );
    case "sms":
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" {...common}>
          <path d="M4 5h16v11H8l-4 4z" />
          <path d="M8 10.5h.01M12 10.5h.01M16 10.5h.01" strokeWidth={2.4} />
        </svg>
      );
    case "email":
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3.5 12h17M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
      );
  }
}

export function OmniChannels({ locale }: { locale: Locale }) {
  const s = t[locale];
  return (
    <section className="container py-16">
      <Reveal>
        <h2 className="text-center text-h2">{s.heading}</h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-body-lg leading-relaxed text-ink/75">
          {s.answer}
        </p>
      </Reveal>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {s.channels.map((c, i) => (
          <Reveal key={c.key} delay={i * 0.06}>
            <div className="card card-hover flex h-full items-start gap-3">
              <span className="ring-spectrum flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-brand-purple">
                <ChannelGlyph name={c.key} />
              </span>
              <div>
                <h3 className="text-h5">{c.name}</h3>
                <p className="mt-1 text-body leading-relaxed text-ink/70">{c.line}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="mt-8 text-center text-body-lg font-medium text-ink/80">{s.closing}</p>
    </section>
  );
}
