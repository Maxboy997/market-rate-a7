"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Store } from "lucide-react";
import { useSession } from "@/app/lib/auth-client";
import toast from "react-hot-toast";

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const { data: session, isPending } = useSession();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isPending && !session) {
      toast.error("Please login to view product details!");
      router.push("/signin");
      return;
    }

    if (!slug) return;

    fetch("https://openapi.programming-hero.com/api/bazardor/products")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data || data?.products || [];
        const found = list.find(
          (item: any, idx: number) => String(item?.id || item?.slug || idx + 1) === String(slug)
        );
        setProduct(found || null);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [slug, session, isPending, router]);

  if (isPending || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">ডেটা লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">পণ্যটি পাওয়া যায়নি!</h2>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          হোম পেজে ফিরে যান
        </button>
      </div>
    );
  }

  const name = product?.nameBn || product?.name || "পণ্য";
  const unit = product?.unit || "কেজি";
  const category = product?.categoryNameBn || product?.category || "সাধারণ";

  const markets = product?.markets || [];
  const minPrices = markets.map((m: any) => Number(m.min)).filter((v: number) => !isNaN(v));
  const maxPrices = markets.map((m: any) => Number(m.max)).filter((v: number) => !isNaN(v));

  const minPrice = minPrices.length > 0 ? Math.min(...minPrices) : (product?.price || 0);
  const maxPrice = maxPrices.length > 0 ? Math.max(...maxPrices) : (product?.price || 0);
  const avgPrice = minPrices.length > 0 ? Math.round(minPrices.reduce((a: number, b: number) => a + b, 0) / minPrices.length) : minPrice;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition"
      >
        <ArrowLeft className="w-5 h-5" /> পেছনে ফিরে যান
      </button>

      <div className="bg-white rounded-2xl border p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-4">
          <div className="text-5xl bg-green-50 p-4 rounded-2xl">🛒</div>
          <div>
            <span className="text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
              {category}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{name}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-b py-6 text-center">
          <div className="p-3 bg-gray-50 rounded-xl">
            সর্বনিম্ন মূল্য
            <p className="text-2xl font-bold text-green-600 mt-1">{minPrice} টাকা</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            গড় মূল্য
            <p className="text-2xl font-bold text-blue-600 mt-1">{avgPrice} টাকা</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            সর্বোচ্চ মূল্য
            <p className="text-2xl font-bold text-red-600 mt-1">{maxPrice} টাকা</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Store className="w-5 h-5 text-green-600" /> বাজারভিত্তিক আজকের দাম ({unit})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {markets.map((m: any, idx: number) => (
              <div key={idx} className="border p-4 rounded-xl flex justify-between items-center bg-gray-50/50">
                <div>
                  <h4 className="font-semibold text-gray-800">{m.market}</h4>
                  <p className="text-xs text-gray-500">{m.division}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-900">{m.min} - {m.max} টাকা</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailsPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-gray-600">লোড হচ্ছে...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}