import "../globals.css";
import { Analytics } from "@vercel/analytics/react";
import { thmanyah } from "../fonts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatLauncher } from "@/components/ChatLauncher";

/**
 * Arabic root layout — Arabic is the default language and lives at the
 * root (blueprint §2.1). lang/dir are in the server-rendered HTML.
 */
export default function ArabicRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={thmanyah.variable}>
      <body className="font-sans">
        <Header locale="ar" />
        <main id="main">{children}</main>
        <Footer locale="ar" />
        <ChatLauncher locale="ar" />
        <Analytics />
      </body>
    </html>
  );
}
