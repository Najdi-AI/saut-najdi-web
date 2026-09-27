import type { Locale } from "@/lib/i18n";

// Capacity/support: signed v3 carried forward from v2, mirrored in the
// application plan catalog and bilingual plan copy. Recording periods are a
// Sultan-requested proposal; do not release them before approval/policy alignment.
const capacity = {
  essential: { users: 2, agents: 3, lines: 3, days: 90, support: { ar: "خلال يومَي عمل", en: "Within 2 business days" } },
  growth: { users: 5, agents: 8, lines: 8, days: 180, support: { ar: "خلال يوم عمل", en: "Within 1 business day" } },
  expansion: { users: 10, agents: 20, lines: 20, days: 365, support: { ar: "خلال 8 ساعات عمل", en: "Within 8 business hours" } },
} as const;

export const capacityCopy = {
  ar: {
    title: "فريقك وسعة التشغيل", users: "مستخدمون من فريقك", agents: "وكلاء ذكاء اصطناعي", lines: "مكالمات متزامنة", recordings: "حفظ التسجيلات — مقترح", records: "النصوص والملخصات وسجل العملاء", active: "طوال مدة الاشتراك", support: "الرد على طلبات الدعم", quote: "حسب العرض المكتوب", day: "يوماً",
    note: "المستخدم حساب لموظف من فريقك، والوكيل مساعد ذكاء اصطناعي تُعدّه لنشاطك. المكالمات المتزامنة هي عدد المكالمات في الوقت نفسه، وليست أرقام هاتف.",
    draft: "للمراجعة: مدد حفظ التسجيلات المقترحة تنتظر الاعتماد؛ السياسة الحالية 90 يوماً. النصوص والملخصات وسجل العملاء لها مدد مستقلة في سياسة الخصوصية.",
  },
  en: {
    title: "Your team and operating capacity", users: "Team users", agents: "AI agents", lines: "Simultaneous calls", recordings: "Recording retention — proposed", records: "Transcripts, summaries & customer records", active: "During the subscription", support: "Support response", quote: "Written agreement", day: "days",
    note: "A user is a team member's account; an AI agent is an assistant configured for your business. Simultaneous calls are calls handled at the same time, not phone numbers.",
    draft: "For review: proposed recording periods await approval; the current policy is 90 days. Transcripts, summaries and customer records have separate retention terms in the privacy policy.",
  },
} as const;

export function planCapacityRows(key: string, locale: Locale) {
  const t = capacityCopy[locale];
  const p = key in capacity ? capacity[key as keyof typeof capacity] : null;
  return [
    { key: "users", label: t.users, value: p ? String(p.users) : t.quote },
    { key: "agents", label: t.agents, value: p ? String(p.agents) : t.quote },
    { key: "lines", label: t.lines, value: p ? String(p.lines) : t.quote },
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
