"use client";

import { CheckCheck, Bell, BellOff } from "lucide-react";

import Sidebar from "@/features/dashboard/components/Sidebar";
import useNotifications from "../hooks/useNotifications";
import type { Notification } from "../types/notification.types";

const TYPE_CONFIG: Record<
  Notification["type"],
  { label: string; color: string; dot: string }
> = {
  "join-approved": {
    label: "انضمام مقبول",
    color: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
  },
  "join-rejected": {
    label: "انضمام مرفوض",
    color: "bg-red-100 text-red-600",
    dot: "bg-red-500",
  },
  "president-assigned": {
    label: "تعيين رئيس",
    color: "bg-purple-100 text-purple-700",
    dot: "bg-purple-500",
  },
  general: {
    label: "عام",
    color: "bg-gray-100 text-gray-600",
    dot: "bg-gray-400",
  },
};

function timeAgo(ts?: { seconds: number } | null): string {
  if (!ts) return "";
  const diff = Math.floor(Date.now() / 1000 - ts.seconds);
  if (diff < 60) return "الآن";
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
  return `منذ ${Math.floor(diff / 86400)} يوم`;
}

export default function NotificationsPage() {
  const { notifications, loading, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  return (
    <main className="min-h-screen bg-[#EFE8F7] p-5 overflow-hidden">
      <div className="flex h-[calc(100vh-40px)] rounded-[36px] bg-white/60 backdrop-blur-xl border border-white/80 shadow-2xl overflow-hidden">
        <section className="flex-1 h-full overflow-y-auto p-7" dir="rtl">

          {/* Header */}
          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white shadow-md text-sm font-bold text-[#21166A] hover:bg-[#F3F0FA] transition"
                >
                  <CheckCheck size={16} />
                  تحديد الكل كمقروء
                </button>
              )}
            </div>

            <div className="text-right">
              <h1 className="text-3xl font-black text-[#21166A]">الإشعارات</h1>
              <p className="text-sm text-gray-500 mt-1">
                {unreadCount > 0
                  ? `${unreadCount} إشعار غير مقروء`
                  : "جميع الإشعارات مقروءة"}
              </p>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <p className="text-sm font-bold text-[#21166A]">
                جاري تحميل الإشعارات...
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="w-16 h-16 rounded-[24px] bg-[#F3F0FA] flex items-center justify-center">
                <BellOff size={28} className="text-[#7C3AED]" />
              </div>
              <p className="text-sm font-bold text-gray-500">
                لا توجد إشعارات حتى الآن
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((n) => {
                const cfg = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.general;
                return (
                  <div
                    key={n.id}
                    onClick={() => !n.isRead && markAsRead(n.id)}
                    className={`
                      flex items-start gap-4 p-5 rounded-[24px] border transition cursor-pointer
                      ${n.isRead
                        ? "bg-white border-[#F3F0FA]"
                        : "bg-[#FAF8FF] border-[#DDD5F8] shadow-sm"
                      }
                    `}
                  >
                    {/* Dot */}
                    <div className="mt-1 shrink-0">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          n.isRead ? "bg-gray-300" : cfg.dot
                        }`}
                      />
                    </div>

                    {/* Body */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${cfg.color}`}
                        >
                          {cfg.label}
                        </span>
                        <span className="text-xs text-gray-400 shrink-0">
                          {timeAgo(n.createdAt)}
                        </span>
                      </div>

                      <h3 className="text-sm font-black text-[#21166A] leading-5">
                        {n.title}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500 leading-6">
                        {n.message}
                      </p>
                    </div>

                    {/* Unread badge */}
                    {!n.isRead && (
                      <div className="shrink-0 mt-1">
                        <Bell size={14} className="text-[#7C3AED]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <Sidebar />
      </div>
    </main>
  );
}
