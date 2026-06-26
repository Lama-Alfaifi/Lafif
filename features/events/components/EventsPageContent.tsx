"use client";

import { useState } from "react";
import Sidebar from "@/features/dashboard/components/Sidebar";
import { useAuth } from "@/features/auth/context/AuthContext";
import useEvents from "../hooks/useEvents";
import { useLanguage } from "@/features/i18n/context/LanguageContext";

import EventCalendar    from "./EventCalendar";
import EventDetailsCard from "./EventDetailsCard";
import PublicClubsCard  from "./PublicClubsCard";
import AttendanceStats  from "./AttendanceStats";
import UpcomingEvents   from "./UpcomingEvents";
import type { EventItem } from "../types/event.types";

type Filter = "all" | "public" | "members";

function applyFilter(events: EventItem[], filter: Filter): EventItem[] {
  if (filter === "all") return events;
  return events.filter((e) => e.type === filter);
}

export default function EventsPageContent() {
  const { profile } = useAuth();
  const { events, selectedEvent, setSelectedEvent, loading } = useEvents();
  const { t, dir }  = useLanguage();
  const [filter, setFilter] = useState<Filter>("all");
  const [statsRefreshKey, setStatsRefreshKey] = useState(0);

  const FILTER_OPTIONS: { value: Filter; label: string }[] = [
    { value: "all",     label: t.events.filterAll },
    { value: "public",  label: t.events.filterPub },
    { value: "members", label: t.events.filterMem },
  ];

  const filtered = applyFilter(events, filter);

  return (
    <div className="flex min-h-screen bg-[#F7F5FF]">
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Sticky page header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
          <div className="px-8 py-4 flex items-center justify-between" dir={dir}>
            <div>
              <p className="text-xs font-bold text-[#7C3AED] mb-0.5">{t.events.calendarTag}</p>
              <h1 className="text-xl font-black text-[#21166A]">
                {profile?.universityName
                  ? `${t.events.eventsOf} ${profile.universityName}`
                  : t.events.title}
              </h1>
            </div>

            <div className="flex gap-2">
              {FILTER_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`
                    px-4 py-2 rounded-2xl text-xs font-bold transition
                    ${filter === value
                      ? "bg-[#21166A] text-white shadow"
                      : "bg-[#F7F5FF] text-gray-500 border border-gray-100 hover:bg-[#EFE8F7] hover:text-[#21166A]"
                    }
                  `}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-8">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <p className="font-bold text-[#21166A]">{t.events.loadingEvt}</p>
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center" dir={dir}>
              <div className="w-16 h-16 rounded-[24px] bg-white shadow-md flex items-center justify-center text-3xl">📅</div>
              <div>
                <p className="text-sm font-black text-[#21166A]">{t.events.noEvents}</p>
                <p className="text-xs text-gray-400 mt-1">{t.events.noEventsSub}</p>
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
        </div>
      </div>

      <Sidebar />
    </div>
  );
}
