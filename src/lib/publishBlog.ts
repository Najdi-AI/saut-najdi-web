import { revalidatePath } from "next/cache";
import {
  savePublished,
  listPublished,
  deleteDraft,
  type PublishedPost,
} from "./draftStore";

/**
 * The one place that knows how to take a post live and how to un-take it.
 * Both the queue's Publish button and the dashboard editor go through this,
 * so the cache purge and the IndexNow ping cannot drift apart between them.
 */

/** Every cached surface that shows posts — purged so changes are live NOW. */
export function revalidateBlogSurfaces(slug: string): void {
  for (const path of [
    "/",
    "/en",
    "/blog",
    "/en/blog",
    `/blog/${slug}`,
    `/en/blog/${slug}`,
    "/sitemap.xml",
    "/feed.xml",
    "/en/feed.xml",
    "/llms.txt",
    "/llms-ar.txt",
  ]) {
    revalidatePath(path);
  }
}

/**
 * IndexNow, same as scripts/indexnow.mjs after a manual publish. The key is
 * ownership-proof-by-public-file, not a secret. Fire-and-forget — indexing
 * lag must never fail a publish.
 */
export async function pingIndexNow(slug: string): Promise<void> {
  try {
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: "sautnajdi.ai",
        key: "5260df457746beb402be196c879acb8a",
        urlList: [
          `https://sautnajdi.ai/blog/${slug}`,
          `https://sautnajdi.ai/en/blog/${slug}`,
          "https://sautnajdi.ai/blog",
          "https://sautnajdi.ai/en/blog",
        ],
      }),
      signal: AbortSignal.timeout(6000),
    });
  } catch (error) {
    console.log("[blog-publish] indexnow ping failed (non-fatal):", String(error).slice(0, 120));
  }
}

/**
 * Persist a post as live, prove the write round-trips, clear any draft with
 * the same slug, purge caches, ping IndexNow. Returns null on success or a
 * human-readable reason.
 */
export async function goLive(post: PublishedPost): Promise<string | null> {
  await savePublished(post);
  const readBack = (await listPublished()).some((p) => p.slug === post.slug);
  if (!readBack) return "published record did not read back";
  await deleteDraft(post.slug);
  revalidateBlogSurfaces(post.slug);
  await pingIndexNow(post.slug);
  console.log("[blog-publish]", JSON.stringify({ slug: post.slug, date: post.date }));
  return null;
}
