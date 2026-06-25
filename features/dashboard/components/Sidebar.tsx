"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  User,
  Bell,
  LogOut,
  Trophy,
  MessageSquare,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/src/lib/firebase";
import { useAuth } from "@/features/auth/context/AuthContext";
import useNotifications from "@/features/notifications/hooks/useNotifications";

const NAV = [
  { href: "/dashboard",     label: "الرئيسية",   icon: LayoutDashboard },
  { href: "/events",        label: "الفعاليات",  icon: CalendarDays },
  { href: "/leaderboard",   label: "الترتيب",    icon: Trophy },
  { href: "/notifications", label: "الإشعارات",  icon: Bell },
  { href: "/profile",       label: "حسابي",      icon: User },
  { href: "/support",       label: "الدعم",       icon: MessageSquare },
];

const ROLE_LABEL: Record<string, string> = {
  student:         "طالب",
  member:          "عضو",
  vicePresident:   "نائب الرئيس",
  president:       "رئيس النادي",
  universityAdmin: "مسؤول الجامعة",
  superAdmin:      "مسؤول النظام",
};

export default function Sidebar() {
  const pathname   = usePathname();
  const router     = useRouter();
  const { profile } = useAuth();
  const { unreadCount } = useNotifications();

  async function handleLogout() {
    await signOut(auth);
    router.push("/login");
  }

  const firstName = profile?.name?.split(" ")[0] ?? "";
  const roleLabel = ROLE_LABEL[profile?.role ?? ""] ?? "طالب";
  const initial   = (profile?.name ?? "؟")[0];

  return (
    <aside
      className="w-[240px] shrink-0 h-screen sticky top-0 bg-white border-l border-gray-100 shadow-sm flex flex-col"
      dir="rtl"
    >
      {/* Logo */}
      <div className="px-6 pt-7 pb-5 border-b border-gray-50">
        <span className="text-3xl font-black text-[#21166A]">لفيف</span>
        <p className="text-xs font-bold text-[#7C3AED] mt-1">منصة الأندية الجامعية</p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all
                ${active
                  ? "bg-[#EFE8F7] text-[#21166A]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-[#21166A]"
                }
              `}
            >
              <div className="relative shrink-0">
                <Icon size={18} />
                {href === "/notifications" && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              <span className="flex-1">{label}</span>
              {active && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#21166A] shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User card + Logout */}
      <div className="px-3 py-5 border-t border-gray-50 space-y-2">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#F7F5FF]">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#22C55E] flex items-center justify-center text-white text-sm font-black shrink-0">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-[#21166A] truncate">{firstName}</p>
            <p className="text-[10px] text-gray-400 truncate">{roleLabel}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-50 hover:text-red-600 transition"
        >
          <LogOut size={18} />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
