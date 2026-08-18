import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { DRAFT_SCHEMA, MODEL, RESEARCH_PROMPT } from "@/lib/newsDraft";

/**
 * Batch-failure probe, reachable via `vercel crons run /api/cron/batch-probe`.
 *
 * Every inlined batch request fails with a bare INVALID_ARGUMENT (code 3, no
 * `details[]`) while the identical request succeeds via generateContent. Three
 * hypotheses remain, and each needs a real batch submission to test — which
 * needs GEMINI_API_KEY, which is Sensitive and therefore server-only.
 *
 * A cron route rather than an admin page, because `vercel crons run` lets this
 * be triggered without a session cookie, and everything it learns is written
 * to `console.log` where `vercel logs` can read it. That takes the site owner
 * out of a loop they have already been round four times.
 *
 * Run it twice: the first call submits, the second (a few minutes later)
 * reports. It re-submits only when the newest probe is over 15 minutes old, so
 * repeated triggers report rather than pile up jobs.
 */
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const TAG = "[batch-probe]";
/**
 * Reporting matches every round (so a still-running earlier round can still be
 * collected); submission and the freshness check use the CURRENT round only,
 * so bumping ROUND always starts a fresh set instead of being skipped as
 * "a recent probe already exists".
 */
const PREFIX = "probe";
const ROUND = "probe8-";
const SUBMIT_ENABLED = true;

/** Deeply removes a keyword from a JSON-Schema-shaped object. */
function strip(node: unknown, key: string): unknown {
  if (Array.isArray(node)) return node.map((n) => strip(n, key));
  if (node === null || typeof node !== "object") return node;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
    if (k === key) continue;
    out[k] = strip(v, key);
  }
  return out;
}
const TEXT = 'Reply with the single word "ok".';

/**
 * ROUND 2 — one batch per variant.
 *
 * Round 1 settled the structural questions: gemini-3.6-flash batches fine via
 * the SDK, raw REST and SDK behave identically, and `generationConfig: {}` and
 * `role` are both harmless. All six probes passed.
 *
 * It also invalidated the earlier bisect. That one put twelve variants as
 * twelve INLINE REQUESTS inside ONE batch, and every one came back failed —
 * including an empty config that round 1 has now proven valid. So a single bad
 * request fails the whole job, and "even the empty config failed" was never
 * evidence of anything. One variant per batch is the only design that isolates.
 */
const TINY = {
  type: "object",
  properties: { ok: { type: "boolean" } },
  required: ["ok"],
} as const;

const SEARCH = [{ googleSearch: {} }];
const JSON_MIME = "application/json";

/**
 * ROUND 3 — isolate WITHIN the schema.
 *
 * Round 2 (one batch per variant) showed empty config and thinking PASS, while
 * both variants carrying the real DRAFT_SCHEMA FAIL. A tiny schema did not
 * fail. So batch's schema validator is stricter than the synchronous one, and
 * rejects something specific to DRAFT_SCHEMA.
 *
 * Prime suspect: `propertyOrdering`, a Gemini extension belonging to
 * `responseSchema` that I put inside `responseJsonSchema`. Second suspect:
 * `enum`. s3 is the candidate fix; s4 is the known-bad control that must fail,
 * or the round proves nothing.
 */

const schemaCfg = (schema: unknown) => ({
  responseMimeType: JSON_MIME,
  responseJsonSchema: schema,
});

/**
 * ROUND 8 — does a search-first prompt actually raise the search rate?
 *
 * `googleSearch` is a tool the model MAY call, and across 12 real jobs only 3
 * did. The old prompt opened with company identity and buried the instruction
 * to search in paragraph two; the new one opens with an imperative and an
 * explicit statement that memory is unusable.
 *
 * That is a plausible story, which is exactly why it needs measuring rather
 * than shipping on confidence — the last several rounds were lost to plausible
 * stories. Four samples each, same config, only the prompt differs.
 */
const OLD_PROMPT = `You are researching a weekly news roundup for the blog of Saut Najdi — a Saudi company selling a hybrid AI + human call-centre agent that answers calls in Saudi dialects. The audience is Saudi business buyers evaluating this category, not a general tech audience.

Search the web for genuinely NEW developments from the past 7 days in AI voice agents, conversational AI, and contact-centre automation. Cover BOTH the Saudi/Gulf market and notable global news. Run at least eight distinct searches from different angles, in Arabic and in English.

Write research NOTES, not a finished article. Plain text. For each item give: what happened, why a Saudi business buyer should care.`;

const RESEARCH_CFG = {
  tools: SEARCH,
  thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
  maxOutputTokens: 32768,
};

const VARIANTS: { name: string; config: Record<string, unknown>; prompt?: string }[] = [
  { name: "old-1", config: RESEARCH_CFG, prompt: OLD_PROMPT },
  { name: "old-2", config: RESEARCH_CFG, prompt: OLD_PROMPT },
  { name: "old-3", config: RESEARCH_CFG, prompt: OLD_PROMPT },
  { name: "old-4", config: RESEARCH_CFG, prompt: OLD_PROMPT },
  { name: "new-1", config: RESEARCH_CFG, prompt: RESEARCH_PROMPT },
  { name: "new-2", config: RESEARCH_CFG, prompt: RESEARCH_PROMPT },
  { name: "new-3", config: RESEARCH_CFG, prompt: RESEARCH_PROMPT },
  { name: "new-4", config: RESEARCH_CFG, prompt: RESEARCH_PROMPT },
];

