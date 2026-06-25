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
    <div className="w-full flex items-center justify-between gap-6">
      <div>
        <h1 className="text-2xl font-black text-[#0F172A]">
          أهلاً {firstName} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          اكتشف فعاليات وأندية جامعتك
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-3 bg-white px-4 py-3 rounded-2xl shadow-md border border-gray-100">
          <Search size={18} className="text-gray-400" />
          <input
            placeholder="ابحث..."
            className="outline-none bg-transparent text-sm w-[160px]"
          />
        </div>

        <Link
          href="/notifications"
          className="relative w-11 h-11 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <Bell size={20} className="text-[#0F172A]" />
          {unreadCount > 0 && (
            <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500" />
          )}
        </Link>
      </div>
    </div>
  );
}
