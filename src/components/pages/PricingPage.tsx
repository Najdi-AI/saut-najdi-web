import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { plans, textConversations, voiceMinutes } from "@/content/pricing";
import { SELLER_NAME, SELLER_NAME_AR, VAT_NUMBER } from "@/lib/site";
import { PricingTooltip } from "@/components/pages/PricingTooltip";

const copy = {
  ar: {
    eyebrow: "الباقات والأسعار",
    title: "رصيد واحد للمكالمات والمحادثات",
    intro: "اختر باقتك الشهرية واستخدم رصيدها للمكالمات الصوتية أو المحادثات النصية أو مزيج منهما. ابدأ بعرض تعريفي لنحدد التجهيز المناسب لمنشأتك.",
    vat: "الأسعار المعروضة بالريال السعودي ولا تشمل ضريبة القيمة المضافة 15%. تُضاف الضريبة في الفاتورة الضريبية عند الدفع بعد العرض التعريفي والعرض المكتوب.",
    seller: "الجهة البائعة",
    vatNumber: "الرقم الضريبي",
    plan: "الباقة",
    monthly: "السعر الشهري الأساسي",
    credits: "الرصيد الشهري المشترك",
    voice: "إذا استُخدم كله للمكالمات",
    text: "إذا استُخدم كله للمحادثات",
    valueVoice: "تكلفة الدقيقة ضمن الباقة",
    valueText: "تكلفة المحادثة ضمن الباقة",
    extraVoice: "الدقيقة الإضافية بعد نفاد الرصيد",
    extraText: "المحادثة الإضافية بعد نفاد الرصيد",
    extraHelp: "هذا سعر الاستخدام الإضافي لهذه الخدمة بعد نفاد الرصيد الشهري المشترك. يظهر في الفاتورة التالية ويُخصم من رصيد الاستخدام المدفوع مقدماً.",
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
    unitHelp: "قسمة السعر الشهري الأساسي قبل الضريبة على السعة إذا استُخدم الرصيد كله لهذا النوع؛ هذا متوسط ضمن الباقة وليس سعر استخدام إضافي.",
    conditionTitle: "قبل الاشتراك",
    conditions: [
      "تبدأ الخطوة الأولى بعرض تعريفي. نرسل بعده عرضاً مكتوباً يوضح رسوم التجهيز حسب احتياج منشأتك وتاريخ التفعيل.",
      "بعد نفاد الرصيد تُحتسب الدقائق والمحادثات الإضافية بالأسعار الموضحة أعلاه وتُبيّن في الفاتورة التالية. يُستخدم رصيد الاستخدام المدفوع مقدماً لتسوية هذه الرسوم إن وُجد، ولا تُحصّل مرتين. يوضح العرض المكتوب أي رسوم إضافية قبل الدفع.",
      "ينتهي الرصيد المشمول بنهاية فترة الفوترة الشهرية ولا يُستبدل بنقد. يسري إلغاء الاشتراك في نهاية الشهر الذي يصلنا فيه طلب مكتوب من مدير الحساب.",
      "الحد الأدنى لشحن رصيد الاستخدام 250 ر.س، وصلاحيته 12 شهراً من تاريخ الدفع. توضح سياسة الاسترداد والإلغاء الحالات التي يُرد فيها الرصيد غير المستخدم.",
    ],
    policy: "سياسة الاسترداد والإلغاء",
    contact: "تواصل معنا",
    tableLabel: "مقارنة الباقات الشهرية",
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
    monthly: "Monthly base price",
    credits: "Shared monthly credits",
    voice: "If used only for voice",
    text: "If used only for conversations",
    valueVoice: "Effective voice cost in plan",
    valueText: "Effective conversation cost in plan",
    extraVoice: "Extra voice minute after credits run out",
    extraText: "Extra conversation after credits run out",
    extraHelp: "This is the extra-usage rate for this service after the shared monthly pool runs out. It appears on the next invoice and is deducted from a prepaid usage balance.",
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
    unitHelp: "Monthly base price before VAT divided by the full-pool capacity for this use type. This is an in-plan average, not an extra-usage rate.",
    conditionTitle: "Before you subscribe",
    conditions: [
      "Start with a demo. We then send a written offer showing the setup fee for your needs and the activation date.",
      "After the pool runs out, extra voice minutes and conversations are itemized on the next invoice at the rates above. Any prepaid usage balance is applied to those charges, so the same usage is not collected twice. The written offer states any other charges before payment.",
      "Included credits expire at the end of the monthly billing period and cannot be redeemed for cash. Cancellation takes effect at the end of the month in which we receive a written request from the account administrator.",
      "Prepaid usage balance has a minimum top-up of SAR 250 and is valid for 12 months from payment. The refund policy explains when unused balance is returned.",
    ],
    policy: "Refund & Cancellation Policy",
    contact: "Contact us",
    tableLabel: "Monthly plan comparison",
    swipe: "Scroll the table sideways to compare the other plans.",
  },
} as const;

function Amount({ value }: { value: number }) {
  return <span dir="ltr" className="inline-block tabular-nums">{new Intl.NumberFormat("en-US").format(value)}</span>;
}

