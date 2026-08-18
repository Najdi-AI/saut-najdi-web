import { OmniChannels } from "@/components/OmniChannels";
import Link from "next/link";
import { DemoLink } from "@/components/DemoLink";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { DemoCta } from "@/components/DemoCta";
import { FaqAccordion } from "@/components/FaqAccordion";
import { IconChip, type IconName } from "@/components/icons";
import type { FaqItem } from "@/lib/schema";

// Positional icons — one per `kinds` card and one per `sections` card.
const kindIcons: IconName[] = ["chat", "doc", "globe", "check", "clock"];
const sectionIcons: IconName[] = ["doc", "database", "chat", "check", "shield", "repeat"];

/**
 * /product/knowledge-base (spec P2-22 row 7). Brief-per-feature: each section
 * is a question heading plus one or two sentences, never a deep explanation.
 *
 * Claim boundaries: live-call KB grounding is NOT claimable (blueprint §10.8
 * gate not passed — the production voice orchestrator has no KB wiring; the
 * VOICE_KB_RETRIEVAL flag lives on the api service, which is not the
 * production voice path). Grounding copy therefore stays scoped to the
 * chat/text channels and the test chat, with no roadmap promise either. Do
 * not reintroduce live-call grounding. The OCR processing location is
 * disclosed here, not hidden.
 */

