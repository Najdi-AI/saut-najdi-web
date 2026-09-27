import Link from "next/link";
import { DemoLink } from "@/components/DemoLink";
import { PricingTooltip } from "@/components/pages/PricingTooltip";
import { Waveform } from "@/components/Waveform";
import { PlanCapacity, capacityCopy } from "@/components/PlanCapacity";
import { CREDIT_COST, formatSarRate, plans, textConversations, voiceMinutes } from "@/content/pricing";
import { localePath, type Locale } from "@/lib/i18n";

const copy = {
  ar: {
    eyebrow: "الباقات والأسعار",
    heading: "باقات لكل مرحلة من نموك",
    intro: "رصيد شهري مشترك للمكالمات مع الوكيل والمحادثات النصية. اختر السعة التي تناسب استخدامك، ثم احجز عرضاً لنحدد التجهيز لمنشأتك.",
    fit: {
      essential: "لموقع واحد وتغطية المكالمات خارج الدوام وعند الانشغال",
      growth: "لفريق ينمو ويحتاج سعة أكبر للرد والمتابعة",
      expansion: "لتشغيل فروع متعددة بسعة أكبر للفريق والوكلاء",
      enterprise: "احتياجات خاصة يحددها عرض مكتوب",
    },
    monthly: "شهرياً",
    sar: "ر.س",
    credits: "الرصيد الشهري المشترك",
    creditsHelp: `كل دقيقة مكالمة مع الوكيل تستهلك ${CREDIT_COST.voiceMinute} رصيد. كل محادثة نصية قابلة للفوترة ضمن نافذة 24 ساعة تستهلك ${CREDIT_COST.textConversation} رصيد. كلاهما من الرصيد نفسه.`,
    voice: "إذا استُخدم كله للمكالمات",
    text: "إذا استُخدم كله للمحادثات",
    exclusive: "تقدير لكل نوع على حدة؛ عند المزج يُخصم الاستهلاك الفعلي من الرصيد نفسه.",
    minuteUnit: "دقيقة",
    conversationUnit: "محادثة",
    rates: "تفاصيل سعر الاستخدام",
    withinVoice: "مرجع سعر الدقيقة ضمن الباقة",
    withinText: "مرجع سعر المحادثة ضمن الباقة",
    extraVoice: "الدقيقة بعد نفاد الرصيد",
    extraText: "المحادثة بعد نفاد الرصيد",
    ratesNote: "الرصيد مشمول في السعر الشهري؛ أسعار الاستخدام ضمن الباقة مرجعية ولا تُضاف إليه. يُحاسب الاستخدام بعد نفاد الرصيد بالسعر الإضافي.",
    perMinute: "ر.س/دقيقة",
    perConversation: "ر.س/محادثة",
    quote: "عرض مكتوب",
    quoteCapacity: "تُحسب في العرض",
    book: "احجز عرضاً",
    compare: "قارن كل تفاصيل الباقات",
    vat: "الأسعار بالريال السعودي ولا تشمل ضريبة القيمة المضافة 15%. تُضاف عند الدفع بعد العرض التعريفي والعرض المكتوب. رسوم التجهيز تُحدد حسب احتياج منشأتك في العرض المكتوب.",
    vatShort: "لا يشمل ضريبة القيمة المضافة 15%",
    hoverRates: (voice: string, text: string, extraVoice: string, extraText: string) => `ضمن الباقة: ${voice} ر.س/دقيقة و${text} ر.س/محادثة. بعد نفاد الرصيد: ${extraVoice} ر.س/دقيقة و${extraText} ر.س/محادثة.`,
    inclusions: [
      "بناء الوكيل وقاعدة معرفة خاصة بمنشأتك",
      "صندوق وارد مشترك وتحويل المحادثة لموظفك",
      "نص المكالمة وردود الوكيل ومعالجة الملخص ضمن أرصدة المكالمة",
      "لوحة متابعة وسجل محادثات العملاء",
    ],
  },
  en: {
    eyebrow: "Plans & pricing",
    heading: "Plans for every stage of growth",
    intro: "One monthly credit pool for AI calls and text conversations. Choose the capacity that fits your use, then book a demo to scope setup for your business.",
    fit: {
      essential: "For a single site, after-hours and overflow coverage",
      growth: "For growing teams that need more answering capacity",
      expansion: "For multi-branch operations with larger teams",
      enterprise: "Custom needs set out in a written quote",
    },
    monthly: "month",
    sar: "SAR",
    credits: "Shared monthly credits",
    creditsHelp: `Each AI call minute uses ${CREDIT_COST.voiceMinute} credits. Each billable text conversation in a 24-hour window uses ${CREDIT_COST.textConversation} credits. Both draw from the same pool.`,
    voice: "If used only for voice",
    text: "If used only for conversations",
    exclusive: "Each estimate uses the whole pool for one type. Mixed usage draws actual credits from the same pool.",
    minuteUnit: "minutes",
    conversationUnit: "conversations",
    rates: "Usage price details",
    withinVoice: "In-plan voice-minute reference rate",
    withinText: "In-plan conversation reference rate",
    extraVoice: "Voice minute after credits run out",
    extraText: "Conversation after credits run out",
    ratesNote: "Credits are included in the monthly base; in-plan rates are reference values, not added charges. Usage beyond the pool is billed at the extra-usage rates.",
    perMinute: "SAR/minute",
    perConversation: "SAR/conversation",
    quote: "Written quote",
    quoteCapacity: "Calculated in quote",
    book: "Book a demo",
    compare: "Compare all plan details",
    vat: "Prices are in SAR and exclude 15% VAT. VAT is added at payment after the demo and written offer. Your setup fee is scoped to your needs in that offer.",
    vatShort: "Excludes 15% VAT",
    hoverRates: (voice: string, text: string, extraVoice: string, extraText: string) => `In-plan reference rates: voice SAR ${voice}/minute and text SAR ${text}/conversation. After credits: voice SAR ${extraVoice}/minute and text SAR ${extraText}/conversation.`,
    inclusions: [
      "Agent builder and your business knowledge base",
      "Shared inbox and human handoff",
      "Call transcript, AI replies and summary processing are covered by voice credits",
      "Dashboard and customer conversation history",
    ],
  },
} as const;

