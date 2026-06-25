"use client";

import { useState } from "react";

import Sidebar from "@/features/dashboard/components/Sidebar";
import { useAuth } from "@/features/auth/context/AuthContext";
import useEvents from "../hooks/useEvents";

import EventCalendar from "./EventCalendar";
import EventDetailsCard from "./EventDetailsCard";
import PublicClubsCard from "./PublicClubsCard";
import AttendanceStats from "./AttendanceStats";
import UpcomingEvents from "./UpcomingEvents";
import type { EventItem } from "../types/event.types";

type Filter = "all" | "public" | "members";

const FILTER_OPTIONS: { value: Filter; label: string }[] = [
  { value: "all", label: "الكل" },
  { value: "public", label: "عامة" },
  { value: "members", label: "للأعضاء فقط" },
];

function applyFilter(events: EventItem[], filter: Filter): EventItem[] {
  if (filter === "all") return events;
  return events.filter((e) => e.type === filter);
}

export default function EventsPageContent() {
  const { profile } = useAuth();
  const { events, selectedEvent, setSelectedEvent, loading } = useEvents();
  const [filter, setFilter] = useState<Filter>("all");
  const [statsRefreshKey, setStatsRefreshKey] = useState(0);

  const filtered = applyFilter(events, filter);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#EFE8F7] p-5 overflow-hidden">
        <div className="flex h-[calc(100vh-40px)] rounded-[36px] bg-white/60 border border-white/80 shadow-2xl overflow-hidden items-center justify-center">
          <p className="font-bold text-[#21166A]">جاري تحميل الفعاليات...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#EFE8F7] p-5 overflow-hidden">
      <div className="flex h-[calc(100vh-40px)] rounded-[36px] bg-white/60 backdrop-blur-xl border border-white/80 shadow-2xl overflow-hidden">

        <section className="flex-1 h-full overflow-y-auto p-7">

          {/* Header */}
          <div className="flex items-start justify-between mb-6" dir="rtl">
            <div>
              <h1 className="text-2xl font-black text-[#21166A]">تقويم الفعاليات</h1>
              <p className="text-sm text-gray-500 mt-1">
                {profile?.universityName
                  ? `فعاليات ${profile.universityName}`
                  : "استكشف الورش والفعاليات القادمة"}
              </p>
            </div>

            {/* Filter bar */}
            <div className="flex gap-2">
              {FILTER_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`
                    px-4 py-2 rounded-2xl text-xs font-bold transition
                    ${filter === value
                      ? "bg-[#21166A] text-white shadow"
                      : "bg-white text-[#6B7280] hover:bg-[#F3F0FA] hover:text-[#21166A]"
                    }
                  `}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Empty state */}
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
              <div className="w-16 h-16 rounded-[24px] bg-[#F3F0FA] flex items-center justify-center text-3xl">
                📅
              </div>
              <div>
                <p className="text-sm font-black text-[#21166A]">لا توجد فعاليات حاليًا</p>
                <p className="text-xs text-gray-400 mt-1">
                  سيتم إضافة فعاليات جديدة قريبًا
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                <div className="xl:col-span-5">
                  <EventCalendar
                    events={filtered}
                    selectedEvent={selectedEvent}
                    setSelectedEvent={setSelectedEvent}
                  />

                  <UpcomingEvents
                    events={filtered}
                    selectedEvent={selectedEvent}
                    onSelect={setSelectedEvent}
                  />
                </div>

                <div className="xl:col-span-4">
                  <EventDetailsCard
                    selectedEvent={selectedEvent}
                    onStatsRefresh={() => setStatsRefreshKey((k) => k + 1)}
                  />
                </div>

                <div className="xl:col-span-3">
                  <PublicClubsCard events={filtered} />
                </div>
              </div>

              <AttendanceStats refreshKey={statsRefreshKey} />
            </>
          )}

        </section>

        <Sidebar />
      </div>
    </main>
  );
}
