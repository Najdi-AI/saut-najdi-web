import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { TAGLINE_AR, TAGLINE_EN } from "@/lib/site";
import { Reveal } from "@/components/Reveal";
import { DemoCta } from "@/components/DemoCta";
import { Waveform } from "@/components/Waveform";

/**
 * /about (blueprint §6.7): honest — no fabricated founding story, no
 * invented milestones, no photos until real team members agree. The prose
 * is cut into question-shaped H2 blocks because /about is where an entity
 * engine looks for who-builds-this, and a wall of <p> answers nothing.
 */

/** `link` renders inline at the end of `p` — /about used to link only via buttons. */
type AboutBlock = { h: string; p: string; link?: { path: string; text: string } };

const t = {
  ar: {
    h1: "ليش سوّينا صوت نجدي؟",
    blocks: [
      {
        h: "ليش ما يكفي رد آلي عادي؟",
        p: "لأن العميل السعودي يبغى أحد يفهمه من أول كلمة. يتصل يقول «أبغى أحجز بكرة» — ما يبغى قائمة «اضغط 1»، ولا روبوت يرد عليه بفصحى متكلفة أو بعربية مكسرة مترجمة. اللحظة اللي يحس فيها إنه يكلم آلة ما تفهمه، يسكر ويدق على غيرك.",
      },
      {
        h: "مين وراء صوت نجدي؟",
        p: "صوت نجدي منتج من نجدي AI (Najdi AI)، فريق سعودي مقره الرياض. بنينا المنصة من أساسها على اللهجات السعودية: كيف نتكلم فعلاً، ووش نقصد لما نقول «الحين» و«بكرة» و«يمديك». ما أخذنا منتجاً أجنبياً وعرّبناه — بنينا للسوق السعودي من أول سطر كود، والتعامل مع كل عميل يمر بفريقنا مباشرة.",
      },
      {
        h: "ليش هجين — ذكاء وبشر — مو ذكاء بس؟",
        p: "لأن في مكالمات ما يصلح لها إلا إنسان: الشكوى، والسؤال الحساس، والعميل اللي يبغى يسمع صوت بشري. عشان كذا موظفك دايم موجود في الصورة، ويستلم المكالمة بكامل سياقها بأي لحظة — النص والملخص وتاريخ العميل قدامه. الذكاء يخدم فريقك ما يستبدله، وهذي مو جملة تسويق: هي طريقة بناء المنتج نفسه.",
        link: { path: "product/human-handoff", text: "شوف بالضبط وش يستلم موظفك لحظة التصعيد ←" },
      },
      {
        h: "قاعدتنا في الكلام: ما نقول شي ما نقدر نوريك إياه",
        p: "تلاحظ إن ما في أرقام في هذا الموقع: لا نسبة دقة، ولا نسبة رضا، ولا «وفّر 40%». وما في شعارات عملاء ولا قصص نجاح. السبب بسيط: ما قسناها بشكل نقدر ندافع عنه، وما أخذنا موافقة أحد ننشر اسمه. ونفس الشي على الميزات — نكتب اللي شغال اليوم، وإذا شي لسه ما وصل نقولها بصراحة: ما فيه مكالمات صادرة، وما فيه رقم سعودي تجربه اليوم. الأرقام تجي لما نقيسها صح، وأسماء العملاء تجي لما يوافقون.",
        link: { path: "security", text: "ونفس القاعدة في صفحة الأمان: وين تنحفظ بياناتك ووين تتعالج بالضبط ←" },
      },
    ] as AboutBlock[],
    tagline: TAGLINE_AR,
    taglineSub: TAGLINE_EN,
    reach: "تبغى توصل لنا؟",
    contact: "تواصل معنا",
    security: "الأمان والبيانات",
  },
  en: {
    h1: "Why we built Saut Najdi",
    blocks: [
      {
        h: "Why isn't a normal automated answering system enough?",
        p: "Because Saudi customers want to be understood from the first word. They call saying exactly what they need — not to hear a “press 1” menu, or a robot answering in stilted formal Arabic or awkward translated phrasing. The moment a caller feels they're talking to a machine that doesn't follow them, they hang up and call someone else.",
      },
      {
        h: "Who is behind Saut Najdi?",
        p: "Saut Najdi is a product of Najdi AI, a Saudi team based in Riyadh. We built the platform on Saudi dialects from the ground up: how people actually talk, and what they actually mean. We didn't take a foreign product and localise it — we built for the Saudi market from the first line of code, and every customer relationship runs through our own team.",
      },
      {
        h: "Why hybrid — AI plus humans — rather than AI alone?",
        p: "Because some calls only a person should take: the complaint, the sensitive question, the customer who wants a human voice. That's why your employee is always in the picture, able to take over any call with its full context at any moment — transcript, summary and customer history in front of them. The AI serves your team rather than replacing it, and that isn't a marketing line: it's how the product is built.",
        link: { path: "product/human-handoff", text: "See exactly what your employee inherits at the moment of handoff →" },
      },
      {
        h: "Our rule: we don't say anything we can't show you",
        p: "You'll notice there are no numbers on this website: no accuracy rate, no satisfaction score, no “save 40%.” No customer logos and no success stories either. The reason is simple — we haven't measured them in a way we could defend, and nobody has consented to be named. The same applies to features: we write what works today, and when something isn't there yet we say so plainly — there is no outbound calling, and there is no Saudi number you can try today. The numbers will come when we can measure them properly, and the customer names when customers agree.",
        link: { path: "security", text: "The same rule on our security page: exactly where your data is stored and where it's processed →" },
      },
    ] as AboutBlock[],
    tagline: TAGLINE_EN,
    taglineSub: "نحجي. نفهم. ننجز",
    reach: "Want to reach us?",
    contact: "Contact us",
    security: "Security & data",
  },
} as const;

export function AboutPage({ locale }: { locale: Locale }) {
  const s = t[locale];
  return (
    <>
      <section className="bg-gradient-to-b from-white to-canvas py-14">
        <div className="container text-center">
          <h1 className="text-h1">{s.h1}</h1>
          <Waveform bars={32} maxHeight={28} className="mt-6 opacity-70" />
        </div>
      </section>
      <section className="container pb-16">
        <div className="mx-auto max-w-2xl space-y-8">
          {s.blocks.map((b, i) => (
            <Reveal key={b.h} delay={i * 0.05}>
              <h2 className="text-h3">{b.h}</h2>
              <p className="mt-3 text-body-lg leading-relaxed text-ink/80">
                {b.p}
                {b.link ? (
                  <>
                    {" "}
                    <Link
                      href={localePath(locale, b.link.path)}
                      className="font-medium text-brand-blue underline-offset-4 hover:underline"
                    >
                      {b.link.text}
                    </Link>
                  </>
                ) : null}
              </p>
            </Reveal>
          ))}
          <Reveal>
            <p className="pt-2 text-center text-h4 text-gradient">{s.tagline}</p>
            <p className="mt-1 text-center text-body-lg text-ink/60">{s.taglineSub}</p>
          </Reveal>
          <Reveal className="pt-4 text-center">
            <p className="text-body-lg text-ink/70">{s.reach}</p>
            <div className="mt-3 flex justify-center gap-3">
              <Link href={localePath(locale, "contact")} className="btn-primary">{s.contact}</Link>
              <Link href={localePath(locale, "security")} className="btn-secondary">{s.security}</Link>
            </div>
          </Reveal>
        </div>
      </section>
      <DemoCta locale={locale} />
    </>
  );
}
