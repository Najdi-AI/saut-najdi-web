import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { PDPL_LINE_AR, PDPL_LINE_EN } from "@/lib/site";
import { Reveal } from "@/components/Reveal";
import { DemoCta } from "@/components/DemoCta";
import { FaqAccordion } from "@/components/FaqAccordion";
import { IconChip, type IconName } from "@/components/icons";
import type { FaqItem } from "@/lib/schema";

const sectionIcons: IconName[] = ["shield", "database", "mic", "globe", "lock", "badge"];

/**
 * /security (blueprint §6.4) — PDPL-led, precise فصحى (the §3 tone
 * exception). Precision is the pitch: exact facts, no vague claims,
 * never "everything inside Saudi Arabia" (§2.2).
 */

const t = {
  ar: {
    h1: "الأمان والبيانات",
    lead: PDPL_LINE_AR,
    intro:
      "نكتب هذه الصفحة بدقة متعمدة، لأن الدقة في الإفصاح هي جوهر الامتثال. هنا تجد أين تُخزَّن بياناتك، وأين تُعالَج، وكيف يُتحكَّم في الوصول إليها — بالتفصيل الذي يطلبه مسؤول الامتثال قبل التوقيع.",
    sections: [
      {
        title: "التوافق مع نظام حماية البيانات الشخصية (PDPL)",
        body: "صُمِّمت المنصة بما يتوافق مع مبادئ النظام السعودي لحماية البيانات الشخصية: مشروعية الغرض وتحديده، وتقليل البيانات إلى ما تحتاجه الخدمة فعلاً، وحدود واضحة للاحتفاظ، وحقوق أصحاب البيانات في الاطلاع والتصحيح والحذف، والشفافية الكاملة في الإفصاح عن أماكن المعالجة — وهو ما تقرؤه في هذه الصفحة وفي سياسة الخصوصية.",
      },
      {
        title: "أين تُخزَّن بياناتك",
        body: "التخزين الدائم لبيانات المنصة يتم على قواعد بيانات Cloud SQL PostgreSQL في منطقة الخليج (الدوحة — me-central1) على Google Cloud، عبر شبكة خاصة (Private IP) فقط، مع نسخ احتياطية واستعادة لنقطة زمنية محددة.",
      },
      {
        title: "تسجيلات المكالمات",
        body: "تُخزَّن تسجيلات المكالمات في المنطقة نفسها، وتُحذَف تلقائياً بعد 90 يوماً — وهذا سلوك مقصود يجسّد مبدأ حدود الاحتفاظ في النظام. الوصول إلى أي تسجيل يتم حصراً عبر روابط موقعة مؤقتة قصيرة الصلاحية.",
      },
      {
        title: "الإفصاح عن أماكن المعالجة",
        body: "نقولها بوضوح: التخزين الدائم في منطقة الخليج، بينما تمر المعالجة اللحظية للصوت والذكاء الاصطناعي — تحويل الكلام إلى نص، وفهم اللغة، وتوليد الصوت — عبر مزوّدين عالميين، وتمر معالجة مستندات قاعدة المعرفة (التعرّف الضوئي) عبر نقطة معالجة أوروبية. هذا الإفصاح بحد ذاته هو الموقف الامتثالي الذي يتطلبه النظام في نقل البيانات عبر الحدود — ولا نقول أبداً إن كل شيء داخل السعودية.",
      },
      {
        title: "سجل تدقيق غير قابل للتعديل",
        body: "كل إجراء حساس في المنصة يُسجَّل في سجل تدقيق ملحق فقط (append-only) تفرضه قاعدة البيانات نفسها: لا يمكن تعديل أي سطر أو حذفه — حتى من مسؤول النظام. ولعملاء المنشآت، يمكن تصدير السجل للمراجعة.",
      },
      {
        title: "التحكم في الوصول",
        body: "أدوار وصلاحيات محددة لكل موظف في منشأتك، وعزل تام لبيانات كل عميل يُفرَض على مستوى قاعدة البيانات ذاتها، وقواعد صارمة لوصول فريق المنصة: أي اطلاع من فريق الدعم على مكالمة يُسجَّل تلقائياً في سجل التدقيق، وأي دخول مؤقت لحسابك يكون مسجلاً وظاهراً وقابلاً للإنهاء.",
      },
    ],
    faqHeading: "أسئلة الأمان",
    faq: [
      {
        q: "أين تُخزَّن بيانات مكالماتي تحديداً؟",
        a: "التخزين الدائم في منطقة الخليج (الدوحة — me-central1) على Google Cloud عبر شبكة خاصة، والتسجيلات تُحذف تلقائياً بعد 90 يوماً.",
      },
      {
        q: "هل تُعالَج البيانات داخل السعودية؟",
        a: "التخزين الدائم في منطقة الخليج، بينما تمر المعالجة اللحظية للصوت والذكاء الاصطناعي عبر مزوّدين عالميين — ونفصح عن ذلك بالكامل لأن الإفصاح عن النقل عبر الحدود هو ما يتطلبه نظام حماية البيانات الشخصية.",
      },
      {
        q: "من يستطيع الاطلاع على مكالمات منشأتي؟",
        a: "موظفوك حسب الأدوار والصلاحيات التي تحددها، وفريق دعم المنصة عند الحاجة فقط — وكل اطلاع من فريق الدعم يُسجَّل تلقائياً في سجل تدقيق غير قابل للتعديل.",
      },
      {
        q: "هل توجد اتفاقية معالجة بيانات؟",
        a: "نعم — تجد ملخص اتفاقية معالجة البيانات في صفحة مستقلة، وتُوقَّع النسخة الكاملة ضمن التعاقد.",
      },
    ] as FaqItem[],
    legalLinks: "اقرأ أيضاً: ",
  },
  en: {
    h1: "Security & data",
    lead: PDPL_LINE_EN,
    intro:
      "This page is deliberately precise, because precision of disclosure is the substance of compliance. Here you'll find where your data is stored, where it is processed, and how access is controlled — at the level of detail a compliance officer wants before signing.",
    sections: [
      {
        title: "Alignment with the Saudi PDPL",
        body: "The platform is designed to comply with the principles of Saudi Arabia's Personal Data Protection Law: lawful, defined purposes; minimising data to what the service actually needs; clear retention limits; data-subject rights to access, correction and deletion; and full transparency about where processing happens — which is exactly what you read on this page and in the privacy policy.",
      },
      {
        title: "Where your data lives",
        body: "Permanent platform storage runs on Cloud SQL PostgreSQL in the Gulf region (Doha — me-central1) on Google Cloud, reachable over private IP only, with backups and point-in-time restore.",
      },
      {
        title: "Call recordings",
        body: "Call recordings are stored in the same region and automatically deleted after 90 days — a deliberate behaviour that embodies the law's retention-limit principle. Access to any recording happens exclusively through short-lived signed links.",
      },
      {
        title: "The processing disclosure",
        body: "We say it plainly: permanent storage is in the Gulf region, while realtime speech and AI processing — speech-to-text, language understanding, voice generation — transits global providers, and knowledge-base document processing (OCR) runs on a European endpoint. This disclosure is itself the compliance posture the law requires for cross-border transfers — and we never claim everything sits inside Saudi Arabia.",
      },
      {
        title: "An append-only audit log",
        body: "Every sensitive action on the platform is written to an append-only audit log enforced by the database itself: no row can be edited or deleted — not even by an administrator. Enterprise customers can export the log for review.",
      },
      {
        title: "Access control",
        body: "Defined roles and permissions for every employee in your organisation; hard tenant isolation enforced at the database level; and strict rules for platform-staff access: any support view of a call is automatically audit-logged, and any temporary access to your account is recorded, visible, and revocable.",
      },
    ],
    faqHeading: "Security questions",
    faq: [
      {
        q: "Where exactly is my call data stored?",
        a: "Permanent storage is in the Gulf region (Doha — me-central1) on Google Cloud over private networking, and recordings are automatically deleted after 90 days.",
      },
      {
        q: "Is data processed inside Saudi Arabia?",
        a: "Permanent storage is in the Gulf region, while realtime speech and AI processing transits global providers — and we disclose that fully, because disclosing cross-border transfer is what the PDPL requires.",
      },
      {
        q: "Who can see my organisation's calls?",
        a: "Your employees according to the roles and permissions you define, and platform support staff only when needed — and every support view is automatically written to an append-only audit log.",
      },
      {
        q: "Is there a data processing agreement?",
        a: "Yes — a summary DPA is published on its own page, and the full version is signed as part of contracting.",
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
