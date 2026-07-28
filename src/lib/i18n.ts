export type Locale = "ar" | "en";

export const locales: Locale[] = ["ar", "en"];

export function dirOf(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

/**
 * Path helpers. Arabic lives at the root (`/x`), English under `/en/x`.
 * `path` is always the locale-less form: "", "how-it-works", "demo", …
 */
export function localePath(locale: Locale, path: string): string {
  const clean = path.replace(/^\/+|\/+$/g, "");
  if (locale === "ar") return clean ? `/${clean}` : "/";
  return clean ? `/en/${clean}` : "/en";
}

/** The same page in the other language — used by the header switch. */
export function altLocale(locale: Locale): Locale {
  return locale === "ar" ? "en" : "ar";
}
