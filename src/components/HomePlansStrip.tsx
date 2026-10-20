import Link from "next/link";
import type { ReactNode } from "react";
import { DemoLink } from "@/components/DemoLink";
import { Reveal } from "@/components/Reveal";
import { CreditMeterFigure } from "@/components/anatomy/credit-meter/figure";
import { plans, textConversations, voiceMinutes } from "@/content/pricing";
import { localePath, type Locale } from "@/lib/i18n";

/**
 * The homepage plans strip (critique 2026-10-20, priority issue 1).
 *
 * The full matrix (credit conversions, capacity, feature gates, footnotes)
 * lives on /pricing. An owner deciding whether to book a demo needs three
 * things per plan: the price, who it fits, and roughly what it covers. Every
 * number is computed from content/pricing.ts, so the strip cannot drift from
 * the pricing page. The "includes" lines paraphrase planFeatureRows in
 * PlanCapacity.tsx (approved 2026-09-27) without their counts, so a limit
 * change there cannot leave a stale number here.
 *
 * One CTA under the strip, not one per plan (blueprint §2.4). Numbers and the
 * VAT percentage are isolated so they never reorder inside Arabic (§2.1).
 *
 * The credit meter (anatomy figure 5, NAJ-897) closes the section, right
 * under the link to /pricing: it draws the intro's one monthly pool spent on
 * calls or text, with the same numbers (it reads content/pricing.ts too). It
 * sits after the CTA on purpose, so «احجز عرضاً» stays directly under the
 * plans and the strip does not grow before its one action.
 */

const num = (value: number) => (
  <bdi dir="ltr" className="tabular-nums">
    {new Intl.NumberFormat("en-US").format(value)}
  </bdi>
);

const vatRate = <bdi dir="ltr">15%</bdi>;

type PlanKey = (typeof plans)[number]["key"];

const copy: Record<
  Locale,
  {
    heading: string;
    intro: string;
    price: (sar: number) => ReactNode;
    fit: Record<PlanKey, string>;
    capacity: (minutes: number, conversations: number) => ReactNode;
    includes: Record<PlanKey, string>;
    enterprise: string;
    vat: ReactNode;
    cta: string;
    compare: string;
  }
