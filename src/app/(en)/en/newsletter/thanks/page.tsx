import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page/PageHero";

/** Newsletter confirmation, English. noindex like every thank-you page. */
export const metadata: Metadata = {
  title: "Subscribed",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

/* On the inner-page kit, as /en/demo/thank-you (ThankYouPage). The link is the
   standard button, unsized: white on Najdi Red needs its 20px/700 label. */
export default function Page() {
  return (
    <PageHero
      title={<>You&apos;re subscribed</>}
      lead={
        <>
          Welcome to the Saut Najdi newsletter — company updates and the AI news
          that matters, in one short email. No noise.
        </>
      }
      className="min-h-[55vh] pb-[clamp(96px,11.2vw,168px)]"
    >
      <p className="mb-3 basis-full text-body-lg text-muted-foreground">
        Unsubscribe any time by emailing ai@sautnajdi.ai.
      </p>
      <Link href="/en/blog" className="btn-primary">
        Back to the blog
      </Link>
    </PageHero>
  );
}
