import type { Locale } from "@/lib/i18n";

// Capacity/support: signed v3 carried forward from v2, mirrored in the
// application plan catalog and bilingual plan copy. Sultan approved recording
// periods on 2026-09-27; policy/storage alignment remains a release dependency.
const capacity = {
  essential: { users: 2, agents: 3, days: 90, support: { ar: "خلال يومَي عمل", en: "Within 2 business days" } },
  growth: { users: 5, agents: 8, days: 180, support: { ar: "خلال يوم عمل", en: "Within 1 business day" } },
  expansion: { users: 10, agents: 20, days: 365, support: { ar: "خلال 8 ساعات عمل", en: "Within 8 business hours" } },
} as const;

export const capacityCopy = {
  ar: {
    title: "فريقك وسعة التشغيل", users: "مستخدمون من فريقك", agents: "وكلاء ذكاء اصطناعي", lines: "مكالمات متزامنة", lineCapacity: "حسب سعة خطك أو الرقم المطلوب", recordings: "حفظ التسجيلات", records: "النصوص والملخصات وسجل العملاء", active: "طوال مدة الاشتراك", support: "الرد على طلبات الدعم", quote: "حسب العرض المكتوب", day: "يوماً",
    note: "المستخدم حساب لموظف من فريقك، والوكيل مساعد ذكاء اصطناعي تُعدّه لنشاطك. تعتمد المكالمات المتزامنة على سعة خطك الهاتفي أو السعة المفعّلة للرقم المطلوب، وتُؤكد في العرض المكتوب.",
    draft: "نسخة مراجعة: اعتُمدت مدد حفظ التسجيلات المعروضة، ويُنسَّق تطبيقها مع سياسة الخصوصية وإعدادات التخزين قبل النشر. السياسة الحالية 90 يوماً؛ وللنصوص والملخصات وسجل العملاء مدد مستقلة.",
  },
  en: {
    title: "Your team and operating capacity", users: "Team users", agents: "AI agents", lines: "Simultaneous calls", lineCapacity: "Based on your line or ordered number capacity", recordings: "Recording retention", records: "Transcripts, summaries & customer records", active: "During the subscription", support: "Support response", quote: "Written agreement", day: "days",
    note: "A user is a team member's account; an AI agent is an assistant configured for your business. Simultaneous calls depend on your existing phone line or the capacity provisioned with your ordered number, confirmed in the written offer.",
    draft: "Review version: the displayed recording periods are approved; privacy policy and storage settings must be aligned before publication. The current policy is 90 days. Transcripts, summaries and customer records have separate retention terms.",
  },
} as const;

export function planCapacityRows(key: string, locale: Locale) {
  const t = capacityCopy[locale];
  const p = key in capacity ? capacity[key as keyof typeof capacity] : null;
  return [
    { key: "users", label: t.users, value: p ? String(p.users) : t.quote },
    { key: "agents", label: t.agents, value: p ? String(p.agents) : t.quote },
    { key: "lines", label: t.lines, value: t.lineCapacity },
    { key: "recordings", label: t.recordings, value: p ? `${p.days} ${t.day}` : t.quote },
    { key: "records", label: t.records, value: t.active },
    { key: "support", label: t.support, value: p ? p.support[locale] : t.quote },
  ];
}

export function PlanCapacity({ planKey, locale }: { planKey: string; locale: Locale }) {
  return <dl className="mt-5 grid gap-x-6 gap-y-3 border-t border-line pt-5 text-body sm:grid-cols-2">
    {planCapacityRows(planKey, locale).map(row => <div key={row.key}>
      <dt className="text-ink/65">{row.label}</dt>
      <dd className="mt-1 font-semibold tabular-nums text-ink">{row.value}</dd>
    </div>)}
  </dl>;
}

// Review proposal based on documented platform capabilities and current
// paid-plan entitlements. No invented automation/API quotas or unlimited claims.
export function planFeatureRows(key: string, locale: Locale) {
  const ar = locale === "ar";
  const available = ar ? "متاح" : "Available";
  const quote = ar ? "حسب نطاق التجهيز والعرض المكتوب" : "Scoped in the written offer";
  const labels = ar ? ["الرد الصوتي بالذكاء الاصطناعي على مدار الساعة", "واتساب وتيليجرام ودردشة الموقع", "بناء الوكيل وقاعدة المعرفة", "سجل العملاء وصندوق الوارد المشترك", "أتمتة سير العمل", "تقارير المكالمات والملخصات وتحليل المشاعر", "إشراف مباشر: استماع وتوجيه واستلام المكالمة", "أصوات العلامة المستنسخة", "تكامل الأنظمة الخارجية", "تجهيز الأرقام وربط خطك"] : ["24/7 AI voice answering", "WhatsApp, Telegram and website chat", "Agent builder and knowledge base", "Customer history and shared inbox", "Workflow automation", "Call reports, summaries and sentiment", "Live supervision: listen, whisper and take over", "Cloned brand voices", "External system integrations", "Number provisioning and line connection"];
  const voices = key === "essential" ? (ar ? "غير مشمول — تتوفر الأصوات الجاهزة" : "Not included — standard voices available") : key === "growth" ? "1" : key === "expansion" ? "3" : quote;
  return labels.map((label, index) => ({ key: `feature-${index}`, label, value: index === 7 ? voices : index >= 8 ? quote : available }));
}
