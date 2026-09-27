import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { formatSarRate, plans, textConversations, voiceMinutes } from "@/content/pricing";
import { SELLER_NAME, SELLER_NAME_AR, VAT_NUMBER } from "@/lib/site";
import { PricingTooltip } from "@/components/pages/PricingTooltip";
import { PricingOverview } from "@/components/PricingOverview";
import { Waveform } from "@/components/Waveform";
import { capacityCopy, planCapacityRows } from "@/components/PlanCapacity";
import { WorkflowComparison } from "@/components/WorkflowComparison";

const copy = {
  ar: {
    eyebrow: "الباقات والأسعار",
    title: "رصيد واحد للمكالمات والمحادثات",
    intro: "اختر باقتك الشهرية واستخدم رصيدها للمكالمات الصوتية أو المحادثات النصية أو مزيج منهما. ابدأ بعرض تعريفي لنحدد التجهيز المناسب لمنشأتك.",
    vat: "الأسعار المعروضة بالريال السعودي ولا تشمل ضريبة القيمة المضافة 15%. تُضاف الضريبة في الفاتورة الضريبية عند الدفع بعد العرض التعريفي والعرض المكتوب.",
    seller: "الجهة البائعة",
    vatNumber: "الرقم الضريبي",
    plan: "الباقة",
    fit: {
      essential: "بداية برصيد شهري مشترك",
      growth: "رصيد أكبر لنمو الاستخدام",
      expansion: "للاستخدام الشهري الأعلى",
      enterprise: "التفاصيل في عرض مكتوب",
    },
    monthly: "السعر الشهري الأساسي",
    credits: "الرصيد الشهري المشترك",
    creditsPerSar: "رصيد لكل ريال",
    creditsPerSarHelp: "الرصيد الشهري المشمول مقسوماً على السعر الشهري الأساسي قبل الضريبة، مع تقريب الناتج إلى منزلة عشرية واحدة.",
    voice: "إذا استُخدم كله للمكالمات",
    text: "إذا استُخدم كله للمحادثات",
    valueVoice: "سعر الدقيقة ضمن الباقة",
    valueText: "سعر المحادثة ضمن الباقة",
    extraVoice: "الدقيقة الإضافية بعد نفاد الرصيد",
    extraText: "المحادثة الإضافية بعد نفاد الرصيد",
    extraHelp: "هذا السعر أعلى 10% من سعر الاستخدام ضمن الباقة، ويُحتسب بعد نفاد الرصيد الشهري المشترك. يظهر في الفاتورة التالية ويُسوّى من رصيد الاستخدام المدفوع مقدماً إن وُجد.",
    sar: "ر.س",
    min: "دقيقة",
    conversation: "محادثة",
    perMinute: "ر.س/دقيقة",
    perConversation: "ر.س/محادثة",
    custom: "عرض مكتوب",
    enterprise: "مؤسسات",
    book: "احجز عرضاً",
    mathTitle: "كيف يُحسب الرصيد؟",
    math: "كل دقيقة مكالمة مع الوكيل = 100 رصيد. كل محادثة نصية قابلة للفوترة ضمن نافذة 24 ساعة = 56 رصيد. كلاهما يُخصم من الرصيد الشهري نفسه.",
    example: "مثال: 3 دقائق مكالمات ومحادثتان نصيتان = 3 × 100 + 2 × 56 = 412 رصيد.",
    exclusive: "الأرقام في صفَّي الدقائق والمحادثات تفترض استخدام الرصيد كله لنوع واحد. عند مزج النوعين، يكون الإجمالي حسب الرصيد المستهلك فعلياً.",
    unitHelp: "السعر المرجعي المعتمد لهذا النوع من الاستخدام ضمن الباقة. يُخصم الاستخدام من الرصيد المشمول، ولا تُضاف رسوم استخدام مستقلة ما دام الرصيد متاحاً.",
    inPlanNote: "أسعار الاستخدام ضمن الباقة أسعار مرجعية، ولا تُضاف إلى الاشتراك ما دام الرصيد المشترك متاحاً. تتغير التكلفة الفعلية لكل استخدام حسب مزيج المكالمات والمحادثات.",
    callCostTitle: "ماذا تغطي أرصدة المكالمة؟",
    callCost: "دقيقة مكالمة واحدة = 100 رصيد، وتشمل معالجة تحويل الكلام إلى نص للمحادثة، وردود الوكيل، ومعالجة ملخص المكالمة عند إنشائه. لا يوجد خصم أرصدة مستقل لكل خطوة من هذه الخطوات.",
    callCostNote: "نص المكالمة ينتج من تحويل الكلام إلى نص؛ ويُستخدم توليد النص في ردود الوكيل والملخص. توضح الفاتورة استخدام المكالمات والمحادثات، لا تكلفة كل مزوّد تقني على حدة.",
    conditionTitle: "قبل الاشتراك",
    conditions: [
      "تبدأ الخطوة الأولى بعرض تعريفي. نرسل بعده عرضاً مكتوباً يوضح رسوم التجهيز حسب احتياج منشأتك وتاريخ التفعيل.",
      "بعد نفاد الرصيد تُحتسب الدقائق والمحادثات الإضافية بسعر أعلى 10% من سعر الاستخدام ضمن الباقة، وتُبيّن في الفاتورة التالية. يُستخدم رصيد الاستخدام المدفوع مقدماً لتسوية هذه الرسوم إن وُجد، ولا تُحصّل مرتين. يوضح العرض المكتوب أي رسوم إضافية قبل الدفع.",
      "ينتهي الرصيد المشمول بنهاية فترة الفوترة الشهرية ولا يُستبدل بنقد. يسري إلغاء الاشتراك في نهاية الشهر الذي يصلنا فيه طلب مكتوب من مدير الحساب.",
      "الحد الأدنى لشحن رصيد الاستخدام 250 ر.س، وصلاحيته 12 شهراً من تاريخ الدفع. توضح سياسة الاسترداد والإلغاء الحالات التي يُرد فيها الرصيد غير المستخدم.",
    ],
    policy: "سياسة الاسترداد والإلغاء",
    contact: "تواصل معنا",
    tableLabel: "مقارنة الباقات الشهرية",
    fullDetails: "جدول المقارنة الكامل",
    usageDetail: "التكلفة والاستخدام الإضافي",
    swipe: "مرّر الجدول أفقياً لمقارنة بقية الباقات.",
  },
  en: {
    eyebrow: "Plans & pricing",
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
    extraVoice: "Extra voice minute after credits run out",
    extraText: "Extra conversation after credits run out",
    extraHelp: "This rate is 10% above the in-plan usage rate and applies after the shared monthly pool runs out. It appears on the next invoice and is settled against any prepaid usage balance, if available.",
    sar: "SAR",
    min: "minutes",
    conversation: "conversations",
    perMinute: "SAR/minute",
    perConversation: "SAR/conversation",
    custom: "Written quote",
    enterprise: "Enterprise",
    book: "Book a demo",
    mathTitle: "How credits work",
    math: "Each AI call minute uses 100 credits. Each billable text conversation in a 24-hour window uses 56 credits. Both draw from the same monthly pool.",
    example: "Example: 3 call minutes and 2 text conversations = 3 × 100 + 2 × 56 = 412 credits.",
    exclusive: "The minutes and conversations rows assume the full pool is spent on one use type. When you mix them, the total follows credits actually used.",
    unitHelp: "The approved reference rate for this use within the plan. Usage draws from included credits; there is no separate unit charge while credits remain.",
    inPlanNote: "In-plan usage rates are reference prices and are not added to the subscription while shared credits remain. Your effective cost per use varies with your mix of calls and conversations.",
    callCostTitle: "What do voice credits cover?",
    callCost: "One AI call minute = 100 credits. This covers speech-to-text processing for the call transcript, agent replies, and post-call summary processing when a summary is generated. These steps do not each consume a separate credit unit.",
    callCostNote: "Speech-to-text creates the transcript; text generation powers agent replies and the summary. Invoices show call and conversation usage, not separate technology-provider costs.",
    conditionTitle: "Before you subscribe",
    conditions: [
      "Start with a demo. We then send a written offer showing the setup fee for your needs and the activation date.",
      "After the pool runs out, extra voice minutes and conversations cost 10% more than the in-plan usage rates and are itemized on the next invoice. Any prepaid usage balance is applied to those charges, so the same usage is not collected twice. The written offer states any other charges before payment.",
      "Included credits expire at the end of the monthly billing period and cannot be redeemed for cash. Cancellation takes effect at the end of the month in which we receive a written request from the account administrator.",
      "Prepaid usage balance has a minimum top-up of SAR 250 and is valid for 12 months from payment. The refund policy explains when unused balance is returned.",
    ],
    policy: "Refund & Cancellation Policy",
    contact: "Contact us",
    tableLabel: "Monthly plan comparison",
    fullDetails: "Full plan comparison",
    usageDetail: "Costs and extra usage",
    swipe: "Scroll the table sideways to compare the other plans.",
  },
} as const;

