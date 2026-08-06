import type { MetadataRoute } from "next";
import { SITE_NAME_AR, SITE_NAME_EN } from "@/lib/site";

/**
 * Web app manifest. Arabic is the primary language, so name/lang/dir and
 * start_url all describe the Arabic root — an installed shortcut must not
 * land a Saudi user on /en. Colours are the Off-White canvas and brand Blue
 * from tailwind.config.ts; the site is light-theme only, so no dark variant.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME_AR} — ${SITE_NAME_EN}`,
    short_name: SITE_NAME_AR,
    description:
      "وكيل صوتي سعودي بالذكاء الاصطناعي يرد على مكالمات عملائك بلهجتهم.",
    lang: "ar",
    dir: "rtl",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F8FA",
    theme_color: "#5B6CE5",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
