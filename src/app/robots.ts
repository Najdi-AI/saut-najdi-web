import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** Public robots.txt at 200 declaring the sitemap (§8.6). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/demo/thank-you", "/en/demo/thank-you"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
