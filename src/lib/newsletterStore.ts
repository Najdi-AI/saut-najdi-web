import { createHash } from "node:crypto";
import { put, list, del, get } from "@vercel/blob";

/**
 * Newsletter subscribers, stored in the site's own PRIVATE Blob store.
 *
 * Deliberately not a third-party list service: the site's whole privacy
 * pitch is Gulf-resident data with named processors, and shipping visitor
 * emails to a US marketing platform would contradict the page that says so.
 * Collection is the hard part worth owning; when a campaign is actually sent,
 * the admin page exports CSV for whatever sender is chosen then.
 *
 * The blob KEY is a hash of the normalised email, which buys three things at
 * once: resubmitting the same address overwrites instead of duplicating, the
 * address itself never appears in storage paths or listing output, and
 * deletion by email needs no scan.
 */

const PREFIX = "newsletter/subscribers/";

export interface Subscriber {
  email: string;
  /** Which locale's form they used — send them that language. */
  locale: "ar" | "en";
  /** Where on the site they signed up (blog-index, blog-post, home). */
  source: string;
  subscribedAt: string;
}

function keyOf(email: string): string {
  const normalised = email.trim().toLowerCase();
  return `${PREFIX}${createHash("sha256").update(normalised).digest("hex")}.json`;
}

/** Conservative shape check — the real gate is the browser + server regex. */
export function isPlausibleEmail(email: string): boolean {
  return /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,24}$/.test(email) && email.length <= 254;
}

export async function addSubscriber(s: Subscriber): Promise<void> {
  await put(keyOf(s.email), JSON.stringify(s, null, 2), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true, // resubscribe = harmless overwrite, never a duplicate
  });
}

export async function listSubscribers(): Promise<Subscriber[]> {
  const { blobs } = await list({ prefix: PREFIX });
  const out = await Promise.all(
    blobs.map(async (b) => {
      const result = await get(b.pathname, { access: "private" });
      if (!result || result.statusCode !== 200 || !result.stream) return null;
      return (await new Response(result.stream).json()) as Subscriber;
    }),
  );
  return out
    .filter((s): s is Subscriber => s !== null && typeof s.email === "string")
    .sort((a, b) => b.subscribedAt.localeCompare(a.subscribedAt));
}

/** PDPL erasure: removing a subscriber must be as easy as adding one. */
export async function removeSubscriber(email: string): Promise<void> {
  const { blobs } = await list({ prefix: keyOf(email) });
  await Promise.all(blobs.map((b) => del(b.pathname)));
}
