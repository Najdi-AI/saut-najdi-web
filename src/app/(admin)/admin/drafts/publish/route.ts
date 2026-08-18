import { cookies } from "next/headers";
import { ADMIN_COOKIE, isValidSession } from "@/lib/adminAuth";
import { listDrafts, isRenderable, type PublishedPost } from "@/lib/draftStore";
import { goLive } from "@/lib/publishBlog";

/**
 * The Approve half of the queue review — one click from pipeline draft to
 * live post. All the mechanics live in lib/publishBlog.goLive, shared with
 * the dashboard editor, so the two publish paths cannot drift.
 */
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  if (!isValidSession((await cookies()).get(ADMIN_COOKIE)?.value)) {
    return new Response("Not Found", { status: 404 });
  }

  const form = await request.formData();
  const slug = String(form.get("slug") ?? "");
  if (!/^[a-z0-9-]{1,120}$/.test(slug)) return new Response("Bad Request", { status: 400 });

  const draft = (await listDrafts()).find((d) => d.slug === slug);
  if (!draft) {
    return new Response(null, {
      status: 303,
      headers: { Location: "/admin/drafts?error=notfound" },
    });
  }

  const broken = isRenderable(draft);
  if (broken) {
    return new Response(null, {
      status: 303,
      headers: { Location: `/admin/drafts?error=${encodeURIComponent(broken)}` },
    });
  }

  const post: PublishedPost = {
    slug: draft.slug,
    // Frozen now — the visible publication date is the approval, not the
    // generation.
    date: new Date().toISOString().slice(0, 10),
    tags: draft.tags,
    ar: draft.ar,
    en: draft.en,
    cover: `/api/cover/${draft.slug}`,
  };

  const failed = await goLive(post);
  return new Response(null, {
    status: 303,
    headers: {
      Location: failed
        ? `/admin/drafts?error=${encodeURIComponent(failed)}`
        : `/admin/drafts?published=${encodeURIComponent(slug)}`,
    },
  });
}
