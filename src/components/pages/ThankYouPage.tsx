import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { PageHero } from "@/components/page/PageHero";

/** /demo/thank-you — booking redirect target, noindex (blueprint §2.4). */

const t = {
  ar: {
    h1: "تم الحجز — نشوفك قريب!",
    body: "وصلك تأكيد الموعد على إيميلك ومعه رابط الاجتماع. جهّز أكثر ثلاثة أسئلة يسألها عملاؤك بالتلفون — نوريك كيف يتعامل معها الوكيل.",
    home: "الرئيسية",
    how: "اقرأ كيف يشتغل",
  },
  en: {
    h1: "Booked — see you soon!",
    body: "A confirmation with the meeting link is in your inbox. To prepare, jot down the three questions your customers ask most on the phone — we'll show you how the agent handles them.",
    home: "Home",
    how: "Read how it works",
  },
} as const;

export function ThankYouPage({ locale }: { locale: Locale }) {
  const s = t[locale];
  return (
    <PageHero title={s.h1} lead={s.body} className="min-h-[55vh] pb-[clamp(96px,11.2vw,168px)]">
      <Link href={localePath(locale, "")} className="btn-primary">{s.home}</Link>
      <Link href={localePath(locale, "how-it-works")} className="btn-secondary">{s.how}</Link>
    </PageHero>
  );
}
