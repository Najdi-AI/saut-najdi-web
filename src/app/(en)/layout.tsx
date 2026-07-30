import "../globals.css";
import { Analytics } from "@vercel/analytics/react";
import { thmanyah } from "../fonts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatLauncher } from "@/components/ChatLauncher";

/**
 * English root layout — English is a separate piece of writing under /en,
 * never a machine translation (blueprint §2.1).
 */
export default function EnglishRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className={thmanyah.variable}>
      <body className="font-sans">
        <Header locale="en" />
        <main id="main">{children}</main>
        <Footer locale="en" />
        <ChatLauncher locale="en" />
        <Analytics />
      </body>
    </html>
  );
}
