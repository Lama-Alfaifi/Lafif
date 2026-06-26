"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, CalendarDays, User, Bell,
  LogOut, Trophy, MessageSquare, Globe,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/src/lib/firebase";
import { useAuth } from "@/features/auth/context/AuthContext";
import useNotifications from "@/features/notifications/hooks/useNotifications";
import { useLanguage } from "@/features/i18n/context/LanguageContext";

const NAV_HREFS = [
  { href: "/dashboard",     key: "home",          icon: LayoutDashboard },
  { href: "/events",        key: "events",         icon: CalendarDays },
  { href: "/leaderboard",   key: "leaderboard",    icon: Trophy },
  { href: "/notifications", key: "notifications",  icon: Bell },
  { href: "/profile",       key: "profile",        icon: User },
  { href: "/support",       key: "support",        icon: MessageSquare },
] as const;

export default function Sidebar() {
  const pathname        = usePathname();
  const router          = useRouter();
  const { profile }     = useAuth();
  const { unreadCount } = useNotifications();
  const { t, lang, setLang, isRTL } = useLanguage();

  async function handleLogout() {
    await signOut(auth);
    router.push("/login");
  }

  const firstName = profile?.name?.split(" ")[0] ?? "";
  const roleLabel = t.roles[profile?.role as keyof typeof t.roles] ?? profile?.role ?? "";
  const initial   = (profile?.name ?? "?")[0];

  return (
    <aside
      className="w-[240px] shrink-0 h-screen sticky top-0 bg-white border-l border-gray-100 shadow-sm flex flex-col"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Logo + language toggle */}
      <div className="px-6 pt-7 pb-5 border-b border-gray-50 flex items-start justify-between">
        <div>
          <span className="text-3xl font-black text-[#21166A]">لفيف</span>
          <p className="text-xs font-bold text-[#7C3AED] mt-1">{t.nav.tagline}</p>
        </div>
        <button
          onClick={() => setLang(lang === "ar" ? "en" : "ar")}
          className="mt-1 flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#F7F5FF] hover:bg-[#EFE8F7] transition text-[11px] font-bold text-[#7C3AED]"
          title="Switch language"
        >
          <Globe size={12} />
          {t.lang}
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {NAV_HREFS.map(({ href, key, icon: Icon }) => {
          const active = pathname === href;
          const label  = t.nav[key];
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
          {t.nav.logout}
        </button>
      </div>
    </aside>
  );
}
