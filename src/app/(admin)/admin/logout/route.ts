import { ADMIN_COOKIE } from "@/lib/adminAuth";

/**
 * Sign out — expire the session cookie. POST-only so a prefetched link can
 * never log the reviewer out. This clears the browser cookie; a copied token
 * remains valid until its server expiry or an ADMIN_KEY rotation. There is no
 * per-session server revocation registry.
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
