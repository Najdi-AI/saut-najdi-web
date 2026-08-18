import { cookies } from "next/headers";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { ADMIN_COOKIE, isValidSession } from "@/lib/adminAuth";
import { DRAFT_SCHEMA, MODEL } from "@/lib/newsDraft";

/**
 * Isolates which config key makes Gemini reject the weekly-draft request.
 *
 * The Batch API reports a failed inner request as the bare string "Request
 * contains an invalid argument", with no field name and no detail. A
 * synchronous generateContent call against the SAME config returns Google's
 * full error body, so this route replays the production config as a set of
 * variants — each one adding a single feature — and reports which combination
 * is the first to fail.
 *
 * Cookie-gated exactly like /admin/drafts. Prompts are deliberately trivial:
 * the 400 happens at request validation, before any generation, so there is no
 * reason to pay for real output while bisecting.
 */
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Small stand-in for DRAFT_SCHEMA, to separate "schemas at all" from "this schema". */
const TINY = {
  type: "object",
  properties: { ok: { type: "boolean" }, note: { type: "string" } },
  required: ["ok"],
} as const;

const TINY_ORDERED = { ...TINY, propertyOrdering: ["ok", "note"] } as const;

const SEARCH = [{ googleSearch: {} }];
const JSON_MIME = "application/json";

/** Each variant isolates one suspect. Order is narrative, not functional. */
const VARIANTS: { name: string; config: Record<string, unknown> }[] = [
  { name: "1-plain", config: {} },
  { name: "2-thinking", config: { thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH } } },
  { name: "3-maxOutputTokens", config: { maxOutputTokens: 32768 } },
  { name: "4-search", config: { tools: SEARCH } },
  { name: "5-tinySchema", config: { responseMimeType: JSON_MIME, responseJsonSchema: TINY } },
  {
    name: "6-tinySchema+propertyOrdering",
    config: { responseMimeType: JSON_MIME, responseJsonSchema: TINY_ORDERED },
  },
  {
    name: "7-tinySchema+search",
    config: { tools: SEARCH, responseMimeType: JSON_MIME, responseJsonSchema: TINY },
  },
  { name: "8-realSchema", config: { responseMimeType: JSON_MIME, responseJsonSchema: DRAFT_SCHEMA } },
  {
    name: "9-realSchema+search",
    config: { tools: SEARCH, responseMimeType: JSON_MIME, responseJsonSchema: DRAFT_SCHEMA },
  },
  {
    name: "10-full-production-config",
    config: {
      tools: SEARCH,
      responseMimeType: JSON_MIME,
      responseJsonSchema: DRAFT_SCHEMA,
      thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
      maxOutputTokens: 32768,
    },
  },
];

export async function GET(): Promise<Response> {
  if (!isValidSession((await cookies()).get(ADMIN_COOKIE)?.value)) {
    return new Response("Not Found", { status: 404 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return Response.json({ error: "GEMINI_API_KEY is not set" }, { status: 500 });
  const ai = new GoogleGenAI({ apiKey });

  // Parallel: these are independent, and serially they would exceed maxDuration.
  const results = await Promise.all(
    VARIANTS.map(async (variant) => {
      const started = Date.now();
      try {
        const response = await ai.models.generateContent({
          model: MODEL,
          contents: 'Reply with the single word "ok".',
          config: variant.config,
        });
        const candidate = response.candidates?.[0];
        const text = (candidate?.content?.parts ?? [])
          .filter((p) => !p.thought && typeof p.text === "string")
          .map((p) => p.text)
          .join("");
        return {
          variant: variant.name,
          ok: true,
          ms: Date.now() - started,
          finishReason: candidate?.finishReason ?? null,
          groundingChunks: candidate?.groundingMetadata?.groundingChunks?.length ?? 0,
          preview: text.slice(0, 120),
        };
      } catch (error) {
        // Google's message carries the field path that batch mode omits — the
        // whole reason this route exists. Keep it whole, just bounded.
        const message = error instanceof Error ? error.message : String(error);
        return {
          variant: variant.name,
          ok: false,
          ms: Date.now() - started,
          error: message.slice(0, 900),
        };
      }
    }),
  );

  const firstFailure = results.find((r) => !r.ok)?.variant ?? null;
  return Response.json(
    { model: MODEL, firstFailure, results },
    { headers: { "cache-control": "no-store" } },
  );
}
