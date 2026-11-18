import { OmniChannels } from "@/components/OmniChannels";
import Link from "next/link";
import { DemoLink } from "@/components/DemoLink";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { DemoCta } from "@/components/DemoCta";
import { TrustStrip } from "@/components/TrustStrip";
import { FaqAccordion } from "@/components/FaqAccordion";
import { PageHero } from "@/components/page/PageHero";
import { Section } from "@/components/page/Section";
import { Row, Rows } from "@/components/page/Rows";
import { voiceAgentFaq } from "@/content/pageFaq";

/**
 * /product/voice-agent (spec P2-22 row 3) — the capability page behind the
 * home page's first card. Brief-per-feature, not a deep explanation: each
 * section is a question heading plus one or two sentences.
 *
 * Verified claim boundaries on this page:
 * - Voice catalogue is Najdi / Hijazi / Levantine / English, male and female.
 *   There is NO Khaleeji voice — do not reintroduce it.
 * - Voice cloning ships: one sample of 60s+, a recorded consent attestation
 *   naming the speaker. Withdrawal disables use immediately; sample deletion
 *   has a separate retention schedule. It clones a VOICE, never a new conversational dialect — the
 *   agent's words stay Najdi Arabic. Plan-dependent, never quantified.
 * - Outbound calling ships as human-initiated only: a person starts each call
 *   from the dashboard. No auto-dialling of a list; no quiet-hours, opt-out or
 *   consent-gated dialling claims.
 * - We publish no performance numbers about ourselves; the customer's own
 *   numbers live in the dashboard (see /product/dashboard).
 *
 * On the inner-page kit (About is the pilot): PageHero, then every question
 * with its answer as a ruled row; the limits as flat tiles. Its FAQ lives in content/pageFaq.ts.
 */

