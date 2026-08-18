import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, isValidSession } from "@/lib/adminAuth";
import {
  listPending,
  listDrafts,
  clearPending,
  saveDraft,
  saveFailure,
  listFailures,
  addPending,
  getLastRun,
  type DraftPost,
} from "@/lib/draftStore";
import { collectDraftBatch } from "@/lib/newsDraft";

/**
 * The human gate. Nothing the weekly cron produces reaches the site until
 * someone reads it here and moves it into content/blog.ts by hand.
 *
 * That last step is deliberately manual. Auto-publishing generated news to a
 * live investor-facing site risks putting a hallucinated funding round under
 * the brand, and Google's scaled-content-abuse policy targets exactly this
 * pattern — so the automation stops at "researched and drafted", which is the
 * part that actually takes a person an afternoon.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

/** Renders the draft as the exact literal to paste into content/blog.ts. */
function asTypeScript(d: DraftPost): string {
  const block = (b: { t: string; text?: string; items?: string[] }) =>
    b.items
      ? `        { t: ${JSON.stringify(b.t)}, items: ${JSON.stringify(b.items)} },`
      : `        { t: ${JSON.stringify(b.t)}, text: ${JSON.stringify(b.text ?? "")} },`;
  const side = (k: "ar" | "en") =>
    `    ${k}: {
      title: ${JSON.stringify(d[k]?.title ?? "")},
      description: ${JSON.stringify(d[k]?.description ?? "")},
      excerpt: ${JSON.stringify(d[k]?.excerpt ?? "")},
      body: [
${d[k].body.map(block).join("\n")}
      ],
    },`;
  return `  {
    slug: ${JSON.stringify(d.slug)},
    date: ${JSON.stringify(d.generatedAt.slice(0, 10))},
    tags: { ar: ${JSON.stringify(d.tags?.ar ?? [])}, en: ${JSON.stringify(d.tags?.en ?? [])} },
${side("ar")}
${side("en")}
  },`;
}

