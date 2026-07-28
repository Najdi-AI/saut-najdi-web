import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** Public robots.txt at 200 declaring the sitemap (§8.6). */
export default function robots(): MetadataRoute.Robots {
  // The thank-you pages rely on their noindex meta — a robots Disallow
  // would stop crawlers from ever seeing it (review finding).
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
