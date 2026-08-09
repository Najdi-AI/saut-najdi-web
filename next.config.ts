import type { NextConfig } from "next";

/**
 * Legacy-domain redirect, wired to the SAME switch as the canonical host.
 *
 * The .com -> .ai 301s turn on ONLY when NEXT_PUBLIC_SITE_URL says .ai is
 * primary. That coupling is the safety property: it is impossible to redirect
 * visitors to .ai while the app still calls .com canonical (which would send
 * every crawler in a loop), or to leave .com serving a duplicate of the site
 * after the cutover. One env var moves both halves at once, and unsetting it
 * rolls the whole migration back on the next deploy.
 *
 * 308 (permanent: true) preserves the method and passes full link equity.
 */
const PRIMARY_HOST = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sautnajdi.com",
).host;

const legacyHosts = ["sautnajdi.com", "www.sautnajdi.com"];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // framer-motion is not in Next's default optimize list. Rewriting the
    // barrel import to the resolved modules keeps the animation components
    // working exactly as written while trimming the shared client chunk.
    optimizePackageImports: ["framer-motion"],
  },
  async redirects() {
    if (PRIMARY_HOST === "sautnajdi.com") return [];
    return legacyHosts.map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: `https://${PRIMARY_HOST}/:path*`,
      permanent: true,
    }));
  },
};

export default nextConfig;
