"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  CalendarDays,
  Users,
  User,
  Bell,
  LogOut,
} from "lucide-react";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/src/lib/firebase";
import useNotifications from "@/features/notifications/hooks/useNotifications";

const NAV = [
  { href: "/dashboard", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/events", label: "الفعاليات", icon: CalendarDays },
  { href: "/notifications", label: "الإشعارات", icon: Bell },
  { href: "/profile", label: "حسابي", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { unreadCount } = useNotifications();

  async function handleLogout() {
    await signOut(auth);
    router.push("/login");
  }

  return (
    <aside className="order-last w-[240px] h-screen bg-white border-r border-gray-100 px-4 py-5 flex flex-col justify-between">
      <div>
        <h1 className="text-[40px] font-black text-[#21166A] text-center">
          لفيف
        </h1>

        <nav className="mt-8 flex flex-col gap-1.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`
                  relative flex items-center justify-between px-4 py-3 rounded-2xl
                  text-[14px] font-bold transition-all
                  ${active
                    ? "bg-[#EFE8F7] text-[#21166A]"
                    : "text-[#6B7280] hover:bg-[#F3F0FA] hover:text-[#21166A]"
                  }
                `}
              >
                <span>{label}</span>
                <div className="relative">
                  <Icon size={18} />
                  {href === "/notifications" && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pb-8">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-[14px] font-bold text-red-400 hover:bg-red-50 hover:text-red-600 transition"
        >
          تسجيل الخروج
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