const amount = (value: number) => new Intl.NumberFormat("en-US").format(value);

export function PricingOverview({ locale, variant = "home" }: { locale: Locale; variant?: "home" | "page" }) {
  const t = copy[locale];
  const isHome = variant === "home";
  const cards = [
    ...plans.map((plan) => ({ ...plan, label: locale === "ar" ? plan.ar : plan.en })),
    {
      key: "enterprise" as const,
      label: locale === "ar" ? "مؤسسات" : "Enterprise",
      monthlySar: null,
      credits: null,
      withinVoiceSar: null,
      withinTextSar: null,
      extraVoiceSar: null,
      extraTextSar: null,
    },
  ];

  return (
    <section
      aria-labelledby={isHome ? "home-pricing-heading" : undefined}
      aria-label={isHome ? undefined : t.eyebrow}
      className={isHome ? "border-y border-line bg-brand-gradient-soft py-16 dark:bg-canvas" : "bg-canvas py-8 sm:py-10"}
    >
      <div className="container">
        {isHome && <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="home-pricing-heading" className="mt-3 text-h2">{t.heading}</h2>
          <p className="mt-4 text-body-lg leading-relaxed text-ink/75">{t.intro}</p>
          <Waveform bars={28} animate={false} maxHeight={25} className="mt-4" />
        </div>}

        <div className={`mx-auto max-w-6xl space-y-5 ${isHome ? "mt-10" : ""}`}>
          {cards.map((plan) => {
            const isQuote = plan.credits === null;
            const rate = (value: number | null, unit: string) => value === null ? t.quote : <span dir="ltr" className="inline-block tabular-nums">{formatSarRate(value)} {unit}</span>;
            return (
              <article key={plan.key} className="overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
                <div className="h-1 bg-brand-gradient" aria-hidden="true" />
                <div className="grid min-w-0 lg:grid-cols-[minmax(0,0.39fr)_minmax(0,0.61fr)]">
                  <div className="flex min-w-0 flex-col border-b border-line p-6 sm:p-8 lg:border-b-0 lg:border-e">
                    {isHome ? <h3 className="text-h3">{plan.label}</h3> : <h2 className="text-h3">{plan.label}</h2>}
                    <p className="mt-2 text-body-lg text-ink/70">{t.fit[plan.key]}</p>
                    <p className="mt-7 text-3xl font-bold text-ink sm:text-h2">
                      {plan.monthlySar === null ? t.quote : <><span dir="ltr" className="inline-block tabular-nums">{amount(plan.monthlySar)}</span> <span className="text-h4 font-medium">{t.sar}</span></>}
                      {plan.monthlySar !== null && <span className="ms-2 text-body-lg font-normal text-ink/60">{locale === "ar" ? t.monthly : `/ ${t.monthly}`}</span>}
                    </p>
                    {plan.monthlySar !== null && <p className="mt-2 text-body text-ink/60">{t.vatShort}</p>}
                    <DemoLink locale={locale} className="mt-7 w-full sm:max-w-xs">{t.book}</DemoLink>
                  </div>

                  <div className="min-w-0 p-6 sm:p-8">
                    <dl className="divide-y divide-line">
                      <div className="flex flex-col gap-2 pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
                        <dt className="text-body-lg font-medium text-ink/75"><PricingTooltip id={`home-price-${plan.key}-credits`} explanation={isQuote ? t.creditsHelp : `${t.creditsHelp} ${t.hoverRates(formatSarRate(plan.withinVoiceSar), formatSarRate(plan.withinTextSar), formatSarRate(plan.extraVoiceSar), formatSarRate(plan.extraTextSar))}`}>{t.credits}</PricingTooltip></dt>
                        <dd className="text-h4 font-bold text-ink">{isQuote ? t.quote : <span dir="ltr" className="inline-block tabular-nums">{amount(plan.credits)}</span>}</dd>
                      </div>
                      <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
                        <dt className="text-body-lg text-ink/70">{t.voice}</dt>
                        <dd className="text-body-lg font-semibold text-ink">{isQuote ? t.quoteCapacity : <><span dir="ltr" className="inline-block tabular-nums">{amount(voiceMinutes(plan.credits))}</span> {t.minuteUnit}</>}</dd>
                      </div>
                      <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
                        <dt className="text-body-lg text-ink/70">{t.text}</dt>
                        <dd className="text-body-lg font-semibold text-ink">{isQuote ? t.quoteCapacity : <><span dir="ltr" className="inline-block tabular-nums">{amount(textConversations(plan.credits))}</span> {t.conversationUnit}</>}</dd>
                      </div>
                    </dl>
                    <p className="mt-2 text-body text-ink/60">{t.exclusive}</p>
                    <PlanCapacity planKey={plan.key} locale={locale} />
                    <ul className="mt-4 grid gap-2 border-t border-line pt-4 text-body text-ink/75 sm:grid-cols-2">
                      {t.inclusions.map((item) => <li key={item} className="flex items-start gap-2"><span aria-hidden="true" className="text-brand-blue">✓</span><span>{item}</span></li>)}
                    </ul>
                    <details className="group mt-5 border-t border-line pt-4">
                      <summary className="cursor-pointer font-semibold text-brand-blue underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-brand-blue">{t.rates}</summary>
                      <p className="mt-3 text-body leading-relaxed text-ink/65">{t.ratesNote}</p>
                      <dl className="mt-3 grid gap-x-6 gap-y-3 text-body sm:grid-cols-2">
                        <div><dt className="text-ink/65">{t.withinVoice}</dt><dd className="mt-1 font-semibold text-ink">{rate(plan.withinVoiceSar, t.perMinute)}</dd></div>
                        <div><dt className="text-ink/65">{t.withinText}</dt><dd className="mt-1 font-semibold text-ink">{rate(plan.withinTextSar, t.perConversation)}</dd></div>
                        <div><dt className="text-ink/65">{t.extraVoice}</dt><dd className="mt-1 font-semibold text-ink">{rate(plan.extraVoiceSar, t.perMinute)}</dd></div>
                        <div><dt className="text-ink/65">{t.extraText}</dt><dd className="mt-1 font-semibold text-ink">{rate(plan.extraTextSar, t.perConversation)}</dd></div>
                      </dl>
                    </details>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mx-auto mt-6 max-w-4xl text-center text-body leading-relaxed text-ink/70">{capacityCopy[locale].note}</p>
        <p className="mx-auto mt-3 max-w-4xl rounded-xl border border-line bg-surface p-4 text-center text-body leading-relaxed text-ink/70">{capacityCopy[locale].draft}</p>
        {isHome && <p className="mx-auto mt-7 max-w-4xl text-center text-body leading-relaxed text-ink/70">{t.vat}</p>}
        {isHome && <div className="mt-7 text-center">
          <Link href={localePath(locale, "pricing")} className="btn-secondary">{t.compare} {locale === "ar" ? "←" : "→"}</Link>
        </div>}
      </div>
    </section>
  );
}