/** Neutral chip — codes, counters, timestamps. */
const chip =
  "rounded-full border border-line bg-canvas px-2.5 py-0.5 text-body-sm text-ink/55";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ published?: string; error?: string }>;
}) {
  const notice = await searchParams;
  /**
   * No session -> the sign-in page, not a 404.
   *
   * This used to call notFound(), which meant "session expired", "wrong key"
   * and "page genuinely broken" were indistinguishable — the sole user of this
   * page hit all three and could not tell them apart. Hiding the route's
   * existence was never the real protection; the key is, and it is compared in
   * constant time.
   */
  if (!isValidSession((await cookies()).get(ADMIN_COOKIE)?.value)) redirect("/admin/login");

  // Collect on view, so a reviewer never has to wait for the next cron tick.
  const pending = await listPending();
  const stillPending: string[] = [];
  for (const p of pending) {
    const result = await collectDraftBatch(p);
    if (result.status === "pending") {
      stillPending.push(p.submittedAt);
    } else if (result.status === "advanced") {
      // Research done, write-up batch queued — still generating from the
      // reviewer's point of view.
      await clearPending(p.batchId);
      await addPending(result.next);
      stillPending.push(result.next.submittedAt);
    } else if (result.status === "failed") {
      /**
       * Recorded, not just rendered. This used to push the reason into a local
       * array — so the error appeared in the single render that collected it
       * and was gone on the next reload, leaving a page that said "Nothing
       * queued" after a failure. Keeping the batch id is what makes the failed
       * job inspectable at /admin/jobs afterwards.
       */
      await saveFailure({
        batchId: p.batchId,
        reason: result.reason,
        submittedAt: p.submittedAt,
        failedAt: new Date().toISOString(),
      });
      await clearPending(p.batchId);
    } else {
      await saveDraft(result.draft);
      await clearPending(p.batchId);
    }
  }

  const [drafts, failures, lastRun] = await Promise.all([
    listDrafts(),
    listFailures(),
    getLastRun(),
  ]);

  return (
    <div>
      <h1 className="text-h3 font-bold">Draft queue</h1>
      <p className="mt-1 text-body text-ink/50">
        Generated weekly — Publish puts a post live immediately; the paste-ready block under each
        draft promotes it into <code>src/content/blog.ts</code> permanently.
      </p>

      {notice.published && (
        <p className="mt-8 rounded-xl border border-ok/40 bg-ok/10 p-3 text-body text-ok">
          Published — live now at <code>/blog/{notice.published}</code> and{" "}
          <code>/en/blog/{notice.published}</code>.
        </p>
      )}
      {notice.error && (
        <p className="mt-8 rounded-xl border border-brand-red/40 bg-brand-red/10 p-3 text-body text-brand-red">
          Publish failed: {notice.error}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-2">
        <span className={chip}>{drafts.length} awaiting review</span>
        {stillPending.map((at) => (
          <span key={at} className={chip}>
            1 generating — submitted {at.slice(0, 16).replace("T", " ")}
          </span>
        ))}
        {/* Always shown, so a quiet queue can be told apart from a dead cron. */}
        <span className={chip}>
          {lastRun
            ? `cron last ran ${lastRun.at.slice(0, 16).replace("T", " ")}`
            : "cron has never run"}
        </span>
      </div>

      {failures.length > 0 && (
        <div className="mt-8 rounded-xl border border-brand-red/40 bg-brand-red/10 p-4">
          <h2 className="text-h5 text-brand-red">Recent failures</h2>
          <p className="mt-1 text-body-sm text-ink/45">
            These persist until superseded — inspect the job at <code>/admin/jobs</code>. Newest
            first, last 10 kept.
          </p>
          <ul className="mt-4 space-y-2">
            {failures.map((f) => (
              <li key={f.failedAt} className="text-body">
                <span className="text-ink/45">{f.failedAt.slice(0, 16).replace("T", " ")}</span>{" "}
                <span className="text-brand-red">{f.reason}</span>
                <br />
                <code className="text-body-sm text-ink/45">{f.batchId}</code>
              </li>
            ))}
          </ul>
        </div>
      )}

      {drafts.length === 0 && stillPending.length === 0 && (
        <div className="mt-8 rounded-2xl border border-line bg-surface py-16 text-center">
          {/* The brand waveform, muted — an idle console, not an error. */}
          <span aria-hidden className="mx-auto flex h-8 w-fit items-end gap-1">
            <span className="w-1 rounded-full bg-white/15" style={{ height: "40%" }} />
            <span className="w-1 rounded-full bg-white/15" style={{ height: "75%" }} />
            <span className="w-1 rounded-full bg-white/15" style={{ height: "100%" }} />
            <span className="w-1 rounded-full bg-white/15" style={{ height: "65%" }} />
            <span className="w-1 rounded-full bg-white/15" style={{ height: "45%" }} />
          </span>
          <p className="mt-4 text-body text-ink/45">
            Nothing awaiting review. The cron submits a new job every Monday.
          </p>
        </div>
      )}

      {drafts.map((d) => (
        <article
          key={d.slug}
          className="mt-8 rounded-2xl border border-line bg-surface p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-h4">{d.en?.title ?? "(missing English title)"}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <code className={chip}>{d.slug}</code>
              {/* The reject half of the review. Plain form: no client JS, and
                  a GET could be fired by a prefetch or a crawler. */}
              <a
                href={`/admin/blog/editor?slug=${encodeURIComponent(d.slug)}`}
                className="rounded-full border border-line px-3 py-1 text-body-sm text-ink/75 transition hover:border-brand-purple hover:text-ink"
              >
                Edit
              </a>
              <form action="/admin/drafts/publish" method="post">
                <input type="hidden" name="slug" value={d.slug} />
                <button
                  type="submit"
                  className="btn-spectrum rounded-full px-4 py-1.5 text-body-sm font-semibold"
                >
                  Publish
                </button>
              </form>
              <form action="/admin/drafts/discard" method="post">
                <input type="hidden" name="slug" value={d.slug} />
                <button
                  type="submit"
                  className="rounded-full border border-brand-red/50 px-3 py-1 text-body-sm text-brand-red transition hover:bg-brand-red hover:text-white"
                >
                  Discard
                </button>
              </form>
            </div>
          </div>
          <p className="mt-1 text-body-lg text-ink/75" dir="rtl">
            {d.ar?.title ?? "(missing Arabic title)"}
          </p>

          <h3 className="mt-8 text-h5">Sources</h3>
          <p className="mt-1 text-body-sm text-ink/45">
            Every cited URL, checked two ways: against the pages Google Search actually retrieved,
            and — failing that — by fetching the URL itself.{" "}
            <strong>verified</strong> that exact page was retrieved ·{" "}
            <strong>DOMAIN ONLY</strong> that publisher was retrieved, but not this URL ·{" "}
            <strong>LIVE, UNCONFIRMED</strong> no retrieval record, but the page exists ·{" "}
            <strong>DEAD LINK</strong> no retrieval record and the URL does not resolve — treat any
            claim resting on it as fabricated until you prove otherwise.
          </p>
          <ul className="mt-4 space-y-2">
            {(d.sources ?? []).map((s) => {
              const check = s.check ?? "none";
              return (
                <li key={s.url} className="flex flex-wrap items-center gap-2 text-body">
                  {/* Wording still carries the meaning; the pill colour only
                      echoes it — this gets read quickly, sometimes on a phone. */}
                  <span
                    className={
                      check === "url"
                        ? "rounded-full border border-ok/40 bg-ok/10 px-2.5 py-0.5 text-body-sm text-ok"
                        : check === "domain" || check === "live"
                          ? chip
                          : "rounded-full border border-brand-red/40 bg-brand-red/10 px-2.5 py-0.5 text-body-sm text-brand-red"
                    }
                  >
                    {check === "url"
                      ? "verified"
                      : check === "domain"
                        ? "DOMAIN ONLY"
                        : check === "live"
                          ? "LIVE, UNCONFIRMED"
                          : check === "dead"
                            ? "DEAD LINK"
                            : "UNVERIFIED"}
                  </span>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-blue transition hover:text-ink hover:underline"
                  >
                    {s.title}
                  </a>
                </li>
              );
            })}
          </ul>

          {(["ar", "en"] as const).map((loc) => (
            <div key={loc} className="mt-8" dir={loc === "ar" ? "rtl" : "ltr"}>
              <h3 className="text-h5">{loc === "ar" ? "العربية" : "English"}</h3>
              <p className="mt-1 text-body text-ink/60">{d[loc].description}</p>
              <div className="mt-4 space-y-3">
                {/* Defensive: one malformed draft must not 500 the whole queue
                    and lock the reviewer out of every other draft in it. */}
                {(Array.isArray(d[loc]?.body) ? d[loc].body : []).map((b, i) =>
                  b.items ? (
                    <ul key={i} className="ms-5 list-disc space-y-1">
                      {b.items.map((it) => (
                        <li key={it} className="text-body-lg text-ink/75">
                          {it}
                        </li>
                      ))}
                    </ul>
                  ) : b.t === "h2" ? (
                    <h4 key={i} className="text-h5 text-ink">
                      {b.text}
                    </h4>
                  ) : (
                    <p key={i} className="text-body-lg leading-relaxed text-ink/75">
                      {b.text}
                    </p>
                  ),
                )}
              </div>
            </div>
          ))}

          <h3 className="mt-8 text-h5">Paste into src/content/blog.ts</h3>
          <pre
            className="mt-2 max-h-80 overflow-auto rounded-xl border border-line bg-canvas p-4 text-body-sm text-ink/70"
            dir="ltr"
          >
            <code>{asTypeScript(d)}</code>
          </pre>
          <p className="mt-2 text-body-sm text-ink/45">
            Then generate a cover at <code>public/blog/{d.slug}.png</code> (1200×630) or the post
            will render a broken image.
          </p>
        </article>
      ))}
    </div>
  );
}
