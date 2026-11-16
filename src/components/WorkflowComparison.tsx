import { DemoLink } from "@/components/DemoLink";
import { Section } from "@/components/page/Section";
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

/**
 * Separate tools against one platform, on the inner-page kit: a Section
 * head, the four chores as flat Silver chips, then the two columns as
 * square panels, the Saut Najdi one a Charcoal .on-dark panel with the
 * demo link. Text colours come from the tokens so both panels read right.
 */
export function WorkflowComparison({ locale, className = "" }: { locale: Locale; className?: string }) {
  const t = copy[locale];
  return (
    <Section title={t.title} lead={t.intro} className={className}>
      <ul className="flex flex-wrap gap-2" aria-label={locale === "ar" ? "قلّل العمل المتكرر" : "Reduce repetitive work"}>
        {(locale === "ar" ? ["تكرار الردود يدوياً", "التنقل بين أدوات متفرقة", "إعادة شرح طلب العميل", "كتابة ملخص كل مكالمة يدوياً"] : ["Repetitive manual answers", "Switching between separate tools", "Customers repeating their request", "Writing every call summary manually"]).map((label) => (
          <li key={label} className="bg-secondary px-4 py-2.5 text-[0.9375rem] font-medium">
            <span aria-hidden="true" className="me-2">−</span>
            {label}
          </li>
        ))}
      </ul>
      <div className="mt-10 grid gap-2 md:grid-cols-2">
        {([false, true] as const).map((withSaut) => (
          <article key={String(withSaut)} className={`flex min-w-0 flex-col p-6 sm:p-8 ${withSaut ? "on-dark" : "border border-border"}`}>
            <h3 className={`text-[1.5rem] font-bold ${withSaut ? "" : "text-muted-foreground"}`}>{withSaut ? t.saut : t.traditional}</h3>
            <ol className="mt-4 flex-1">
              {t.rows.map(([topic, before, after], index) => (
                <li key={topic} className="border-b border-border py-5 last:border-b-0 md:min-h-40">
                  <h4 className="flex items-start gap-3 text-[1.125rem] font-bold">
                    <span className="flex size-7 shrink-0 items-center justify-center bg-secondary text-[0.9375rem] tabular-nums">{index + 1}</span>
                    {topic}
                  </h4>
                  <p className="mt-3 text-[1.0625rem] leading-[1.7] text-muted-foreground">{withSaut ? after : before}</p>
                </li>
              ))}
            </ol>
            <p className="mt-6 bg-secondary p-4 text-[1.0625rem] font-medium">{withSaut ? (locale === "ar" ? "اختر الباقة المناسبة، ثم نحدد التجهيز في العرض التعريفي" : "Choose your plan, then scope setup in your demo") : (locale === "ar" ? "يعتمد الجهد والوقت على أدواتك ومزوّدي الخدمة" : "Time and effort depend on your tools and providers")}</p>
            {withSaut && <div className="mt-6"><DemoLink locale={locale}>{t.cta}</DemoLink></div>}
          </article>
        ))}
      </div>
      <p className="mt-6 max-w-[60ch] text-[1.0625rem] leading-[1.7] text-muted-foreground">{t.note} {locale === "ar" ? "تتوفر الميزات بحسب الباقة والنطاق المتفق عليه." : "Feature availability depends on your plan and agreed scope."}</p>
    </Section>
  );
}