/**
 * Hand-built REST payloads for the primary model, bypassing the SDK entirely.
 * R1 is Google's documented minimal shape. R2 adds the empty `generationConfig`
 * the SDK always injects — the one field present in every failure and absent
 * from every success. R3 adds the `role` the SDK also sets.
 */
function restVariants(): { name: string; body: unknown }[] {
  const base = (request: unknown, displayName: string) => ({
    batch: {
      display_name: displayName,
      input_config: { requests: { requests: [{ request, metadata: { key: "r1" } }] } },
    },
  });
  return [
    { name: "R1-minimal", body: base({ contents: [{ parts: [{ text: TEXT }] }] }, `${PREFIX}R1-minimal`) },
    {
      name: "R2-emptyGenerationConfig",
      body: base(
        { contents: [{ parts: [{ text: TEXT }] }], generationConfig: {} },
        `${PREFIX}R2-emptyGenerationConfig`,
      ),
    },
    {
      name: "R3-withRole",
      body: base(
        { contents: [{ role: "user", parts: [{ text: TEXT }] }] },
        `${PREFIX}R3-withRole`,
      ),
    },
  ];
}

function unauthorized(): Response {
  return Response.json({ error: "unauthorized" }, { status: 401 });
}

export async function GET(request: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET;
  if (!secret) return unauthorized();
  if (request.headers.get("authorization") !== `Bearer ${secret}`) return unauthorized();

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return Response.json({ error: "GEMINI_API_KEY is not set" }, { status: 500 });
  const ai = new GoogleGenAI({ apiKey });

  // ---- Report every probe job we can see -------------------------------
  const seen: { name: string; label: string; created: string }[] = [];
  const pager = await ai.batches.list({ config: { pageSize: 40 } });
  for await (const summary of pager) {
    /**
     * Also report the REAL pipeline's jobs. The production path logged zero
     * grounding chunks on jobs whose config is identical to probes that
     * returned 9-21, so the same job must be read through both readers to see
     * whether the difference is in the request or in the reading.
     */
    const isReal = summary.displayName?.startsWith("weekly-news-");
    if ((summary.displayName?.startsWith(PREFIX) || isReal) && summary.name) {
      seen.push({
        name: summary.name,
        label: summary.displayName ?? summary.name,
        created: summary.createTime ?? "",
      });
    }
  }

  const report = await Promise.all(
    seen.map(async (s) => {
      const job = await ai.batches.get({ name: s.name });
      const inlined = job.dest?.inlinedResponses ?? [];
      const errored = inlined.filter((r) => r.error);
      const ok = inlined.length > 0 && errored.length === 0;
      const candidate = inlined.find((r) => !r.error)?.response?.candidates?.[0];
      const chunks = candidate?.groundingMetadata?.groundingChunks ?? [];
      return {
        label: s.label,
        name: s.name,
        responses: inlined.length,
        state: job.state,
        verdict: job.state !== "JOB_STATE_SUCCEEDED" ? "running" : ok ? "PASS" : "FAIL",
        error: errored.length ? String(errored[0]?.error?.message ?? "").slice(0, 160) : null,
        // Answers the other open question in the same run: does grounding
        // metadata survive being combined with a response schema?
        groundingChunks: chunks.length,
        sampleChunkTitle: chunks[0]?.web?.title ?? null,
        finish: candidate?.finishReason ?? null,
        // What else is in groundingMetadata? webSearchQueries populated with
        // zero chunks would mean it searched but the chunks were dropped.
        gmKeys: Object.keys(candidate?.groundingMetadata ?? {}),
        queries: candidate?.groundingMetadata?.webSearchQueries?.length ?? 0,
      };
    }),
  );
  for (const r of report) console.log(TAG, JSON.stringify(r));
  console.log(TAG, "probe-jobs-reported", report.length);

  // ---- Submit a fresh set only if the last one is stale -----------------
  const newest = seen.filter((s) => s.label.startsWith(ROUND)).map((s) => s.created).sort().pop() ?? "";
  const fresh = newest !== "" && Date.now() - Date.parse(newest) < 15 * 60 * 1000;
  if (fresh || !SUBMIT_ENABLED) {
    console.log(TAG, "recent probe exists, reporting only");
    return Response.json({ ok: true, submitted: 0, report });
  }

  const submitted: string[] = [];

  // One batch per variant, ONE inline request each — see the note on VARIANTS.
  for (const variant of VARIANTS) {
    try {
      const job = await ai.batches.create({
        model: MODEL,
        src: [{ contents: [{ role: "user", parts: [{ text: variant.prompt ?? TEXT }] }], config: variant.config }],
        config: { displayName: `${ROUND}${variant.name}` },
      });
      submitted.push(`${variant.name}=${job.name}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(TAG, `submit-threw ${variant.name}`, message.slice(0, 300));
    }
  }

  console.log(TAG, "submitted", JSON.stringify(submitted));
  return Response.json({ ok: true, submitted: submitted.length, report });
}
