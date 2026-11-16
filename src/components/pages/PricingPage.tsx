import { billingTerms } from "@/content/billingTerms";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { formatSarRate, plans, textConversations, voiceMinutes } from "@/content/pricing";
import { SELLER_NAME, SELLER_NAME_AR, VAT_NUMBER } from "@/lib/site";
import { DemoLink } from "@/components/DemoLink";
import { PricingTooltip } from "@/components/pages/PricingTooltip";
import { PlanWalk } from "@/components/pricing/PlanWalk";
import { PageHero } from "@/components/page/PageHero";
import { Section } from "@/components/page/Section";
import { capacityCopy, planCapacityRows, planFeatureRows } from "@/components/PlanCapacity";
import { WorkflowComparison } from "@/components/WorkflowComparison";

/**
 * /pricing (rebrand D5) on the inner-page kit, About as the pilot: PageHero,
 * the four-tier walk under its own h2 (its tier names are h3), then the
 * detail: the full comparison table, the trial, credit and contract terms as
 * ruled rows, the workflow comparison and the closing links. Figures come
 * from content/pricing.ts and billingTerms.ts only. This module is not
 * imported by pageFactory, so the walk's client island stays on this route.
 */

/** The walk's heading: the plans overview's own line. */
const walkTitle = { ar: "باقات لكل مرحلة من نموك", en: "Plans for every stage of growth" } as const;

