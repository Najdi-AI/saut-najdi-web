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
 * EVERY host attached to this project, primary included — the filter in
 * redirects() drops whichever one is currently primary, so this list is a
 * plain inventory rather than a list that has to be kept in opposition to
 * NEXT_PUBLIC_SITE_URL.
 *
 * The www forms matter as much as the apexes. Each attached host serves a
 * full copy of the site the moment it is added — `.sa` did on 2026-08-11,
 * and `www.sautnajdi.ai` was doing exactly that (200, not a redirect) until
 * 2026-08-12, with only a canonical tag disowning the duplicate.
 */
const ownedHosts = [
  "sautnajdi.ai",
  "www.sautnajdi.ai",
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
     * Drop exactly one host — the primary — from its own redirect list.
     *
     * A host that redirects to itself 308s forever, and that is the ONLY
     * loop available here: every other host points at a different name, so
     * the hop terminates in one step. An earlier version of this filter also
     * excluded `www.${PRIMARY_HOST}`, which was over-applied — www.X -> X is
     * a hop between two distinct hosts, not a self-redirect. That extra
     * clause was silently swallowing www.sautnajdi.ai and leaving it serving
     * a full duplicate of the site.
     *
     * Filtering rather than hard-coding keeps the rollback property: point
     * NEXT_PUBLIC_SITE_URL back at .com and .com stops redirecting, with the
     * loop still unreachable whichever domain is promoted next.
     */
    const sources = ownedHosts.filter((host) => host !== PRIMARY_HOST);
    return sources.map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: `https://${PRIMARY_HOST}/:path*`,
      permanent: true,
    }));
  },
  /**
   * Security headers. Vercel already sends HSTS (max-age=63072000); the rest
   * were all absent in production.
   *
   * CSP ships in TWO parts on purpose.
   *
   * ENFORCED is the structural subset — the directives that cannot break a
   * page because the site does not use the capability they remove: no <base>
   * tag, no <object>/<embed>, nothing legitimately frames us, and the one
   * <form> on the site calls preventDefault() and hands off to mailto:, so it
   * never performs an HTTP submission at all.
   *
   * REPORT-ONLY is the full resource policy. It is not enforced yet because
   * the GTM container (GTM-KCWP33MC) can load tags from origins that cannot
   * be enumerated from the codebase — only from the container's own config —
   * and a missing origin under enforcement means a silently broken booking
   * flow or chat, on a site currently being shown to investors. Report-only
   * surfaces exactly those origins in the browser console with nothing
   * blocked. Once the four flows below have been exercised with a clean
   * console, move this value onto the enforced header and delete the split:
   *   1. open the chat widget and send a message (app.najdiai.com frame)
   *   2. open /demo and let the Cal booker render (app.cal.com frame)
   *   3. click a "book a meeting" CTA that opens the Cal modal
   *   4. toggle the theme (ThemeScript is a blocking inline script)
   *
   * Note `'unsafe-inline'` in script-src: the site is statically prerendered,
   * so a per-request nonce is not available, and ThemeScript must run inline
   * and blocking in <head> to avoid a flash of the wrong theme. The host
   * allowlist is what this directive buys us, not inline protection.
   */
  async headers() {
    /**
     * Keep in sync with APP_URL in src/lib/site.ts — this file cannot import
     * it (next.config runs before path aliases resolve).
     *
     * Naming the widget origin explicitly is the whole point of this
     * directive rather than a plain `microphone=()`. The web-chat frame is
     * cross-origin and offers voice input, and a feature is only usable in a
     * child frame when the PARENT's policy admits that origin — the iframe's
     * own `allow="microphone"` cannot grant what the top document withholds.
     * Denying it here would silently kill the mic button inside the chat.
     */
    const WIDGET_ORIGIN = "https://app.najdiai.com";
    const CAL = ["https://app.cal.com", "https://cal.com"];
    const GTM = "https://www.googletagmanager.com";

    /**
     * Marketing-pixel script hosts, allowlisted BEFORE any of them is
     * installed.
     *
     * Enforcing script-src has one predictable failure mode: a marketer adds a
     * pixel through the GTM container, no code is deployed, and the tag is
     * blocked with no obvious cause. Every platform below is one the business
     * already operates an account on, so pre-clearing their loader hosts costs
     * nothing today and removes that trap. A pixel is a SCRIPT, so a permissive
     * img-src/connect-src alone would not have saved it.
     */
    const PIXELS = [
      "https://connect.facebook.net", // Meta
      "https://snap.licdn.com", // LinkedIn Insight
      "https://static.ads-twitter.com", // X
      "https://analytics.tiktok.com", // TikTok
      "https://sc-static.net", // Snapchat
      "https://www.google-analytics.com",
      "https://www.googleadservices.com",
    ];

    const scriptSrc = `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${GTM} ${CAL.join(" ")} https://va.vercel-scripts.com ${PIXELS.join(" ")}`;
    const frameSrc = `frame-src 'self' ${CAL.join(" ")} ${WIDGET_ORIGIN} ${GTM}`;

    /**
     * Enforced: the structural directives (inert here — see above) plus
     * script-src and frame-src, which is where the actual security value sits
     * and which were validated against all four embed flows with a
     * `securitypolicyviolation` listener before being promoted.
     *
     * img-src and connect-src stay OUT of enforcement on purpose. Those are
     * what analytics and pixels beacon through, they change without a deploy,
     * and blocking a measurement call is a silent data loss rather than a
     * visible break — the worst kind to debug.
     */
    const cspEnforced = [
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "form-action 'self'",
      scriptSrc,
      frameSrc,
      "upgrade-insecure-requests",
    ].join("; ");

    /**
     * Still observing the directives that are NOT yet enforced — default-src,
     * style-src, img-src, connect-src, font-src, worker-src. Keeping this
     * running after promotion is the point: it is the early-warning channel
     * for the day a new tag starts beaconing somewhere unexpected.
     */
    const cspReportOnly = [
      "default-src 'self'",
      scriptSrc,
      "style-src 'self' 'unsafe-inline'",
      // Analytics pixels are the one place a blanket https: is the honest
      // call — GTM tags legitimately fetch 1x1s from arbitrary ad/measurement
      // hosts, and enumerating them from outside the container is guesswork.
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      `connect-src 'self' ${GTM} https://*.google-analytics.com https://*.analytics.google.com ${CAL.join(" ")} ${WIDGET_ORIGIN} https://va.vercel-scripts.com ${PIXELS.join(" ")}`,
      frameSrc,
      "worker-src 'self' blob:",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "form-action 'self'",
    ].join("; ");

    return [
      /**
       * Keep every non-canonical host out of the index.
       *
       * The owned domains all 308 to the primary host, so they never serve
       * content — but the Vercel deployment hosts do. `sautnajdi.vercel.app`
       * was serving a complete, indexable copy of the site: HTTP 200,
       * `robots: index, follow`, and the same icon links. Google defines a
       * site by its hostname, so that is a second site competing with the real
       * one for duplicate content AND holding its own favicon record. The
       * canonical tag is only a hint; this is the directive.
       *
       * `missing` host inverts the match, so this covers every preview
       * deployment URL too, not just the production alias — and it cannot
       * catch the primary host, which is the one thing that must stay
       * indexable.
       */
      {
        source: "/:path*",
        missing: [{ type: "host", value: PRIMARY_HOST }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: cspEnforced },
          { key: "Content-Security-Policy-Report-Only", value: cspReportOnly },
          // Stops a browser from second-guessing a declared Content-Type,
          // which is the vector that turns an uploaded/user-supplied file
          // into executable script.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Full URL to same-origin, bare origin cross-origin, nothing at all
          // when leaving HTTPS. Keeps paths out of third-party referer logs
          // while preserving attribution for our own analytics.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Clickjacking. Legacy relative to CSP frame-ancestors, but still
          // honoured everywhere and the only framing control we have until
          // the CSP pass lands. Nothing legitimately frames this site.
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Only the features named here are restricted; anything omitted
          // keeps its browser default, so this cannot regress a capability
          // the site is already using.
          {
            key: "Permissions-Policy",
            value: [
              "camera=()",
              "geolocation=()",
              "payment=()",
              "usb=()",
              `microphone=(self "${WIDGET_ORIGIN}")`,
            ].join(", "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
