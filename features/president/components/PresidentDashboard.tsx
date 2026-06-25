"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Bell } from "lucide-react";

import Sidebar from "@/features/dashboard/components/Sidebar";
import useNotifications from "@/features/notifications/hooks/useNotifications";

import PresidentStats from "./PresidentStats";
import JoinRequestsCard from "./JoinRequestsCard";
import CreateEventModal from "./CreateEventModal";
import ClubEventsTable from "./ClubEventsTable";
import EventAttendanceCard from "./EventAttendanceCard";
import usePresidentClub from "../hooks/usePresidentClub";

export default function PresidentDashboard() {
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>();
  const [eventsRefreshKey, setEventsRefreshKey] = useState(0);

  const { data, loading } = usePresidentClub();
  const { unreadCount } = useNotifications();

  if (loading) {
    return (
      <main className="min-h-screen bg-[#EFE8F7] flex items-center justify-center">
        <p className="font-bold text-[#21166A]">جاري تحميل البيانات...</p>
      </main>
    );
  }

  const isPresident = data?.role === "president";
  const isVP = data?.role === "vicePresident";
  const hasAccess = (isPresident || isVP) && !!data?.clubId && !!data?.universityId;

  if (!hasAccess) {
    return (
      <main className="min-h-screen bg-[#EFE8F7] flex items-center justify-center">
        <p className="font-bold text-[#21166A]">لا تملك صلاحية دخول لوحة الرئيس.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#EFE8F7] p-5 overflow-hidden">
      <div className="flex h-[calc(100vh-40px)] rounded-[36px] bg-white/60 backdrop-blur-xl border border-white/80 shadow-2xl overflow-hidden">
        <section className="flex-1 h-full overflow-y-auto p-7">

          {/* Header */}
          <div className="flex items-center justify-between mb-7" dir="rtl">
            <div>
              <h1 className="text-3xl font-black text-[#21166A]">
                {isVP ? "لوحة نائب الرئيس" : "لوحة رئيس النادي"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">{data!.clubName}</p>
            </div>

            <div className="flex items-center gap-3">
              {isPresident && (
                <button
                  onClick={() => setShowCreateEvent(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#7C3AED] text-white text-sm font-bold hover:opacity-90 transition shadow"
                >
                  <Plus size={16} />
                  فعالية جديدة
                </button>
              )}

              <Link
                href="/notifications"
                className="relative w-10 h-10 rounded-2xl bg-white shadow-md flex items-center justify-center hover:scale-105 transition"
              >
                <Bell size={18} className="text-[#21166A]" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full" />
                )}
              </Link>
            </div>
          </div>

          {/* Stats */}
          <PresidentStats
            clubId={data!.clubId!}
            universityId={data!.universityId!}
          />

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6">

            {/* Left column */}
            <div className="xl:col-span-8 space-y-6">

              {/* Join Requests */}
              <div className="bg-white rounded-[30px] p-5 shadow-lg" dir="rtl">
                <h2 className="text-xl font-black text-[#21166A] mb-5">طلبات الانضمام</h2>
                <JoinRequestsCard
                  clubId={data!.clubId!}
                  universityId={data!.universityId!}
                  canManage={isPresident}
                />
              </div>

              {/* Events table */}
              <ClubEventsTable
                clubId={data!.clubId!}
                universityId={data!.universityId!}
                refreshKey={eventsRefreshKey}
                onSelectEvent={setSelectedEventId}
                canDelete={isPresident}
              />

            </div>

            {/* Right column */}
            <div className="xl:col-span-4 space-y-5">

              {/* Club summary */}
              <div className="bg-white rounded-[30px] p-5 shadow-lg" dir="rtl">
                <h2 className="text-xl font-black text-[#21166A] mb-5">ملخص النادي</h2>

                <div className="space-y-3">
                  <div className="rounded-2xl bg-[#F8F6FC] border border-[#EEE7F8] p-4">
                    <p className="text-xs text-gray-400 mb-1">النادي</p>
                    <p className="text-sm font-black text-[#21166A]">{data!.clubName}</p>
                  </div>

                  <div className="rounded-2xl bg-[#F8F6FC] border border-[#EEE7F8] p-4">
                    <p className="text-xs text-gray-400 mb-1">الجامعة</p>
                    <p className="text-sm font-black text-[#21166A]">{data!.universityName}</p>
                  </div>

                  <div className="rounded-2xl bg-[#F8F6FC] border border-[#EEE7F8] p-4">
                    <p className="text-xs text-gray-400 mb-1">الدور</p>
                    <p className={`text-sm font-black ${isPresident ? "text-purple-700" : "text-cyan-700"}`}>
                      {isPresident ? "رئيس النادي" : "نائب الرئيس"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#F8F6FC] border border-[#EEE7F8] p-4">
                    <p className="text-xs text-gray-400 mb-1">حالة النادي</p>
                    <p className="text-sm font-black text-emerald-600">نشط</p>
                  </div>
                </div>
              </div>

              {/* Attendance */}
              <EventAttendanceCard
                eventId={selectedEventId}
                universityId={data!.universityId!}
              />

            </div>

          </div>

        </section>

        <Sidebar />
      </div>

      {/* Create event modal */}
      {showCreateEvent && (
        <CreateEventModal
          onClose={() => setShowCreateEvent(false)}
          onCreated={() => setEventsRefreshKey((k) => k + 1)}
          clubId={data!.clubId!}
          clubName={data!.clubName ?? ""}
          universityId={data!.universityId!}
          universityName={data!.universityName ?? ""}
        />
      )}
    </main>
  );
}
