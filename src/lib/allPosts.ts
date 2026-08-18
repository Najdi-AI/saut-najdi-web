import { cache } from "react";
import { posts as codePosts, type BlogPost, type Block } from "@/content/blog";
import { getHiddenSlugs, listPublished, type PublishedPost } from "./draftStore";

/**
 * The blog's single source of posts: content/blog.ts merged with the posts
 * approved from /admin/drafts (stored in Blob — see draftStore.PUBLISHED).
 *
 * Merged at render time because this project deploys from the CLI, not git,
 * so "publish" cannot mean "rebuild".
 *
 * DASHBOARD WINS a slug collision. It was code-wins for one day; that died
 * the moment the admin gained an editor, because editing a code post writes a
 * Blob copy — and code-wins would silently discard every edit. The code entry
 * is the baseline; the dashboard record is the owner's newer word, and the
 * dashboard offers Revert to drop the override and fall back to code.
 *
 * Posts on the hidden list are filtered here, which removes them from the
 * index, feeds, sitemap, homepage and their own URL in one place.
 *
 * FAIL OPEN, deliberately — the opposite of the admin queue's readAll. If the
 * blob store is unreachable the public site must still render every code
 * post; a storage hiccup taking down the whole blog (and the homepage that
 * embeds its teaser) is a far worse failure than briefly missing the pipeline
 * posts. The error is logged, never swallowed silently.
 *
 * Wrapped in react.cache so one request renders index + teaser + JSON-LD from
 * a single Blob list, not three.
 */
export const getAllPosts = cache(async (): Promise<BlogPost[]> => {
  let published: PublishedPost[] = [];
  try {
    published = await listPublished();
  } catch (error) {
    console.error("[blog] published-posts read failed, serving code posts only:", error);
  }

  let hidden: string[] = [];
  try {
    hidden = await getHiddenSlugs();
  } catch (error) {
    // Fail OPEN to visible: a storage error must not blank the blog. Hiding
    // is a curation tool, not an access control — anything truly private
    // must never be published in the first place.
    console.error("[blog] hidden-list read failed, showing all posts:", error);
  }

  const bySlug = new Map<string, BlogPost>();
  for (const p of codePosts) bySlug.set(p.slug, p); // baseline
  for (const p of published) {
    const post = asBlogPost(p);
    if (post) bySlug.set(post.slug, post); // dashboard wins
    else console.error("[blog] skipping malformed published post:", p?.slug);
  }
  for (const slug of hidden) bySlug.delete(slug);

  return [...bySlug.values()].sort((a, b) => b.date.localeCompare(a.date));
});

export async function getPost(slug: string): Promise<BlogPost | undefined> {
  return (await getAllPosts()).find((p) => p.slug === slug);
}

/**
 * Validate a stored record into a BlogPost, or reject it.
 *
 * Model output has violated its schema twice in this project's history; the
 * publish route validates before saving, but the public site re-checks anyway
 * because a malformed record here would crash every blog page at once.
 */
function asBlogPost(p: PublishedPost): BlogPost | null {
  if (!p || typeof p.slug !== "string" || !/^[a-z0-9-]{1,120}$/.test(p.slug)) return null;
  if (typeof p.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(p.date)) return null;
  if (!Array.isArray(p.tags?.ar) || !Array.isArray(p.tags?.en)) return null;
  for (const loc of ["ar", "en"] as const) {
    const c = p[loc];
    if (!c || typeof c.title !== "string" || typeof c.description !== "string") return null;
    if (typeof c.excerpt !== "string" || !Array.isArray(c.body) || c.body.length === 0) return null;
    for (const b of c.body as Block[]) {
      if (!b || typeof b.t !== "string") return null;
      if ((b.t === "ul" || b.t === "ol") && !Array.isArray((b as { items?: unknown }).items)) return null;
      if ((b.t === "p" || b.t === "h2" || b.t === "note") && typeof (b as { text?: unknown }).text !== "string") return null;
    }
  }
  return {
    slug: p.slug,
    date: p.date,
    tags: p.tags,
    ar: p.ar,
    en: p.en,
    ...(p.cover ? { cover: p.cover } : {}),
  } as BlogPost;
}
