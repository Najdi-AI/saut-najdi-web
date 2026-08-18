import { buildFeed } from "@/lib/rss";

/** See the Arabic feed route for why this is force-static. */
export const dynamic = "force-static";

export async function GET(): Promise<Response> {
  return new Response(await buildFeed("en"), {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
