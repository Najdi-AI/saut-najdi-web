import { cookies } from "next/headers";
import { GoogleGenAI } from "@google/genai";
import { ADMIN_COOKIE, isValidSession } from "@/lib/adminAuth";

/**
 * Lists recent Gemini batch jobs straight from the API.
 *
 * Exists because the pipeline threw away its own evidence: a failed collection
 * deleted the pending record, and with it the batch id, so the job could no
 * longer be inspected. Asking the API what jobs exist recovers that regardless
 * of what we did or did not store — and it is the only view that shows the
 * per-request errors behind a job the UI has already discarded.
 *
 *   GET /admin/jobs           recent jobs with state and error counts
 *   GET /admin/jobs?full=1    also include the first error message per job
 */
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request): Promise<Response> {
  if (!isValidSession((await cookies()).get(ADMIN_COOKIE)?.value)) {
    return new Response("Not Found", { status: 404 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return Response.json({ error: "GEMINI_API_KEY is not set" }, { status: 500 });
  const ai = new GoogleGenAI({ apiKey });
  const full = new URL(request.url).searchParams.get("full") === "1";

  /**
   * list() returns job METADATA ONLY — `dest.inlinedResponses` is absent from
   * it, so reading results straight off the pager reports every job as having
   * zero requests. The results live behind a per-job get(), which is why this
   * fans out. Bounded to the most recent few so it stays inside maxDuration.
   */
  const names: string[] = [];
  const pager = await ai.batches.list({ config: { pageSize: 20 } });
  for await (const summary of pager) {
    if (summary.name) names.push(summary.name);
    if (names.length >= 8) break;
  }

  const jobs = await Promise.all(
    names.map(async (name) => {
    const job = await ai.batches.get({ name });
    const inlined = job.dest?.inlinedResponses ?? [];
    const errors = inlined.filter((r) => r.error);
    const grounded = inlined
      .map((r) => r.response?.candidates?.[0]?.groundingMetadata?.groundingChunks?.length ?? 0)
      .filter((n) => n > 0);

    const first = inlined.find((r) => !r.error)?.response?.candidates?.[0];
    return {
      name: job.name,
      displayName: job.displayName,
      state: job.state,
      createTime: job.createTime ?? null,
      requests: inlined.length,
      failed: errors.length,
      // The still-open question from the Gemini port: does grounding metadata
      // survive being combined with a response schema?
      groundedResponses: grounded.length,
      maxGroundingChunks: grounded.length ? Math.max(...grounded) : 0,
      firstFinishReason: first?.finishReason ?? null,
      ...(errors.length
        ? {
            firstError: String(errors[0]?.error?.message ?? "").slice(0, 400),
            /**
             * The whole error object, not just `.message`. Google's terse
             * "Request contains an invalid argument" is the message field;
             * `code`, `status` and especially `details[]` (FieldViolation)
             * are where the offending field is named. Reading only .message
             * is why three rounds of diagnosis had nothing to work with.
             */
            rawError: JSON.stringify(errors[0]?.error ?? {}).slice(0, 1500),
          }
        : {}),
      ...(full && first
        ? {
            sampleChunkUri:
              first.groundingMetadata?.groundingChunks?.[0]?.web?.uri?.slice(0, 120) ?? null,
            sampleChunkTitle: first.groundingMetadata?.groundingChunks?.[0]?.web?.title ?? null,
            textPreview: (first.content?.parts ?? [])
              .filter((p) => !p.thought && typeof p.text === "string")
              .map((p) => p.text)
              .join("")
              .slice(0, 200),
          }
        : {}),
    };
    }),
  );

  return Response.json({ count: jobs.length, jobs }, { headers: { "cache-control": "no-store" } });
}