function Amount({ value }: { value: number }) {
  return <span dir="ltr" className="inline-block tabular-nums">{new Intl.NumberFormat("en-US").format(value)}</span>;
}

export function PricingPage({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const creditsPerSar = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1, minimumFractionDigits: 1 });
  const columns = [
    ...plans.map((p) => ({ key: p.key, label: locale === "ar" ? p.ar : p.en, fit: t.fit[p.key], credits: p.credits, monthlySar: p.monthlySar, withinVoiceSar: p.withinVoiceSar, withinTextSar: p.withinTextSar, extraVoiceSar: p.extraVoiceSar, extraTextSar: p.extraTextSar })),
    { key: "enterprise", label: t.enterprise, fit: t.fit.enterprise, credits: null, monthlySar: null, withinVoiceSar: null, withinTextSar: null, extraVoiceSar: null, extraTextSar: null },
  ];
  type Column = typeof columns[number];
  const monthlyPrice = (p: Column) => p.monthlySar === null ? t.custom : <><Amount value={p.monthlySar} /> <span className="text-body-lg font-medium">{t.sar}</span></>;
  type PricingRow = { key: string; label: string; detail: string; value: (p: Column) => ReactNode };
  const primaryRows: PricingRow[] = [
    { key: "credits", label: t.credits, detail: t.math, value: (p: Column) => p.credits === null ? t.custom : <span className="text-h4 font-bold"><Amount value={p.credits} /></span> },
    { key: "creditsPerSar", label: t.creditsPerSar, detail: t.creditsPerSarHelp, value: (p: Column) => p.credits === null || p.monthlySar === null ? t.custom : <span dir="ltr" className="inline-block tabular-nums">{creditsPerSar.format(p.credits / p.monthlySar)}</span> },
    { key: "voice", label: t.voice, detail: t.exclusive, value: (p: Column) => p.credits === null ? t.custom : <><Amount value={voiceMinutes(p.credits)} /> <span className="text-body">{t.min}</span></> },
    { key: "text", label: t.text, detail: t.exclusive, value: (p: Column) => p.credits === null ? t.custom : <><Amount value={textConversations(p.credits)} /> <span className="text-body">{t.conversation}</span></> },
  ];
  const detailRows: PricingRow[] = [
    { key: "valueVoice", label: t.valueVoice, detail: t.unitHelp, value: (p: Column) => p.withinVoiceSar === null ? t.custom : <span dir="ltr" className="inline-block tabular-nums">{formatSarRate(p.withinVoiceSar)} {t.perMinute}</span> },
    { key: "valueText", label: t.valueText, detail: t.unitHelp, value: (p: Column) => p.withinTextSar === null ? t.custom : <span dir="ltr" className="inline-block tabular-nums">{formatSarRate(p.withinTextSar)} {t.perConversation}</span> },
    { key: "extraVoice", label: t.extraVoice, detail: t.extraHelp, value: (p: Column) => p.extraVoiceSar === null ? t.custom : <span dir="ltr" className="inline-block tabular-nums">{formatSarRate(p.extraVoiceSar)} {t.perMinute}</span> },
    { key: "extraText", label: t.extraText, detail: t.extraHelp, value: (p: Column) => p.extraTextSar === null ? t.custom : <span dir="ltr" className="inline-block tabular-nums">{formatSarRate(p.extraTextSar)} {t.perConversation}</span> },
  ];
  const renderRow = (row: PricingRow, prominent: boolean) => (
    <tr key={row.key} className="border-t border-line">
      <th scope="row" className="sticky start-0 z-10 border-t border-line bg-surface px-5 py-4 text-start text-body font-medium text-ink">
        <PricingTooltip id={`price-help-table-${row.key}`} explanation={row.detail}>{row.label}</PricingTooltip>
      </th>
      {columns.map((p) => <td key={p.key} className={`border-t border-line px-4 py-4 text-center text-ink ${p.key === "growth" ? "bg-brand-purple/5" : "bg-surface"} ${prominent ? "text-body-lg font-semibold" : "text-body"}`}>{row.value(p)}</td>)}
    </tr>
  );

  return (
    <>
      <section className="border-b border-line bg-brand-gradient-soft">
        <div className="container py-7 text-center sm:py-10">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="mx-auto mt-3 max-w-4xl text-3xl font-bold leading-tight sm:text-h1">{t.title}</h1>
          <p className="mx-auto mt-3 max-w-3xl text-body leading-relaxed text-ink/75 sm:text-body-lg">{t.intro}</p>
          <Waveform bars={28} animate={false} maxHeight={26} className="mt-3" />
        </div>
      </section>
      <section className="container pt-6 sm:pt-8">
        <p className="rounded-xl border border-line bg-surface px-5 py-3 text-body leading-relaxed text-ink/75">{t.vat}</p>
      </section>
      <PricingOverview locale={locale} variant="page" />
      <section className="container pb-8">
        <details className="group">
          <summary className="cursor-pointer rounded-xl border border-line bg-surface px-5 py-4 text-h4 font-semibold text-ink hover:border-brand-blue focus-visible:outline-brand-blue">{t.fullDetails}</summary>
          <p className="my-3 text-body text-ink/70 xl:hidden">{t.swipe}</p>
          <div role="region" aria-label={t.tableLabel} tabIndex={0} className="mt-4 overflow-x-auto rounded-2xl border border-line bg-surface shadow-card focus-visible:outline-brand-blue">
          <table className="w-full min-w-[1010px] border-separate border-spacing-0 text-start" aria-label={t.tableLabel}>
            <thead>
              <tr className="bg-navy text-white">
                <th scope="col" className="sticky start-0 z-20 w-[225px] bg-navy px-5 py-6 text-start align-top text-body-lg">{t.plan}</th>
                {columns.map((p) => <th key={p.key} scope="col" className={`min-w-[195px] px-4 py-5 text-center align-top ${p.key === "growth" ? "bg-brand-purple/30" : ""}`}>
                  <div className="flex min-h-[205px] flex-col items-center justify-between gap-3">
                    <div>
                      <span className="block text-h4 font-bold">{p.label}</span>
                      <span className="mt-2 block whitespace-normal text-body font-normal leading-snug text-white/75">{p.fit}</span>
                      <span className="mt-4 block text-body-sm font-normal text-white/70">{t.monthly}</span>
                      <span className="mt-1 block text-h3 font-bold">{monthlyPrice(p)}</span>
                    </div>
                    <Link href={localePath(locale, "demo")} className="inline-flex min-h-10 items-center justify-center rounded-full bg-white px-5 py-2 text-body font-semibold text-[#0D1326] transition hover:bg-white/90 focus-visible:outline-brand-cyan">{t.book}</Link>
                  </div>
                </th>)}
              </tr>
            </thead>
            <tbody>
              {primaryRows.map((row) => renderRow(row, true))}
              <tr><th colSpan={columns.length + 1} className="border-t border-line bg-canvas px-5 py-3 text-start text-body font-semibold text-ink">{capacityCopy[locale].title}</th></tr>
              {planCapacityRows("essential", locale).map((row, index) => renderRow({ key: row.key, label: row.label, detail: row.key === "recordings" ? capacityCopy[locale].draft : capacityCopy[locale].note, value: (p) => planCapacityRows(p.key, locale)[index].value }, false))}
              <tr><th colSpan={columns.length + 1} className="border-t border-line bg-canvas px-5 py-3 text-start text-body font-semibold text-ink">{t.usageDetail}</th></tr>
              {detailRows.map((row) => renderRow(row, false))}
            </tbody>
          </table>
          </div>
        </details>
        <p className="mt-4 text-body leading-relaxed text-ink/70">{t.exclusive}</p>
        <p className="mt-2 text-body leading-relaxed text-ink/70">{t.inPlanNote}</p>
        <p className="mt-2 text-body text-ink/70">{t.seller}: <span>{locale === "ar" ? SELLER_NAME_AR : SELLER_NAME}</span> · {t.vatNumber}: <span dir="ltr">{VAT_NUMBER}</span></p>
      </section>
      <section className="container grid gap-8 py-10 lg:grid-cols-2">
        <div className="card"><h2 className="text-h3">{t.mathTitle}</h2><p className="mt-4 text-body-lg leading-relaxed text-ink/75">{t.math}</p><p className="mt-4 text-body-lg font-medium text-ink">{t.example}</p><h3 className="mt-6 text-h4 font-semibold">{t.callCostTitle}</h3><p className="mt-3 text-body-lg leading-relaxed text-ink/75">{t.callCost}</p><p className="mt-3 text-body leading-relaxed text-ink/70">{t.callCostNote}</p></div>
        <div className="card"><h2 className="text-h3">{t.conditionTitle}</h2><ul className="mt-4 list-disc space-y-3 ps-5 text-body-lg leading-relaxed text-ink/75">{t.conditions.map((c) => <li key={c}>{c}</li>)}</ul></div>
      </section>
      <WorkflowComparison locale={locale} />
      <section className="container py-16 text-center">
        <Link href={localePath(locale, "demo")} className="btn-primary">{t.book}</Link>
        <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-body">
          <Link href={localePath(locale, "refund-policy")} className="text-brand-blue hover:underline">{t.policy}</Link>
          <Link href={localePath(locale, "contact")} className="text-brand-blue hover:underline">{t.contact}</Link>
        </div>
      </section>
    </>
  );
}
