import { addSubscriber, isPlausibleEmail } from "@/lib/newsletterStore";

/**
 * Public newsletter signup — the only unauthenticated WRITE on the site, so
 * it is deliberately narrow:
 *
 * - HONEYPOT: the form ships a visually-hidden "website" field. Humans leave
 *   it empty; form-stuffing bots fill it. A filled honeypot gets the same
 *   redirect as success — telling a bot it was caught just trains it.
 * - Strict validation and normalisation before anything is stored.
 * - Dedup by construction (store keys on the email hash), so replaying the
 *   same address cannot grow the list.
 *
 * No client JS anywhere in the flow: plain form POST in, 303 to a bilingual
 * thank-you page out, which also keeps the blog pages fully static.
 */
export const dynamic = "force-dynamic";

const THANKS = { ar: "/newsletter/thanks", en: "/en/newsletter/thanks" } as const;

function redirectTo(path: string): Response {
  return new Response(null, { status: 303, headers: { Location: path } });
}

export async function POST(request: Request): Promise<Response> {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return new Response("Bad Request", { status: 400 });
  }

  const locale = String(form.get("locale")) === "en" ? "en" : "ar";
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const honeypot = String(form.get("website") ?? "");
  const source = String(form.get("source") ?? "").slice(0, 32) || "blog";

  // Bot filled the trap: pretend success, store nothing.
  if (honeypot) return redirectTo(THANKS[locale]);

  if (!isPlausibleEmail(email)) {
    /**
     * Rare by construction: the form's type="email" + required stops invalid
     * input before it ever submits, so whatever reaches this branch is a
     * script, not a person. Bounce it back to the form anchor — the blog
     * pages are static and cannot render a per-request error message, and
     * building dynamic rendering for an audience of bots would be backwards.
     */
    const back = request.headers.get("referer");
    const fallback = locale === "en" ? "/en/blog" : "/blog";
    const target = back && back.startsWith("https://sautnajdi.") ? back.split("#")[0] : fallback;
    return redirectTo(`${target}#newsletter`);
  }

  await addSubscriber({
    email,
    locale,
    source,
    subscribedAt: new Date().toISOString(),
  });
  console.log("[newsletter]", JSON.stringify({ source, locale }));

  return redirectTo(THANKS[locale]);
}
