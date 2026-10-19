"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutGrid, ArrowUpDown, ArrowLeft } from "lucide-react";

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug;
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    if (!slug) return;

    fetch("https://openapi.programming-hero.com/api/bazardor/products", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data || data?.products || [];
        const decodedSlug = decodeURIComponent(slug).toLowerCase();
        
        const filtered = list.filter((item: any) => {
          const itemCat = String(item?.category || item?.categoryNameBn || "").toLowerCase();
          return itemCat.includes(decodedSlug) || decodedSlug.includes(itemCat);
        });
        
        setProducts(filtered.length > 0 ? filtered : list.slice(0, 8));
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [slug]);

  const getPrice = (item: any) => {
    return item?.price ?? item?.current_price ?? item?.markets?.[0]?.min ?? 0;
  };

  const getChange = (item: any) => {
    const raw = item?.dir?.pct ?? item?.change ?? item?.price_change ?? 0;
    const num = parseFloat(String(raw).replace(/[^0-9.-]+/g, ""));
    return isNaN(num) ? 0 : num;
  };

  const sortedProducts = [...products].sort((a, b) => {
    const priceA = getPrice(a);
    const priceB = getPrice(b);

    if (sortBy === "low-to-high") return priceA - priceB;
    if (sortBy === "high-to-low") return priceB - priceA;
    return 0;
  });

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="text-gray-600">ক্যাটাগরির তথ্য লোড হচ্ছে...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি!</h2>
        <p className="text-sm text-gray-500">অন্য কোনো ক্যাটাগরি অথবা হোম পেজ দেখুন।</p>
        <button
          onClick={() => router.push("/")}
          className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
        >
          হোম পেজে ফিরে যান
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> পেছনে ফিরে যান
      </button>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-6 h-6 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900 capitalize">
            ক্যাটাগরি: {decodeURIComponent(slug)} ({products.length})
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg text-sm p-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="default">সাজান: ডিফল্ট</option>
            <option value="low-to-high">দাম: কম থেকে বেশি</option>
            <option value="high-to-low">দাম: বেশি থেকে কম</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {sortedProducts.map((item, idx) => {
          const price = getPrice(item);
          const changeVal = getChange(item);
          return (
            <Link
              key={item.id || idx}
              href={`/product/${item.id || item.slug || idx + 1}`}
              className="bg-white p-4 rounded-xl border hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="text-3xl mb-2">{item.emoji || "🛒"}</div>
                <h3 className="font-semibold text-gray-800 text-sm truncate">
                  {item.nameBn || item.name || "পণ্য"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {price} টাকা / {item.unit || "কেজি"}
                </p>
              </div>
              <div className="mt-3">
                <span
                  className={`inline-block text-xs font-bold px-2 py-0.5 rounded ${
                    changeVal >= 0 ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50"
                  }`}
                >
                  {changeVal > 0 ? `▲ ${changeVal}%` : changeVal < 0 ? `▼ ${Math.abs(changeVal)}%` : `— 0%`}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}