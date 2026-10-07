import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
      <h2 className="text-3xl font-black text-slate-900 mb-2">404 - Sayfa Bulunamadı</h2>
      <p className="text-sm text-slate-500 mb-6">
        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
