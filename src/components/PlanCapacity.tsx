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
    title: "فريقك وسعة التشغيل", users: "مستخدمون من فريقك", agents: "وكلاء ذكاء اصطناعي", lines: "مكالمات متزامنة", lineCapacity: "حسب سعة خطك أو الرقم المطلوب", recordings: "حفظ التسجيلات", records: "النصوص والملخصات وسجل العملاء", active: "طوال مدة الاشتراك", support: "الرد على طلبات الدعم", quote: "حسب العقد", day: "يوماً",
    note: "المستخدم حساب لموظف من فريقك، والوكيل مساعد ذكاء اصطناعي تُعدّه لنشاطك. تعتمد المكالمات المتزامنة على سعة خطك الهاتفي أو السعة المفعّلة للرقم المطلوب، وتُؤكد في العرض المكتوب.",
    draft: "مدة حفظ التسجيلات حسب الباقة: 90 يوماً لأساسي، و180 يوماً لنمو، و365 يوماً لتوسّع، ولمؤسسات حسب العقد. تُؤكد إعدادات الاحتفاظ عند التفعيل. للنصوص والملخصات وسجل العملاء مدد مستقلة.",
  },
  en: {
    title: "Your team and operating capacity", users: "Team users", agents: "AI agents", lines: "Simultaneous calls", lineCapacity: "Based on your line or ordered number capacity", recordings: "Recording retention", records: "Transcripts, summaries & customer records", active: "During the subscription", support: "Support response", quote: "By contract", day: "days",
    note: "A user is a team member's account; an AI agent is an assistant configured for your business. Simultaneous calls depend on your existing phone line or the capacity provisioned with your ordered number, confirmed in the written offer.",
    draft: "Recording retention: Essential 90 days, Growth 180 days, Expansion 365 days; Enterprise by contract. Retention settings are confirmed at activation. Transcripts, summaries and customer records have separate terms.",
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

// Feature gates and workflow limits approved by Sultan, 2026-09-27.
// Growth includes takeover. Cloning uses credits from Growth upward;
// 2 credits per new clone approved. This is not runtime entitlement code.
export function planFeatureRows(key: string, locale: Locale) {
  const ar = locale === "ar";
  const t = (en: string, arabic: string) => ar ? arabic : en;
  const yes = t("Included", "مشمول");
  const no = t("Not included", "غير مشمول");
  const quote = t("By contract", "حسب العقد");
  const index = ({ essential: 0, growth: 1, expansion: 2 } as Record<string, number>)[key] ?? 3;
  const rows = [
    [t("24/7 AI answering, builder & knowledge base", "رد آلي على مدار الساعة وبناء الوكيل وقاعدة المعرفة"), [yes, yes, yes, yes]],
    [t("Text channels", "القنوات النصية"), [t("Website chat", "دردشة الموقع"), t("Website, WhatsApp & Telegram", "الموقع وواتساب وتيليجرام"), t("Website, WhatsApp & Telegram", "الموقع وواتساب وتيليجرام"), quote]],
    [t("Customer history & human handoff", "سجل العملاء والتحويل لموظف"), [yes, yes, yes, yes]],
    [t("Shared team inbox", "صندوق وارد مشترك للفريق"), [no, yes, yes, yes]],
    [t("Active automated workflows", "مسارات أتمتة نشطة"), [no, "3", "15", quote]],
    [t("Recordings, transcripts & summaries", "التسجيلات والنصوص والملخصات"), [yes, yes, yes, yes]],
    [t("Reporting", "التقارير"), [t("Basic usage reports", "تقارير الاستخدام الأساسية"), t("Performance & sentiment", "الأداء وتحليل المشاعر"), t("Performance & sentiment across branches", "الأداء وتحليل المشاعر عبر الفروع"), quote]],
    [t("Live supervision", "الإشراف المباشر"), [no, t("Listen & take over", "استماع واستلام المكالمة"), t("Listen, whisper & take over", "استماع وتوجيه واستلام المكالمة"), quote]],
    [t("Voice cloning", "استنساخ الصوت"), [t("Standard voices only", "الأصوات الجاهزة فقط"), t("2 credits / new voice", "2 رصيد لكل صوت جديد"), t("2 credits / new voice", "2 رصيد لكل صوت جديد"), quote]],
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
    growth: ar ? ["كل ميزات أساسي، مع واتساب وتيليجرام وصندوق مشترك", "3 مسارات أتمتة وإشراف بالاستماع واستلام المكالمة", "استنساخ الصوت 2 رصيد لكل صوت جديد"] : ["Everything in Essential, plus WhatsApp, Telegram and a shared inbox", "3 active workflows, supervisor listening and takeover", "Voice cloning: 2 credits per new voice"],
    expansion: ar ? ["كل ميزات نمو، مع 15 مسار أتمتة", "تقارير الفروع والتوجيه ووصول API محدد", "استنساخ الصوت 2 رصيد لكل صوت جديد"] : ["Everything in Growth, plus 15 active workflows", "Branch reporting, whisper and scoped API access", "Voice cloning: 2 credits per new voice"],
    enterprise: ar ? ["متطلبات توسّع مخصصة بحسب العقد", "مدير حساب واتفاقية خدمة وتكاملات حسب الاتفاق"] : ["Custom scale requirements in a written offer", "Account management, SLA and integrations by agreement"],
  };
  return copy[key as keyof typeof copy] ?? copy.enterprise;
}
