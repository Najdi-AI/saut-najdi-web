/**
 * Domain cutover helper.
 *
 * Everything rendered by the app derives its host from SITE_URL (src/lib/site.ts),
 * which reads NEXT_PUBLIC_SITE_URL — so canonicals, hreflang, the sitemap, OG urls
 * and schema @ids all move with one env change. This script handles the leftovers
 * that are plain text and cannot read env at request time:
 *
 *   public/llms.txt, public/llms-ar.txt   — absolute links in the AI briefs
 *   src/content/legal.ts                  — the domain named in legal prose
 *   scripts/indexnow.mjs                  — the HOST it submits under
 *   src/app/robots.txt/route.ts           — the header comment
 *
 * Usage:  node scripts/set-domain.mjs sautnajdi.ai
 *         node scripts/set-domain.mjs sautnajdi.com   (to roll back)
 *
 * Run it, commit the diff, and set NEXT_PUBLIC_SITE_URL in Vercel to match.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const KNOWN = ["sautnajdi.ai", "sautnajdi.com"];
const target = process.argv[2];

if (!KNOWN.includes(target)) {
  console.error(`Usage: node scripts/set-domain.mjs <${KNOWN.join("|")}>`);
  process.exit(1);
}
const from = KNOWN.find((h) => h !== target);

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const files = [
  "public/llms.txt",
  "public/llms-ar.txt",
  "src/content/legal.ts",
  "scripts/indexnow.mjs",
  "src/app/robots.txt/route.ts",
];

let total = 0;
for (const rel of files) {
  const path = join(root, rel);
  const before = readFileSync(path, "utf8");
  // Bare-host match: catches https://host/... and plain "host" in prose alike.
  const after = before.split(from).join(target);
  const hits = before.split(from).length - 1;
  if (hits > 0) {
    writeFileSync(path, after);
    total += hits;
  }
  console.log(`${hits.toString().padStart(3)}  ${rel}`);
}
console.log(`\n${total} replacements: ${from} -> ${target}`);
console.log(
  `Next: set NEXT_PUBLIC_SITE_URL=https://${target} in Vercel production, redeploy,\n` +
    `then re-run scripts/indexnow.mjs so the new host gets submitted.`,
);
