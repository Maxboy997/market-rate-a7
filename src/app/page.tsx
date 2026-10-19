"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutGrid, ArrowUpDown, TrendingUp, TrendingDown, ShoppingBag } from "lucide-react";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    fetch("https://openapi.programming-hero.com/api/bazardor/products", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data || data?.products || [];
        setProducts(list);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const getPrice = (item: any) => {
    return item?.price ?? item?.current_price ?? item?.markets?.[0]?.min ?? 0;
  };

  const getChange = (item: any) => {
    const raw = item?.dir?.pct ?? item?.change ?? item?.price_change ?? 0;
    const num = parseFloat(String(raw).replace(/[^0-9.-]+/g, ""));
    return isNaN(num) ? 0 : num;
  };

  const risers = [...products]
    .sort((a, b) => getChange(b) - getChange(a))
    .slice(0, 6);

  const fallers = [...products]
    .sort((a, b) => getChange(a) - getChange(b))
    .slice(0, 6);

  const sortedProducts = [...products].sort((a, b) => {
    const priceA = getPrice(a);
    const priceB = getPrice(b);

    if (sortBy === "low-to-high") return priceA - priceB;
    if (sortBy === "high-to-low") return priceB - priceA;
    return 0;
  });

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-12">
      <section className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-3xl p-6 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-green-200 shadow-sm">
        <div className="space-y-4 max-w-xl text-center md:text-left">
          <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            বিশ্বস্ত বাজার দর
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            প্রতিদিনের সঠিক বাজার মূল্য এক নজরে
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            চাল, ডাল, তেল থেকে শুরু করে সকল নিত্যপ্রয়োজনীয় পণ্যের বাজারভিত্তিক সঠিক দাম ও দৈনিক ওঠানামা জানুন খুব সহজেই।
          </p>
          <div className="pt-2">
            <a
              href="#sob-ponyo"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow transition"
            >
              <ShoppingBag className="w-5 h-5" /> সব পণ্য দেখুন
            </a>
          </div>
        </div>
        <div className="text-8xl md:text-9xl bg-white p-8 rounded-3xl shadow-md border">
          🛒
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800">জনপ্রিয় ক্যাটাগরি</h2>
        <div className="flex flex-wrap gap-2">
          {["চাল", "ডাল", "তেল", "মাছ", "মাংস", "সবজি", "মসলা"].map((cat, idx) => (
            <Link
              key={idx}
              href={`/category/${cat}`}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition shadow-sm"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {risers.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <TrendingUp className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-bold text-gray-800">আজ দাম বেড়েছে ▲</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {risers.map((item, idx) => {
              const price = getPrice(item);
              const change = getChange(item);
              return (
                <Link
                  key={item.id || idx}
                  href={`/product/${item.id || item.slug || idx + 1}`}
                  className="bg-white p-4 rounded-xl border hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="text-3xl mb-2">{item.emoji || "📈"}</div>
                    <h3 className="font-semibold text-gray-800 text-sm truncate">
                      {item.nameBn || item.name || "পণ্য"}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {price} টাকা / {item.unit || "কেজি"}
                    </p>
                  </div>
                  <div className="mt-3">
                    <span className="inline-block text-xs font-bold px-2 py-0.5 rounded text-red-600 bg-red-50">
                      ▲ {Math.abs(change)}%
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {fallers.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <TrendingDown className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">আজ দাম কমেছে ▼</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {fallers.map((item, idx) => {
              const price = getPrice(item);
              const change = getChange(item);
              return (
                <Link
                  key={item.id || idx}
                  href={`/product/${item.id || item.slug || idx + 1}`}
                  className="bg-white p-4 rounded-xl border hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="text-3xl mb-2">{item.emoji || "📉"}</div>
                    <h3 className="font-semibold text-gray-800 text-sm truncate">
                      {item.nameBn || item.name || "পণ্য"}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {price} টাকা / {item.unit || "কেজি"}
                    </p>
                  </div>
                  <div className="mt-3">
                    <span className="inline-block text-xs font-bold px-2 py-0.5 rounded text-green-600 bg-green-50">
                      ▼ {Math.abs(change)}%
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section id="sob-ponyo" className="space-y-6 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-3">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">সব পণ্য ({products.length})</h2>
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
      </section>
    </div>
  );
}