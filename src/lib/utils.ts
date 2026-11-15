import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Class-name join for shadcn/ui components: clsx, then Tailwind conflict merge. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
