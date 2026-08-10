import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { Waveform } from "@/components/Waveform";

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
    <section className="container flex min-h-[55vh] flex-col items-center justify-center py-20 text-center">
      <Waveform bars={28} maxHeight={44} className="opacity-80" />
      <h1 className="mt-6 text-h1">{s.h1}</h1>
      <p className="mt-4 max-w-xl text-body-lg leading-relaxed text-ink/70">{s.body}</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href={localePath(locale, "")} className="btn-primary">{s.home}</Link>
        <Link href={localePath(locale, "how-it-works")} className="btn-secondary">{s.how}</Link>
      </div>
    </section>
  );
}
