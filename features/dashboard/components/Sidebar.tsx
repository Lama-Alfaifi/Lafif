"use client";

import Link from "next/link";

import {
  LayoutDashboard,
  CalendarDays,
  Users,
  User,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside
      className="
        order-last
        w-[260px]
        h-screen
        bg-white
        border-r border-gray-200
        px-5
        py-5
        flex flex-col
        justify-between
      "
    >
      <div>
        {/* الشعار */}
        <h1
          className="
            text-[42px]
            font-black
            text-[#21166A]
            text-center
          "
        >
          لفيف
        </h1>

        {/* القائمة */}
        <div className="mt-10 flex flex-col gap-2">
          <Link
            href="/dashboard"
            className="
              flex items-center justify-between
              px-4 py-3
              rounded-2xl
              bg-[#EFE8F7]
              text-[#21166A]
              font-bold
              text-[15px]
            "
          >
            <LayoutDashboard size={18} />
            الرئيسية
          </Link>

          <Link
            href="/events"
            className="
              flex items-center justify-between
              px-4 py-3
              rounded-2xl
              text-[#6B7280]
              hover:bg-[#F3F0FA]
              hover:text-[#21166A]
              transition
              text-[15px]
              font-medium
            "
          >
            <CalendarDays size={18} />
            الفعاليات
          </Link>

          <Link
            href="/dashboard"
            className="
              flex items-center justify-between
              px-4 py-3
              rounded-2xl
              text-[#6B7280]
              hover:bg-[#F3F0FA]
              hover:text-[#21166A]
              transition
              text-[15px]
              font-medium
            "
          >
            <Users size={18} />
            الأندية
          </Link>

          <Link
            href="/profile"
            className="
              flex items-center justify-between
              px-4 py-3
              rounded-2xl
              text-[#6B7280]
              hover:bg-[#F3F0FA]
              hover:text-[#21166A]
              transition
              text-[15px]
              font-medium
            "
          >
            <User size={18} />
            حسابي
          </Link>
        </div>
      </div>

      {/* الإعدادات */}
      <div className="pb-10">
        <Link
          href="/settings"
          className="
            w-full
            flex items-center justify-between
            px-4 py-3
            rounded-2xl
            text-[#6B7280]
            hover:bg-[#F3F0FA]
            hover:text-[#21166A]
            transition
            text-[15px]
            font-medium
          "
        >
          <Settings size={18} />
          الإعدادات
        </Link>
      </div>
    </aside>
  );
}