"use client";

import { useState } from "react";

import Sidebar from "@/features/dashboard/components/Sidebar";

import useEvents from "../hooks/useEvents";

import EventCalendar from "./EventCalendar";
import EventDetailsCard from "./EventDetailsCard";
import PublicClubsCard from "./PublicClubsCard";
import AttendanceStats from "./AttendanceStats";

export default function EventsPageContent() {

  const {
    events,
    selectedEvent,
    setSelectedEvent,
    loading,
  } = useEvents();

  const [statsRefreshKey, setStatsRefreshKey] =
    useState(0);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#EFE8F7] flex items-center justify-center">
        <p className="font-bold text-[#21166A]">
          جاري تحميل الفعاليات...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#EFE8F7] p-5 overflow-hidden">

      <div
        className="
          flex
          h-[calc(100vh-40px)]
          rounded-[36px]
          bg-white/60
          backdrop-blur-xl
          border border-white/80
          shadow-2xl
          overflow-hidden
        "
      >

        <section className="flex-1 h-full overflow-y-auto p-7">

          <div className="text-right mb-7">

            <h1 className="text-2xl font-black text-[#21166A]">
              تقويم الفعاليات
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              استكشف الورش والفعاليات القادمة
            </p>

          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">

            <div className="xl:col-span-5">

              <EventCalendar
                events={events}
                selectedEvent={selectedEvent}
                setSelectedEvent={setSelectedEvent}
              />

            </div>

            <div className="xl:col-span-4">

              <EventDetailsCard
                selectedEvent={selectedEvent}
                onStatsRefresh={() =>
                  setStatsRefreshKey(
                    (prev) => prev + 1
                  )
                }
              />

            </div>

            <div className="xl:col-span-3">

              <PublicClubsCard
                events={events}
              />

            </div>

          </div>

          <AttendanceStats
            refreshKey={statsRefreshKey}
          />

        </section>

        <Sidebar />

      </div>

    </main>
  );
}