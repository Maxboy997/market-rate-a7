"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutGrid, ArrowUpDown, TrendingUp, TrendingDown, ShoppingBag } from "lucide-react";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>("default");

  useEffect(() => {
    setMounted(true);
    fetch("https://openapi.programming-hero.com/api/bazardor/products", { cache: "no-store" })
      .then((res) => res.json())
      .then((resData) => {
        let list: any[] = [];
        if (Array.isArray(resData)) list = resData;
        else if (resData?.data && Array.isArray(resData.data)) list = resData.data;
        else if (resData?.products && Array.isArray(resData.products)) list = resData.products;

        setProducts(list);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  if (!mounted) return null;

  const getItemId = (item: any, idx: number) => item?.id || item?._id || item?.product_id || item?.slug || idx + 1;
  const getItemName = (item: any) => item?.nameBn || item?.name || item?.product_name || "পণ্য";
  const getItemPrice = (item: any) => {
    const marketMin = item?.markets?.[0]?.min;
    const priceVal = item?.price ?? item?.current_price ?? marketMin ?? 0;
    return Number(priceVal) || 0;
  };
  const getItemChange = (item: any) => {
    const changeVal = item?.dir?.pct ?? item?.change ?? item?.price_change ?? 0;
    return Number(changeVal) || 0;
  };
  const getItemUnit = (item: any) => item?.unit || "কেজি";

  const risers = [...products].sort((a, b) => getItemChange(b) - getItemChange(a)).slice(0, 6);
  const fallers = [...products].sort((a, b) => getItemChange(a) - getItemChange(b)).slice(0, 6);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "low-to-high") return getItemPrice(a) - getItemPrice(b);
    if (sortBy === "high-to-low") return getItemPrice(b) - getItemPrice(a);
    return 0;
  });

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">বাজারের তথ্য লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-12">
      {/* Hero / Banner Section */}
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

      {/* Section A — আজ দাম বেড়েছে ▲ */}
      {risers.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <TrendingUp className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-bold text-gray-800">আজ দাম বেড়েছে ▲</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {risers.map((item, idx) => {
              const id = getItemId(item, idx);
              const price = getItemPrice(item);
              const change = getItemChange(item);
              return (
                <Link
                  key={id}
                  href={`/product/${id}`}
                  className="bg-white p-4 rounded-xl border hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="text-3xl mb-2">{item?.emoji || "📈"}</div>
                    <h3 className="font-semibold text-gray-800 text-sm truncate">{getItemName(item)}</h3>
                    <p className="text-xs text-gray-500 mt-1">{price} টাকা / {getItemUnit(item)}</p>
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

      {/* Section B — আজ দাম কমেছে ▼ */}
      {fallers.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <TrendingDown className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">আজ দাম কমেছে ▼</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {fallers.map((item, idx) => {
              const id = getItemId(item, idx);
              const price = getItemPrice(item);
              const change = getItemChange(item);
              return (
                <Link
                  key={id}
                  href={`/product/${id}`}
                  className="bg-white p-4 rounded-xl border hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="text-3xl mb-2">{item?.emoji || "📉"}</div>
                    <h3 className="font-semibold text-gray-800 text-sm truncate">{getItemName(item)}</h3>
                    <p className="text-xs text-gray-500 mt-1">{price} টাকা / {getItemUnit(item)}</p>
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

      {/* Section C — সব পণ্য */}
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
              <option value="default">সর্টিং: ডিফল্ট</option>
              <option value="low-to-high">দাম: কম থেকে বেশি</option>
              <option value="high-to-low">দাম: বেশি থেকে কম</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {sortedProducts.map((item, idx) => {
            const id = getItemId(item, idx);
            const price = getItemPrice(item);
            const name = getItemName(item);
            const change = getItemChange(item);
            return (
              <Link
                key={id}
                href={`/product/${id}`}
                className="bg-white p-4 rounded-xl border hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="text-3xl mb-2">{item?.emoji || "🛒"}</div>
                  <h3 className="font-semibold text-gray-800 text-sm truncate">{String(name)}</h3>
                  <p className="text-xs text-gray-500 mt-1">{price} টাকা / {getItemUnit(item)}</p>
                </div>
                <div className="mt-3">
                  <span
                    className={`inline-block text-xs font-bold px-2 py-0.5 rounded ${
                      change >= 0 ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50"
                    }`}
                  >
                    {change >= 0 ? `▲ ${change}%` : `▼ ${Math.abs(change)}%`}
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