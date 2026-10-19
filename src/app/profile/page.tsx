"use client";

import { useSession } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import { User, Mail, Edit3 } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  if (isPending) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 text-center text-gray-600">
        প্রোফাইল তথ্য লোড হচ্ছে...
      </div>
    );
  }

  if (!session) {
    router.push("/signin");
    return null;
  }

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="bg-white rounded-2xl border p-6 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="bg-green-100 text-green-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
            <User className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">আমার প্রোফাইল</h1>
        </div>

        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center gap-3 text-sm">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">নাম</p>
              <p className="font-semibold text-gray-800">{session.user.name || "নাম দেওয়া নেই"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">ইমেইল</p>
              <p className="font-semibold text-gray-800">{session.user.email}</p>
            </div>
          </div>
        </div>

        <Link
          href="/profile/update"
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow transition"
        >
          <Edit3 className="w-4 h-4" /> তথ্য আপডেট করুন
        </Link>
      </div>
    </div>
  );
}