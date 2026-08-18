import { SITE_URL, SITE_NAME_AR, SITE_NAME_EN } from "./site";
import { localePath, type Locale } from "./i18n";
import { type Block } from "@/content/blog";
import { getAllPosts } from "@/lib/allPosts";
import { blogStrings } from "./blog";

/**
 * RSS 2.0 for the blog, one feed per locale.
 *
 * Hand-built rather than pulled from a library: the whole document is five
 * tags, and a dependency here would be more code to audit than to write.
 *
 * The five XML predefined entities are the ONLY escaping XML requires, and
 * `&` must be replaced first — doing it after would double-escape the
 * ampersands the other four just introduced.
 */
function xml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Blocks → plain text, for the feed description. */
function plain(body: Block[]): string {
  return body
    .map((b) => {
      if (b.t === "ul" || b.t === "ol") return b.items.map((i) => `• ${i}`).join("\n");
      if (b.t === "h2") return `\n${b.text}\n`;
      return b.text;
    })
    .join("\n\n");
}

/**
 * RFC 822 dates, which RSS 2.0 requires — not ISO 8601.
 *
 * Built from fixed English tokens rather than toUTCString() or a locale
 * formatter: the spec's day and month names are English by definition, and a
 * runtime with a non-English default locale would otherwise emit Arabic month
 * names into a field readers parse strictly.
 */
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function rfc822(iso: string): string {
  const d = new Date(`${iso}T09:00:00Z`);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${DAYS[d.getUTCDay()]}, ${p(d.getUTCDate())} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:00 +0000`;
}

export async function buildFeed(locale: Locale): Promise<string> {
  const sortedPosts = await getAllPosts();
  const self = `${SITE_URL}${localePath(locale, "feed.xml")}`;
  const site = `${SITE_URL}${localePath(locale, "blog")}`;
  const name = locale === "ar" ? SITE_NAME_AR : SITE_NAME_EN;
  const s = blogStrings[locale];

  const items = sortedPosts
    .map((post) => {
      const c = post[locale];
      const url = `${SITE_URL}${localePath(locale, `blog/${post.slug}`)}`;
      return `    <item>
      <title>${xml(c.title)}</title>
      <link>${xml(url)}</link>
      <!-- isPermaLink=false: the guid is an identity token for readers to
           dedupe on, and tying it to the URL would resurface every post as
           unread if a path ever changes. -->
      <guid isPermaLink="false">${xml(`${SITE_URL}#post-${post.slug}-${locale}`)}</guid>
      <pubDate>${rfc822(post.date)}</pubDate>
      <description>${xml(c.excerpt)}</description>
      <content:encoded><![CDATA[${plain(c.body)}]]></content:encoded>
${post.tags[locale].map((t) => `      <category>${xml(t)}</category>`).join("\n")}
    </item>`;
    })
    .join("\n");

  const latest = sortedPosts.length ? rfc822(sortedPosts[0].date) : rfc822("2026-08-16");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${xml(`${name} — ${s.h1}`)}</title>
    <link>${xml(site)}</link>
    <description>${xml(s.lead)}</description>
    <language>${locale === "ar" ? "ar-SA" : "en"}</language>
    <lastBuildDate>${latest}</lastBuildDate>
    <!-- Required by the spec's own validator: without a self-reference a
         reader that acquired the feed indirectly cannot tell where to
         re-fetch it from. -->
    <atom:link href="${xml(self)}" rel="self" type="application/rss+xml" />
    <!-- The other locale's feed, so a reader can offer the translation. -->
    <atom:link href="${xml(`${SITE_URL}${localePath(locale === "ar" ? "en" : "ar", "feed.xml")}`)}" rel="alternate" type="application/rss+xml" hreflang="${locale === "ar" ? "en" : "ar"}" />
${items}
  </channel>
</rss>
`;
}
