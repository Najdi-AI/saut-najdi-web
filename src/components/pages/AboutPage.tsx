import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { TAGLINE_AR, TAGLINE_EN } from "@/lib/site";
import { Reveal } from "@/components/Reveal";
import { DemoCta } from "@/components/DemoCta";
import { Waveform } from "@/components/Waveform";

/**
 * /about (blueprint §6.7): honest — no fabricated founding story, no
 * invented milestones, no photos until real team members agree.
 */

const t = {
  ar: {
    h1: "ليه سوّينا صوت نجدي؟",
    paras: [
      "لأن العميل السعودي يبغى أحد يفهمه من أول كلمة. يتصل يقول «أبغى أحجز بكرة» — ما يبغى قائمة «اضغط 1»، ولا روبوت يرد عليه بفصحى متكلفة أو بعربية مكسرة مترجمة.",
      "صوت نجدي فريق سعودي في الرياض، بنى المنصة من أساسها على اللهجات السعودية: كيف نتكلم فعلاً، ووش نقصد لما نقول «الحين» و«بكرة» و«يمديك». ما أخذنا منتجاً أجنبياً وعرّبناه — بنينا للسوق السعودي من أول سطر.",
      "وليه هجين — ذكاء وبشر — مو ذكاء بس؟ لأن في مكالمات ما يصلح لها إلا إنسان: الشكوى، والسؤال الحساس، والعميل اللي يبغى يسمع صوت بشري. عشان كذا موظفك دايم موجود في الصورة، ويستلم المكالمة بكامل سياقها بأي لحظة. الذكاء يخدم فريقك — ما يستبدله.",
      "نتعامل مع كل عميل بنفس المبدأ اللي نكتب فيه هالموقع: ما نقول شي ما نقدر نوريك إياه في العرض.",
    ],
    tagline: TAGLINE_AR,
    taglineSub: TAGLINE_EN,
    reach: "تبغى توصل لنا؟",
    contact: "تواصل معنا",
    security: "الأمان والبيانات",
  },
  en: {
    h1: "Why we built Saut Najdi",
    paras: [
      "Because Saudi customers want to be understood from the first word. They call saying exactly what they need — not to hear a “press 1” menu, or a robot answering in stilted formal Arabic or awkward translated phrasing.",
      "Saut Najdi is a Saudi team in Riyadh that built the platform on Saudi dialects from the ground up: how people actually talk, and what they actually mean. We didn't take a foreign product and localise it — we built for the Saudi market from the first line of code.",
      "And why hybrid — AI plus humans — rather than AI alone? Because some calls only a human should take: the complaint, the sensitive question, the customer who wants a human voice. That's why your employee is always in the picture, able to take over any call with its full context at any moment. The AI serves your team — it doesn't replace it.",
      "We hold ourselves to the same principle this website is written by: we don't say anything we can't show you in the demo.",
    ],
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
        <div className="mx-auto max-w-2xl space-y-6">
          {s.paras.map((p, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <p className="text-body-lg leading-relaxed text-ink/80">{p}</p>
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
