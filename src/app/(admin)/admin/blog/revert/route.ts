import { cookies } from "next/headers";
import { ADMIN_COOKIE, isValidSession } from "@/lib/adminAuth";
import { deletePublished } from "@/lib/draftStore";
import { revalidateBlogSurfaces } from "@/lib/publishBlog";
import { posts as codePosts } from "@/content/blog";

/**
 * Drop a dashboard override so the code version serves again. Only offered
 * (and only allowed) when a code baseline exists — otherwise this would be a
 * delete wearing a softer name.
 */
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  if (!isValidSession((await cookies()).get(ADMIN_COOKIE)?.value)) {
    return new Response("Not Found", { status: 404 });
  }
  const form = await request.formData();
  const slug = String(form.get("slug") ?? "");
  if (!/^[a-z0-9-]{1,120}$/.test(slug)) return new Response("Bad Request", { status: 400 });
  if (!codePosts.some((p) => p.slug === slug)) {
    return new Response(null, {
      status: 303,
      headers: { Location: "/admin/blog?error=no%20code%20version%20to%20revert%20to" },
    });
  }

  await deletePublished(slug);
  revalidateBlogSurfaces(slug);
  console.log("[blog-revert]", JSON.stringify({ slug }));
  return new Response(null, { status: 303, headers: { Location: "/admin/blog" } });
}
