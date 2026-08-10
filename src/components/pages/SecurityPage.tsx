import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { PDPL_LINE_AR, PDPL_LINE_EN } from "@/lib/site";
import { Reveal } from "@/components/Reveal";
import { DemoCta } from "@/components/DemoCta";
import { FaqAccordion } from "@/components/FaqAccordion";
import { IconChip, type IconName } from "@/components/icons";
import type { FaqItem } from "@/lib/schema";

// One icon per section, positional — keep this array the same length as
// `sections` or a new card renders with an undefined icon name.
const sectionIcons: IconName[] = ["shield", "database", "mic", "globe", "lock", "badge"];

/**
 * /security (blueprint §6.4) — PDPL-led, precise فصحى (the §3 tone
 * exception). Precision is the pitch: exact facts, no vague claims,
 * never "everything inside Saudi Arabia" (§2.2). Every section heading is a
 * question with its answer directly underneath, kept short — the disclosure
 * stays complete, the prose around it does not.
 */

const t = {
  ar: {
    h1: "الأمان والبيانات",
    lead: PDPL_LINE_AR,
    intro: "بدقة متعمدة: أين تُخزَّن بياناتك، وأين تُعالَج، ومن يصل إليها.",
    sections: [
      {
        title: "هل المنصة متوافقة مع نظام حماية البيانات الشخصية (PDPL)؟",
        body: "صُمِّمت وفق مبادئه: غرض محدد، وتقليل للبيانات، وحدود للاحتفاظ، وحقوق الاطلاع والتصحيح والحذف، وإفصاح كامل عن أماكن المعالجة.",
        // P1-15(d): the page's only upward links — from the fact each one
        // answers, in prose, not as a "related links" block.
        link: {
          lead: "والتفاصيل التي يسأل عنها أصحاب الأنشطة في ",
          text: "الأسئلة الشائعة عن البيانات والامتثال",
          path: "faq",
        },
      },
      {
        title: "أين تُخزَّن بياناتك؟",
        body: "التخزين الدائم على قاعدة بيانات PostgreSQL مُدارة في منطقة الخليج (الدوحة)، عبر شبكة خاصة فقط، مع نسخ احتياطية واستعادة لنقطة زمنية محددة.",
        link: null,
      },
      {
        title: "هل تسجيل المكالمات متوافق مع نظام حماية البيانات الشخصية؟",
        body: "التسجيلات في المنطقة نفسها، وتُحذَف تلقائياً بعد 90 يوماً تطبيقاً لحدود الاحتفاظ، ولا تُفتح إلا عبر روابط موقَّعة قصيرة الصلاحية، ويُدوَّن كل اطلاع في سجل التدقيق. ويبقى إشعار المتصل والأساس النظامي مسؤولية المنشأة المشغِّلة، ويمكن ضبط جملة الافتتاح لتتضمن إشعاراً بالتسجيل.",
        link: null,
      },
      {
        title: "هل تُخزَّن بيانات العملاء وتُعالَج داخل السعودية؟",
        body: "لا نقول إن كل شيء داخل السعودية، لأن ذلك غير دقيق اليوم. التخزين الدائم في منطقة الخليج (الدوحة)، بينما تمر المعالجة اللحظية للصوت والذكاء الاصطناعي عبر مزوّدين عالميين، وتمر معالجة مستندات قاعدة المعرفة (التعرّف الضوئي) عبر نقطة معالجة أوروبية. والإفصاح عن النقل عبر الحدود هو ما يتطلبه النظام.",
        link: null,
      },
      {
        title: "هل يمكن تعديل سجل التدقيق أو حذفه؟",
        body: "لا. كل إجراء حساس يُكتَب في سجل ملحق فقط (append-only) تفرضه قاعدة البيانات: لا يُعدَّل سطر ولا يُحذَف، ولا حتى من مسؤول النظام. ولعملاء المنشآت تصدير السجل للمراجعة.",
        link: {
          lead: "وكل تصعيد إلى موظف بشري يُدوَّن فيه — ",
          text: "اقرأ كيف يستلم الموظف المكالمة بكامل سياقها",
          path: "product/human-handoff",
        },
      },
      {
        title: "من يستطيع الوصول إلى بياناتك؟",
        body: "موظفوك بأدوار وصلاحيات تحددها أنت، وعزل تام لبيانات كل عميل على مستوى قاعدة البيانات. واطلاع فريق الدعم يُسجَّل تلقائياً، وأي دخول مؤقت إلى حسابك مسجَّل وظاهر وقابل للإنهاء.",
        link: null,
      },
    ],
    faqHeading: "أسئلة الأمان",
    faq: [
      {
        q: "أين تُخزَّن بيانات مكالماتي تحديداً؟",
        a: "التخزين الدائم في منطقة الخليج (الدوحة) عبر شبكة خاصة، والتسجيلات تُحذَف تلقائياً بعد 90 يوماً.",
      },
      {
        q: "هل تُعالَج البيانات داخل السعودية؟",
        a: "التخزين الدائم في منطقة الخليج، والمعالجة اللحظية للصوت والذكاء الاصطناعي عبر مزوّدين عالميين — ونفصح عن ذلك لأن النظام يتطلب الإفصاح عن النقل عبر الحدود.",
      },
      {
        q: "من يستطيع الاطلاع على مكالمات منشأتي؟",
        a: "موظفوك حسب الصلاحيات التي تحددها، وفريق الدعم عند الحاجة فقط — وكل اطلاع يُسجَّل في سجل تدقيق غير قابل للتعديل.",
      },
      {
        q: "هل توجد اتفاقية معالجة بيانات؟",
        a: "نعم. الملخص منشور في صفحة مستقلة، وتُوقَّع النسخة الكاملة ضمن التعاقد.",
      },
    ] as FaqItem[],
    legalLinks: "اقرأ أيضاً: ",
  },
  en: {
    h1: "Security & data",
    lead: PDPL_LINE_EN,
    intro: "Deliberately precise: where your data is stored, where it is processed, and who can reach it.",
    sections: [
      {
        title: "Is the platform aligned with the Saudi PDPL?",
        body: "It is built on the law's principles: defined lawful purposes, data minimisation, clear retention limits, rights of access, correction and deletion, and full disclosure of where processing happens.",
        link: {
          lead: "The detail buyers ask for is in ",
          text: "the data and compliance FAQ",
          path: "faq",
        },
      },
      {
        title: "Where is your data stored?",
        body: "Permanent storage runs on managed PostgreSQL in the Gulf region (Doha), reachable over private IP only, with backups and point-in-time restore.",
        link: null,
      },
      {
        title: "Is recording customer calls PDPL compliant?",
        body: "Recordings sit in the same region, are deleted automatically after 90 days under the retention-limit principle, open only through short-lived signed links, and every access is written to the audit log. Notifying the caller and establishing a lawful basis remain the operating organisation's responsibility — and the agent's opening line can carry a recording notice.",
        link: null,
      },
      {
        title: "Is customer data stored and processed inside Saudi Arabia?",
        body: "We do not claim everything sits inside Saudi Arabia, because that is not accurate today. Permanent storage is in the Gulf region (Doha), while realtime speech and AI processing transits global providers, and knowledge-base document processing (OCR) runs on a European endpoint. Disclosing cross-border transfer is what the law requires.",
        link: null,
      },
      {
        title: "Can the audit log be edited or deleted?",
        body: "No. Every sensitive action is written to an append-only log enforced by the database itself: no row can be edited or deleted, not even by an administrator. Enterprise customers can export it for review.",
        link: {
          lead: "Every escalation to a human employee lands in it too — ",
          text: "read how your employee inherits the call with its full context",
          path: "product/human-handoff",
        },
      },
      {
        title: "Who can reach your data?",
        body: "Your employees, under roles and permissions you define, with hard tenant isolation enforced at the database level. Support access is automatically audit-logged, and any temporary access to your account is recorded, visible and revocable.",
        link: null,
      },
    ],
    faqHeading: "Security questions",
    faq: [
      {
        q: "Where exactly is my call data stored?",
        a: "Permanent storage is in the Gulf region (Doha) over private networking, and recordings are deleted automatically after 90 days.",
      },
      {
        q: "Is data processed inside Saudi Arabia?",
        a: "Permanent storage is in the Gulf region, while realtime speech and AI processing transits global providers. We disclose that fully, because disclosing cross-border transfer is what the PDPL requires.",
      },
      {
        q: "Who can see my organisation's calls?",
        a: "Your employees under the permissions you define, and platform support only when needed — every support view is written to an append-only audit log.",
      },
      {
        q: "Is there a data processing agreement?",
        a: "Yes. A summary DPA is published on its own page, and the full version is signed as part of contracting.",
      },
    ] as FaqItem[],
    legalLinks: "Also read: ",
  },
} as const;

