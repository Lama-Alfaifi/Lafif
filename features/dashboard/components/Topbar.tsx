"use client";

import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { useAuth } from "@/features/auth/context/AuthContext";
import useNotifications from "@/features/notifications/hooks/useNotifications";

export default function Topbar() {
  const { profile } = useAuth();
  const { unreadCount } = useNotifications();

  const firstName = profile?.name?.split(" ")[0] ?? "بك";

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="px-8 py-4 flex items-center justify-between" dir="rtl">
        <div>
          <h1 className="text-xl font-black text-[#21166A]">
            أهلاً {firstName} 👋
          </h1>
          <p className="text-sm text-gray-400 mt-0.5 font-medium">
            اكتشف فعاليات وأندية جامعتك
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-[#F7F5FF] px-4 py-2.5 rounded-2xl border border-gray-100">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              placeholder="ابحث..."
              className="outline-none bg-transparent text-sm w-[140px] text-right"
              dir="rtl"
            />
          </div>

          <Link
            href="/notifications"
            className="relative w-10 h-10 rounded-2xl bg-[#F7F5FF] border border-gray-100 flex items-center justify-center hover:bg-[#EFE8F7] transition"
          >
            <Bell size={18} className="text-[#21166A]" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
