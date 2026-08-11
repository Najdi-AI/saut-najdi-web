import type { Locale } from "@/lib/i18n";
import { faqGroups } from "@/content/faq";
import { DemoCta } from "@/components/DemoCta";

/**
 * /faq (blueprint §6.9) — the AI-answer surface. Twenty questions in six
 * named groups: the group names are the page's H2s and each question its
 * own H3, so a crawler has an outline to anchor an extracted answer to
 * instead of one H1 over a flat list.
 *
 * The accordion is spelled out here rather than reusing FaqAccordion
 * because the shared component renders questions at the default level and
 * these sit under a group H2. Same native <details>/<summary> markup:
 * every answer ships in the server HTML and survives with zero
 * JavaScript, which is the only reason this page is citable — no major
 * AI crawler executes JS. Do not convert it to a JS accordion.
 */

const t = {
  ar: {
    h1: "الأسئلة الشائعة",
    lead: "كل اللي يدور ببالك عن صوت نجدي — بإجابات واضحة وصريحة.",
    intro:
      "هذي الأسئلة اللي توصلنا فعلاً من أصحاب الأنشطة — مرتبة بمجموعات، وكل جواب مكتوب كامل بحيث تقدر تنسخه وتفهمه بدون ما ترجع لصفحة ثانية.",
    jumpLabel: "مجموعات الأسئلة",
  },
  en: {
    h1: "Frequently asked questions",
    lead: "Everything on your mind about Saut Najdi — with clear, straight answers.",
    intro:
      "These are the questions business owners actually send us — grouped, with each answer written to stand on its own so you can read it without opening another page.",
    jumpLabel: "Question groups",
  },
} as const;

export function FaqPage({ locale }: { locale: Locale }) {
  const s = t[locale];
  const groups = faqGroups[locale];
  return (
    <>
      <section className="container py-14">
        <div className="text-center">
          <h1 className="text-h1">{s.h1}</h1>
          <p className="mx-auto mt-4 max-w-xl text-body-lg text-ink/70">{s.lead}</p>
          <p className="mx-auto mt-4 max-w-2xl text-body-lg leading-relaxed text-ink/75">
            {s.intro}
          </p>
        </div>
        <nav aria-label={s.jumpLabel} className="mx-auto mt-8 max-w-3xl">
          <ul className="flex flex-wrap justify-center gap-2">
            {groups.map((g) => (
              <li key={g.id}>
                <a
                  href={`#${g.id}`}
                  className="block rounded-full border border-line bg-surface px-4 py-1.5 text-body font-medium text-ink/75 shadow-card transition-colors hover:border-brand-blue/50 hover:text-brand-blue"
                >
                  {g.group}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mx-auto mt-12 max-w-2xl space-y-10">
          {groups.map((g) => (
            /* scroll-mt clears the sticky header when a jump link lands here. */
            <section key={g.id} id={g.id} className="scroll-mt-28">
              <h2 className="text-h3">{g.group}</h2>
              <div className="mt-4 divide-y divide-line rounded-2xl border border-line bg-surface shadow-card">
                {g.items.map((item) => (
                  <details key={item.q} className="group px-6 py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                      <h3 className="text-body-lg font-bold text-ink">{item.q}</h3>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        aria-hidden
                        className="shrink-0 text-brand-blue transition-transform duration-300 group-open:rotate-45"
                      >
                        <path
                          d="M9 3v12M3 9h12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </summary>
                    <p className="pt-3 text-body-lg leading-relaxed text-ink/75">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
      <DemoCta locale={locale} />
    </>
  );
}