export function SecurityPage({ locale }: { locale: Locale }) {
  const s = t[locale];
  return (
    <>
      <section className="bg-navy py-14 text-white">
        <div className="container text-center">
          <h1 className="text-h1">{s.h1}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-body-lg leading-relaxed text-brand-cyan">{s.lead}</p>
          <p className="mx-auto mt-4 max-w-2xl text-body-lg leading-relaxed text-white/75">{s.intro}</p>
        </div>
      </section>

      <section className="container py-16">
        <div className="mx-auto max-w-3xl space-y-6">
          {s.sections.map((sec, i) => (
            <Reveal key={sec.title} delay={i * 0.04}>
              <article className="card group">
                <div className="flex items-start gap-4">
                  <IconChip name={sectionIcons[i]} className="shrink-0" />
                  <div>
                    <h2 className="text-h4">{sec.title}</h2>
                    <p className="mt-3 text-body-lg leading-relaxed text-ink/80">{sec.body}</p>
                    {sec.link && (
                      <p className="mt-3 text-body-lg leading-relaxed text-ink/70">
                        {sec.link.lead}
                        <Link
                          href={localePath(locale, sec.link.path)}
                          className="text-brand-blue underline-offset-4 hover:underline"
                        >
                          {sec.link.text}
                        </Link>
                        {"."}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <h2 className="mb-5 text-center text-h3">{s.faqHeading}</h2>
          <FaqAccordion items={s.faq} />
          <p className="mt-6 text-center text-body-lg text-ink/65">
            {s.legalLinks}
            <Link href={localePath(locale, "privacy")} className="text-brand-blue hover:underline">
              {locale === "ar" ? "سياسة الخصوصية" : "Privacy policy"}
            </Link>
            {" · "}
            <Link href={localePath(locale, "terms")} className="text-brand-blue hover:underline">
              {locale === "ar" ? "شروط الخدمة" : "Terms of service"}
            </Link>
            {" · "}
            <Link href={localePath(locale, "dpa")} className="text-brand-blue hover:underline">
              {locale === "ar" ? "اتفاقية معالجة البيانات" : "DPA"}
            </Link>
          </p>
        </div>
      </section>

      <DemoCta locale={locale} />
    </>
  );
}

export const securityFaq = { ar: t.ar.faq, en: t.en.faq };
