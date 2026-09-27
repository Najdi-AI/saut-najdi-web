import { DemoLink } from "@/components/DemoLink";
import type { Locale } from "@/lib/i18n";

const copy = {
  ar: {
    title: "من أدوات متفرقة إلى تجربة واحدة", intro: "شوف كيف يجتمع الرد والمتابعة وتسليم المحادثة لفريقك في صوت نجدي.", traditional: "عندما تعمل الأدوات بشكل منفصل", saut: "مع صوت نجدي", cta: "شوفها في عرض تعريفي",
    rows: [
      ["الرد على المكالمات", "يتولى الفريق المكالمات المتكررة، وتعتمد التغطية على أوقات العمل والورديات.", "وكيل صوتي يجيب عن الأسئلة المتكررة على مدار الساعة، ويحوّل الحالات التي تحتاج موظفاً."],
      ["قنوات العملاء", "التنقل بين المكالمات والرسائل وصناديق الوارد يجعل متابعة السياق أصعب.", "مكالمات ومحادثات نصية في منصة واحدة، مع سياق العميل عند التحويل لفريقك."],
      ["معرفة المنشأة", "يبحث الموظف في الملفات أو يسأل زملاءه عن الإجابة المناسبة.", "وكيلك يرجع لقاعدة معرفة منشأتك ويستخدم المعلومات التي تضيفها إليه."],
      ["تسليم المحادثة لموظف", "قد يضطر العميل لإعادة طلبه عند انتقاله إلى موظف آخر.", "موظفك يستلم المحادثة ومعه النص والملخص والسياق المتاح."],
      ["متابعة المكالمات", "جمع التسجيلات والملاحظات والتقارير من أكثر من أداة.", "تسجيل ونص وملخص للمكالمة ولوحة متابعة، وفق سياسة الاحتفاظ."],
      ["البدء والتجهيز", "تنسيق إعداد الهاتف والرد وإجراءات الفريق عبر أدوات ومزوّدين مختلفين.", "نبدأ بعرض تعريفي، ثم نحدد التجهيز والتكاملات والرسوم وموعد التفعيل في عرض مكتوب."],
    ],
    note: "تختلف خطوات التجهيز باختلاف رقمك الحالي والتكاملات واحتياج منشأتك. نوضحها قبل الاشتراك.",
  },
  en: {
    title: "Bring the customer journey together", intro: "See how answering, follow-up and human handoff connect in Saut Najdi.", traditional: "When tools work separately", saut: "With Saut Najdi", cta: "See it in a demo",
    rows: [
      ["Answering calls", "Your team handles repetitive calls; coverage depends on working hours and shifts.", "A voice agent handles routine questions around the clock and routes cases that need a person."],
      ["Customer channels", "Switching between calls, messages and inboxes makes context harder to follow.", "Calls and text conversations in one platform, with customer context available for handoff."],
      ["Business knowledge", "Staff search documents or ask colleagues for the right answer.", "Your agent draws on the business knowledge you provide."],
      ["Human handoff", "Customers may repeat their request when another staff member takes over.", "Your team receives the conversation with its transcript, summary and available context."],
      ["Call follow-up", "Recordings, notes and reports are gathered from several tools.", "Call recording, transcript, summary and a dashboard, subject to retention terms."],
      ["Getting started", "Phone setup, answering and team workflows are coordinated across tools and providers.", "Start with a demo, then receive a written offer covering setup, integrations, fees and activation."],
    ],
    note: "Setup depends on your existing number, integrations and business needs. We explain these before you subscribe.",
  },
} as const;

export function WorkflowComparison({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return <section className="border-y border-line bg-canvas py-16" aria-labelledby="workflow-comparison-heading">
    <div className="container">
      <div className="mx-auto max-w-3xl text-center"><h2 id="workflow-comparison-heading" className="text-h2">{t.title}</h2><p className="mt-4 text-body-lg text-ink/70">{t.intro}</p></div>
      <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-3" aria-label={locale === "ar" ? "قلّل العمل المتكرر" : "Reduce repetitive work"}>
        {(locale === "ar" ? ["تكرار الردود يدوياً", "التنقل بين أدوات متفرقة", "إعادة شرح طلب العميل", "كتابة ملخص كل مكالمة يدوياً"] : ["Repetitive manual answers", "Switching between separate tools", "Customers repeating their request", "Writing every call summary manually"]).map(label => <span key={label} className="rounded-lg border border-line bg-surface px-4 py-2 text-body text-ink/70"><span aria-hidden="true" className="me-2 text-brand-blue">−</span>{label}</span>)}
      </div>
      <div className="mx-auto mt-9 grid max-w-6xl gap-6 md:grid-cols-2">
        {([false, true] as const).map(withSaut => <article key={String(withSaut)} className={`flex min-w-0 flex-col rounded-3xl border p-5 shadow-card sm:p-8 ${withSaut ? "border-brand-blue/50 bg-brand-gradient-soft" : "border-line bg-surface"}`}>
          <h3 className={`text-center text-h3 ${withSaut ? "text-brand-blue" : "text-ink/70"}`}>{withSaut ? t.saut : t.traditional}</h3>
          <ol className="mt-6 flex-1 divide-y divide-line">
            {t.rows.map(([topic, before, after], index) => <li key={topic} className="py-5 md:min-h-40">
              <h4 className="flex items-start gap-3 text-body-lg font-semibold"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-body text-brand-blue">{index + 1}</span>{topic}</h4>
              <p className="mt-3 text-body leading-relaxed text-ink/70">{withSaut ? after : before}</p>
            </li>)}
          </ol>
          <div className="mt-6 rounded-xl bg-canvas p-4 text-center text-body font-medium">{withSaut ? (locale === "ar" ? "اختر الباقة المناسبة، ثم نحدد التجهيز في العرض التعريفي" : "Choose your plan, then scope setup in your demo") : (locale === "ar" ? "يعتمد الجهد والوقت على أدواتك ومزوّدي الخدمة" : "Time and effort depend on your tools and providers")}</div>
          {withSaut && <div className="mt-6 text-center"><DemoLink locale={locale}>{t.cta}</DemoLink></div>}
        </article>)}
      </div>
      <p className="mx-auto mt-6 max-w-3xl text-center text-body text-ink/65">{t.note} {locale === "ar" ? "تتوفر الميزات بحسب الباقة والنطاق المتفق عليه." : "Feature availability depends on your plan and agreed scope."}</p>
    </div>
  </section>;
}