const copy = {
  ar: {
    title: "حصة واحدة للمكالمات والمحادثات",
    intro: "اختر باقتك الشهرية واستخدم حصتها من النقاط للمكالمات الصوتية أو المحادثات النصية أو مزيج منهما. ابدأ بعرض تعريفي لنحدد التجهيز المناسب لمنشأتك.",
    vat: "الأسعار المعروضة بالريال السعودي ولا تشمل ضريبة القيمة المضافة 15%. تُضاف الضريبة في الفاتورة الضريبية عند الدفع بعد العرض التعريفي والعرض المكتوب.",
    seller: "الجهة البائعة",
    vatNumber: "الرقم الضريبي",
    plan: "الباقة",
    fit: {
      essential: "بداية بحصة نقاط شهرية مشتركة",
      growth: "حصة أكبر لنمو الاستخدام",
      expansion: "للاستخدام الشهري الأعلى",
      enterprise: "التفاصيل حسب العقد",
    },
    monthly: "السعر الشهري الأساسي",
    credits: "حصة النقاط الشهرية المشتركة",
    creditsPerSar: "نقاط لكل ريال",
    creditsPerSarHelp: "عدد النقاط الشهري المشمول مقسوماً على السعر الشهري الأساسي قبل الضريبة، مع تقريب الناتج إلى منزلة عشرية واحدة.",
    voice: "إذا استُخدم كله للمكالمات",
    text: "إذا استُخدم كله للمحادثات",
    valueVoice: "سعر الدقيقة ضمن الباقة",
    valueText: "سعر المحادثة ضمن الباقة",
    sar: "ر.س",
    min: "دقيقة",
    conversation: "محادثة",
    perMinute: "ر.س/دقيقة",
    perConversation: "ر.س/محادثة",
    custom: "حسب العقد",
    enterprise: "مؤسسات",
    book: "احجز عرضاً",
    mathTitle: "كيف تُحتسب النقاط؟",
    math: "مكالمة: 1 دقيقة = 10 نقاط؛ نص: 1 محادثة (24 ساعة) = 4 نقاط؛ استنساخ الصوت: 1 صوت جديد = نقطتان (نمو/توسّع)؛ النص والردود والملخص = مشمولة في المكالمة.",
    example: "مثال: 3 دقائق مكالمات ومحادثتان نصيتان = 3 × 10 + 2 × 4 = 38 نقطة.",
    exclusive: "الأرقام في صفَّي الدقائق والمحادثات تفترض استخدام حصة النقاط كلها لنوع واحد. عند مزج النوعين، يكون الإجمالي حسب النقاط المستهلكة فعلياً.",
    unitHelp: "السعر المرجعي المعتمد لهذا النوع من الاستخدام ضمن الباقة. يُخصم الاستخدام من حصة النقاط المشمولة، ولا تُضاف رسوم استخدام مستقلة ما دامت حصة النقاط متاحة.",
    inPlanNote: "أسعار الاستخدام ضمن الباقة أسعار مرجعية، ولا تُضاف إلى الاشتراك ما دامت حصة النقاط المشتركة متاحة. تفترض هذه القيم استخدام حصة النقاط الشهرية بالكامل.",
    callCostTitle: "ماذا تغطي نقاط المكالمة؟",
    callCost: "دقيقة مكالمة واحدة = 10 نقاط، وتشمل معالجة تحويل الكلام إلى نص للمحادثة، وردود الوكيل، ومعالجة ملخص المكالمة عند إنشائه. لا يوجد خصم نقاط مستقل لكل خطوة من هذه الخطوات.",
    callCostNote: "نص المكالمة ينتج من تحويل الكلام إلى نص؛ ويُستخدم توليد النص في ردود الوكيل والملخص. توضح الفاتورة استخدام المكالمات والمحادثات، لا تكلفة كل مزوّد تقني على حدة.",
    conditionTitle: "قبل الاشتراك",
    policy: "سياسة الاسترداد والإلغاء",
    contact: "تواصل معنا",
    tableLabel: "مقارنة الباقات الشهرية",
    fullDetails: "جدول المقارنة الكامل",
    usageDetail: "شروط النقاط والقيم المرجعية",
    swipe: "مرّر الجدول أفقياً لمقارنة بقية الباقات.",
  },
  en: {
    title: "One credit pool for calls and conversations",
    intro: "Choose a monthly plan and use its credits for AI calls, text conversations, or both. Start with a demo so we can scope setup for your business.",
    vat: "Displayed prices are in SAR and exclude 15% VAT. VAT is added on the tax invoice at payment after the demo and written offer.",
    seller: "Seller",
    vatNumber: "VAT number",
    plan: "Plan",
    fit: {
      essential: "A shared monthly starting pool",
      growth: "More room for growing usage",
      expansion: "For higher monthly usage",
      enterprise: "Terms in a written offer",
    },
    monthly: "Monthly base price",
    credits: "Shared monthly credits",
    creditsPerSar: "Credits per SAR",
    creditsPerSarHelp: "Included monthly credits divided by the monthly base price before VAT, rounded to one decimal place.",
    voice: "If used only for voice",
    text: "If used only for conversations",
    valueVoice: "Voice minute rate within plan",
    valueText: "Conversation rate within plan",
    sar: "SAR",
    min: "minutes",
    conversation: "conversations",
    perMinute: "SAR/minute",
    perConversation: "SAR/conversation",
    custom: "By contract",
    enterprise: "Enterprise",
    book: "Book a demo",
    mathTitle: "How credits work",
    math: "AI call: 1 min = 10 credits; Text: 1 conversation (24h) = 4 credits; Voice clone: 1 new voice = 2 credits (Growth/Expansion); Transcript + replies + summary = included in call.",
    example: "Example: 3 call minutes and 2 text conversations = 3 × 10 + 2 × 4 = 38 credits.",
    exclusive: "The minutes and conversations rows assume the full pool is spent on one use type. When you mix them, the total follows credits actually used.",
    unitHelp: "The approved reference rate for this use within the plan. Usage draws from included credits; there is no separate unit charge while credits remain.",
    inPlanNote: "In-plan usage rates are reference prices and are not added to the subscription while shared credits remain. Values assume full use of the monthly credit pool.",
    callCostTitle: "What do voice credits cover?",
    callCost: "One AI call minute = 10 credits. This covers speech-to-text processing for the call transcript, agent replies, and post-call summary processing when a summary is generated. These steps do not each consume a separate credit unit.",
    callCostNote: "Speech-to-text creates the transcript; text generation powers agent replies and the summary. Invoices show call and conversation usage, not separate technology-provider costs.",
    conditionTitle: "Before you subscribe",
    policy: "Refund & Cancellation Policy",
    contact: "Contact us",
    tableLabel: "Monthly plan comparison",
    fullDetails: "Full plan comparison",
    usageDetail: "Credit terms and reference values",
    swipe: "Scroll the table sideways to compare the other plans.",
  },
} as const;

function Amount({ value }: { value: number }) {
  return <span dir="ltr" className="inline-block tabular-nums">{new Intl.NumberFormat("en-US").format(value)}</span>;
}

/** About's ruled row: the heading on the start side, its content beside it. */
function Row({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <div className="grid gap-4 border-b border-border py-10 sm:py-12 lg:grid-cols-12 lg:gap-6">
      <h2 className="font-display text-[clamp(24px,2.4vw,34px)] leading-[1.35] font-medium text-balance lg:col-span-5">{title}</h2>
      <div className="max-w-[60ch] text-[1.0625rem] leading-[1.7] sm:text-[1.125rem] lg:col-span-7">{children}</div>
    </div>
  );
}

const textLink = "font-bold underline decoration-2 underline-offset-[0.35em] hover:decoration-najdi-red";

