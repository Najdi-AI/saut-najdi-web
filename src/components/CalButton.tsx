"use client";

import { openCalModal } from "@/lib/cal";
import { localePath, type Locale } from "@/lib/i18n";

export function CalButton({
  calLink,
  locale,
  variant = "primary",
  children,
  className = "",
}: {
  calLink: string;
  locale: Locale;
  variant?: "primary" | "secondary" | "spectrum" | "link";
  children: React.ReactNode;
  className?: string;
}) {
  const thankYou = localePath(locale, "demo/thank-you");
  const base =
    variant === "primary"
      ? "btn-primary"
      : variant === "secondary"
        ? "btn-secondary"
        : variant === "spectrum"
          ? "btn-spectrum"
          : "inline-flex min-h-[44px] items-center font-medium text-brand-blue underline-offset-4 hover:underline";
  return (
    <button
      type="button"
      className={`${base} ${className}`}
      onClick={() => openCalModal(calLink, thankYou)}
    >
      {children}
    </button>
  );
}
