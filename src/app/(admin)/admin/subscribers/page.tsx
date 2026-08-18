import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, isValidSession } from "@/lib/adminAuth";
import { listSubscribers } from "@/lib/newsletterStore";

/**
 * Newsletter subscribers — the list, a CSV export for whichever sender is
 * eventually used, and per-row Remove (PDPL erasure must be one click, not a
 * storage spelunk).
 */
export const dynamic = "force-dynamic";

export default async function Page() {
  if (!isValidSession((await cookies()).get(ADMIN_COOKIE)?.value)) redirect("/admin/login");
  const subscribers = await listSubscribers();

  const btn =
    "rounded-full border border-line px-3 py-1 text-body-sm text-ink/75 transition hover:border-brand-purple hover:text-ink";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-h3 font-bold">Subscribers</h1>
          <p className="text-body text-ink/50">
            Newsletter signups from the blog and homepage. Export as CSV to send a campaign.
          </p>
        </div>
        <a href="/admin/subscribers/export" className="btn-spectrum rounded-full px-5 py-2 text-body font-semibold">
          Download CSV
        </a>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <span className="rounded-full border border-line bg-canvas px-2.5 py-0.5 text-body-sm text-ink/55">
          {subscribers.length} total
        </span>
        <span className="rounded-full border border-line bg-canvas px-2.5 py-0.5 text-body-sm text-ink/55">
          {subscribers.filter((s) => s.locale === "ar").length} عربي
        </span>
        <span className="rounded-full border border-line bg-canvas px-2.5 py-0.5 text-body-sm text-ink/55">
          {subscribers.filter((s) => s.locale === "en").length} EN
        </span>
      </div>

      {subscribers.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-line bg-surface py-16 text-center">
          <p className="text-body text-ink/45">
            No subscribers yet. The form is live under the blog and the homepage blog section.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-surface p-5">
          <table className="w-full min-w-[640px] border-collapse text-body">
            <thead>
              <tr className="border-b border-line text-body-sm uppercase tracking-wider text-ink/40">
                <th className="py-2 pe-4 text-start">Email</th>
                <th className="py-2 pe-4 text-start">Locale</th>
                <th className="py-2 pe-4 text-start">Source</th>
                <th className="py-2 pe-4 text-start">Subscribed</th>
                <th className="py-2 text-start">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.email} className="border-b border-line/60 transition last:border-0 hover:bg-ink/5">
                  <td className="py-3 pe-4 font-medium" dir="ltr">
                    {s.email}
                  </td>
                  <td className="py-3 pe-4">{s.locale}</td>
                  <td className="py-3 pe-4 text-ink/60">{s.source}</td>
                  <td className="whitespace-nowrap py-3 pe-4 text-ink/60">
                    {s.subscribedAt.slice(0, 16).replace("T", " ")}
                  </td>
                  <td className="py-3">
                    <form action="/admin/subscribers/remove" method="post">
                      <input type="hidden" name="email" value={s.email} />
                      <button
                        type="submit"
                        className="rounded-full border border-brand-red/50 px-3 py-1 text-body-sm text-brand-red transition hover:bg-brand-red hover:text-white"
                      >
                        Remove
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-6 text-body-sm text-ink/45">
        Emails live in the site&apos;s own private store — no third-party list service. Remove
        honours an unsubscribe or erasure request immediately.{" "}
        <a href="/admin/blog" className={btn}>
          Back to posts
        </a>
      </p>
    </div>
  );
}