> = {
  ar: {
    heading: "وش الباقة اللي تناسبك؟",
    intro:
      "كل باقة لها حصة نقاط شهرية، تصرف منها على مكالماتك مع الوكيل ومحادثاتك النصية. اختار اللي يناسب حجم شغلك، وفي العرض التعريفي نحدد معك التجهيز.",
    price: (sar) => (
      <>
        <span className="text-body-lg font-medium text-ink/65">من</span>{" "}
        <span className="whitespace-nowrap">
          <span className="text-h3">{num(sar)}</span>{" "}
          <span className="text-body-lg font-medium">ر.س</span>
        </span>{" "}
        <span className="text-body-lg font-medium text-ink/65">شهرياً</span>
      </>
    ),
    fit: {
      essential: "لفرع واحد، يغطي مكالماتك بعد الدوام وإذا انشغل فريقك",
      growth: "لفريق يكبر ويبي سعة أكبر للرد والمتابعة",
      expansion: "لأكثر من فرع، بسعة أكبر لفريقك ووكلائك",
    },
    capacity: (minutes, conversations) => (
      <>
        تكفي لحد {num(minutes)} دقيقة مكالمة، أو {num(conversations)} محادثة نصية
      </>
    ),
    includes: {
      essential: "يرد على المكالمات ودردشة موقعك، ويحوّل لموظفك، مع تقارير أساسية",
      growth: "كل اللي في أساسي، مع واتساب وتيليجرام وصندوق وارد مشترك، وتسمع المكالمة وتستلمها وهي شغالة",
      expansion: "كل اللي في نمو، مع مسارات أتمتة أكثر وتقارير لكل فرع",
    },
    enterprise: "احتياجاتك أكبر؟ نجهز لك باقة مؤسسات على مقاسك بعقد مخصص.",
    vat: (
      <>
        الأسعار بالريال وما تشمل ضريبة القيمة المضافة {vatRate}، ورسوم التجهيز نحددها لك في العرض
        المكتوب.
      </>
    ),
    cta: "احجز عرضاً",
    compare: "قارن الباقات بالتفصيل",
  },
  en: {
    heading: "Which plan fits you?",
    intro:
      "Each plan comes with a monthly pool of credits that your AI calls and text conversations draw from. Pick the size that fits your workload, and we scope your setup in the demo.",
    price: (sar) => (
      <>
        <span className="text-body-lg font-medium text-ink/65">From</span>{" "}
        <span className="whitespace-nowrap">
          <span className="text-body-lg font-medium">SAR</span>{" "}
          <span className="text-h3">{num(sar)}</span>
        </span>{" "}
        <span className="text-body-lg font-medium text-ink/65">a month</span>
      </>
    ),
    fit: {
      essential: "For one location: after-hours and overflow calls covered",
      growth: "For a growing team that needs more answering capacity",
      expansion: "For several branches, with room for a bigger team and more agents",
    },
    capacity: (minutes, conversations) => (
      <>
        Up to {num(minutes)} call minutes, or {num(conversations)} text conversations
      </>
    ),
    includes: {
      essential: "Voice answering and website chat, human handoff and basic reports",
      growth: "Everything in Essential, plus WhatsApp, Telegram, a shared inbox, and listening in on live calls and taking them over",
      expansion: "Everything in Growth, plus more automated workflows and per-branch reporting",
    },
    enterprise: "Need more than this? We'll tailor an Enterprise plan to you on a custom contract.",
    vat: <>Prices in SAR, excluding {vatRate} VAT. Setup fees are scoped to your needs in the written offer.</>,
    cta: "Book a demo",
    compare: "Compare plans in detail",
  },
};

export function HomePlansStrip({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <section
      aria-labelledby="home-plans-heading"
      className="border-y border-line bg-brand-gradient-soft py-16 dark:bg-canvas"
    >
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 id="home-plans-heading" className="text-h2">
            {t.heading}
          </h2>
          <p className="mt-4 text-body-lg leading-relaxed text-ink/75">{t.intro}</p>
        </Reveal>

        <ul className="mx-auto mt-10 grid max-w-5xl overflow-hidden rounded-3xl border border-line bg-surface shadow-card md:grid-cols-3">
          {plans.map((plan, i) => (
            <li
              key={plan.key}
              className={`flex flex-col p-6 lg:p-8 ${i > 0 ? "border-t border-line md:border-s md:border-t-0" : ""}`}
            >
              <h3 className="text-h4">{locale === "ar" ? plan.ar : plan.en}</h3>
              <p className="mt-3 font-bold text-ink">{t.price(plan.monthlySar)}</p>
              <p className="mt-3 text-body-lg leading-relaxed text-ink/75">{t.fit[plan.key]}</p>
              <p className="mt-5 border-t border-line pt-5 text-body leading-relaxed text-ink/70">
                {t.capacity(voiceMinutes(plan.credits), textConversations(plan.credits))}
              </p>
              <p className="mt-2 text-body leading-relaxed text-ink/70">{t.includes[plan.key]}</p>
            </li>
          ))}
          <li className="border-t border-line px-6 py-4 text-center text-body-lg text-ink/80 md:col-span-3">
            {t.enterprise}
          </li>
        </ul>

        <p className="mx-auto mt-5 max-w-3xl text-center text-body leading-relaxed text-ink/65">{t.vat}</p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
          <DemoLink locale={locale}>{t.cta}</DemoLink>
          <Link
            href={localePath(locale, "pricing")}
            className="font-medium text-brand-blue underline-offset-4 hover:underline"
          >
            {t.compare} {locale === "ar" ? "←" : "→"}
          </Link>
        </div>

        <div className="mx-auto mt-10 w-full max-w-[640px]">
          <CreditMeterFigure locale={locale} fig={5} />
        </div>
      </div>
    </section>
  );
}
