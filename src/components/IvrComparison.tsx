import type { Locale } from "@/lib/i18n";
import { Section } from "@/components/page/Section";

/*
 * The voice agent against a traditional IVR, moved from the old home to
 * /how-it-works (rebrand D4). The copy is the home's vsIvr, verbatim.
 *
 * Server markup only: HowItWorksPage is imported by pageFactory for its
 * journeySteps, so anything client-side here would ship to every route.
 *
 * A real <table> from 640px up, not a div grid: row and column structure is
 * what answer engines extract. Below 640px the same rows stack, because a
 * three-column table on a phone pushed the «صوت نجدي» answers off-screen.
 * Only one of the two is ever displayed, so assistive tech reads the rows
 * once. The follow-up row («بعد المكالمة») came from the removed workflow
 * comparison. Its knowledge row is deliberately NOT folded in: in a
 * voice-vs-IVR table it reads as a live-call "answers from your documents"
 * claim, which blueprint §2.3 / §10.8 forbid until VOICE_KB_RETRIEVAL is
 * confirmed on in production (see KnowledgeBasePage.tsx). Do not add it
 * back before that gate.
 */
const copy = {
  ar: {
    heading: "وش الفرق بين الوكيل الصوتي الذكي والرد الآلي القديم (IVR)؟",
    answer: "الـ IVR قائمة يمشي عليها العميل. صوت نجدي يتكلم معه، يفهم قصده، وينفذه.",
    cols: ["الموقف", "الرد الآلي (IVR)", "صوت نجدي"],
    rows: [
      ["العميل يبدأ", "قائمة: اضغط 1، اضغط 2", "يقول اللي يبغاه بلهجته"],
      ["إذا قاطع", "القائمة تكمل", "يسكت ويسمع"],
      ["طلب مو في القائمة", "يعلق أو ينتظر موظف", "يتصرف، وإلا يحوّل لموظفك"],
      ["حجز موعد", "يحوّلك لموظف", "يحجز داخل نفس المكالمة"],
      ["يحتاج إنسان", "يبدأ من الصفر", "يستلم ومعه النص والملخص"],
      ["بعد المكالمة", "تجمع التسجيلات والملاحظات من كذا أداة", "تسجيل ونص وملخص قدامك في لوحة التحكم، حسب سياسة الاحتفاظ"],
    ],
  },
  en: {
    heading: "What's the difference between an AI voice agent and a traditional IVR?",
    answer: "An IVR is a menu the caller has to navigate. Saut Najdi talks to them, works out the intent, and acts on it.",
    cols: ["Situation", "Traditional IVR", "Saut Najdi"],
    rows: [
      ["The caller starts", "A menu: press 1, press 2", "They say what they want"],
      ["The caller interrupts", "The menu carries on", "It stops and listens"],
      ["The request isn't on the menu", "Stuck, or waiting for a person", "It acts, or hands off to your team"],
      ["Booking an appointment", "Transferred to a person", "Booked inside the call"],
      ["A human is needed", "Your employee starts from zero", "They inherit transcript and summary"],
      ["After the call", "Recordings and notes gathered from several tools", "Recording, transcript and summary in your dashboard, subject to retention terms"],
    ],
  },
} as const;

/** The table's name is the section heading, through this id. */
const TITLE_ID = "ivr-title";

export function IvrComparison({ locale, className = "" }: { locale: Locale; className?: string }) {
  const t = copy[locale];
  const [situation, ivr, saut] = t.cols;
  return (
    <Section title={<span id={TITLE_ID}>{t.heading}</span>} lead={t.answer} className={className}>
      <ul className="border-t border-border text-[1.0625rem] leading-[1.6] sm:hidden">
        {t.rows.map((r) => (
          <li key={r[0]} className="border-b border-border py-5">
            <p className="font-bold">{r[0]}</p>
            <dl className="mt-3 grid gap-3">
              <div>
                <dt className="text-[0.9375rem] font-medium text-muted-foreground">{ivr}</dt>
                <dd className="mt-0.5 text-muted-foreground">{r[1]}</dd>
              </div>
              <div>
                <dt className="text-[0.9375rem] font-bold">{saut}</dt>
                <dd className="mt-0.5 font-medium">{r[2]}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
      <table
        aria-labelledby={TITLE_ID}
        className="hidden w-full border-collapse text-[1.0625rem] leading-[1.6] sm:table lg:text-[1.125rem]"
      >
        <thead>
          <tr>
            <th scope="col" className="w-[24%] border-b-2 border-foreground p-4 text-start align-bottom font-bold">
              {situation}
            </th>
            <th
              scope="col"
              className="w-[34%] border-b-2 border-foreground p-4 text-start align-bottom font-bold text-muted-foreground"
            >
              {ivr}
            </th>
            <th
              scope="col"
              className="border-b-2 border-charcoal bg-charcoal p-4 text-start align-bottom font-bold text-off-white"
            >
              {saut}
            </th>
          </tr>
        </thead>
        <tbody>
          {t.rows.map((r) => (
            <tr key={r[0]} className="border-b border-border">
              <th scope="row" className="p-4 text-start align-top font-bold">
                {r[0]}
              </th>
              <td className="p-4 align-top text-muted-foreground">{r[1]}</td>
              <td className="p-4 align-top font-medium">{r[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
}
