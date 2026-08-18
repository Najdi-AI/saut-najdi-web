import { getAllPosts } from "./allPosts";
import { SITE_URL } from "./site";
import {
  LLMS_EN_PRE,
  LLMS_EN_POST,
  LLMS_AR_PRE,
  LLMS_AR_MID,
  LLMS_AR_POST,
} from "@/content/llmsTemplate";

/**
 * Assembles the AI-assistant briefs with a LIVE blog section. The prose is
 * hand-written (content/llmsTemplate.ts); only the post lists are generated —
 * from the same merged source as the sitemap and feeds, so a post published
 * from the dashboard reaches the briefs the moment it reaches everything else.
 */
export async function buildLlms(locale: "ar" | "en"): Promise<string> {
  const posts = await getAllPosts();

  if (locale === "en") {
    const bullets = posts
      .map(
        (p) =>
          `- [${p.en.title}](${SITE_URL}/en/blog/${p.slug}) · [العربية](${SITE_URL}/blog/${p.slug}): ${p.en.excerpt}`,
      )
      .join("\n");
    return `${LLMS_EN_PRE}${bullets}${LLMS_EN_POST}`;
  }

  const bullets = posts
    .map((p) => `- [${p.ar.title}](${SITE_URL}/blog/${p.slug}): ${p.ar.excerpt}`)
    .join("\n");
  const paths = `- المدونة: /en/blog · ${posts.map((p) => `/en/blog/${p.slug}`).join(" · ")}`;
  return `${LLMS_AR_PRE}${bullets}${LLMS_AR_MID}${paths}${LLMS_AR_POST}`;
}
