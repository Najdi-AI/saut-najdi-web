import { cookies } from "next/headers";
import { ADMIN_COOKIE, isValidSession } from "@/lib/adminAuth";
import { getHiddenSlugs, setHiddenSlugs } from "@/lib/draftStore";
import { revalidateBlogSurfaces } from "@/lib/publishBlog";

/**
 * Hide / Show. One list covers code and dashboard posts alike, because a code
 * post cannot be edited out of the deployed bundle — filtering at render time
 * (lib/allPosts) is the only lever that works for both. Hiding removes the
 * post from the index, feeds, sitemap, homepage and its own URL immediately.
 */
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  if (!isValidSession((await cookies()).get(ADMIN_COOKIE)?.value)) {
    return new Response("Not Found", { status: 404 });
  }
  const form = await request.formData();
  const slug = String(form.get("slug") ?? "");
  const to = String(form.get("to") ?? "");
  if (!/^[a-z0-9-]{1,120}$/.test(slug) || !["hide", "show"].includes(to)) {
    return new Response("Bad Request", { status: 400 });
  }

  const hidden = new Set(await getHiddenSlugs());
  if (to === "hide") hidden.add(slug);
  else hidden.delete(slug);
  await setHiddenSlugs([...hidden]);
  revalidateBlogSurfaces(slug);
  console.log("[blog-toggle]", JSON.stringify({ slug, to }));

  return new Response(null, { status: 303, headers: { Location: "/admin/blog" } });
}
