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
 * display:none would be skipped by smarter bots. The clipped sr-only class
 * keeps it in the DOM without expanding the page in RTL layouts;
 * aria-hidden + tabIndex keep it out of screen readers and tab order.
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
    <div id="newsletter" className="mt-14 bg-silver-gray p-6 sm:p-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-md">
          <h2 className="font-display text-[clamp(26px,2.6vw,36px)] leading-[1.3] font-medium">{c.heading}</h2>
          <p className="mt-2 text-body-lg leading-relaxed text-muted-foreground">{c.body}</p>
        </div>

        <form action="/api/newsletter" method="post" className="w-full md:max-w-sm">
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="source" value={source} />
          {/* Honeypot — see the component comment. */}
          <div aria-hidden="true" className="sr-only">
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
              className="min-w-0 flex-1 rounded-none border border-muted-foreground bg-white px-4 text-body-lg text-ink placeholder:text-muted-foreground"
            />
            {/* The standard button, unsized: white on Najdi Red needs its
                20px/700 label (builder rules, btn-primary). */}
            <button type="submit" className="btn-primary shrink-0">
              {c.button}
            </button>
          </div>
          {/* Muted ink is 5.57:1 on the Silver Gray panel; Arabic gets
              14px, the floor for Arabic meta text. */}
          <p className={`mt-3 text-muted-foreground ${locale === "ar" ? "text-body" : "text-body-sm"}`}>
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
