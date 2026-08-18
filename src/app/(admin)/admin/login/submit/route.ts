import { timingSafeEqual } from "node:crypto";
import { ADMIN_COOKIE, ADMIN_COOKIE_MAX_AGE, sessionToken } from "@/lib/adminAuth";

/**
 * Validates the posted key and starts a session.
 *
 * POST only, so the key never reaches a URL — no history entry, no referer, no
 * server access log. The reply is always a redirect, so the key is not echoed
 * back into the rendered page either.
 */
export const dynamic = "force-dynamic";

function redirectTo(path: string, cookie?: string): Response {
  const response = new Response(null, { status: 303, headers: { Location: path } });
  if (cookie) response.headers.append("Set-Cookie", cookie);
  return response;
}

export async function POST(request: Request): Promise<Response> {
  const expected = process.env.ADMIN_KEY;
  const form = await request.formData();
  const supplied = String(form.get("key") ?? "");

  // An unset ADMIN_KEY must deny, never default to open.
  if (!expected || !supplied) return redirectTo("/admin/login?error=1");

  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  // Length is checked first because timingSafeEqual throws on a mismatch.
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return redirectTo("/admin/login?error=1");
  }

  return redirectTo(
    "/admin/blog",
    [
      // The cookie holds a HASH of the key, so a leaked cookie cannot be
      // replayed against anything else using that secret.
      `${ADMIN_COOKIE}=${sessionToken(expected)}`,
      "HttpOnly",
      "Secure",
      "SameSite=Strict",
      // Scoped to /admin so it is never attached to a public page request.
      // `__Host-` is deliberately not used — that prefix requires Path=/.
      "Path=/admin",
      `Max-Age=${ADMIN_COOKIE_MAX_AGE}`,
    ].join("; "),
  );
}
