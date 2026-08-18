import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, isValidSession } from "@/lib/adminAuth";

/**
 * Sign-in for the draft queue.
 *
 * Replaces `/admin/enter?key=…`, which was wrong twice over. Practically, it
 * meant three completely different states — no session, expired session, wrong
 * key — all rendered as the same anonymous 404, and the only real user of this
 * page hit all three without ever being told which. Securely, it put the key in
 * the URL: browser history, server logs, and the address bar of anyone
 * screen-sharing.
 *
 * A POST form fixes both. The key travels in a request body, and the page can
 * say "that key was not accepted" without telling an anonymous visitor
 * anything they could not already guess — the protection is the key itself,
 * compared in constant time, not the secrecy of this URL.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  // Already signed in? Skip the form.
  if (isValidSession((await cookies()).get(ADMIN_COOKIE)?.value)) redirect("/admin/blog");
  const failed = (await searchParams).error === "1";

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6">
        {/* The brand waveform, echoing the shell's mark. */}
        <span aria-hidden className="flex h-7 items-end gap-[3px]">
          <span className="w-1 rounded-full bg-brand-cyan" style={{ height: "40%" }} />
          <span className="w-1 rounded-full bg-brand-blue" style={{ height: "75%" }} />
          <span className="w-1 rounded-full bg-brand-purple" style={{ height: "100%" }} />
          <span className="w-1 rounded-full bg-brand-magenta" style={{ height: "65%" }} />
          <span className="w-1 rounded-full bg-brand-red" style={{ height: "45%" }} />
        </span>

        <h1 className="mt-4 text-h3 font-bold">Sign in</h1>
        <p className="mt-1 text-body text-ink/50">
          Blog manager and draft queue. Sign in with the admin key.
        </p>

        <form action="/admin/login/submit" method="post" className="mt-6">
          <label htmlFor="key" className="text-body-sm text-ink/45">
            Admin key
          </label>
          <input
            id="key"
            name="key"
            type="password"
            autoComplete="current-password"
            autoFocus
            required
            className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2 text-body text-ink outline-none transition focus:border-brand-purple placeholder:text-ink/30"
          />
          {failed && (
            <div className="mt-4 rounded-xl border border-brand-red/40 bg-brand-red/10 p-3 text-body text-brand-red">
              That key was not accepted. Check for a trailing space when pasting.
            </div>
          )}
          <button
            type="submit"
            className="btn-spectrum mt-5 w-full rounded-full px-5 py-2 text-body font-semibold"
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 border-t border-line pt-4 text-body-sm text-ink/45">
          The key is stored only in Vercel and is marked sensitive, so it cannot be recovered — if
          it is lost, set a new value and redeploy. Sessions last 30 days.
        </p>
      </div>
    </div>
  );
}
