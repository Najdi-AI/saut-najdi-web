import Link from "next/link";
import { Waveform } from "@/components/Waveform";

/** Styled real 404 (blueprint §8.5) — Arabic tree. */
export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <Waveform bars={24} maxHeight={48} animate={false} className="opacity-60" />
      <h1 className="mt-6 text-h2">الصفحة غير موجودة</h1>
      <p className="mt-3 max-w-md text-body-lg text-ink/65">
        يمكن الرابط تغيّر أو انكتب غلط. تقدر ترجع للرئيسية أو تشوف كيف يشتغل صوت نجدي.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">الرئيسية</Link>
        <Link href="/how-it-works" className="btn-secondary">كيف يشتغل</Link>
        <Link href="/demo" className="btn-secondary">احجز عرضاً</Link>
      </div>
    </div>
  );
}
