import { cookies } from "next/headers";
import { ADMIN_COOKIE, isValidSession } from "@/lib/adminAuth";
import {
  saveDraft,
  listDrafts,
  type DraftPost,
  type PublishedPost,
} from "@/lib/draftStore";
import { goLive } from "@/lib/publishBlog";
import { textToBlocks } from "@/lib/postText";

/**
 * Editor submit — either into the draft queue or straight to live.
 *
 * The body arrives as convention-marked plain text and is converted to the
 * same typed blocks every post uses, so nothing typed here can break layout.
 * Field presence is enforced server-side; the length guidance (title 47,
 * description 70–160) is advisory in the form because a hard reject that
 * throws away a long-form edit is worse than a slightly long description.
 */
export const dynamic = "force-dynamic";

function back(path: string, params: Record<string, string>): Response {
  const q = new URLSearchParams(params).toString();
  return new Response(null, { status: 303, headers: { Location: `${path}?${q}` } });
}

const splitTags = (raw: string): string[] =>
  raw
    .split(/[,،]/)
    .map((t) => t.trim())
    .filter(Boolean);

export async function POST(request: Request): Promise<Response> {
  if (!isValidSession((await cookies()).get(ADMIN_COOKIE)?.value)) {
    return new Response("Not Found", { status: 404 });
  }

  const form = await request.formData();
  const f = (k: string) => String(form.get(k) ?? "").trim();

  const slug = f("slug");
  const action = f("action") === "publish" ? "publish" : "draft";
  if (!/^[a-z0-9-]{1,120}$/.test(slug)) {
    return back("/admin/blog/editor", { error: "slug must be lowercase latin with hyphens" });
  }

  const sides = { ar: {} as DraftPost["ar"], en: {} as DraftPost["en"] };
  for (const loc of ["ar", "en"] as const) {
    const title = f(`${loc}_title`);
    const description = f(`${loc}_description`);
    const excerpt = f(`${loc}_excerpt`);
    const body = textToBlocks(f(`${loc}_body`));
    if (!title || !description || !excerpt || body.length === 0) {
      return back("/admin/blog/editor", {
        slug,
        error: `the ${loc === "ar" ? "Arabic" : "English"} side is missing a required field`,
      });
    }
    sides[loc] = { title, description, excerpt, body };
  }

  const tags = { ar: splitTags(f("tags_ar")), en: splitTags(f("tags_en")) };
  const dateInput = f("date");
  if (dateInput && !/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    return back("/admin/blog/editor", { slug, error: "date must be YYYY-MM-DD or empty" });
  }

  if (action === "draft") {
    // Preserve pipeline provenance: if this slug already has a queued draft
    // (e.g. fixing a typo in a generated one), keep its verified sources.
    const existing = (await listDrafts()).find((d) => d.slug === slug);
    const draft: DraftPost = {
      slug,
      tags,
      ar: sides.ar,
      en: sides.en,
      sources: existing?.sources ?? [],
      generatedAt: new Date().toISOString(),
    };
    await saveDraft(draft);
    return back("/admin/blog", { saved: slug });
  }

  const post: PublishedPost = {
    slug,
    date: dateInput || new Date().toISOString().slice(0, 10),
    tags,
    ar: sides.ar,
    en: sides.en,
    cover: `/api/cover/${slug}`,
  };
  const failed = await goLive(post);
  return failed ? back("/admin/blog", { error: failed }) : back("/admin/blog", { published: slug });
}
