import { buildFeed } from "@/lib/rss";

/**
 * Static with hourly revalidation: the feed now merges pipeline-published
 * posts from Blob, so it can change between deploys. The publish route also
 * revalidates this path directly, so a new post appears without the wait.
 */
export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET(): Promise<Response> {
  return new Response(await buildFeed("ar"), {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      // Readers poll far more often than this site publishes. An hour of
      // freshness is irrelevant to a blog and saves the repeated fetch.
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