const t = {
  ar: {
    h1: "كيف يفهم الوكيل الصوتي اللهجة السعودية؟",
    intro:
      "عميلك ما يقول «أرغب في حجز موعد» — يقول «أبي أحجز بكره». هالصفحة توريك وش يصير داخل المكالمة: وش شغّال اليوم، ووش ما نوعدك فيه.",
    cta: "احجز عرضاً",
    answer: {
      heading: "كيف يشتغل الوكيل الصوتي داخل المكالمة؟",
      capsule:
        "صوت عميلك يتحول نصاً وهو يتكلم، والوكيل يفهم قصده ويرد بصوت طبيعي بنفس اللهجة — والعميل على الخط. قاطعه؟ يسكت ويسمع. عطاه رقم حجز؟ يقرأه رقم رقم. الموضوع يبي إنساناً؟ يحوّله لموظفك بكامل السياق. ما يعرف الجواب؟ يصعّد، ما يخترع. وبعد ما تسكر المكالمة تلقاها مكتوبة وملخّصة في لوحتك.",
    },
    sections: [
      {
        title: "وش اللي ضبطناه في المسار عشان يفهم الكلام السعودي؟",
        body:
          "المسار كله معاير على الكلام السعودي: «أبي» و«أبغى» و«بغيت» توصل لنفس القصد، و«بعد المغرب» تنفهم وقتاً، والأرقام المنطوقة كلاماً تتحول أرقاماً قبل أي حجز. وقاموس مفردات الحجز عندنا مبني من أخطاء تفريغ حقيقية رصدناها في مكالمات، وكل طبقة لها بديل يشتغل تلقائياً عشان المكالمة ما تقف في نص الكلام.",
      },
      {
        title: "إذا قاطعته وهو يتكلم — يسكت؟",
        body:
          "إي، في نفس اللحظة. وإذا بدأت الكلام وسكتّ فجأة، ما يعيد جملته من أولها — يقول «نعم؟» وينتظرك. ونبرته تتغير حسب اللحظة: ترحيب في البداية، وتأكيد هادئ وقت الحجز.",
      },
      {
        title: "ليش يقرأ رقم الحجز رقم رقم؟",
        body:
          "لأن عميلك يكتبه وهو واقف عند الباب أو ماسك مفتاح سيارته. الأكواد تنقرأ رقم رقم بوقفة بينها، وبعدها يتأكد إن العميل كتبها. والحجز نفسه بأدوات حقيقية: يشيك على الأوقات الفاضية، ويثبت الحجز، ويسجل طلب اتصال إذا كان الوقت برا الدوام.",
      },
      {
        title: "وش اللهجات والأصوات الجاهزة اليوم؟",
        body:
          "أصوات رجالية ونسائية: نجدي، وحجازي، وشامي، وإنجليزي. تختار الصوت لكل وكيل من اللوحة، وتسمع عينة قبل ما تعتمد، وتغيّره بعدين بدون ما تبني الوكيل من جديد. وإذا كلّمك عميل بالإنجليزي، الوكيل يرد عليه بالإنجليزي.",
      },
      {
        title: "أقدر أخلي الوكيل يتكلم بصوت علامتي التجارية؟",
        body:
          "تقدر. ترفع عينة من الشخص اللي تبي صوته — 60 ثانية على الأقل — مع إقرار موافقة مسجّل باسمه، وبعدها تعيّن الصوت لوكيلك زي أي صوت ثاني. والموافقة تنسحب بأي وقت، وعندها نوقف استخدام الصوت فوراً. العينة تخضع لمدة احتفاظ مستقلة؛ اسأل فريقنا عن تفاصيل الحذف قبل رفعها. وانتبه لحد واضح: الاستنساخ ينسخ الصوت، مو لهجة محادثة جديدة — كلام الوكيل يبقى بالعربية النجدية مهما كان الصوت. والميزة حسب باقتك.",
      },
      {
        title: "من وين ياخذ الوكيل معلومات نشاطي؟",
        body:
          "من قاعدة معرفتك أنت، مو من الإنترنت: ملفاتك، وأسئلتك وأجوبتك، وأوقات دوامك. وهي اللي يرد منها وكيلك على قنوات المحادثة النصية، وتقدر تجربها في المحادثة التجريبية قبل ما تنشر. وإذا ما لقى جواباً واضحاً، يصعّد أو يسجل طلب اتصال بدل ما يخترع.",
      },
      {
        title: "وش يصير بعد ما تسكر المكالمة؟",
        body:
          "خلال ثواني تلقاها في لوحتك: التسجيل، والنص كامل، وملخص عربي، ومؤشر مزاج المكالمة. تقيّمها وتحط عليها وسماً، وكل هذا ينضاف لملف العميل نفسه. التسجيلات تُفتح بروابط موقّعة قصيرة الصلاحية. مدة حفظ التسجيلات حسب شروط الباقة المؤكدة عند التفعيل: 90 يوماً لأساسي، و180 لنمو، و365 لتوسّع، وبحسب العقد للمؤسسات.",
      },
    ],
    limits: {
      heading: "وش ما يسويه الوكيل — نقولها بصراحة",
      lead: "اللي يوعدك بكل شي بيخذلك في أول أسبوع. هذي حدودنا، نفضل تعرفها من الموقع مو من التجربة.",
      items: [
        {
          title: "ما يدق على قائمة أرقام لحاله",
          body: "الاتصال الصادر شغّال: فريقك يختار عميلاً أو يكتب رقماً من اللوحة، والوكيل يمسك المكالمة. اللي ما هو موجود هو الاتصال الآلي على قائمة أرقام — كل مكالمة صادرة يبدأها إنسان.",
        },
        {
          title: "ما يجتهد بجواب ما يعرفه",
          body: "السؤال الخارج عن معرفته أو الحساس — طبي أو قانوني أو شكوى — يصعّده لموظفك. الاختراع أخطر من «ما أعرف».",
        },
        {
          title: "ما ننشر أرقاماً عن أنفسنا",
          body: "ما بتلقى عندنا «دقة 98%» ولا «يوفر 70% من التكاليف». اللي تلقاه أرقامك أنت في لوحتك، محسوبة من مكالماتك.",
        },
        {
          title: "ما نوعدك بصوت ما أطلقناه",
          body: "الجاهز اليوم نجدي وحجازي وشامي وإنجليزي. أي شي غيره نتكلم عنه كعمل نقدر نسويه، مو كخانة موجودة في اللوحة.",
        },
      ],
    },
    link: {
      lead: "ولما تحتاج المكالمة إنساناً، موظفك يستلمها بكامل سياقها — ",
      text: "اقرأ كيف يشتغل التصعيد",
      path: "product/human-handoff",
    },
    faqHeading: "أسئلة عن الوكيل الصوتي",
  },
  en: {
    h1: "How does the voice agent understand Saudi dialect?",
    intro:
      "Plenty of platforms say they support Arabic. Far fewer survive a real Saudi phone call. This page is what actually happens inside one — what ships today, and what we won't promise.",
    cta: "Book a demo",
    answer: {
      heading: "How does the voice agent work during a call?",
      capsule:
        "Speech becomes text as the caller talks, the agent works out what they want, and the reply comes back as a natural voice in the same dialect — live, on the line. Interrupted? It stops and listens. Booking code? Read digit by digit. Needs a person? Handed over with the full context. No clear answer? It escalates instead of inventing one. When the call ends, the transcript and summary are already in your dashboard.",
    },
    sections: [
      {
        title: "What did we tune in the pipeline so it understands Saudi speech?",
        body:
          "The whole pipeline is calibrated for how Saudis actually speak: the many colloquial ways of saying “I want to book” resolve to one intent, prayer-anchored times like “after Maghrib” are read as times, and numbers spoken as words become digits before they reach a booking. The booking vocabulary comes from real mistranscription forensics we collected ourselves, and every layer has an automatic fallback so a call never dies mid-sentence.",
      },
      {
        title: "If the caller interrupts, does the agent stop?",
        body:
          "Yes — instantly. And if the caller starts and trails off, it doesn't replay its sentence: it says a short “yes?” and waits. Delivery shifts with the moment too — a warm greeting, a calm confirmation when committing a booking.",
      },
      {
        title: "Why does it read booking codes digit by digit?",
        body:
          "Because the caller is usually writing it down one-handed. Codes are spoken digit by digit with a beat between them, and the agent confirms the caller has it. The booking itself runs on real tools: check open slots, commit the reservation, log a callback when the call lands outside working hours.",
      },
      {
        title: "Which voices and dialects are available today?",
        body:
          "Male and female voices in Najdi, Hijazi, Levantine and English. You pick the voice per agent, hear a sample before committing, and can change it later without rebuilding the agent. If a caller speaks English, the agent answers in English.",
      },
      {
        title: "Can the agent speak in my brand's own voice?",
        body:
          "Yes. You upload a sample of the person whose voice you want — 60 seconds or longer — with a recorded consent attestation naming that speaker, then assign the voice to your agent like any other. You can withdraw consent at any time, which stops further use of that voice immediately. The sample has a separate retention period; ask our team for deletion details before uploading it. Cloning reproduces a voice, not a new conversational dialect — the agent's words stay Najdi Arabic whichever voice it uses. Availability depends on your plan.",
      },
      {
        title: "Where does the agent get information about my business?",
        body:
          "From your knowledge base, not the internet: your files, your Q&A pairs, your working hours. That is what your agent answers from on your text chat channels, and you can test it yourself before publishing. With no clear answer it escalates or logs a callback rather than inventing one.",
      },
      {
        title: "What happens after the call ends?",
        body:
          "Within seconds it's in your dashboard: the recording, the full transcript, an Arabic summary and a read on the caller's mood. You can rate and tag it, and all of it attaches to the customer's own record. Recordings open only through short-lived signed links. Recording retention follows the plan terms confirmed at activation: 90 days for Essential, 180 for Growth, 365 for Expansion, and by contract for Enterprise.",
      },
    ],
    limits: {
      heading: "What the agent does not do — plainly",
      lead: "A vendor who promises everything disappoints you in week one. Here are the limits, better learned from the website than from the trial.",
      items: [
        {
          title: "It doesn't dial through a list of numbers on its own",
          body: "Outbound calling ships: your team picks a customer or types a number in the dashboard and the agent holds the conversation. What doesn't exist is auto-dialling a list of numbers — every outbound call is started by a person.",
        },
        {
          title: "It doesn't improvise answers it doesn't have",
          body: "A question outside its knowledge or a sensitive one — medical, legal, a complaint — goes to your employee. Invention is far more dangerous than “I'll get you someone.”",
        },
        {
          title: "We publish no numbers about ourselves",
          body: "No “98% accuracy,” no “cuts costs by 70%.” The numbers you get are your own, computed from your calls in your dashboard.",
        },
        {
          title: "We don't promise a voice we haven't shipped",
          body: "Najdi, Hijazi, Levantine and English is what exists today. Anything else is a conversation about work we could do, not a setting waiting in the dashboard.",
        },
      ],
    },
    link: {
      lead: "And when a call needs a person, your employee inherits it with the full context — ",
      text: "read how handoff works",
      path: "product/human-handoff",
    },
    faqHeading: "Voice agent questions",
  },
} as const;

