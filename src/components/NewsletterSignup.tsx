import type { Locale } from "@/lib/i18n";

/**
 * Newsletter signup band — mounted under the blog index, blog posts, and the
 * homepage blog section.
 *
 * Plain HTML form, zero client JS: the pages it sits on are fully static and
 * stay that way. type="email" + required is the human-facing validation; the
 * API route re-validates for everything that is not a browser.
 *
 * The "website" input is a HONEYPOT — visually hidden but present in the DOM,
 * where form-stuffing bots fill it and humans never see it. `hidden`/
 * display:none would be skipped by smarter bots, hence the sr-only-style
 * offscreen positioning; aria-hidden + tabIndex keep it out of screen readers
 * and tab order so it costs real visitors nothing.
 */
const copy = {
  ar: {
    heading: "نشرتنا البريدية",
    body: "آخر تطورات صوت نجدي وأهم أخبار الذكاء الاصطناعي في السعودية والعالم — رسالة موجزة، بدون إزعاج.",
    placeholder: "بريدك الإلكتروني",
    button: "اشترك",
    consent: "بالاشتراك توافق على استلام رسائلنا. إلغاء الاشتراك متاح في أي وقت —",
    privacy: "سياسة الخصوصية",
  },
  en: {
    heading: "Our newsletter",
    body: "Saut Najdi updates and the AI news that matters in Saudi Arabia and beyond — one short email, no noise.",
    placeholder: "Your email",
    button: "Subscribe",
    consent: "By subscribing you agree to receive our emails. Unsubscribe any time —",
    privacy: "privacy policy",
  },
} as const;

export function NewsletterSignup({ locale, source }: { locale: Locale; source: string }) {
  const c = copy[locale];
  const privacyHref = locale === "en" ? "/en/privacy" : "/privacy";

  return (
    <div
      id="newsletter"
      className="card mt-14 bg-brand-gradient-soft"
    >
      <div className="flex flex-col gap-5 p-2 sm:p-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-md">
          <h2 className="text-h4 text-ink">{c.heading}</h2>
          <p className="mt-1.5 text-body-lg text-ink/70">{c.body}</p>
        </div>

        <form action="/api/newsletter" method="post" className="w-full md:max-w-sm">
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="source" value={source} />
          {/* Honeypot — see the component comment. */}
          <div
            aria-hidden="true"
            style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}
          >
            <label>
              website
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <div className="flex gap-2">
            <label htmlFor={`newsletter-email-${source}`} className="sr-only">
              {c.placeholder}
            </label>
            <input
              id={`newsletter-email-${source}`}
              type="email"
              name="email"
              required
              maxLength={254}
              placeholder={c.placeholder}
              autoComplete="email"
              dir="ltr"
              className="w-full rounded-full border border-line bg-surface px-4 py-2.5 text-body text-ink outline-none transition focus:border-brand-purple placeholder:text-ink/40"
            />
            <button
              type="submit"
              className="btn-spectrum shrink-0 rounded-full px-5 py-2.5 text-body font-semibold"
            >
              {c.button}
            </button>
          </div>
          <p className="mt-2 text-body-sm text-ink/55">
            {c.consent}{" "}
            <a href={privacyHref} className="underline hover:text-ink">
              {c.privacy}
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
