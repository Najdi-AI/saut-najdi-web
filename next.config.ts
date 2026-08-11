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

/**
 * Every host we own that is NOT the primary. `.sa` joined the project on
 * 2026-08-11 already delegated to Vercel's nameservers, so it went live
 * serving a full copy of the site the moment it was attached; without it
 * here, the three domains behave inconsistently — .com redirecting while
 * .sa quietly serves a duplicate that only a canonical tag disowns.
 */
const legacyHosts = [
  "sautnajdi.com",
  "www.sautnajdi.com",
  "sautnajdi.sa",
  "www.sautnajdi.sa",
];

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
    /**
     * Drop the primary — and its www — from its own redirect list.
     *
     * This used to be `if (PRIMARY_HOST === "sautnajdi.com") return []`, which
     * only guarded the one host that could be primary at the time. Now that
     * the list holds three domains, ANY of them could be promoted by changing
     * NEXT_PUBLIC_SITE_URL, and a host left in its own list would 308 to
     * itself forever. Filtering keeps the original rollback property (point
     * the env var back at .com and .com stops redirecting) while making the
     * loop unreachable whichever domain is promoted next.
     */
    const sources = legacyHosts.filter(
      (host) => host !== PRIMARY_HOST && host !== `www.${PRIMARY_HOST}`,
    );
    return sources.map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: `https://${PRIMARY_HOST}/:path*`,
      permanent: true,
    }));
  },
};

export default nextConfig;
