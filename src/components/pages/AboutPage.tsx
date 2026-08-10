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
        p: "العميل السعودي يبغى أحد يفهمه من أول كلمة — مو قائمة «اضغط 1» ولا روبوت يرد بفصحى متكلفة. أول ما يحس إنه يكلم آلة ما تفهمه، يسكر ويدق على غيرك.",
      },
      {
        h: "مين وراء صوت نجدي؟",
        p: "صوت نجدي من إنتاج نجدي AI (Najdi AI)، فريق سعودي مقره الرياض. بنيناه للسوق السعودي من أول سطر كود — مو منتج أجنبي عرّبناه.",
      },
      {
        h: "ليش هجين — ذكاء وبشر — مو ذكاء بس؟",
        p: "في مكالمات ما يصلح لها إلا إنسان: الشكوى والسؤال الحساس. عشان كذا موظفك يستلم أي مكالمة بكامل سياقها — النص والملخص وتاريخ العميل قدامه.",
        link: { path: "product/human-handoff", text: "شوف وش يستلم موظفك لحظة التصعيد ←" },
      },
      {
        h: "قاعدتنا: ما نقول شي ما نقدر نوريك إياه",
        p: "ما في أرقام عن نفسنا هنا: لا نسبة دقة، ولا «وفّر 40%»، ولا شعارات عملاء. الأرقام اللي تهمك هي أرقامك أنت، محسوبة من مكالماتك، وتشوفها في لوحتك أول بأول. ونفس الصراحة في الحدود: ما فيه رقم سعودي تجربه اليوم، والاتصال الصادر يبدأه فريقك من اللوحة — ما فيه اتصال آلي على قائمة أرقام.",
        link: { path: "security", text: "وين تنحفظ بياناتك ووين تتعالج بالضبط ←" },
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
        p: "Saudi callers want to be understood from the first word — not routed through a “press 1” menu or answered by a robot in stilted formal Arabic. The moment they feel the machine isn't following them, they hang up and call a competitor.",
      },
      {
        h: "Who is behind Saut Najdi?",
        p: "Saut Najdi is a product of Najdi AI, a Saudi team based in Riyadh. We built it for the Saudi market from the first line of code — not a foreign product with an Arabic layer bolted on.",
      },
      {
        h: "Why hybrid — AI plus humans — rather than AI alone?",
        p: "Some calls only a person should take: the complaint, the sensitive question. So your employee can take over any call with its full context — transcript, summary and customer history already in front of them.",
        link: { path: "product/human-handoff", text: "See what your employee inherits at handoff →" },
      },
      {
        h: "Our rule: we don't claim what we can't show you",
        p: "There are no numbers about us on this site: no accuracy rate, no “save 40%,” no customer logos. The numbers that matter are your own — call volume, the share the AI handled end to end, duration, sentiment — and you see them in your dashboard. Limits stay just as plain: no Saudi number to try today, and outbound calls are placed by your team from the dashboard, not auto-dialled from a list.",
        link: { path: "security", text: "Where your data is stored and where it's processed →" },
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
