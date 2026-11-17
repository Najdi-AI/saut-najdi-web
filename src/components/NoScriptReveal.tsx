/**
 * The no-JavaScript fallback for the motion wrappers, shared by both root
 * layouts so the two locales can never drift apart. Reveal, JourneySteps,
 * SampleConversation and AnimatedIcon server-render their
 * hidden first frame (opacity 0, an offset or scaled transform, an undrawn
 * path) and only framer-motion lifts it, after hydration, so without
 * JavaScript that copy would never appear. Every such node carries
 * `data-reveal`, and this sheet shows it at its end state instead.
 *
 * With JavaScript on, the browser never parses what is inside <noscript>,
 * and React does not hydrate its children, so the animated render and
 * hydration are unchanged. !important is what beats framer-motion's inline
 * style; the dash reset undoes pathLength's stroke-dasharray attribute.
 */
const SHOW_AT_REST =
  "[data-reveal]{opacity:1!important;transform:none!important}" +
  "path[data-reveal]{stroke-dasharray:none!important}";

export function NoScriptReveal() {
  return (
    <noscript>
      <style dangerouslySetInnerHTML={{ __html: SHOW_AT_REST }} />
    </noscript>
  );
}
