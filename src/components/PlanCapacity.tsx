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

// Commercial packaging PROPOSAL for Sultan's review, not runtime entitlements.
// New feature gates and automation quotas must be approved before publication.
export function planFeatureRows(key: string, locale: Locale) {
  const ar = locale === "ar";
  const t = (en: string, arabic: string) => ar ? arabic : en;
  const yes = t("Included", "مشمول");
  const no = t("Not included", "غير مشمول");
  const quote = t("Written agreement", "حسب العرض المكتوب");
  const index = ({ essential: 0, growth: 1, expansion: 2 } as Record<string, number>)[key] ?? 3;
  const rows = [
    [t("24/7 AI answering, builder & knowledge base", "رد آلي على مدار الساعة وبناء الوكيل وقاعدة المعرفة"), [yes, yes, yes, yes]],
    [t("Text channels", "القنوات النصية"), [t("Website chat", "دردشة الموقع"), t("Website, WhatsApp & Telegram", "الموقع وواتساب وتيليجرام"), t("Website, WhatsApp & Telegram", "الموقع وواتساب وتيليجرام"), quote]],
    [t("Customer history & human handoff", "سجل العملاء والتحويل لموظف"), [yes, yes, yes, yes]],
    [t("Shared team inbox", "صندوق وارد مشترك للفريق"), [no, yes, yes, yes]],
    [t("Active automated workflows", "مسارات أتمتة نشطة"), [no, "3", "15", quote]],
    [t("Recordings, transcripts & summaries", "التسجيلات والنصوص والملخصات"), [yes, yes, yes, yes]],
    [t("Reporting", "التقارير"), [t("Basic usage reports", "تقارير الاستخدام الأساسية"), t("Performance & sentiment", "الأداء وتحليل المشاعر"), t("Performance & sentiment across branches", "الأداء وتحليل المشاعر عبر الفروع"), quote]],
    [t("Live supervision", "الإشراف المباشر"), [no, t("Listen", "استماع"), t("Listen, whisper & take over", "استماع وتوجيه واستلام المكالمة"), quote]],
    [t("Cloned brand voices", "أصوات العلامة المستنسخة"), [t("Standard voices only", "الأصوات الجاهزة فقط"), "1", "3", quote]],
    [t("External integrations", "تكامل الأنظمة الخارجية"), [no, t("Quoted add-on", "إضافة بعرض سعر"), t("Eligible; setup quoted", "متاح؛ التجهيز بعرض سعر"), quote]],
    [t("API access", "الوصول إلى API"), [no, no, t("Scoped access; limits in offer", "وصول محدد؛ الحدود في العرض"), quote]],
    [t("Account manager & contractual SLA", "مدير حساب واتفاقية مستوى الخدمة"), [no, no, no, quote]],
    [t("Number provisioning & line connection", "تجهيز الأرقام وربط الخط"), [quote, quote, quote, quote]],
  ] as const;
  return rows.map(([label, values], i) => ({ key: `feature-${i}`, label, value: values[index] }));
}

export function planUpgradeSummary(key: string, locale: Locale) {
  const ar = locale === "ar";
  const copy = {
    essential: ar ? ["رد صوتي ودردشة الموقع", "تقارير أساسية وتحويل لموظف"] : ["Voice answering and website chat", "Basic reports and human handoff"],
    growth: ar ? ["كل ميزات أساسي، مع واتساب وتيليجرام وصندوق مشترك", "3 مسارات أتمتة وصوت مستنسخ واحد وإشراف بالاستماع"] : ["Everything in Essential, plus WhatsApp, Telegram and a shared inbox", "3 active workflows, 1 cloned voice and supervisor listening"],
    expansion: ar ? ["كل ميزات نمو، مع 15 مسار أتمتة و3 أصوات مستنسخة", "تقارير الفروع والتوجيه والاستلام ووصول API محدد"] : ["Everything in Growth, plus 15 active workflows and 3 cloned voices", "Branch reporting, whisper/takeover and scoped API access"],
    enterprise: ar ? ["متطلبات توسّع مخصصة بعرض مكتوب", "مدير حساب واتفاقية خدمة وتكاملات حسب الاتفاق"] : ["Custom scale requirements in a written offer", "Account management, SLA and integrations by agreement"],
  };
  return copy[key as keyof typeof copy] ?? copy.enterprise;
}
