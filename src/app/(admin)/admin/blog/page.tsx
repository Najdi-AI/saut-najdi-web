import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, isValidSession } from "@/lib/adminAuth";
import { posts as codePosts } from "@/content/blog";
import { listPublished, listDrafts, getHiddenSlugs } from "@/lib/draftStore";

/**
 * Blog management — every post the site knows about, in every state, with the
 * levers beside each one.
 *
 * Three stores feed this view and the STATUS column is their merge, mirroring
 * exactly what lib/allPosts does for the public site: code posts are the
 * baseline, a dashboard record with the same slug overrides it, and the
 * hidden list removes a slug from the public site regardless of source.
 *
 * Renders inside the (admin) shell, which owns the width, nav and ground —
 * this page only lays panels on it.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

interface Row {
  slug: string;
  titleEn: string;
  titleAr: string;
  date: string;
  inCode: boolean;
  overridden: boolean;
  isDraft: boolean;
  hidden: boolean;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; published?: string; error?: string }>;
}) {
  if (!isValidSession((await cookies()).get(ADMIN_COOKIE)?.value)) redirect("/admin/login");
  const notice = await searchParams;

  const [published, drafts, hidden] = await Promise.all([
    listPublished(),
    listDrafts(),
    getHiddenSlugs(),
  ]);
  const hiddenSet = new Set(hidden);
  const publishedBySlug = new Map(published.map((p) => [p.slug, p]));

  const rows = new Map<string, Row>();
  for (const p of codePosts) {
    rows.set(p.slug, {
      slug: p.slug,
      titleEn: p.en.title,
      titleAr: p.ar.title,
      date: p.date,
      inCode: true,
      overridden: publishedBySlug.has(p.slug),
      isDraft: false,
      hidden: hiddenSet.has(p.slug),
    });
  }
  for (const p of published) {
    const existing = rows.get(p.slug);
    rows.set(p.slug, {
      slug: p.slug,
      titleEn: p.en?.title ?? "(untitled)",
      titleAr: p.ar?.title ?? "",
      date: p.date,
      inCode: existing?.inCode ?? false,
      overridden: existing?.inCode ?? false,
      isDraft: false,
      hidden: hiddenSet.has(p.slug),
    });
  }
  for (const d of drafts) {
    if (!rows.has(d.slug)) {
      rows.set(d.slug, {
        slug: d.slug,
        titleEn: d.en?.title ?? "(untitled draft)",
        titleAr: d.ar?.title ?? "",
        date: d.generatedAt?.slice(0, 10) ?? "",
        inCode: false,
        overridden: false,
        isDraft: true,
        hidden: false,
      });
    }
  }

  const all = [...rows.values()].sort((a, b) => b.date.localeCompare(a.date));

  // Display-only tallies for the summary chips row.
  const liveCount = all.filter((r) => !r.isDraft && !r.hidden).length;
  const draftCount = all.filter((r) => r.isDraft).length;
  const hiddenCount = all.filter((r) => r.hidden).length;

  const chip =
    "rounded-full border border-line bg-canvas px-2.5 py-0.5 text-body-sm text-ink/55";
  const pillLive =
    "rounded-full border border-ok/40 bg-ok/10 px-2.5 py-0.5 text-body-sm text-ok";
  const pillDraft =
    "rounded-full border border-brand-purple/40 bg-brand-purple/10 px-2.5 py-0.5 text-body-sm text-brand-purple";
  const pillHidden =
    "rounded-full border border-brand-red/40 bg-brand-red/10 px-2.5 py-0.5 text-body-sm text-brand-red";
  const btn =
    "rounded-full border border-line px-3 py-1 text-body-sm text-ink/75 transition hover:border-brand-purple hover:text-ink";
  const danger =
    "rounded-full border border-brand-red/50 px-3 py-1 text-body-sm text-brand-red transition hover:bg-brand-red hover:text-white";

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-h3 font-bold">Posts</h1>
          <p className="mt-1 text-body text-ink/50">
            Every post the site knows about — one row per post, levers alongside.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={chip}>{all.length} total</span>
          <span className={pillLive}>{liveCount} live</span>
          <span className={pillDraft}>{draftCount} draft</span>
          <span className={pillHidden}>{hiddenCount} hidden</span>
        </div>
      </div>

      {notice.published && (
        <p className="mt-6 rounded-xl border border-ok/40 bg-ok/10 p-3 text-body text-ok">
          Live now: <code>/blog/{notice.published}</code>
        </p>
      )}
      {notice.saved && (
        <p className="mt-6 rounded-xl border border-ok/40 bg-ok/10 p-3 text-body text-ok">
          Saved as draft: <code>{notice.saved}</code>
        </p>
      )}
      {notice.error && (
        <p className="mt-6 rounded-xl border border-brand-red/40 bg-brand-red/10 p-3 text-body text-brand-red">
          {notice.error}
        </p>
      )}

      <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface">
        {all.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16">
            <span aria-hidden className="flex h-8 items-end gap-1 opacity-40">
              <span className="w-1 rounded-full bg-brand-cyan" style={{ height: "40%" }} />
              <span className="w-1 rounded-full bg-brand-blue" style={{ height: "75%" }} />
              <span className="w-1 rounded-full bg-brand-purple" style={{ height: "100%" }} />
              <span className="w-1 rounded-full bg-brand-magenta" style={{ height: "65%" }} />
              <span className="w-1 rounded-full bg-brand-red" style={{ height: "45%" }} />
            </span>
            <p className="text-body text-ink/45">No posts yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] border-collapse text-body">
              <thead>
                <tr className="border-b border-line text-body-sm uppercase tracking-wider text-ink/40">
                  <th className="px-5 py-3 text-start font-medium">Post</th>
                  <th className="px-4 py-3 text-start font-medium">Date</th>
                  <th className="px-4 py-3 text-start font-medium">Status</th>
                  <th className="px-5 py-3 text-end font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {all.map((r) => (
                  <tr
                    key={r.slug}
                    className="border-b border-line/60 align-top transition last:border-0 hover:bg-ink/5"
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-ink">{r.titleEn}</div>
                      <div className="text-ink/60" dir="rtl">
                        {r.titleAr}
                      </div>
                      <code className="text-body-sm text-ink/40">{r.slug}</code>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-ink/60">{r.date}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {r.isDraft ? (
                          <span className={pillDraft}>draft</span>
                        ) : r.hidden ? (
                          <span className={pillHidden}>hidden</span>
                        ) : (
                          <span className={pillLive}>live</span>
                        )}
                        {r.inCode && <span className={chip}>code</span>}
                        {r.overridden && <span className={chip}>edited</span>}
                        {!r.inCode && !r.isDraft && <span className={chip}>dashboard</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        {!r.isDraft && !r.hidden && (
                          <a
                            href={`/blog/${r.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={btn}
                          >
                            View
                          </a>
                        )}
                        <a
                          href={`/admin/blog/editor?slug=${encodeURIComponent(r.slug)}`}
                          className={btn}
                        >
                          Edit
                        </a>
                        {r.isDraft ? (
                          <>
                            <form action="/admin/drafts/publish" method="post">
                              <input type="hidden" name="slug" value={r.slug} />
                              <button
                                type="submit"
                                className="btn-spectrum rounded-full px-4 py-1.5 text-body-sm font-semibold"
                              >
                                Publish
                              </button>
                            </form>
                            <form action="/admin/drafts/discard" method="post">
                              <input type="hidden" name="slug" value={r.slug} />
                              <button type="submit" className={danger}>
                                Delete
                              </button>
                            </form>
                          </>
                        ) : (
                          <>
                            <form action="/admin/blog/toggle" method="post">
                              <input type="hidden" name="slug" value={r.slug} />
                              <input type="hidden" name="to" value={r.hidden ? "show" : "hide"} />
                              <button type="submit" className={btn}>
                                {r.hidden ? "Show" : "Hide"}
                              </button>
                            </form>
                            {r.overridden && (
                              <form action="/admin/blog/revert" method="post">
                                <input type="hidden" name="slug" value={r.slug} />
                                <button
                                  type="submit"
                                  className={btn}
                                  title="Drop the dashboard edit and serve the code version"
                                >
                                  Revert to code
                                </button>
                              </form>
                            )}
                            {!r.inCode && (
                              <form action="/admin/blog/delete" method="post">
                                <input type="hidden" name="slug" value={r.slug} />
                                <button type="submit" className={danger}>
                                  Delete
                                </button>
                              </form>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-6 text-body-sm text-ink/45">
        Hide removes a post from the index, feeds and its own URL immediately; Show brings it back.
        Edits create a dashboard copy that overrides the code version — Revert drops the override.{" "}
        {"“"}code{"”"} posts ship inside the deployed bundle: they can be hidden or overridden here,
        but only a code change removes them permanently. Deleting a dashboard-only post removes it
        outright.
      </p>
    </div>
  );
}
