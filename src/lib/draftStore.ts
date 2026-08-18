import { put, list, del, get } from "@vercel/blob";

/**
 * Storage for weekly news drafts, behind a deliberately tiny interface.
 *
 * Everything the rest of the feature knows about persistence is the five
 * functions below. Vercel Blob is the implementation today; the site is
 * planned to move to GCP, and this file is the only thing that has to change
 * — swap the three calls for @google-cloud/storage and nothing else moves.
 *
 * Two prefixes, because a draft has two lifecycle stages that are queried
 * differently: `pending/` holds a submitted Batch API job we are waiting on,
 * `ready/` holds a generated draft waiting for a human. Listing by prefix is
 * the only query this feature needs, which is why a blob store is enough and
 * a database would be overkill.
 */

const PENDING = "blog-drafts/pending/";
const READY = "blog-drafts/ready/";
/**
 * Failures used to be reported only in the page render that collected them,
 * then the pending record was deleted. That meant an error was visible for
 * exactly ONE page load — reload once and the queue read "Nothing queued",
 * which is indistinguishable from "the cron never ran". It also destroyed the
 * batch id, so the failed job could no longer be inspected. Both happened.
 */
const FAILED = "blog-drafts/failed/";
/**
 * Approved posts, served by the PUBLIC blog at request time.
 *
 * Publishing used to mean "paste into content/blog.ts and deploy", because
 * posts are code. That is still true for cornerstone posts — but this project
 * deploys from the CLI, not from git, so a publish button could not trigger a
 * build. Instead the blog merges these records with the code posts at render
 * time: approving a draft moves it here and the site updates on the next
 * request, no deploy involved.
 */
const PUBLISHED = "blog-drafts/published/";
/** Single blob recording the last cron tick, so "quiet" can be told from "broken". */
const LAST_RUN = "blog-drafts/last-run.json";

/**
 * A Batch API job we have submitted and not yet collected.
 *
 * A draft takes TWO batches, because the two halves have incompatible needs:
 * research must run WITH search and WITHOUT a response schema (a schema
 * silently empties grounding metadata), and the write-up must run WITH a
 * schema and WITHOUT search. See newsDraft.ts.
 *
 * `stage` says which half this job is. `grounded` carries the verification
 * evidence forward: the real source URLs are only knowable from the research
 * call, so they are captured when it lands and held until the write-up
 * produces the citation list to check against.
 */
export interface PendingDraft {
  /** Gemini's job name, e.g. "batches/abc123". */
  batchId: string;
  submittedAt: string;
  /** Absent on records written before the write-up became its own batch. */
  stage?: "research" | "structure";
  /** Sets are not JSON-serialisable, so these travel as arrays. */
  grounded?: { urls: string[]; domains: string[]; pages?: { url: string; title: string }[] };
  /**
   * Which research attempt this is. `googleSearch` is a tool the model MAY
   * call: measured across 12 real jobs, only 3 actually searched. An
   * ungrounded result is retried rather than failing the week.
   */
  attempt?: number;
}

/**
 * How well a cited source stood up to checking — see classify() in
 * newsDraft.ts. Ordered strongest to weakest.
 *
 * "url"    grounding retrieved this exact page
 * "domain" grounding read that publisher, but not this specific URL
 * "live"   no grounding trace, but the URL exists and responds
 * "dead"   no grounding trace AND the URL does not resolve — the signature of
 *          a fabricated citation, and the one that must never be ignored
 * "none"   legacy value from before the liveness check existed
 */
export type SourceCheck = "url" | "domain" | "live" | "dead" | "none";

/** Matches the JSON schema the model is constrained to in newsDraft.ts. */
export interface DraftPost {
  slug: string;
  tags: { ar: string[]; en: string[] };
  ar: DraftContent;
  en: DraftContent;
  /**
   * Sources the model cited, each graded against what grounding actually
   * retrieved. Anything short of "url" means "check this first", not
   * "definitely fabricated".
   */
  sources: { title: string; url: string; check?: SourceCheck }[];
  generatedAt: string;
}