export function VoiceAgentPage({ locale }: { locale: Locale }) {
  const s = t[locale];
  return (
    <>
      {/* Bottom room so the button doesn't sit on the trust strip's rule. */}
      <PageHero title={s.h1} lead={s.intro} className="pb-12 sm:pb-16">
        <DemoLink locale={locale}>{s.cta}</DemoLink>
      </PageHero>

      <TrustStrip locale={locale} />

      {/* Answer-first: the H2 is the query, the paragraph is a liftable answer;
          each capability after it is its own question row. */}
      <Section>
        <Rows>
          <Row title={s.answer.heading}>
            <p>{s.answer.capsule}</p>
          </Row>
          {s.sections.map((sec, i) => (
            <Row key={sec.title} title={sec.title} delay={i * 0.04}>
              <p>{sec.body}</p>
            </Row>
          ))}
        </Rows>
      </Section>

      <Section title={s.limits.heading} lead={s.limits.lead}>
        <div className="grid gap-2 md:grid-cols-2">
          {s.limits.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06} className="h-full">
              <div className="h-full bg-silver-gray p-6">
                <h3 className="text-[1.25rem] leading-[1.3] font-bold">{item.title}</h3>
                <p className="mt-2 text-body-lg leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8">
          <p className="max-w-[60ch] text-[1.0625rem] leading-[1.7] sm:text-[1.125rem]">
            {s.link.lead}
            <Link
              href={localePath(locale, s.link.path)}
              className="font-bold underline decoration-2 underline-offset-[0.35em] hover:decoration-najdi-red"
            >
              {s.link.text}
            </Link>
            {"."}
          </p>
        </Reveal>
      </Section>

      <Section title={s.faqHeading} layout="split">
        <FaqAccordion items={voiceAgentFaq[locale]} />
      </Section>

      <OmniChannels locale={locale} />

      <DemoCta locale={locale} />
    </>
  );
}
