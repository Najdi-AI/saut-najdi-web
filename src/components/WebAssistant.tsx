import Script from "next/script";
import { WEB_ASSISTANT_KEY, WEB_ASSISTANT_SRC } from "@/lib/site";

/**
 * The Saut Najdi web assistant: the platform's official loader tag, added
 * once per page by the two root layouts. The loader draws its own launcher
 * and chat frame; the site adds no chat UI or CSS of its own. It reads the
 * key from this tag's data-najdi-key and guards against a second include.
 * The site's script-src, connect-src and frame-src admit app.sautnajdi.ai
 * (next.config.ts).
 */
export function WebAssistant() {
  return (
    <Script
      src={WEB_ASSISTANT_SRC}
      data-najdi-key={WEB_ASSISTANT_KEY}
      strategy="afterInteractive"
    />
  );
}
