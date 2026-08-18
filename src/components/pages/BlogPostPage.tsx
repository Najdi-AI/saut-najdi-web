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
 */
export async function BlogPostPage({ locale, post }: { locale: Locale; post: BlogPost }) {
  const s = blogStrings[locale];
  const c = post[locale];
  const others = (await getAllPosts()).filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <article className="container py-14">
      <div className="mx-auto max-w-2xl">
        <Link
          href={localePath(locale, "blog")}
          className="inline-block py-2 text-body-lg text-brand-blue hover:underline"
        >
          ← {s.backToBlog}
        </Link>

        <h1 className="mt-4 text-h1">{c.title}</h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-body text-ink/55">
          <span>{s.published}</span>
          <time dateTime={post.date}>{formatPostDate(post.date, locale)}</time>
          <span aria-hidden>·</span>
          <span>{s.readTime(readingMinutes(c))}</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags[locale].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-line px-2.5 py-1 text-body-sm text-ink/60"
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
          className="mt-8 w-full rounded-2xl border border-line"
        />

        <div className="mt-10 space-y-5">
          {c.body.map((block, i) => {
            switch (block.t) {
              case "h2":
                return (
                  <h2 key={i} className="pt-4 text-h3 text-ink">
                    {block.text}
                  </h2>
                );
              case "ul":
                return (
                  <ul key={i} className="space-y-2.5">
                    {block.items.map((item) => (
                      <li key={item} className="flex gap-3 text-body-lg leading-relaxed text-ink/80">
                        <span
                          className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-blue"
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
                      <li key={item} className="flex gap-3 text-body-lg leading-relaxed text-ink/80">
                        {/* A real counter rather than list-style, so the
                            marker sits inside the flow in both directions —
                            RTL list markers are inconsistent across browsers. */}
                        <span
                          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-body-sm font-bold text-brand-blue"
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
                    className="rounded-xl border-s-4 border-brand-purple bg-surface p-4 text-body-lg leading-relaxed text-ink/75"
                  >
                    {block.text}
                  </p>
                );
              default:
                return (
                  <p key={i} className="text-body-lg leading-relaxed text-ink/80">
                    {block.text}
                  </p>
                );
            }
          })}
        </div>

        <div className="mt-12 rounded-2xl border border-line bg-surface p-6 text-center">
          <p className="text-h4 text-ink">{s.ctaTitle}</p>
          <p className="mx-auto mt-2 max-w-md text-body-lg leading-relaxed text-ink/70">
            {s.ctaBody}
          </p>
          <div className="mt-5 flex justify-center">
            <DemoLink locale={locale} variant="primary">
              {s.ctaButton}
            </DemoLink>
          </div>
        </div>

        {others.length > 0 && (
          <div className="mt-12">
            <p className="text-h5 text-ink">{s.related}</p>
            <ul className="mt-3 space-y-2">
              {others.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={localePath(locale, `blog/${p.slug}`)}
                    className="inline-block py-2 text-body-lg text-brand-blue hover:underline"
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
