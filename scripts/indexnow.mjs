/**
 * IndexNow submitter — tells Bing/Yandex (and, through Bing's index, the AI
 * assistants that read it) that our URLs changed, instead of waiting for a
 * crawl. One POST covers every URL; the key file at public/<key>.txt is the
 * ownership proof, so it must be deployed BEFORE this runs.
 *
 * Usage:  node scripts/indexnow.mjs            (submits every indexable URL)
 *         node scripts/indexnow.mjs /faq /demo (submits just those paths)
 *
 * Google does not participate in IndexNow — its side is Search Console.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HOST = "sautnajdi.ai";
const ORIGIN = `https://${HOST}`;
const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const key = readFileSync(join(root, ".indexnow-key"), "utf8").trim();

/** Mirrors src/app/sitemap.ts — both locales of every indexable path. */
const paths = [
  "",
  "how-it-works",
  "product/human-handoff",
  "product/voice-agent",
  "product/knowledge-base",
  "product/dashboard",
  "product/agent-builder",
  "solutions/clinics",
  "solutions/restaurants",
  "solutions/hotels",
  "solutions/real-estate",
  "solutions/retail",
  "security",
  "demo",
  "contact",
  "about",
  "faq",
  "privacy",
  "terms",
  "dpa",
];

const argPaths = process.argv.slice(2);
const urlList =
  argPaths.length > 0
    ? argPaths.map((p) => `${ORIGIN}${p.startsWith("/") ? p : `/${p}`}`)
    : paths.flatMap((p) => [
        `${ORIGIN}/${p}`.replace(/\/$/, "/"),
        `${ORIGIN}/en/${p}`.replace(/\/$/, "/"),
      ]);

const body = {
  host: HOST,
  key,
  keyLocation: `${ORIGIN}/${key}.txt`,
  urlList: urlList.map((u) => u.replace(/(?<!:)\/{2,}/g, "/")),
};

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});

// 200 = accepted, 202 = accepted but key not yet validated (retry after deploy).
console.log(`IndexNow ${res.status} ${res.statusText} — ${body.urlList.length} URLs`);
if (!res.ok && res.status !== 202) {
  console.error(await res.text());
  process.exit(1);
}