const t = {
  ar: {
    h1: "حط ملفاتك… ووكيلك يجاوب منها",
    intro:
      "وكيل ما يعرف نشاطك يرد ردود عامة تضيّع وقت عميلك. قاعدة المعرفة هي المكان اللي تحط فيه اللي يعرفه موظفك الشاطر: الأسعار، والسياسات، والدوام، وأسئلة العملاء المتكررة — بملفاتك أنت.",
    cta: "احجز عرضاً",
    answer: {
      heading: "كيف يجاوب الوكيل من ملفات نشاطي؟",
      capsule:
        "ترفع ملفاتك — PDF أو Word، حتى لو صوراً ممسوحة — والمنصة تقرأها وتقسّمها وتفهرسها بحيث يصير البحث بالمعنى مو بالكلمة الحرفية. ووقت ما يسأل عميلك في قنوات المحادثة النصية، الوكيل يرد من المقطع اللي يجاوب سؤاله؛ وإذا ما لقى جواباً واضحاً يصعّد أو يسجل طلب اتصال. وقبل هذا كله تجرب أي سؤال بنفسك وتشوف من أي ملف جا الجواب.",
    },
    kindsHeading: "وش تقدر تحط في قاعدة المعرفة؟",
    kindsLead: "خمسة أنواع تخلطها زي ما تبي، وكل وكيل تحدد له وش يقرأ منها.",
    kinds: [
      {
        title: "أسئلة وأجوبة",
        body: "السؤال بصيغة عميلك، والجواب بالصيغة اللي تبي وكيلك يقولها بالحرف. أسرع طريقة تضبط فيها رداً حساساً زي سياسة الإلغاء.",
      },
      {
        title: "ملفات",
        body: "PDF وWord (.docx) وملفات نصية (.txt / .md). قائمة الأسعار ودليل الخدمات — ارفعها زي ما هي بدون إعادة كتابة.",
      },
      {
        title: "روابط",
        body: "صفحة من موقعك تضيفها كمصدر بدل ما تنسخ محتواها، وتحدّثها بإعادة السحب.",
      },
      {
        title: "مقتطفات",
        body: "معلومة قصيرة ما تستاهل ملفاً: «الموقف مجاني للعملاء»، «الدفع كاش أو شبكة».",
      },
      {
        title: "أوقات الدوام",
        body: "أيامك وفتراتك وإجازاتك. الوكيل يبني عليها ردوده، ويسجل طلب اتصال بدل ما يوعد بموعد وأنتم مقفلين.",
      },
    ],
    sections: [
      {
        title: "وملفاتي ممسوحة ضوئياً — يقرأها؟",
        body:
          "يقرأها. أغلب أنظمة التعرّف الضوئي تطلع العربي حروفاً متقطعة أو مقلوبة الترتيب؛ محرّكنا يتعامل معه كنص متصل، فالحروف تطلع موصولة والجداول ما تنهرس. نتكلم عن قراءة الحروف مو عن التشكيل — ملفك ما يحتاج يكون مشكّلاً. والمعالجة تصير في الخلفية وتتابع حالة كل ملف في اللوحة.",
      },
      {
        title: "كيف يلقى الوكيل الجواب الصحيح وسط كل هالمحتوى؟",
        body:
          "الملف ينقسم إلى مقاطع بطريقة تراعي العربية، وكل مقطع ينفهرس بمعناه — فيصير البحث بالمعنى: عميلك يسأل «كم تاخذ جلسة التبييض؟» وملفك مكتوب فيه «مدة جلسة تبييض الأسنان: 45 دقيقة»، والنظام يعرف إنه نفس الموضوع. وكل جواب يرجع معه مصدره، فترجع للملف الأصلي وتصحح من هناك.",
      },
      {
        title: "هل يجاوب من ملفاتي في محادثات عملائي؟",
        body:
          "إي — على قنوات المحادثة النصية. الوكيل يدور في قاعدة معرفتك ويصيغ الرد من محتواك أنت، مو من معلومات عامة. وإذا كان السؤال ما له جواب واضح، ما يطلّع رقماً من راسه: يصعّد لموظفك أو يسجل طلب اتصال.",
      },
      {
        title: "كيف أتأكد إن الجواب صح قبل ما أشغّله على عملائي؟",
        body:
          "في اللوحة أداة اختبار للاسترجاع: تكتب السؤال زي ما بيقوله عميلك، وتشوف أي مقاطع رجعت ومن أي ملف. وفوقها المحادثة التجريبية: تتكلم مع الوكيل نفسه وتقرأ الرد كامل قبل ما تنشر. أي تعديل ترفعه وتعيد الاختبار في نفس الجلسة.",
      },
      {
        title: "يعني تدرّبون الذكاء الاصطناعي على ملفاتي؟",
        body:
          "لا. ملفاتك تتخزن لك أنت وتنفهرس عشان البحث، ووقت السؤال يُسحب منها المقطع المناسب ويُعطى للوكيل يصيغ منه رده — يعني الجواب مبني على نص تقدر ترجع له وتقرأه. ونتيجتها العملية: تعديل أو حذف يظهر أثره على طول بدون أي إعادة تدريب، وبيانات منشأتك معزولة على مستوى قاعدة البيانات.",
      },
      {
        title: "كل كم أحدّثها؟ ومين يقدر يعدّل فيها؟",
        body:
          "حدّثها كل ما تغيّر شي يقوله موظفك للعميل: سعر، أو دوام، أو خدمة جديدة. والصلاحيات تتضبط لكل موظف — واحد يعدّل الأسعار وواحد يشوف بس — والتعديلات الحساسة تمشي مع سجل تدقيق ما يتعدل. ونصيحة: خذ أكثر عشرة أسئلة تتكرر عليك في الهاتف وحطها أسئلة وأجوبة بصياغتك.",
      },
    ],
    disclosure: {
      heading: "وين تُعالَج ملفاتي؟",
      body:
        "التخزين الدائم لبياناتك في منطقة الخليج (الدوحة)، بينما تمر معالجة التعرّف الضوئي على مستندات قاعدة المعرفة عبر نقطة معالجة أوروبية. ما نقول لك إن كل شي داخل السعودية، لأن هذا غير دقيق اليوم — والإفصاح عن النقل عبر الحدود هو الموقف الصحيح أمام نظام حماية البيانات الشخصية.",
      link: { lead: "التفاصيل الكاملة في ", text: "صفحة الأمان والبيانات", path: "security" },
    },
    faqHeading: "أسئلة عن قاعدة المعرفة",
    faq: [
      {
        q: "وش صيغ الملفات اللي تقبلونها؟",
        a: "PDF وWord (.docx) وملفات نصية (.txt / .md)، مع أسئلة وأجوبة وروابط ومقتطفات وأوقات الدوام. والملفات الممسوحة ضوئياً تنقرأ بتعرّف ضوئي عربي يطلع الحروف موصولة صح.",
      },
      {
        q: "هل الوكيل يجاوب من ملفاتي في الشات؟",
        a: "إي، على قنوات المحادثة النصية: يرد من محتواك أنت، وإذا ما لقى جواباً واضحاً يصعّد أو يسجل طلب اتصال. وتقدر تجرب أي سؤال في المحادثة التجريبية قبل ما تنشر.",
      },
      {
        q: "لازم أعيد كتابة ملفاتي بصيغة معينة؟",
        a: "لا، ارفعها زي ما هي. اللي ينفع تكتبه يدوياً هو الردود الحساسة اللي تبي صياغتها بالحرف — وهذي تحطها كأسئلة وأجوبة.",
      },
      {
        q: "أقدر أخلي كل فرع يقرأ من ملفاته فقط؟",
        a: "تقدر. نطاق قاعدة المعرفة يتحدد لكل وكيل على حدة، فالوكلاء ما يتداخلون في ملفات بعض.",
      },
    ] as FaqItem[],
  },
  en: {
    h1: "Upload your documents — your agent answers from them",
    intro:
      "An agent that doesn't know your business gives generic answers. The knowledge base is where you put what a well-trained employee knows: prices, policies, opening hours, and the questions customers keep asking — built from your own documents.",
    cta: "Book a demo",
    answer: {
      heading: "How does the agent answer from my business documents?",
      capsule:
        "You upload your files — PDF or Word, scans included — and the platform reads, splits and indexes them so search works by meaning rather than by literal keyword. When your customer asks on your text chat channels, the agent answers from the passage that fits; with no clear answer it escalates or logs a callback instead of inventing one. Before any of that, you can test any question and see which file the answer came from.",
    },
    kindsHeading: "What can go into the knowledge base?",
    kindsLead: "Five content types, mixed however you like — and you decide what each agent may read.",
    kinds: [
      {
        title: "Q&A pairs",
        body: "The question in your customer's words, the answer in exactly the wording you want. The fastest way to lock down a sensitive reply like a cancellation policy.",
      },
      {
        title: "Files",
        body: "PDF, Word (.docx), plain text (.txt / .md). Price lists, service guides, handbooks — uploaded as they are, with no rewriting.",
      },
      {
        title: "Links",
        body: "A page on your own site added as a source instead of copied across — re-ingest it whenever the page changes.",
      },
      {
        title: "Snippets",
        body: "A short fact that doesn't deserve a document: parking is free for customers, card and cash accepted.",
      },
      {
        title: "Working hours",
        body: "Days, shifts and holidays. The agent builds answers on them and logs a callback instead of promising a slot while you're closed.",
      },
    ],
    sections: [
      {
        title: "My documents are scans — can it read those?",
        body:
          "It can. Most OCR engines return Arabic as disconnected letters or with the word order reversed; ours treats Arabic as connected script, so letters join correctly and tables aren't flattened into noise. This is about reading joined letters, not diacritics — your documents don't need to be vocalised. Processing runs in the background and you watch each file's status in the dashboard.",
      },
      {
        title: "How does the agent find the right answer in all that content?",
        body:
          "Documents are split into passages in a way that respects Arabic, and each passage is indexed by its meaning — so retrieval works by meaning, not wording. A customer asks how long a whitening session takes; your file says “teeth whitening session duration: 45 minutes”; the system knows it's the same subject. Every answer carries its source, so you fix a wrong fact at the document rather than arguing with the agent.",
      },
      {
        title: "Does it answer from my documents in my customers' conversations?",
        body:
          "Yes — on the text chat channels. The agent searches your knowledge base and phrases the reply from your content rather than from general information. With no clear answer it doesn't improvise a number: it escalates to your employee or logs a callback.",
      },
      {
        title: "How do I check the answers before customers hear them?",
        body:
          "A retrieval test panel lets you type the question the way your customer would and see which passages came back and from which file. Above it sits the test chat, where you talk to the agent itself and read the full reply before publishing. Any change can be uploaded and re-tested in the same sitting.",
      },
      {
        title: "So you train an AI model on my documents?",
        body:
          "No. Your files are stored for you and indexed for search; at question time the relevant passage is retrieved and handed to the agent to phrase its reply from — so the answer is grounded in text you can go and read. Two consequences: edits and deletions take effect immediately with no retraining, and your organisation's data is isolated at the database level.",
      },
      {
        title: "How often should I update it, and who's allowed to?",
        body:
          "Update it whenever something changes that an employee would say to a customer — a price, your hours, a new service. Permissions are set per employee, so an operations lead can edit pricing while a receptionist has read-only access, and sensitive changes sit alongside the append-only audit log. One suggestion: turn the ten questions you get most on the phone into Q&A pairs.",
      },
    ],
    disclosure: {
      heading: "Where are my documents processed?",
      body:
        "Permanent storage of your data is in the Gulf region (Doha), while OCR processing of knowledge-base documents runs through a European processing endpoint. We do not claim everything sits inside Saudi Arabia, because that isn't accurate today — and disclosing cross-border transfer is itself the correct posture under the PDPL.",
      link: { lead: "The full detail is on ", text: "the security and data page", path: "security" },
    },
    faqHeading: "Knowledge base questions",
    faq: [
      {
        q: "Which file formats do you accept?",
        a: "PDF, Word (.docx) and plain text (.txt / .md), alongside Q&A pairs, links, snippets and working hours. Scans are read with Arabic OCR that returns correctly joined letters.",
      },
      {
        q: "Does the agent answer from my documents in chat?",
        a: "Yes, on the text chat channels — from your own content, and it escalates or logs a callback when there's no clear answer. You can try any question in the test chat before publishing.",
      },
      {
        q: "Do I have to rewrite my documents in a particular format?",
        a: "No, upload them as they are. The only thing worth writing by hand is a sensitive reply you want worded exactly — and that belongs in a Q&A pair.",
      },
      {
        q: "Can each branch read only its own material?",
        a: "Yes. Knowledge-base scope is set per agent, so agents never cross into each other's files.",
      },
    ] as FaqItem[],
  },
} as const;

