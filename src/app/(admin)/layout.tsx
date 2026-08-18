import "../globals.css";
import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { thmanyah } from "../fonts";
import { ThemeScript } from "@/components/ThemeScript";
import { ThemeToggle } from "@/components/nav/ThemeToggle";
import { ADMIN_COOKIE, isValidSession } from "@/lib/adminAuth";

/**
 * Admin root layout — a console, not a marketing page.
 *
 * Its own ROOT route group so the admin stops inheriting the public site's
 * chrome: no marketing header or footer, no chat launcher, and deliberately
 * no GTM — analytics pixels have no business firing on an internal tool.
 * URLs are unchanged (route groups never appear in the path).
 *
 * Themed with the SAME semantic tokens and ThemeScript as the public site,
 * so light/dark follows one preference everywhere — the toggle here and the
 * one in the marketing header write the same choice. Under dark the semantic
 * tokens resolve to exactly the night palette, so dark is the console's
 * signature look and light is a first-class citizen.
 *
 * robots noindex lives HERE so no admin page can ever forget it.
 */
export const metadata: Metadata = {
  title: { default: "Saut Najdi Admin", template: "%s — Saut Najdi Admin" },
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F8FA" },
    { media: "(prefers-color-scheme: dark)", color: "#080D1C" },
  ],
};

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="rounded-full px-3 py-1.5 text-body text-ink/70 transition hover:bg-ink/5 hover:text-ink"
    >
      {children}
    </a>
  );
}

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const signedIn = isValidSession((await cookies()).get(ADMIN_COOKIE)?.value);

  return (
    <html lang="en" dir="ltr" className={thmanyah.variable} suppressHydrationWarning>
      <head>
        {/* Resolves the stored/system theme before paint — no flash, and the
            choice is SHARED with the public site via the same storage key. */}
        <ThemeScript />
      </head>
      <body className="min-h-screen bg-canvas font-sans text-ink">
        <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
            <a href="/admin/blog" className="flex items-center gap-2.5">
              {/* Miniature brand waveform, drawn inline so the shell has zero
                  asset dependencies. */}
              <span aria-hidden className="flex h-5 items-end gap-[3px]">
                <span className="w-[3px] rounded-full bg-brand-cyan" style={{ height: "40%" }} />
                <span className="w-[3px] rounded-full bg-brand-blue" style={{ height: "75%" }} />
                <span className="w-[3px] rounded-full bg-brand-purple" style={{ height: "100%" }} />
                <span className="w-[3px] rounded-full bg-brand-magenta" style={{ height: "65%" }} />
                <span className="w-[3px] rounded-full bg-brand-red" style={{ height: "45%" }} />
              </span>
              <span className="text-body-lg font-bold tracking-tight">
                Saut Najdi <span className="font-medium text-ink/50">Admin</span>
              </span>
            </a>

            {signedIn && (
              <nav className="flex items-center gap-1">
                <NavLink href="/admin/blog">Posts</NavLink>
                <NavLink href="/admin/drafts">Queue</NavLink>
                <NavLink href="/admin/subscribers">Subscribers</NavLink>
                <NavLink href="/admin/blog/editor">New post</NavLink>
                <span aria-hidden className="mx-1 h-5 w-px bg-line" />
                <ThemeToggle locale="en" />
                <NavLink href="/">View site ↗</NavLink>
                <form action="/admin/logout" method="post">
                  <button
                    type="submit"
                    className="rounded-full px-3 py-1.5 text-body text-ink/50 transition hover:bg-ink/5 hover:text-ink"
                  >
                    Sign out
                  </button>
                </form>
              </nav>
            )}
          </div>
          {/* The brand spectrum as a 2px signature under the bar. */}
          <div aria-hidden className="h-0.5 bg-brand-gradient opacity-70" />
        </header>

        <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">{children}</main>

        <footer className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
          <p className="border-t border-line pt-4 text-body-sm text-ink/35">
            Internal console — nothing here is public. Drafts generate Mondays 10:00 Riyadh.
          </p>
        </footer>
      </body>
    </html>
  );
}
