import { SITE_URL } from "@/lib/site";

// A hand-written route rather than MetadataRoute.Robots: that helper cannot
// emit comments, and the "# llms.txt:" pointer is the whole reason to bother.
export const dynamic = "force-static";

const BODY = `# robots.txt — sautnajdi.ai
# Saut Najdi — a Saudi AI voice agent. A product of Najdi AI, Riyadh.
# Plain-language brief for AI assistants:
#   English: ${SITE_URL}/llms.txt
#   العربية: ${SITE_URL}/llms-ar.txt

User-agent: *
Allow: /

# --- AI answer engines: these fetch a page at answer time and are the gate
# --- on being CITED. Blocking them removes us from the answer, not just training.
User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

# --- Training crawlers: a new brand with no content moat gains recognition,
# --- and loses nothing, by being in the corpus.
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: CCBot
Allow: /

User-agent: meta-externalagent
Allow: /

User-agent: Bytespider
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

// The thank-you pages rely on their noindex meta — a robots Disallow would
// stop crawlers from ever seeing it (review finding).
export function GET() {
  return new Response(BODY, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