export function KnowledgeBasePage({ locale }: { locale: Locale }) {
  const s = t[locale];
  return (
    <>
      <section className="bg-gradient-to-b from-surface to-canvas">
        <div className="container py-14 text-center">
          <h1 className="mx-auto max-w-3xl text-h2 sm:text-h1">{s.h1}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-body-lg leading-relaxed text-ink/70">{s.intro}</p>
          <div className="mt-7">
            <DemoLink locale={locale}>{s.cta}</DemoLink>
          </div>
        </div>
      </section>

      {/* Answer-first paragraph: the whole pipeline in one liftable capsule. */}
      <section className="container py-16">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-h2">{s.answer.heading}</h2>
          <p className="mt-4 text-body-lg leading-relaxed text-ink/75">{s.answer.capsule}</p>
        </Reveal>
      </section>

      <section className="bg-surface py-16">
        <div className="container">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="text-h2">{s.kindsHeading}</h2>
            <p className="mt-3 text-body-lg leading-relaxed text-ink/70">{s.kindsLead}</p>
          </Reveal>
          <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {s.kinds.map((k, i) => (
              <Reveal key={k.title} delay={i * 0.06}>
                <article className="card card-hover group h-full">
                  <IconChip name={kindIcons[i]} delay={i * 0.08} />
                  <h3 className="mt-3 text-h4">{k.title}</h3>
                  <p className="mt-3 text-body-lg leading-relaxed text-ink/75">{k.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16">
        <div className="mx-auto max-w-3xl space-y-6">
          {s.sections.map((sec, i) => (
            <Reveal key={sec.title} delay={i * 0.04}>
              <article className="card group border-s-4 border-s-brand-cyan">
                <div className="flex items-start gap-4">
                  <IconChip name={sectionIcons[i]} className="shrink-0" delay={i * 0.1} />
                  <div>
                    <h2 className="text-h4">{sec.title}</h2>
                    <p className="mt-3 text-body-lg leading-relaxed text-ink/80">{sec.body}</p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* The processing-location disclosure belongs on this page, not only
            on /security — OCR is the one step that leaves the region. */}
        <Reveal className="mx-auto mt-10 max-w-3xl text-center">
          <h2 className="text-h3">{s.disclosure.heading}</h2>
          <p className="mt-3 text-body-lg leading-relaxed text-ink/75">{s.disclosure.body}</p>
          <p className="mt-3 text-body-lg leading-relaxed text-ink/70">
            {s.disclosure.link.lead}
            <Link
              href={localePath(locale, s.disclosure.link.path)}
              className="text-brand-blue underline-offset-4 hover:underline"
            >
              {s.disclosure.link.text}
            </Link>
            {"."}
          </p>
        </Reveal>

        <div className="mx-auto mt-14 max-w-2xl">
          <h2 className="mb-5 text-center text-h3">{s.faqHeading}</h2>
          <FaqAccordion items={s.faq} />
        </div>
      </section>

      <OmniChannels locale={locale} />

      <DemoCta locale={locale} />
    </>
  );
}

export const knowledgeBaseFaq = { ar: t.ar.faq, en: t.en.faq };
