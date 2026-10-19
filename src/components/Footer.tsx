import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-12 py-8 text-sm text-gray-600">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-gray-800">বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">
            সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
          </p>
        </div>
      </div>
    </footer>
  );
}