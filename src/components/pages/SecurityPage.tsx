import type { ReactNode } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { PDPL_LINE_AR, PDPL_LINE_EN } from "@/lib/site";
import { Reveal } from "@/components/Reveal";
import { DemoCta } from "@/components/DemoCta";
import { FaqAccordion } from "@/components/FaqAccordion";
import { PageHero } from "@/components/page/PageHero";
import { Section } from "@/components/page/Section";
import { securityFaq } from "@/content/pageFaq";

/**
 * /security (blueprint §6.4) — PDPL-led, precise فصحى (the §3 tone
 * exception). Precision is the pitch: exact facts, no vague claims,
 * never "everything inside Saudi Arabia" (§2.2). Every section heading is a
 * question with its answer directly underneath, kept short — the disclosure
 * stays complete, the prose around it does not.
 *
 * On the inner-page kit (About is the pilot): a Charcoal PageHero (the page
 * kept its dark hero), each question with its answer as a ruled row, the FAQ
 * in the split layout. Its FAQ lives in content/pageFaq.ts.
 */

/** About's ruled row (PR 11's local Row): the question on the start side, its answer beside it. */
function Row({ title, delay = 0, children }: { title: string; delay?: number; children: ReactNode }) {
  return (
    <Reveal delay={delay} className="grid gap-4 border-b border-line py-10 sm:py-12 lg:grid-cols-12 lg:gap-6">
      <h2 className="font-display text-[clamp(24px,2.4vw,34px)] leading-[1.35] font-medium text-balance lg:col-span-5">
        {title}
      </h2>
      <div className="max-w-[60ch] space-y-4 text-[1.0625rem] leading-[1.7] sm:text-[1.125rem] lg:col-span-7">
        {children}
      </div>
    </Reveal>
  );
}

/** The underlined link of the inner pages (About, PR 11). */
const link = "font-bold underline decoration-2 underline-offset-[0.35em] hover:decoration-najdi-red";

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
        body: "التسجيلات في المنطقة نفسها. مدة حفظ التسجيلات حسب شروط الباقة المؤكدة عند التفعيل: 90 يوماً لأساسي، و180 لنمو، و365 لتوسّع، وبحسب العقد للمؤسسات، ولا تُفتح إلا عبر روابط موقَّعة قصيرة الصلاحية، ويُدوَّن كل اطلاع في سجل التدقيق. ويبقى إشعار المتصل والأساس النظامي مسؤولية المنشأة المشغِّلة، ويمكن ضبط جملة الافتتاح لتتضمن إشعاراً بالتسجيل.",
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
        body: "Recordings sit in the same region; recording retention follows the plan terms confirmed at activation: 90 days for Essential, 180 for Growth, 365 for Expansion, and by contract for Enterprise. They open only through short-lived signed links, and every access is written to the audit log. Notifying the caller and establishing a lawful basis remain the operating organisation's responsibility — and the agent's opening line can carry a recording notice.",
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
    legalLinks: "Also read: ",
  },
} as const;

export function SecurityPage({ locale }: { locale: Locale }) {
  const s = t[locale];
  return (
    <>
      <PageHero tone="dark" title={s.h1} lead={s.lead}>
        <p className="max-w-[52ch] text-[1.0625rem] leading-[1.7] text-muted-foreground sm:text-[1.125rem]">{s.intro}</p>
      </PageHero>

      <Section>
        <div className="border-t border-line">
          {s.sections.map((sec, i) => (
            <Row key={sec.title} title={sec.title} delay={i * 0.04}>
              <p>{sec.body}</p>
              {sec.link && (
                <p>
                  {sec.link.lead}
                  <Link href={localePath(locale, sec.link.path)} className={link}>
                    {sec.link.text}
                  </Link>
                  {"."}
                </p>
              )}
            </Row>
          ))}
        </div>
      </Section>

      <Section title={s.faqHeading} layout="split" className="pb-[clamp(96px,11.2vw,168px)]">
        <FaqAccordion items={securityFaq[locale]} />
        {/* A row of links rather than a sentence, so each link is a full 48px target. */}
        <p className="mt-8 text-body-lg text-muted-foreground">
          {s.legalLinks}
          <Link href={localePath(locale, "privacy")} className={`inline-flex min-h-12 min-w-12 items-center justify-center text-foreground ${link}`}>
            {locale === "ar" ? "سياسة الخصوصية" : "Privacy policy"}
          </Link>
          {" · "}
          <Link href={localePath(locale, "terms")} className={`inline-flex min-h-12 min-w-12 items-center justify-center text-foreground ${link}`}>
            {locale === "ar" ? "شروط الخدمة" : "Terms of service"}
          </Link>
          {" · "}
          <Link href={localePath(locale, "dpa")} className={`inline-flex min-h-12 min-w-12 items-center justify-center text-foreground ${link}`}>
            {locale === "ar" ? "اتفاقية معالجة البيانات" : "DPA"}
          </Link>
        </p>
      </Section>

      <DemoCta locale={locale} />
    </>
  );
}
