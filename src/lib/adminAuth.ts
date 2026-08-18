import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Session check for the draft-review page.
 *
 * The page used to take the key straight off the query string. That put the
 * secret in browser history, in Vercel's request logs, and in the URL bar of
 * anyone screen-sharing — and the page links out to source articles, so it
 * rode along in Referer headers too on any link that lacked `noreferrer`.
 *
 * Now the key is POSTed from a form at /admin/login, which sets an HttpOnly
 * cookie and redirects. It never touches a URL at all — not history, not a
 * referer header, not a server access log.
 *
 * The cookie stores a HASH of the key, not the key. The env secret then never
 * sits in a cookie jar or a proxy log. It is still a bearer token — whoever
 * holds it is in — but it is not the credential itself, so a leaked cookie
 * cannot be replayed against anything else that might use the same value.
 */
export const ADMIN_COOKIE = "sn_admin";

/**
 * Session-cookie lifetime: 30 days.
 *
 * This was 8 hours, reasoning that a review page deserves a short session.
 * That was wrong for how the page is actually used. The cron runs WEEKLY, so
 * an 8-hour cookie is guaranteed to be expired at every single review — which
 * forces the key back through the URL bar every week, writing it into browser
 * history and request logs each time. The short cookie made the secret leak
 * MORE often, not less.
 *
 * 30 days means the key is typed roughly monthly instead of weekly, and the
 * cookie remains HttpOnly + Secure + SameSite=Strict, scoped to /admin, and
 * holds only a hash. Rotating ADMIN_KEY invalidates every session immediately,
 * which is the real revocation lever.
 */
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export function sessionToken(key: string): string {
  return createHash("sha256").update(`sn-admin:${key}`).digest("hex");
}

/**
 * Constant-time compare. Overkill for a single-user page, but string `===`
 * on a secret is the kind of thing that gets copied into somewhere it matters.
 * Length is checked first because timingSafeEqual throws on a length mismatch.
 */
export function isValidSession(cookieValue: string | undefined): boolean {
  const key = process.env.ADMIN_KEY;
  // An unset ADMIN_KEY must deny, never default to open.
  if (!key || !cookieValue) return false;
  const a = Buffer.from(cookieValue);
  const b = Buffer.from(sessionToken(key));
  return a.length === b.length && timingSafeEqual(a, b);
}
