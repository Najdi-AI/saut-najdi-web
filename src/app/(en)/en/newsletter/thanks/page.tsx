import type { Metadata } from "next";
import Link from "next/link";

/** Newsletter confirmation, English. noindex like every thank-you page. */
export const metadata: Metadata = {
  title: "Subscribed",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function Page() {
  return (
    <section className="container flex min-h-[50vh] items-center py-14">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-h2 text-ink">You&apos;re subscribed</h1>
        <p className="mt-3 text-body-lg text-ink/70">
          Welcome to the Saut Najdi newsletter — company updates and the AI news
          that matters, in one short email. No noise.
        </p>
        <p className="mt-2 text-body text-ink/55">
          Unsubscribe any time by emailing ai@sautnajdi.ai.
        </p>
        <div className="mt-6">
          <Link href="/en/blog" className="btn-spectrum rounded-full px-6 py-2.5 text-body font-semibold">
            Back to the blog
          </Link>
        </div>
      </div>
    </section>
  );
}
