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
      <div className="mx-auto mt-9 max-w-6xl overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
        <div className="hidden grid-cols-2 border-b border-line md:grid"><h3 className="p-6 text-h4 text-ink/70">{t.traditional}</h3><h3 className="border-s border-line bg-brand-gradient-soft p-6 text-h4">{t.saut}</h3></div>
        {t.rows.map(([topic, before, after]) => <div key={topic} className="border-b border-line last:border-b-0">
          <h3 className="bg-canvas px-6 py-3 text-body-lg font-semibold">{topic}</h3>
          <div className="grid md:grid-cols-2"><div className="p-6 text-body-lg leading-relaxed text-ink/65"><span className="mb-2 block text-body font-semibold md:hidden">{t.traditional}</span>{before}</div><div className="border-t border-line bg-brand-blue/5 p-6 text-body-lg leading-relaxed text-ink md:border-s md:border-t-0"><span className="mb-2 block text-body font-semibold text-brand-blue md:hidden">{t.saut}</span>{after}</div></div>
        </div>)}
      </div>
      <p className="mx-auto mt-6 max-w-3xl text-center text-body text-ink/65">{t.note}</p>
      <div className="mt-6 text-center"><DemoLink locale={locale}>{t.cta}</DemoLink></div>
    </div>
  </section>;
}
