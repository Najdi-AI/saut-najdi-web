import { cookies } from "next/headers";
import { ADMIN_COOKIE, isValidSession } from "@/lib/adminAuth";
import { deleteDraft } from "@/lib/draftStore";

/**
 * Reject a draft.
 *
 * The queue could accept a draft (paste it into content/blog.ts) but never
 * refuse one — so a bad draft sat there indefinitely and the only way to clear
 * it was to hope the next run reused the same slug and overwrote it. A review
 * tool needs both verdicts.
 *
 * POST from a plain form, so it works without client JS and cannot be
 * triggered by a link prefetch or a crawler the way a GET could. The session
 * cookie is scoped to /admin, which covers this path.
 */
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  if (!isValidSession((await cookies()).get(ADMIN_COOKIE)?.value)) {
    return new Response("Not Found", { status: 404 });
  }

  const form = await request.formData();
  const slug = String(form.get("slug") ?? "");
  // Slugs are lowercase Latin and hyphenated by construction; anything else is
  // not a draft we wrote, and must not reach a storage key.
  if (!/^[a-z0-9-]{1,120}$/.test(slug)) {
    return new Response("Bad Request", { status: 400 });
  }

  await deleteDraft(slug);
  console.log("[draft-discard]", JSON.stringify({ slug }));

  // 303 so a refresh of the queue does not repost the form.
  return new Response(null, { status: 303, headers: { Location: "/admin/drafts" } });
}