export function PricingPage({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const terms = billingTerms[locale];
  const creditsPerSar = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1, minimumFractionDigits: 1 });
  const columns = [
    ...plans.map((p) => ({ key: p.key, label: locale === "ar" ? p.ar : p.en, fit: t.fit[p.key], credits: p.credits, monthlySar: p.monthlySar, withinVoiceSar: p.withinVoiceSar, withinTextSar: p.withinTextSar })),
    { key: "enterprise", label: t.enterprise, fit: t.fit.enterprise, credits: null, monthlySar: null, withinVoiceSar: null, withinTextSar: null },
  ];
  type Column = typeof columns[number];
  const monthlyPrice = (p: Column) => p.monthlySar === null ? t.custom : <><Amount value={p.monthlySar} /> <span className="text-[1.125rem] font-medium">{t.sar}</span></>;
  type PricingRow = { key: string; label: string; detail: string; value: (p: Column) => ReactNode };
  const primaryRows: PricingRow[] = [
    { key: "credits", label: t.credits, detail: t.math, value: (p: Column) => p.credits === null ? t.custom : <span className="text-[1.375rem] font-bold"><Amount value={p.credits} /></span> },
    { key: "creditsPerSar", label: t.creditsPerSar, detail: t.creditsPerSarHelp, value: (p: Column) => p.credits === null || p.monthlySar === null ? t.custom : <span dir="ltr" className="inline-block tabular-nums">{creditsPerSar.format(p.credits / p.monthlySar)}</span> },
    { key: "voice", label: t.voice, detail: t.exclusive, value: (p: Column) => p.credits === null ? t.custom : <><Amount value={voiceMinutes(p.credits)} /> <span>{t.min}</span></> },
    { key: "text", label: t.text, detail: t.exclusive, value: (p: Column) => p.credits === null ? t.custom : <><Amount value={textConversations(p.credits)} /> <span>{t.conversation}</span></> },
  ];
  const detailRows: PricingRow[] = [
    { key: "valueVoice", label: t.valueVoice, detail: t.unitHelp, value: (p: Column) => p.withinVoiceSar === null ? t.custom : <span dir="ltr" className="inline-block tabular-nums">{formatSarRate(p.withinVoiceSar)} {t.perMinute}</span> },
    { key: "valueText", label: t.valueText, detail: t.unitHelp, value: (p: Column) => p.withinTextSar === null ? t.custom : <span dir="ltr" className="inline-block tabular-nums">{formatSarRate(p.withinTextSar)} {t.perConversation}</span> },
  ];
  const renderRow = (row: PricingRow, prominent: boolean) => (
    <tr key={row.key}>
      <th scope="row" className="border-t border-border bg-background px-5 py-4 text-start font-medium sm:sticky sm:inset-s-0 sm:z-10">
        <PricingTooltip id={`price-help-table-${row.key}`} explanation={row.detail}>{row.label}</PricingTooltip>
      </th>
      {columns.map((p) => <td key={p.key} className={`border-t border-border px-4 py-4 text-center ${prominent ? "text-[1.125rem] font-semibold" : ""}`}>{row.value(p)}</td>)}
    </tr>
  );
  const groupRow = (title: string) => (
    <tr><th colSpan={columns.length + 1} className="border-t border-border bg-secondary px-5 py-3 text-start font-bold">{title}</th></tr>
  );

  return (
    <>
      {/* No in-page link to the table below the walk: the walk grows after
          hydration, and a smooth fragment scroll aims at the old offset. */}
      <PageHero title={t.title} lead={t.intro} />

      <Section title={walkTitle[locale]}>
        <PlanWalk locale={locale} />
      </Section>

      <Section title={t.fullDetails}>
        <p className="max-w-[75ch] bg-secondary px-5 py-4 text-[1.0625rem] leading-[1.7]">{t.vat}</p>
        <p className="mt-6 text-[1.0625rem] text-muted-foreground xl:hidden">{t.swipe}</p>
        <div role="region" aria-label={t.tableLabel} tabIndex={0} className="mt-4 overflow-x-auto border border-border focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ring">
          <table className="w-full min-w-[1010px] border-separate border-spacing-0 text-start text-[1.0625rem]" aria-label={t.tableLabel}>
            <thead>
              <tr className="bg-charcoal text-off-white">
                <th scope="col" className="w-[225px] bg-charcoal px-5 py-6 text-start align-top text-[1.125rem] sm:sticky sm:inset-s-0 sm:z-20">{t.plan}</th>
                {columns.map((p) => <th key={p.key} scope="col" className="min-w-[195px] px-4 py-5 text-center align-top">
                  <div className="flex min-h-[205px] flex-col items-center justify-between gap-3">
                    <div>
                      <span className="block text-[1.375rem] font-bold">{p.label}</span>
                      <span className="mt-2 block whitespace-normal font-normal leading-snug text-[#a3abbd]">{p.fit}</span>
                      <span className="mt-4 block text-[0.9375rem] font-normal text-[#a3abbd]">{t.monthly}</span>
                      <span className="mt-1 block text-[1.75rem] font-bold">{monthlyPrice(p)}</span>
                    </div>
                    <Link href={localePath(locale, "demo")} className="inline-flex min-h-11 items-center justify-center bg-off-white px-5 font-bold text-charcoal transition-colors hover:bg-silver-gray focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-cyan">{t.book}</Link>
                  </div>
                </th>)}
              </tr>
            </thead>
            <tbody>
              {primaryRows.map((row) => renderRow(row, true))}
              {groupRow(capacityCopy[locale].title)}
              {planCapacityRows("essential", locale).map((row, index) => renderRow({ key: row.key, label: row.label, detail: row.key === "recordings" ? capacityCopy[locale].draft : capacityCopy[locale].note, value: (p) => planCapacityRows(p.key, locale)[index].value }, false))}
              {groupRow(locale === "ar" ? "ميّزات المنصة" : "Platform features")}
              {planFeatureRows("essential", locale).map((row, index) => renderRow({ key: row.key, label: row.label, detail: locale === "ar" ? "يخضع استخدام المكالمات والمحادثات النصية لقواعد حصة النقاط الموضحة أعلاه. يوضح العرض المكتوب نطاق الربط ورسوم التجهيز وأي رسوم خارجية." : "Call and text usage follows the credit rules shown above. The written offer specifies integration scope, setup and any external charges.", value: (p) => planFeatureRows(p.key, locale)[index].value }, false))}
              {groupRow(t.usageDetail)}
              {detailRows.map((row) => renderRow(row, false))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 grid max-w-[75ch] gap-2 text-[1.0625rem] leading-[1.7] text-muted-foreground">
          <p>{t.exclusive}</p>
          <p>{t.inPlanNote}</p>
          <p>{locale === "ar" ? "قيمة النقطة: 11 هللة في أساسي، و10 هللات في نمو، ونحو 9 هللات في توسّع. أسعار الاستخدام في توسّع تقريبية بسبب تقريب عدد النقاط الشهري إلى عدد صحيح. أسعار مؤسسات وحصتها واستخدامها تُحدد في العقد." : "Credit value: 11 halalah in Essential, 10 in Growth and approximately 9 in Expansion. Expansion’s usage values are approximate because its monthly credits are rounded to a whole number. Enterprise pricing, credits and usage terms are set by contract."}</p>
          <p>{t.seller}: <span>{locale === "ar" ? SELLER_NAME_AR : SELLER_NAME}</span> · {t.vatNumber}: <span dir="ltr">{VAT_NUMBER}</span></p>
        </div>
      </Section>

      <Section>
        <div className="border-t border-border">
          <Row title={locale === "ar" ? "تجربة 14 يوماً" : "14-day trial"}>
            <p>{terms.trial}</p>
          </Row>
          <Row title={t.mathTitle}>
            <p>{terms.units}</p>
            <p className="mt-3">{terms.cloning}</p>
            <ul className="mt-5 divide-y divide-border border-y border-border font-medium tabular-nums">{t.math.split(";").flatMap(line => line.split("؛")).map(line => <li key={line} className="py-3">{line.trim()}</li>)}</ul>
            <p dir="ltr" className="mt-5 bg-secondary p-4 text-center text-[1.125rem] font-semibold">(3 × 10) + (2 × 4) = 38 {locale === "ar" ? "نقطة" : "credits"}</p>
            <p className="mt-3 text-muted-foreground">{locale === "ar" ? "حصة واحدة مشتركة. لا خصم إضافياً لمعالجة المكالمة." : "One shared pool. No additional call-processing credit deduction."}</p>
          </Row>
          <Row title={t.conditionTitle}>
            <ul className="list-disc space-y-3 ps-5">{[terms.zero, terms.more, terms.packs, terms.annual, terms.expiry, terms.setup, terms.byoc].map((c) => <li key={c}>{c}</li>)}</ul>
          </Row>
        </div>
      </Section>

      <WorkflowComparison locale={locale} />

      <Section className="pb-[clamp(96px,11.2vw,168px)]">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <DemoLink locale={locale}>{t.book}</DemoLink>
          <Link href={localePath(locale, "refund-policy")} className={`inline-flex min-h-11 items-center text-[1.125rem] ${textLink}`}>{t.policy}</Link>
          <Link href={localePath(locale, "contact")} className={`inline-flex min-h-11 items-center text-[1.125rem] ${textLink}`}>{t.contact}</Link>
        </div>
      </Section>
    </>
  );
}
