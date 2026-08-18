import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, isValidSession } from "@/lib/adminAuth";
import { posts as codePosts } from "@/content/blog";
import { listDrafts, listPublished } from "@/lib/draftStore";
import { blocksToText } from "@/lib/postText";

/**
 * The editor — new posts and edits to any existing one, both languages side
 * by side, no client JS.
 *
 * The body is edited as plain text under a four-rule convention (see
 * lib/postText.ts): "## " heading, "- " list, "1. " numbered list, "> " note,
 * blank line between paragraphs. That renders faithfully back into the same
 * typed blocks every post already uses, so nothing an editor types can break
 * the page layout.
 *
 * Prefill priority mirrors what publishing would affect: an in-flight draft
 * first (that is the copy Save updates), then the live dashboard record, then
 * the code baseline.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

interface LooseContent {
  title: string;
  description: string;
  excerpt: string;
  body: { t: string; text?: string; items?: string[] }[];
}
const EMPTY: LooseContent = { title: "", description: "", excerpt: "", body: [] };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string; error?: string }>;
}) {
  if (!isValidSession((await cookies()).get(ADMIN_COOKIE)?.value)) redirect("/admin/login");
  const { slug = "", error } = await searchParams;

  let ar: LooseContent = EMPTY;
  let en: LooseContent = EMPTY;
  let tagsAr = "";
  let tagsEn = "";
  let date = "";
  let source = "new post";

  if (slug) {
    const [drafts, published] = await Promise.all([listDrafts(), listPublished()]);
    const draft = drafts.find((d) => d.slug === slug);
    const live = published.find((p) => p.slug === slug);
    const code = codePosts.find((p) => p.slug === slug);
    const found = draft ?? live ?? code;
    if (found) {
      ar = found.ar;
      en = found.en;
      tagsAr = found.tags.ar.join("، ");
      tagsEn = found.tags.en.join(", ");
      date = ("date" in found ? found.date : undefined) ?? "";
      source = draft ? "editing the draft copy" : live ? "editing the live dashboard copy" : "editing the code version (saving creates a dashboard override)";
    } else {
      source = "slug not found — saving will create a new post";
    }
  }

  const input =
    "mt-1 w-full rounded-xl border border-line bg-canvas px-3 py-2 text-body text-ink outline-none transition focus:border-brand-purple placeholder:text-ink/30";
  const label = "mt-4 block text-body-sm text-ink/45";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-h3 font-bold">{slug ? "Edit post" : "New post"}</h1>
          <p className="mt-1 text-body text-ink/50">{source}</p>
        </div>
        {slug && (
          <span
            dir="ltr"
            className="rounded-full border border-line bg-canvas px-2.5 py-0.5 text-body-sm text-ink/55"
          >
            {slug}
          </span>
        )}
      </div>

      {error && (
        <p className="mt-6 rounded-xl border border-brand-red/40 bg-brand-red/10 p-3 text-body text-brand-red">
          {error}
        </p>
      )}

      <form action="/admin/blog/save" method="post" className="mt-8">
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="text-body-sm uppercase tracking-wider text-ink/40">Post meta</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <label htmlFor="slug" className="block text-body-sm text-ink/45">
                Slug (lowercase latin, hyphens)
              </label>
              <input
                id="slug"
                name="slug"
                defaultValue={slug}
                readOnly={Boolean(slug)}
                required
                pattern="[a-z0-9-]{1,120}"
                className={`${input} ${slug ? "opacity-60" : ""}`}
                dir="ltr"
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-body-sm text-ink/45">
                Date (empty = today on publish)
              </label>
              <input
                id="date"
                name="date"
                defaultValue={date}
                pattern="\d{4}-\d{2}-\d{2}"
                placeholder="YYYY-MM-DD"
                className={input}
                dir="ltr"
              />
            </div>
            <div>
              <label htmlFor="tags_en" className="block text-body-sm text-ink/45">
                Tags EN (comma separated)
              </label>
              <input id="tags_en" name="tags_en" defaultValue={tagsEn} className={input} dir="ltr" />
              <label htmlFor="tags_ar" className={label}>
                Tags AR
              </label>
              <input id="tags_ar" name="tags_ar" defaultValue={tagsAr} className={input} dir="rtl" />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {/* Arabic side */}
          <div dir="rtl" className="rounded-2xl border border-line bg-surface p-6">
            <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
              <h2 className="text-h5">العربية</h2>
              <span className="rounded-full border border-line bg-canvas px-2.5 py-0.5 text-body-sm text-ink/55">
                AR
              </span>
            </div>
            <label htmlFor="ar_title" className={label}>
              العنوان (٤٧ حرفاً كحد أقصى)
            </label>
            <input
              id="ar_title"
              name="ar_title"
              defaultValue={ar.title}
              required
              maxLength={47}
              className={input}
            />
            <label htmlFor="ar_description" className={label}>
              الوصف (٧٠–١٦٠ حرفاً — يظهر في نتائج البحث)
            </label>
            <textarea
              id="ar_description"
              name="ar_description"
              defaultValue={ar.description}
              required
              rows={2}
              className={input}
            />
            <label htmlFor="ar_excerpt" className={label}>
              المقتطف (جملة واحدة لبطاقة المدونة)
            </label>
            <textarea
              id="ar_excerpt"
              name="ar_excerpt"
              defaultValue={ar.excerpt}
              required
              rows={2}
              className={input}
            />
            <label htmlFor="ar_body" className={label}>
              {"المحتوى — ‎## عنوان، ‎- قائمة، ‎> تنبيه، سطر فارغ بين الفقرات"}
            </label>
            <textarea
              id="ar_body"
              name="ar_body"
              defaultValue={blocksToText(ar.body)}
              required
              rows={18}
              className={`${input} font-mono text-body-sm leading-relaxed`}
            />
          </div>

          {/* English side */}
          <div className="rounded-2xl border border-line bg-surface p-6">
            <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
              <h2 className="text-h5">English</h2>
              <span className="rounded-full border border-line bg-canvas px-2.5 py-0.5 text-body-sm text-ink/55">
                EN
              </span>
            </div>
            <label htmlFor="en_title" className={label}>
              Title (max 47 chars)
            </label>
            <input
              id="en_title"
              name="en_title"
              defaultValue={en.title}
              required
              maxLength={47}
              className={input}
            />
            <label htmlFor="en_description" className={label}>
              Description (70–160 chars — shows in search results)
            </label>
            <textarea
              id="en_description"
              name="en_description"
              defaultValue={en.description}
              required
              rows={2}
              className={input}
            />
            <label htmlFor="en_excerpt" className={label}>
              Excerpt (one sentence for the listing card)
            </label>
            <textarea
              id="en_excerpt"
              name="en_excerpt"
              defaultValue={en.excerpt}
              required
              rows={2}
              className={input}
            />
            <label htmlFor="en_body" className={label}>
              {"Body — ## heading, - list, > note, blank line between paragraphs"}
            </label>
            <textarea
              id="en_body"
              name="en_body"
              defaultValue={blocksToText(en.body)}
              required
              rows={18}
              className={`${input} font-mono text-body-sm leading-relaxed`}
            />
          </div>
        </div>

        <div className="sticky bottom-0 z-10 mt-8 rounded-2xl border border-line bg-surface/95 p-4 backdrop-blur">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              name="action"
              value="draft"
              className="rounded-full border border-line px-3 py-1 text-body-sm text-ink/75 transition hover:border-brand-purple hover:text-ink"
            >
              Save as draft
            </button>
            <button
              type="submit"
              name="action"
              value="publish"
              className="btn-spectrum rounded-full px-5 py-2 text-body font-semibold"
            >
              Publish now
            </button>
            <p className="text-body-sm text-ink/45">
              Save as draft puts it in the queue for later. Publish goes live immediately on both
              locales, updates feeds and the sitemap, and pings the search engines.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
