import Link from "next/link";
import Image from "next/image";
import { localePath, type Locale } from "@/lib/i18n";
import { readingMinutes } from "@/content/blog";
import { getAllPosts } from "@/lib/allPosts";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { formatPostDate, blogStrings, postImage } from "@/lib/blog";

/**
 * The blog listing. Cards link to posts; nothing here is paginated because
 * three posts do not need pages, and an empty page 2 is a crawl trap.
 */
export async function BlogIndexPage({ locale }: { locale: Locale }) {
  const s = blogStrings[locale];

  return (
    <section className="container py-14">
      <div className="text-center">
        <h1 className="text-h1">{s.h1}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-body-lg leading-relaxed text-ink/70">
          {s.lead}
        </p>
      </div>

      <ul className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(await getAllPosts()).map((post) => {
          const c = post[locale];
          return (
            <li key={post.slug} className="flex">
              {/* The whole card is the link — a card with a small "read more"
                  inside it gives a 60px target on a 340px surface. */}
              <Link
                href={localePath(locale, `blog/${post.slug}`)}
                className="card group flex w-full flex-col overflow-hidden transition-shadow hover:shadow-card-hover"
              >
                {/* Fixed 40:21 box with object-cover, so a future cover of a
                    different aspect cannot make one card taller than its row. */}
                <div className="-mx-5 -mt-5 mb-4 aspect-[40/21] overflow-hidden border-b border-line">
                  <Image
                    src={postImage(post)}
                    alt=""
                    width={400}
                    height={210}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 360px"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-body-sm text-ink/55">
                  <time dateTime={post.date}>{formatPostDate(post.date, locale)}</time>
                  <span aria-hidden>·</span>
                  <span>{s.readTime(readingMinutes(c))}</span>
                </div>
                <h2 className="mt-3 text-h4 text-ink transition-colors group-hover:text-brand-blue">
                  {c.title}
                </h2>
                <p className="mt-2 flex-1 text-body-lg leading-relaxed text-ink/70">
                  {c.excerpt}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags[locale].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-line px-2.5 py-1 text-body-sm text-ink/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <NewsletterSignup locale={locale} source="blog-index" />
    </section>
  );
}
