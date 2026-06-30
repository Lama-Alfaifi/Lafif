"use client";

import { CheckCheck, BellOff, Bell } from "lucide-react";
import Sidebar from "@/features/dashboard/components/Sidebar";
import useNotifications from "../hooks/useNotifications";
import { useLanguage } from "@/features/i18n/context/LanguageContext";
import type { Notification } from "../types/notification.types";

function timeAgo(
  ts?: { seconds: number } | null,
  t?: { now: string; minAgo: string; hourAgo: string; dayAgo: string; timeAgo: string }
): string {
  if (!ts) return "";
  const diff = Math.floor(Date.now() / 1000 - ts.seconds);
  if (!t) {
    if (diff < 60)    return "الآن";
    if (diff < 3600)  return `منذ ${Math.floor(diff / 60)} دقيقة`;
    if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
    return `منذ ${Math.floor(diff / 86400)} يوم`;
  }
  if (diff < 60)    return t.now;
  if (diff < 3600)  return t.minAgo.replace("{n}", String(Math.floor(diff / 60)));
  if (diff < 86400) return t.hourAgo.replace("{n}", String(Math.floor(diff / 3600)));
  return t.dayAgo.replace("{n}", String(Math.floor(diff / 86400)));
}

export default function NotificationsPage() {
  const { notifications, loading, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const { t, dir } = useLanguage();

  const TYPE_CONFIG: Record<
    Notification["type"],
    { label: string; color: string; dot: string }
  > = {
    "join-approved":      { label: t.notifications.typeApproved,  color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
    "join-rejected":      { label: t.notifications.typeRejected,  color: "bg-red-100 text-red-600",         dot: "bg-red-500" },
    "president-assigned": { label: t.notifications.typePresident, color: "bg-purple-100 text-purple-700",   dot: "bg-purple-500" },
    general:              { label: t.notifications.typeGeneral,   color: "bg-gray-100 text-gray-600",       dot: "bg-gray-400" },
  };

  return (
    <div className="flex min-h-screen bg-[#F7F5FF]">
      <div className="flex-1 min-w-0 flex flex-col">

        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
          <div className="px-8 py-4 flex items-center justify-between" dir={dir}>
            <div>
              <p className="text-xs font-bold text-[#7C3AED] mb-0.5">{t.notifications.inbox}</p>
              <h1 className="text-xl font-black text-[#21166A]">{t.nav.notifications}</h1>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#EFE8F7] text-sm font-bold text-[#21166A] hover:bg-[#E0D8F5] transition"
              >
                <CheckCheck size={15} />
                {t.notifications.markAllRead}
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-8">

          {unreadCount > 0 && (
            <div
              className="mb-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-purple-100 shadow-sm text-xs font-bold text-[#7C3AED]"
              dir={dir}
            >
              <Bell size={12} />
              {t.notifications.unreadBadge.replace("{n}", String(unreadCount))}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <p className="font-bold text-[#21166A]">{t.notifications.loading}</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="w-16 h-16 rounded-[24px] bg-white shadow-md flex items-center justify-center">
                <BellOff size={24} className="text-[#7C3AED]" />
              </div>
              <p className="text-sm font-bold text-gray-400">{t.notifications.empty}</p>
            </div>
          ) : (
            <div className="max-w-2xl space-y-3" dir={dir}>
              {notifications.map((n) => {
                const cfg = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.general;
                return (
                  <div
                    key={n.id}
                    onClick={() => !n.isRead && markAsRead(n.id)}
                    className={`
                      flex items-start gap-4 p-5 rounded-[24px] border transition-all cursor-pointer
                      hover:-translate-y-0.5 hover:shadow-md
                      ${n.isRead
                        ? "bg-white border-gray-100"
                        : "bg-white border-purple-100 shadow-sm"
                      }
                    `}
                  >
                    <div
                      className={`mt-1.5 shrink-0 w-2.5 h-2.5 rounded-full ${
                        n.isRead ? "bg-gray-200" : cfg.dot
                      }`}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${cfg.color}`}>
                          {cfg.label}
                        </span>
                        <span className="text-xs text-gray-400 shrink-0">
                          {timeAgo(n.createdAt, t.notifications)}
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-[#21166A] leading-5">{n.title}</h3>
                      <p className="mt-1 text-xs text-gray-500 leading-6">{n.message}</p>
                    </div>

                    {!n.isRead && (
                      <Bell size={13} className="text-[#7C3AED] shrink-0 mt-1" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Sidebar />
    </div>
  );
}
