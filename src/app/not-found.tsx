import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-4">
      <div className="text-6xl font-extrabold text-green-600">404</div>
      <h1 className="text-2xl font-bold text-gray-800">পেজটি পাওয়া যায়নি!</h1>
      <p className="text-gray-500 text-sm max-w-sm">
        আপনি যে পেজটি খুঁজছেন তা হয়তো মুছে ফেলা হয়েছে অথবা লিংকটি ভুল।
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
      >
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}