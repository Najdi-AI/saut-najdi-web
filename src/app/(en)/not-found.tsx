import Link from "next/link";
import { Waveform } from "@/components/Waveform";

/** Styled real 404 (blueprint §8.5) — English tree. */
export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <Waveform bars={24} maxHeight={48} animate={false} className="opacity-60" />
      <h1 className="mt-6 text-h2">Page not found</h1>
      <p className="mt-3 max-w-md text-body-lg text-ink/65">
        The link may have changed or been mistyped. Head back home or see how
        Saut Najdi works.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/en" className="btn-primary">Home</Link>
        <Link href="/en/how-it-works" className="btn-secondary">How it works</Link>
        <Link href="/en/demo" className="btn-secondary">Book a demo</Link>
      </div>
    </div>
  );
}
