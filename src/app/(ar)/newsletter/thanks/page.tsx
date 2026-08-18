import type { Metadata } from "next";
import Link from "next/link";

/**
 * Newsletter confirmation, Arabic. noindex like every thank-you page —
 * and crawlable (never robots-Disallowed) so the noindex is actually seen.
 */
export const metadata: Metadata = {
  title: "تم الاشتراك",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function Page() {
  return (
    <section className="container flex min-h-[50vh] items-center py-14">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-h2 text-ink">تم الاشتراك بنجاح</h1>
        <p className="mt-3 text-body-lg text-ink/70">
          أهلاً بك في نشرة صوت نجدي — بنرسل لك آخر التطورات وأهم أخبار الذكاء
          الاصطناعي. رسالة موجزة، وبدون إزعاج.
        </p>
        <p className="mt-2 text-body text-ink/55">
          تقدر تلغي الاشتراك في أي وقت بمراسلتنا على ai@sautnajdi.ai.
        </p>
        <div className="mt-6">
          <Link href="/blog" className="btn-spectrum rounded-full px-6 py-2.5 text-body font-semibold">
            العودة إلى المدونة
          </Link>
        </div>
      </div>
    </section>
  );
}
