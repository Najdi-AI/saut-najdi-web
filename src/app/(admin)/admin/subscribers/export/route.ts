import { cookies } from "next/headers";
import { ADMIN_COOKIE, isValidSession } from "@/lib/adminAuth";
import { listSubscribers } from "@/lib/newsletterStore";

/** CSV of the list, for whichever campaign sender is eventually chosen. */
export const dynamic = "force-dynamic";

function csvField(v: string): string {
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export async function GET(): Promise<Response> {
  if (!isValidSession((await cookies()).get(ADMIN_COOKIE)?.value)) {
    return new Response("Not Found", { status: 404 });
  }
  const rows = await listSubscribers();
  const csv = [
    "email,locale,source,subscribed_at",
    ...rows.map((s) =>
      [s.email, s.locale, s.source, s.subscribedAt].map(csvField).join(","),
    ),
  ].join("\r\n");

  return new Response(`\uFEFF${csv}`, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="sautnajdi-newsletter-${new Date().toISOString().slice(0, 10)}.csv"`,
      "cache-control": "no-store",
    },
  });
}
