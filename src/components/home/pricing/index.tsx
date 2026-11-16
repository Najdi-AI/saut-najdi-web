import Link from "next/link";
import { PlanWalk } from "@/components/pricing/PlanWalk";
import { localePath, type Locale } from "@/lib/i18n";
import { SectionHead } from "../ui/SectionHead";

/** The approved plans strip's heading and intro (HomePlansStrip.tsx). */
const copy = {
  ar: {
    title: "وش الباقة اللي تناسبك؟",
    lead: "كل باقة لها حصة نقاط شهرية، تصرف منها على مكالماتك مع الوكيل ومحادثاتك النصية. اختار اللي يناسب حجم شغلك، وفي العرض التعريفي نحدد معك التجهيز.",
    compare: "قارن الباقات بالتفصيل",
    arrow: "←",
  },
  en: {
    title: "Which plan fits you?",
    lead: "Each plan comes with a monthly pool of credits that your AI calls and text conversations draw from. Pick the size that fits your workload, and we scope your setup in the demo.",
    compare: "Compare plans in detail",
    arrow: "→",
  },
} as const;

/**
 * #pricing: the four-tier walk (decision 185), opening on Essential. The
 * walk is shared with /pricing; this adds the section's heading and the
 * link to the detailed comparison there.
 */
export function Pricing({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="px-5 pt-24 sm:px-8 lg:pt-40">
      <SectionHead id="pricing-title" title={t.title} lead={t.lead} />
      <Link
        href={localePath(locale, "pricing")}
        className="mt-2 inline-flex min-h-11 items-center text-lg font-medium underline decoration-1 underline-offset-[0.3em]"
      >
        {t.compare}
        <span aria-hidden>&nbsp;{t.arrow}</span>
      </Link>
      <div className="mt-10 lg:mt-16">
        <PlanWalk locale={locale} />
      </div>
    </section>
  );
}