export interface DraftContent {
  title: string;
  description: string;
  excerpt: string;
  body: { t: "p" | "h2" | "ul" | "ol" | "note"; text?: string; items?: string[] }[];
}

/**
 * `access: "private"` — these are UNPUBLISHED posts for a company whose site
 * investors are reading, so they must not be world-readable.
 *
 * An earlier version of this file used `access: "public"` with a comment
 * claiming the URLs were unguessable. That was wrong in a way worth recording:
 * only the store's hostname is random. The path is `ready/<slug>.json`, and
 * the generator is instructed to produce dated slugs like
 * `ai-voice-news-2026-08-16` — so anyone who learned the hostname once (a
 * leaked log line, a screenshot, a shared URL) could enumerate every past and
 * future draft by guessing dates. Private access removes the guess entirely:
 * reads require the store token, which never leaves the server.
 *
 * `addRandomSuffix: false` is safe under private access and keeps a re-run
 * overwriting one blob instead of accumulating near-identical copies.
 */
async function write(key: string, data: unknown): Promise<void> {
  await put(key, JSON.stringify(data, null, 2), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

/**
 * Reads go through the SDK's authenticated `get`, not `fetch(blob.url)` — a
 * private blob's URL is not publicly fetchable, and routing reads through the
 * token is the point of making them private.
 */
async function readAll<T>(prefix: string): Promise<T[]> {
  const { blobs } = await list({ prefix });
  // Cast because Promise.all widens T to Awaited<T>, which the compiler cannot
  // prove equals T for an unconstrained generic. The runtime shape is a
  // parsed JSON object either way.
  const out = (await Promise.all(
    blobs.map(async (b) => {
      const result = await get(b.pathname, { access: "private" });
      /**
       * Only a genuinely-missing blob is skipped — one that vanished between
       * list and get must not blank the whole queue.
       *
       * Anything else THROWS. This used to swallow every non-200, which meant
       * a systemic read failure (bad token, wrong store, permissions) rendered
       * as a cheerful empty queue rather than an error. A silent empty list is
       * the worst possible output for a page whose entire job is to tell you
       * whether something is waiting.
       */
      // A null result is the SDK's "not found" — the vanished-between-list-
      // and-get case, which is the only one safe to skip.
      if (!result) return null;
      if (result.statusCode !== 200 || !result.stream) {
        throw new Error(`blob read failed for ${b.pathname} (status ${result.statusCode ?? "none"})`);
      }
      return (await new Response(result.stream).json()) as T;
    }),
  )) as (T | null)[];
  return out.filter((x): x is T => x !== null);
}

/**
 * Gemini job names look like "batches/abc123". Left as-is that slash would
 * nest a directory under the prefix, so it is flattened — the name itself is
 * still stored inside the blob, which is what callers actually read.
 */
function pendingKey(batchId: string): string {
  return `${PENDING}${batchId.replace(/\//g, "_")}.json`;
}

export async function addPending(p: PendingDraft): Promise<void> {
  await write(pendingKey(p.batchId), p);
}

export async function listPending(): Promise<PendingDraft[]> {
  return readAll<PendingDraft>(PENDING);
}

export async function clearPending(batchId: string): Promise<void> {
  const { blobs } = await list({ prefix: pendingKey(batchId) });
  await Promise.all(blobs.map((b) => del(b.pathname)));
}

export async function saveDraft(d: DraftPost): Promise<void> {
  await write(`${READY}${d.slug}.json`, d);
}

export async function listDrafts(): Promise<DraftPost[]> {
  const drafts = await readAll<DraftPost>(READY);
  return drafts.sort((a, b) => b.generatedAt.localeCompare(a.generatedAt));
}

/**
 * Is this stored draft safe to render?
 *
 * A draft whose body is not an array crashed the review page and locked the
 * reviewer out of the ENTIRE queue, not just the bad entry. Validation now
 * happens before saving, but a broken draft saved earlier is still sitting in
 * storage — and the only tool for removing it lives on the page it breaks.
 * So the cron sweeps them instead.
 */
export function isRenderable(d: DraftPost): string | null {
  if (!d || typeof d.slug !== "string") return "no slug";
  for (const loc of ["ar", "en"] as const) {
    if (!d[loc] || typeof d[loc] !== "object") return `${loc} side missing`;
    if (!Array.isArray(d[loc].body)) return `${loc}.body is not an array`;
    if (typeof d[loc].title !== "string") return `${loc}.title missing`;
  }
  if (!Array.isArray(d.sources)) return "sources is not an array";
  return null;
}

/** The exact shape content/blog.ts posts have — frozen at publish time. */
export interface PublishedPost {
  slug: string;
  date: string;
  tags: { ar: string[]; en: string[] };
  ar: DraftContent;
  en: DraftContent;
  cover?: string;
}

/**
 * Slugs the public site must not serve, whatever their source.
 *
 * One list covering BOTH code and dashboard posts, because hiding a code post
 * cannot touch the code: the bundle is immutable until the next CLI deploy.
 * getAllPosts filters against this, so a hidden post drops out of the index,
 * feeds, sitemap and homepage at once, and its URL 404s.
 */
const HIDDEN = "blog-drafts/hidden.json";

export async function getHiddenSlugs(): Promise<string[]> {
  const result = await get(HIDDEN, { access: "private" });
  if (!result || result.statusCode !== 200 || !result.stream) return [];
  const parsed = (await new Response(result.stream).json()) as unknown;
  return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string") : [];
}

export async function setHiddenSlugs(slugs: string[]): Promise<void> {
  await write(HIDDEN, [...new Set(slugs)].sort());
}

export async function savePublished(post: PublishedPost): Promise<void> {
  await write(`${PUBLISHED}${post.slug}.json`, post);
}

export async function listPublished(): Promise<PublishedPost[]> {
  return readAll<PublishedPost>(PUBLISHED);
}

export async function deletePublished(slug: string): Promise<void> {
  const { blobs } = await list({ prefix: `${PUBLISHED}${slug}.json` });
  await Promise.all(blobs.map((b) => del(b.pathname)));
}

export async function deleteDraft(slug: string): Promise<void> {
  const { blobs } = await list({ prefix: `${READY}${slug}.json` });
  await Promise.all(blobs.map((b) => del(b.pathname)));
}

/* ------------------------------------------------------------------ *
 * Failure log and last-run marker — so the queue can never lie by
 * omission. "Nothing queued" must mean nothing is queued, not "something
 * broke and you missed the one render that said so".
 * ------------------------------------------------------------------ */

export interface DraftFailure {
  batchId: string;
  reason: string;
  submittedAt: string;
  failedAt: string;
}

/** Keeps the batch id, which is what makes a failed job inspectable afterwards. */
export async function saveFailure(f: DraftFailure): Promise<void> {
  await write(`${FAILED}${f.failedAt.replace(/[:.]/g, "-")}.json`, f);
  // Bounded so this cannot grow without limit on a persistently broken job.
  const all = await listFailures();
  for (const stale of all.slice(10)) {
    const { blobs } = await list({ prefix: `${FAILED}${stale.failedAt.replace(/[:.]/g, "-")}.json` });
    await Promise.all(blobs.map((b) => del(b.pathname)));
  }
}

export async function listFailures(): Promise<DraftFailure[]> {
  const failures = await readAll<DraftFailure>(FAILED);
  return failures.sort((a, b) => b.failedAt.localeCompare(a.failedAt));
}

export interface LastRun {
  at: string;
  submitted: string;
  collected: number;
}

export async function setLastRun(r: LastRun): Promise<void> {
  await write(LAST_RUN, r);
}

export async function getLastRun(): Promise<LastRun | null> {
  const result = await get(LAST_RUN, { access: "private" });
  if (!result || result.statusCode !== 200 || !result.stream) return null;
  return (await new Response(result.stream).json()) as LastRun;
}
