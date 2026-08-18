import Link from "next/link";
import Image from "next/image";
import { localePath, type Locale } from "@/lib/i18n";
import { readingMinutes } from "@/content/blog";
import { getAllPosts } from "@/lib/allPosts";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { blogStrings, formatPostDate, postImage } from "@/lib/blog";

/**
 * The homepage's window into the blog.
 *
 * It exists so the blog is discoverable at all: a footer link is not a signal
 * a visitor reads, and a section that shows real dated posts also tells them
 * the site is maintained — which is most of the reason to run a blog on a
 * young company's site.
 *
 * Three posts, newest first, sliced from the same sorted array the index
 * renders. Nothing here is a second copy of the post list, so publishing a new
 * post updates the homepage with no edit.
 */
export async function BlogTeaser({ locale }: { locale: Locale }) {
  const s = blogStrings[locale];
  const posts = (await getAllPosts()).slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <div>
      <div className="text-center">
        <h2 className="text-h2">{s.homeHeading}</h2>
        <p className="mx-auto mt-3 max-w-xl text-body-lg text-ink/70">{s.homeLead}</p>
      </div>

      <ul className="mt-10 grid gap-6 md:grid-cols-3">
        {posts.map((post) => {
          const c = post[locale];
          return (
            <li key={post.slug} className="flex">
              <Link
                href={localePath(locale, `blog/${post.slug}`)}
                className="card group flex w-full flex-col overflow-hidden transition-shadow hover:shadow-card-hover"
              >
                <div className="-mx-5 -mt-5 mb-4 aspect-[40/21] overflow-hidden border-b border-line">
                  {/* alt="" — the card's own link text is the title, and a
                      duplicate here would make a screen reader announce the
                      same words twice for one control. */}
                  <Image
                    src={postImage(post)}
                    alt=""
                    width={400}
                    height={210}
                    sizes="(max-width: 768px) 100vw, 360px"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-body-sm text-ink/55">
                  <time dateTime={post.date}>{formatPostDate(post.date, locale)}</time>
                  <span aria-hidden>·</span>
                  <span>{s.readTime(readingMinutes(c))}</span>
                </div>
                <h3 className="mt-2 text-h5 text-ink transition-colors group-hover:text-brand-blue">
                  {c.title}
                </h3>
                <p className="mt-2 flex-1 text-body leading-relaxed text-ink/70">{c.excerpt}</p>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 text-center">
        <Link
          href={localePath(locale, "blog")}
          className="font-medium text-brand-blue underline-offset-4 hover:underline"
        >
          {s.homeCta} {locale === "ar" ? "←" : "→"}
        </Link>
      </div>

      <NewsletterSignup locale={locale} source="home" />
    </div>
  );
}
