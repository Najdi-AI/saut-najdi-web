import { submitDraftBatch, collectDraftBatch } from "@/lib/newsDraft";
import { isAuthorizedCron } from "@/lib/cronAuth";
import {
  addPending,
  listPending,
  clearPending,
  saveDraft,
  saveFailure,
  setLastRun,
  listDrafts,
  deleteDraft,
  isRenderable,
} from "@/lib/draftStore";

/**
 * Weekly cron: collect whatever last week's job produced, then submit a new
 * one. Never publishes — everything lands in the review queue at /admin/drafts.
 *
 * Collect-then-submit in one handler, rather than two crons, because Vercel's
 * Hobby plan allows very few scheduled jobs and a batch always finishes long
 * before the next weekly tick. /admin/drafts collects too, so a reviewer who
 * checks mid-week is not waiting on this route.
 */
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function unauthorized(): Response {
  return Response.json({ error: "unauthorized" }, { status: 401 });
}

export async function GET(request: Request): Promise<Response> {
  /**
   * Vercel signs its own cron invocations with CRON_SECRET as a bearer token.
   * The route is a public URL, so without this check anyone could trigger a
   * paid model run at will. Compare against the env var, and refuse to run at
   * all if it is unset — an unset secret must not degrade to "open".
   */
  if (!isAuthorizedCron(request.headers.get("authorization"))) return unauthorized();

  const collected: string[] = [];
  const failed: string[] = [];
  let stillRunning = 0;

  for (const pending of await listPending()) {
    const result = await collectDraftBatch(pending);
    if (result.status === "pending") {
      stillRunning += 1;
      continue;
    }
    if (result.status === "advanced") {
      // Research landed and the write-up batch is now queued. Swap the pending
      // record for the new stage and count it as still running, so the guard
      // below does not start a second research job on top of it.
      await clearPending(pending.batchId);
      await addPending(result.next);
      stillRunning += 1;
      continue;
    }
    if (result.status === "failed") {
      failed.push(`${pending.batchId}: ${result.reason}`);
      // Persisted as well as returned — the cron's JSON response is seen by
      // nobody, so without this the reason dies with the request.
      await saveFailure({
        batchId: pending.batchId,
        reason: result.reason,
        submittedAt: pending.submittedAt,
        failedAt: new Date().toISOString(),
      });
      await clearPending(pending.batchId);
      continue;
    }
    await saveDraft(result.draft);
    await clearPending(pending.batchId);
    collected.push(result.draft.slug);
  }

  /**
   * Don't stack jobs. Research batches cost real money, and a manual re-trigger
   * while one is still running used to submit another every time — four
   * triggers, four paid jobs, three of them pointless.
   */
  let batchId: string | null = null;
  const at = new Date().toISOString();
  if (stillRunning === 0) {
    batchId = await submitDraftBatch();
    await addPending({ batchId, submittedAt: at });
  }
  // Recorded so the review page can distinguish "quiet week" from "the cron
  // has not run since <date>" — the two look identical without it.
  await setLastRun({ at, submitted: batchId ?? "(skipped — one already running)", collected: collected.length });

  /**
   * Log what is actually IN the queue, not just what this run did. The review
   * page also collects, so a draft can appear without any cron run reporting
   * it — which made "is there a draft waiting?" unanswerable from the logs.
   */
  /**
   * Sweep unrenderable drafts. One of these takes down the whole review page,
   * and the Discard button that would remove it lives on that page — so
   * without this the queue can wedge itself with no way out.
   */
  const swept: string[] = [];
  for (const d of await listDrafts()) {
    const broken = isRenderable(d);
    if (!broken) continue;
    await deleteDraft(d.slug);
    await saveFailure({
      batchId: "(stored draft)",
      reason: `discarded unrenderable draft: ${broken}`,
      submittedAt: d.generatedAt,
      failedAt: new Date().toISOString(),
    });
    swept.push(`${d.slug}: ${broken}`);
  }

  const queue = (await listDrafts()).map((d) => ({
    slug: d.slug,
    sources: d.sources.length,
    checks: d.sources.reduce<Record<string, number>>((acc, s) => {
      const k = s.check ?? "none";
      acc[k] = (acc[k] ?? 0) + 1;
      return acc;
    }, {}),
  }));

  const summary = { collected, failed, stillRunning, submitted: batchId, swept, queue };
  // Logged as well as returned: nobody reads a cron's HTTP response, so
  // without this the outcome is invisible until someone opens the queue.
  console.log("[draft-cron]", JSON.stringify(summary));
  return Response.json({ ok: true, ...summary });
}
