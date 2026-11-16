import type { Locale } from "@/lib/i18n";
import { homeFaq } from "@/content/faq";
import { SectionHead } from "../ui/SectionHead";
import s from "./Faq.module.css";

const copy = {
  ar: { title: "أسئلة تدور ببالك؟", avatar: "ص", agent: "وكيل صوت نجدي", hint: "اضغط على أي سؤال، ويرد عليك." },
  en: { title: "Questions on your mind?", avatar: "S", agent: "Saut Najdi agent", hint: "Tap any question and it answers." },
} as const;

const PLUS = "M8 2.5v11M2.5 8h11";
const SEEN = "M1.5 8.5l3 3 6-7M7.5 11.5l1 0 6-7";

/**
 * The home FAQ as a conversation (Try 3 .convo, t3-08-faq): each question
 * is the caller's bubble, the open answer the agent's reply. The six items
 * come from homeFaq (content/faq.ts). Native <details> sharing one name: the
 * first opens with the page, opening one closes the others, the open one
 * closes again, and every answer is in the HTML with or without
 * JavaScript, so no client code. The typing dots before a reply are
 * decoration (aria-hidden) and only run when motion is allowed. No FAQPage
 * JSON-LD here: that lives on /faq only (pageFactory).
 */
export function Faq({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <section aria-labelledby="faq-title" className="px-5 pt-24 sm:px-8 lg:pt-40">
      <div className={s.grid}>
        <div className={s.head}>
          <SectionHead id="faq-title" title={t.title} />
          <div className={s.who}>
            <span className={s.avatar} aria-hidden>
              {t.avatar}
            </span>
            <p>
              <b>{t.agent}</b>
              <span>{t.hint}</span>
            </p>
          </div>
        </div>
        <div className={s.thread}>
          {homeFaq[locale].map((item, i) => (
            <details key={item.q} className={s.ask} name="home-faq" open={i === 0}>
              <summary>
                <span className={s.q}>
                  {item.q}
                  <svg className={s.plus} viewBox="0 0 16 16" aria-hidden>
                    <path d={PLUS} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                  <svg className={s.seen} viewBox="0 0 16 16" aria-hidden>
                    <path d={SEEN} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </summary>
              <div className={s.a}>
                <span className={s.typing} aria-hidden>
                  <i />
                  <i />
                  <i />
                </span>
                <div className={s.r}>
                  <small>{t.agent}</small>
                  <p>{item.a}</p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
