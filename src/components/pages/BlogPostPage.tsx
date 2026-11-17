import Link from "next/link";
import Image from "next/image";
import { localePath, type Locale } from "@/lib/i18n";
import { type BlogPost, readingMinutes } from "@/content/blog";
import { getAllPosts } from "@/lib/allPosts";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import {
  formatPostDate,
  blogStrings,
  postImage,
  POST_IMAGE_W,
  POST_IMAGE_H,
} from "@/lib/blog";
import { DemoLink } from "@/components/DemoLink";

/**
 * A single post. Prose is rendered from the typed block list in
 * content/blog.ts — there is no HTML string anywhere in the pipeline, so a
 * post cannot inject markup or break the page's heading outline.
 *
 * The H1 is the post title, and every body heading is an H2. Blocks carry no
 * H3 on purpose: at this article length a third level adds outline depth
 * without adding navigation, and a flat H2 set is what pulls clean section
 * links in search results.
 *
 * Styled to the inner-page kit by classes only (a post may come from the
 * dashboard, so its rendering is unchanged): a start-aligned reading column,
 * serif H1 and H2, square image, markers, note and closing panel.
 */
export async function BlogPostPage({ locale, post }: { locale: Locale; post: BlogPost }) {
  const s = blogStrings[locale];
  const c = post[locale];
  const others = (await getAllPosts()).filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <article className="container pt-[clamp(56px,7vw,112px)] pb-[clamp(96px,11.2vw,168px)]">
      <div className="max-w-2xl">
        <Link
          href={localePath(locale, "blog")}
          className="inline-flex min-h-12 items-center text-body-lg font-bold hover:underline"
        >
          ← {s.backToBlog}
        </Link>

        <h1 className="mt-4 font-display text-[clamp(36px,4.4vw,60px)] leading-[1.25] font-medium text-balance">{c.title}</h1>

        <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-body-lg text-muted-foreground">
          <span>{s.published}</span>
          <time dateTime={post.date}>{formatPostDate(post.date, locale)}</time>
          <span aria-hidden>·</span>
          <span>{s.readTime(readingMinutes(c))}</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags[locale].map((tag) => (
            <span
              key={tag}
              className="border border-line px-2.5 py-1 text-body text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* `priority` because this is the LCP element on a post — it sits
            above the fold and Next would otherwise lazy-load it, delaying the
            largest paint on the exact page type built to be landed on from
            search. The art is flat vector on a fixed ground, so it is the same
            asset in both themes. */}
        <Image
          src={postImage(post)}
          alt={c.title}
          width={POST_IMAGE_W}
          height={POST_IMAGE_H}
          priority
          sizes="(max-width: 768px) 100vw, 672px"
          className="mt-8 w-full border border-line"
        />

        <div className="mt-10 space-y-6">
          {c.body.map((block, i) => {
            switch (block.t) {
              case "h2":
                return (
                  <h2 key={i} className="pt-6 font-display text-[clamp(26px,2.6vw,36px)] leading-[1.3] font-medium text-balance">
                    {block.text}
                  </h2>
                );
              case "ul":
                return (
                  <ul key={i} className="space-y-3">
                    {block.items.map((item) => (
                      <li key={item} className="flex gap-3 text-[1.0625rem] leading-[1.7] sm:text-[1.125rem]">
                        <span
                          className="mt-[0.7em] h-1.5 w-1.5 shrink-0 bg-charcoal"
                          aria-hidden
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              case "ol":
                return (
                  <ol key={i} className="space-y-3">
                    {block.items.map((item, n) => (
                      <li key={item} className="flex gap-3 text-[1.0625rem] leading-[1.7] sm:text-[1.125rem]">
                        {/* A real counter rather than list-style, so the
                            marker sits inside the flow in both directions —
                            RTL list markers are inconsistent across browsers. */}
                        <span
                          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center bg-silver-gray text-body font-bold"
                          aria-hidden
                        >
                          {n + 1}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                );
              case "note":
                return (
                  <p
                    key={i}
                    className="border-s-4 border-charcoal bg-silver-gray p-5 text-[1.0625rem] leading-[1.7] sm:text-[1.125rem]"
                  >
                    {block.text}
                  </p>
                );
              default:
                return (
                  <p key={i} className="text-[1.0625rem] leading-[1.7] sm:text-[1.125rem]">
                    {block.text}
                  </p>
                );
            }
          })}
        </div>

        <div className="mt-14 bg-silver-gray p-6 sm:p-8">
          <p className="font-display text-[clamp(24px,2.4vw,34px)] leading-[1.35] font-medium">{s.ctaTitle}</p>
          <p className="mt-2 max-w-md text-body-lg leading-relaxed text-muted-foreground">
            {s.ctaBody}
          </p>
          <div className="mt-6 flex">
            <DemoLink locale={locale} variant="primary">
              {s.ctaButton}
            </DemoLink>
          </div>
        </div>

        {others.length > 0 && (
          <div className="mt-12">
            <p className="text-[1.25rem] font-bold">{s.related}</p>
            <ul className="mt-3 space-y-2">
              {others.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={localePath(locale, `blog/${p.slug}`)}
                    className="inline-flex min-h-12 items-center text-body-lg font-bold underline decoration-2 underline-offset-[0.35em] hover:decoration-najdi-red"
                  >
                    {p[locale].title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <NewsletterSignup locale={locale} source="blog-post" />
      </div>
    </article>
  );
}
