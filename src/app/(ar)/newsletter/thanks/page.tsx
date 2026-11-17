import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page/PageHero";

/**
 * Newsletter confirmation, Arabic. noindex like every thank-you page —
 * and crawlable (never robots-Disallowed) so the noindex is actually seen.
 */
export const metadata: Metadata = {
  title: "تم الاشتراك",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

/* On the inner-page kit, as /demo/thank-you (ThankYouPage). The link is the
   standard button, unsized: white on Najdi Red needs its 20px/700 label. */
export default function Page() {
  return (
    <PageHero
      title="تم الاشتراك بنجاح"
      lead={
        <>
          أهلاً بك في نشرة صوت نجدي — بنرسل لك آخر التطورات وأهم أخبار الذكاء
          الاصطناعي. رسالة موجزة، وبدون إزعاج.
        </>
      }
      className="min-h-[55vh] pb-[clamp(96px,11.2vw,168px)]"
    >
      <p className="mb-3 basis-full text-body-lg text-muted-foreground">
        تقدر تلغي الاشتراك في أي وقت بمراسلتنا على ai@sautnajdi.ai.
      </p>
      <Link href="/blog" className="btn-primary">
        العودة إلى المدونة
      </Link>
    </PageHero>
  );
}
