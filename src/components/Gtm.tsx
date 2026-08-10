import Script from "next/script";
import { GTM_ID } from "@/lib/site";

/**
 * Google Tag Manager, shared by both root layouts so the two locales can
 * never drift apart on analytics.
 *
 * `afterInteractive` rather than GTM's copy-paste inline snippet: the raw
 * snippet is a render-blocking script in <head>, and this site is optimised
 * for Core Web Vitals because organic search is its whole acquisition
 * channel. afterInteractive is what Next's own @next/third-parties GTM
 * component uses — the container still loads on every page and receives the
 * full pageview, it just stops competing with first paint.
 *
 * `dataLayer` is initialised inside the same script that starts GTM, so any
 * later push (the Cal.com booking events) lands on a real array.
 */
export function Gtm() {
  if (GTM_ID.length === 0) return null;
  return (
    <Script id="gtm-init" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  );
}

/**
 * The no-JavaScript fallback. Must be the FIRST child of <body> per Google's
 * install instructions, so it is a separate export rather than part of <Gtm>.
 */
export function GtmNoScript() {
  if (GTM_ID.length === 0) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
