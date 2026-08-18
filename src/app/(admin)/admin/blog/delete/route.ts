import { cookies } from "next/headers";
import { ADMIN_COOKIE, isValidSession } from "@/lib/adminAuth";
import { deletePublished } from "@/lib/draftStore";
import { revalidateBlogSurfaces } from "@/lib/publishBlog";
import { posts as codePosts } from "@/content/blog";

/**
 * Remove a dashboard-only post outright. Refused for slugs with a code
 * baseline — deleting the override there would RESURFACE the code version,
 * which is the opposite of what "delete" promises; Hide is the honest lever
 * for those.
 */
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  if (!isValidSession((await cookies()).get(ADMIN_COOKIE)?.value)) {
    return new Response("Not Found", { status: 404 });
  }
  const form = await request.formData();
  const slug = String(form.get("slug") ?? "");
  if (!/^[a-z0-9-]{1,120}$/.test(slug)) return new Response("Bad Request", { status: 400 });
  if (codePosts.some((p) => p.slug === slug)) {
    return new Response(null, {
      status: 303,
      headers: { Location: "/admin/blog?error=code%20posts%20can%20be%20hidden%2C%20not%20deleted" },
    });
  }

  await deletePublished(slug);
  revalidateBlogSurfaces(slug);
  console.log("[blog-delete]", JSON.stringify({ slug }));
  return new Response(null, { status: 303, headers: { Location: "/admin/blog" } });
}
