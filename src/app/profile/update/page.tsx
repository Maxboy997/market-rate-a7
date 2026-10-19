"use client";

import { useState } from "react";
import { useSession, authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import { User, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function UpdateProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [name, setName] = useState(session?.user?.name || "");
  const [loading, setLoading] = useState(false);

  if (isPending) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 text-center text-gray-600">
        লোড হচ্ছে...
      </div>
    );
  }

  if (!session) {
    router.push("/signin");
    return null;
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("নামের ঘরটি খালি রাখা যাবে না!");
      return;
    }

    setLoading(true);
    try {
      await authClient.updateUser({
        name: name.trim(),
      });
      toast.success("তথ্য সফলভাবে আপডেট করা হয়েছে!");
      router.push("/profile");
    } catch (err) {
      toast.error("তথ্য আপডেট করতে সমস্যা হয়েছে!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4 space-y-4">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> পেছনে ফিরে যান
      </button>

      <div className="bg-white rounded-2xl border p-6 shadow-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">তথ্য আপডেট করুন</h1>
          <p className="text-xs text-gray-500">আপনার প্রোফাইলের নাম পরিবর্তন করুন</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">পূর্ণ নাম</label>
            <div className="relative">
              <User className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="নতুন নাম লিখুন"
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow transition"
          >
            {loading ? "আপডেট হচ্ছে..." : "Update Information"}
          </button>
        </form>
      </div>
    </div>
  );
}