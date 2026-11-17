import Link from "next/link";
import Image from "next/image";
import { localePath, type Locale } from "@/lib/i18n";
import { readingMinutes } from "@/content/blog";
import { getAllPosts } from "@/lib/allPosts";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { formatPostDate, blogStrings, postImage } from "@/lib/blog";
import { PageHero } from "@/components/page/PageHero";
import { Section } from "@/components/page/Section";

/**
 * The blog listing. Cards link to posts; nothing here is paginated because
 * three posts do not need pages, and an empty page 2 is a crawl trap.
 *
 * On the inner-page kit (About is the pilot): PageHero, then square cards
 * (`card card-hover`: Silver Gray on hover and on keyboard focus, so their
 * meta and excerpt use the muted ink, 5.57:1 there).
 */
export async function BlogIndexPage({ locale }: { locale: Locale }) {
  const s = blogStrings[locale];

  return (
    <>
      <PageHero title={s.h1} lead={s.lead} />

      <Section className="pb-[clamp(96px,11.2vw,168px)]">
        <ul className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {(await getAllPosts()).map((post) => {
            const c = post[locale];
            return (
              <li key={post.slug} className="flex">
                {/* The whole card is the link — a card with a small "read more"
                    inside it gives a 60px target on a 340px surface. */}
                <Link
                  href={localePath(locale, `blog/${post.slug}`)}
                  className="card card-hover group flex w-full flex-col overflow-hidden"
                >
                  {/* Fixed 2:1 box with object-cover (the 40:21 covers lose a few
                      pixels), so a future cover of a different aspect cannot make
                      one card taller than its row; with WCAG 1.4.12 spacing a card
                      still fits a 1366x657 screen below the header. */}
                  <div className="-mx-6 -mt-6 mb-4 aspect-2/1 overflow-hidden border-b border-line">
                    <Image
                      src={postImage(post)}
                      alt=""
                      width={400}
                      height={210}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 360px"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-body text-muted-foreground">
                    <time dateTime={post.date}>{formatPostDate(post.date, locale)}</time>
                    <span aria-hidden>·</span>
                    <span>{s.readTime(readingMinutes(c))}</span>
                  </div>
                  <h2 className="mt-3 font-display text-[1.375rem] leading-[1.35] font-medium">{c.title}</h2>
                  <p className="mt-2 flex-1 text-body leading-relaxed text-muted-foreground">{c.excerpt}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags[locale].map((tag) => (
                      <span key={tag} className="border border-line px-2.5 py-1 text-body text-muted-foreground">
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
      </Section>
    </>
  );
}