export function PricingPage({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const nf = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  const columns = [
    ...plans.map((p) => ({ key: p.key, label: locale === "ar" ? p.ar : p.en, credits: p.credits, monthlySar: p.monthlySar, extraVoiceSar: p.extraVoiceSar, extraTextSar: p.extraTextSar })),
    { key: "enterprise", label: t.enterprise, credits: null, monthlySar: null, extraVoiceSar: null, extraTextSar: null },
  ];
  const rows = [
    { key: "monthly", label: t.monthly, detail: null, value: (p: typeof columns[number]) => p.monthlySar === null ? t.custom : <><Amount value={p.monthlySar} /> {t.sar}</> },
    { key: "credits", label: t.credits, detail: t.math, value: (p: typeof columns[number]) => p.credits === null ? t.custom : <Amount value={p.credits} /> },
    { key: "voice", label: t.voice, detail: t.exclusive, value: (p: typeof columns[number]) => p.credits === null ? t.custom : <><Amount value={voiceMinutes(p.credits)} /> {t.min}</> },
    { key: "text", label: t.text, detail: t.exclusive, value: (p: typeof columns[number]) => p.credits === null ? t.custom : <><Amount value={textConversations(p.credits)} /> {t.conversation}</> },
    { key: "valueVoice", label: t.valueVoice, detail: t.unitHelp, value: (p: typeof columns[number]) => p.credits === null || p.monthlySar === null ? t.custom : <span dir="ltr" className="inline-block tabular-nums">{nf.format(p.monthlySar / voiceMinutes(p.credits))} {t.perMinute}</span> },
    { key: "valueText", label: t.valueText, detail: t.unitHelp, value: (p: typeof columns[number]) => p.credits === null || p.monthlySar === null ? t.custom : <span dir="ltr" className="inline-block tabular-nums">{nf.format(p.monthlySar / textConversations(p.credits))} {t.perConversation}</span> },
    { key: "extraVoice", label: t.extraVoice, detail: t.extraHelp, value: (p: typeof columns[number]) => p.extraVoiceSar === null ? t.custom : <span dir="ltr" className="inline-block tabular-nums">{nf.format(p.extraVoiceSar)} {t.perMinute}</span> },
    { key: "extraText", label: t.extraText, detail: t.extraHelp, value: (p: typeof columns[number]) => p.extraTextSar === null ? t.custom : <span dir="ltr" className="inline-block tabular-nums">{nf.format(p.extraTextSar)} {t.perConversation}</span> },
  ];

  return (
    <>
      <section className="bg-gradient-to-b from-surface to-canvas">
        <div className="container py-14 text-center">
          <p className="text-body font-medium text-brand-purple">{t.eyebrow}</p>
          <h1 className="mx-auto mt-3 max-w-4xl text-h1">{t.title}</h1>
          <p className="mx-auto mt-5 max-w-3xl text-body-lg leading-relaxed text-ink/75">{t.intro}</p>
          <p className="mx-auto mt-3 max-w-3xl text-body leading-relaxed text-ink/70">{t.vat}</p>
        </div>
      </section>
      <section className="container py-10">
        <div role="region" aria-label={t.tableLabel} tabIndex={0} className="overflow-x-auto rounded-2xl border border-line bg-surface focus-visible:outline-brand-blue">
          <table className="w-full min-w-[850px] border-collapse text-start" aria-label={t.tableLabel}>
            <thead><tr className="bg-ink text-canvas">
              <th scope="col" className="sticky start-0 z-10 bg-ink p-4 text-start text-body-lg">{t.plan}</th>
              {columns.map((p) => <th key={p.key} scope="col" className="min-w-36 p-4 text-center text-body-lg">{p.label}</th>)}
            </tr></thead>
            <tbody>{rows.map((row) => <tr key={row.key} className="border-t border-line even:bg-canvas/70">
              <th scope="row" className="sticky start-0 z-10 bg-surface p-4 text-start font-medium text-ink">{row.detail ? <PricingTooltip id={`price-help-${row.key}`} explanation={row.detail}>{row.label}</PricingTooltip> : row.label}</th>
              {columns.map((p) => <td key={p.key} className="p-4 text-center text-body-lg text-ink/80">{row.value(p)}</td>)}
            </tr>)}</tbody>
          </table>
        </div>
        <p className="mt-3 text-body text-ink/70 sm:hidden">{t.swipe}</p>
        <p className="mt-4 text-body leading-relaxed text-ink/70">{t.exclusive}</p>
        <p className="mt-2 text-body text-ink/70">{t.seller}: <span>{locale === "ar" ? SELLER_NAME_AR : SELLER_NAME}</span> · {t.vatNumber}: <span dir="ltr">{VAT_NUMBER}</span></p>
      </section>
      <section className="container grid gap-8 py-10 lg:grid-cols-2">
        <div className="card"><h2 className="text-h3">{t.mathTitle}</h2><p className="mt-4 text-body-lg leading-relaxed text-ink/75">{t.math}</p><p className="mt-4 text-body-lg font-medium text-ink">{t.example}</p></div>
        <div className="card"><h2 className="text-h3">{t.conditionTitle}</h2><ul className="mt-4 list-disc space-y-3 ps-5 text-body-lg leading-relaxed text-ink/75">{t.conditions.map((c) => <li key={c}>{c}</li>)}</ul></div>
      </section>
      <section className="container pb-16 text-center">
        <Link href={localePath(locale, "demo")} className="btn-primary">{t.book}</Link>
        <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-body">
          <Link href={localePath(locale, "refund-policy")} className="text-brand-blue hover:underline">{t.policy}</Link>
          <Link href={localePath(locale, "contact")} className="text-brand-blue hover:underline">{t.contact}</Link>
        </div>
      </section>
    </>
  );
}
