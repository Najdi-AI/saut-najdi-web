import { cookies } from "next/headers";
import { ADMIN_COOKIE, isValidSession } from "@/lib/adminAuth";
import { removeSubscriber } from "@/lib/newsletterStore";

/** One-click erasure — an unsubscribe request must never wait on tooling. */
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  if (!isValidSession((await cookies()).get(ADMIN_COOKIE)?.value)) {
    return new Response("Not Found", { status: 404 });
  }
  const form = await request.formData();
  const email = String(form.get("email") ?? "");
  if (email.length > 0 && email.length <= 254) {
    await removeSubscriber(email);
    console.log("[newsletter] removed one subscriber");
  }
  return new Response(null, { status: 303, headers: { Location: "/admin/subscribers" } });
}
