import type { Locale } from "@/lib/i18n";
import { faqGroups } from "@/content/faq";
import { DemoCta } from "@/components/DemoCta";
import { PageHero } from "@/components/page/PageHero";
import { Section } from "@/components/page/Section";

/**
 * /faq (blueprint §6.9) — the AI-answer surface. Twenty-nine questions in
 * six named groups: the group names are the page's H2s and each question its
 * own H3, so a crawler has an outline to anchor an extracted answer to
 * instead of one H1 over a flat list.
 *
 * The accordion is spelled out here rather than reusing FaqAccordion
 * because the shared component renders questions at the default level and
 * these sit under a group H2. Same native <details>/<summary> markup:
 * every answer ships in the server HTML and survives with zero
 * JavaScript, which is the only reason this page is citable — no major
 * AI crawler executes JS. Do not convert it to a JS accordion.
 *
 * On the inner-page kit (About is the pilot): PageHero, then each group as
 * a split section (its name beside its rows), the rows drawn as
 * FaqAccordion's are (filled, square, Charcoal when open).
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
      <PageHero title={s.h1} lead={s.lead} />
      <div className="container">
        <p className="mt-6 max-w-[60ch] text-[1.0625rem] leading-[1.7] sm:text-[1.125rem]">{s.intro}</p>
        <nav aria-label={s.jumpLabel} className="mt-10">
          <ul className="flex flex-wrap gap-2">
            {groups.map((g) => (
              <li key={g.id}>
                <a
                  href={`#${g.id}`}
                  className="flex min-h-12 items-center rounded-(--radius) bg-silver-gray px-4 text-body-lg transition-colors hover:bg-[#dadde3]"
                >
                  {g.group}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {groups.map((g, i) => (
        /* A jump link lands on the group's H2 (headingId), not above the section's top padding; html's
           scroll-padding-top (globals.css) clears the sticky header. The last group keeps the kit's bottom
           room before the DemoCta band. */
        <Section
          key={g.id}
          headingId={g.id}
          title={g.group}
          layout="split"
          className={i === groups.length - 1 ? "pb-[clamp(96px,11.2vw,168px)]" : ""}
        >
          <div className="grid gap-2">
            {g.items.map((item) => (
              <details
                key={item.q}
                className="group bg-silver-gray transition-colors duration-200 not-open:hover:bg-[#dadde3] open:bg-charcoal open:text-off-white"
              >
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 sm:min-h-19 sm:px-6 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-[1.0625rem] font-bold sm:text-[1.25rem] sm:font-medium">{item.q}</h3>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    aria-hidden
                    className="shrink-0 transition-transform duration-300 group-open:rotate-45"
                  >
                    <path
                      d="M9 3v12M3 9h12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </summary>
                <p className="max-w-[60ch] px-5 pb-6 text-[1.0625rem] leading-[1.7] text-[#d5d9e2] sm:px-6 sm:text-[1.125rem]">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </Section>
      ))}
      <DemoCta locale={locale} />
    </>
  );
}
