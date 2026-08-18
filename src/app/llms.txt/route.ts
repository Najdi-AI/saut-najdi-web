import { buildLlms } from "@/lib/llms";

/** Static with hourly revalidation, and purged directly on publish. */
export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET(): Promise<Response> {
  return new Response(await buildLlms("en"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
