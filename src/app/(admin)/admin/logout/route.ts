import { ADMIN_COOKIE } from "@/lib/adminAuth";

/**
 * Sign out — expire the session cookie. POST-only so a prefetched link can
 * never log the reviewer out. Nothing server-side to revoke: the cookie holds
 * a hash of the current key, so clearing it locally IS the sign-out, and
 * rotating ADMIN_KEY remains the global kill switch.
 */
export const dynamic = "force-dynamic";

export async function POST(): Promise<Response> {
  const response = new Response(null, {
    status: 303,
    headers: { Location: "/admin/login" },
  });
  response.headers.append(
    "Set-Cookie",
    `${ADMIN_COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/admin; Max-Age=0`,
  );
  return response;
}
