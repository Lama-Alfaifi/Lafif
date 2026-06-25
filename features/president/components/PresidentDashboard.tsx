"use client";

import { useState } from "react";

import Sidebar from "@/features/dashboard/components/Sidebar";

import PresidentStats from "./PresidentStats";
import JoinRequestsCard from "./JoinRequestsCard";
import CreateEventModal from "./CreateEventModal";
import ClubEventsTable from "./ClubEventsTable";
import EventAttendanceCard from "./EventAttendanceCard";

import usePresidentClub from "../hooks/usePresidentClub";

import {
  Plus,
  Search,
  Bell,
} from "lucide-react";

export default function PresidentDashboard() {
  const [showCreateEvent, setShowCreateEvent] =
    useState(false);

  const [selectedEventId, setSelectedEventId] =
    useState<string>();

  const { data, loading } =
    usePresidentClub();

  if (loading) {
    return (
      <main className="min-h-screen bg-[#EFE8F7] flex items-center justify-center">
        <p className="font-bold text-[#21166A]">
          جاري تحميل بيانات الرئيس...
        </p>
      </main>
    );
  }

  if (
  !data?.clubId ||
  !data?.universityId ||
  data.role !== "president"
  ) {
    return (
      <main className="min-h-screen bg-[#EFE8F7] flex items-center justify-center">
        <p className="font-bold text-[#21166A]">
          لا تملكين صلاحية دخول لوحة الرئيس.
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

          {/* Header */}
          <div className="flex items-center justify-between mb-7">

            <div className="flex items-center gap-4">

              <button
                className="
                  w-11 h-11
                  rounded-2xl
                  bg-white
                  shadow-md
                  flex
                  items-center
                  justify-center
                  relative
                "
              >
                <Bell
                  size={18}
                  className="text-[#21166A]"
                />

                <span
                  className="
                    absolute
                    top-2
                    right-2
                    w-2.5
                    h-2.5
                    bg-red-500
                    rounded-full
                  "
                />
              </button>

              <div
                className="
                  w-[300px]
                  h-12
                  rounded-2xl
                  bg-white
                  shadow-md
                  px-4
                  flex
                  items-center
                  gap-3
                "
              >
                <Search
                  size={18}
                  className="text-gray-400"
                />

                <input
                  placeholder="ابحث..."
                  className="
                    w-full
                    bg-transparent
                    outline-none
                    text-sm
                    text-right
                    placeholder:text-gray-300
                  "
                />
              </div>

            </div>

            <div className="text-right">

              <h1
                className="
                  text-3xl
                  font-black
                  text-[#21166A]
                "
              >
                لوحة رئيس النادي
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                {data.clubName}
              </p>

            </div>

          </div>

          {/* Stats */}
          <PresidentStats
            clubId={data.clubId}
          />

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

            {/* Left */}
            <div className="xl:col-span-8">

              {/* Join Requests */}
              <div className="bg-white rounded-[30px] p-5 shadow-lg">

                <div className="flex items-center justify-between mb-5">

                  <button
                    onClick={() =>
                      setShowCreateEvent(true)
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-2xl
                      bg-[#7C3AED]
                      text-white
                      px-5
                      py-3
                      text-sm
                      font-bold
                      hover:opacity-90
                      transition
                    "
                  >
                    <Plus size={18} />
                    إضافة فعالية
                  </button>

                  <h2
                    className="
                      text-xl
                      font-black
                      text-[#21166A]
                    "
                  >
                    طلبات الانضمام
                  </h2>

                </div>

                <JoinRequestsCard
                  clubId={data.clubId}
                  universityId={
                    data.universityId
                  }
                />

              </div>

              {/* Events Table */}
              <ClubEventsTable
                clubId={data.clubId}
                onSelectEvent={
                  setSelectedEventId
                }
              />

            </div>

            {/* Right */}
            <div className="xl:col-span-4">

              {/* Club Summary */}
              <div className="bg-white rounded-[30px] p-5 shadow-lg">

                <h2
                  className="
                    text-xl
                    font-black
                    text-[#21166A]
                    mb-5
                  "
                >
                  ملخص النادي
                </h2>

                <div className="space-y-4">

                  <div
                    className="
                      rounded-2xl
                      bg-[#F8F6FC]
                      border
                      border-[#EEE7F8]
                      p-4
                    "
                  >

                    <p className="text-sm text-gray-500">
                      النادي
                    </p>

                    <h3
                      className="
                        text-lg
                        font-black
                        text-[#21166A]
                        mt-1
                      "
                    >
                      {data.clubName}
                    </h3>

                  </div>

                  <div
                    className="
                      rounded-2xl
                      bg-[#F8F6FC]
                      border
                      border-[#EEE7F8]
                      p-4
                    "
                  >

                    <p className="text-sm text-gray-500">
                      الجامعة
                    </p>

                    <h3
                      className="
                        text-lg
                        font-black
                        text-[#21166A]
                        mt-1
                      "
                    >
                      {data.universityName}
                    </h3>

                  </div>

                  <div
                    className="
                      rounded-2xl
                      bg-[#F8F6FC]
                      border
                      border-[#EEE7F8]
                      p-4
                    "
                  >

                    <p className="text-sm text-gray-500">
                      حالة النادي
                    </p>

                    <h3
                      className="
                        text-lg
                        font-black
                        text-emerald-600
                        mt-1
                      "
                    >
                      نشط
                    </h3>

                  </div>

                </div>

              </div>

              {/* Attendance */}
              <EventAttendanceCard
                eventId={selectedEventId}
              />

            </div>

          </div>

        </section>

        <Sidebar />

      </div>

      {/* Modal */}
      {showCreateEvent && (

        <CreateEventModal
  onClose={() => setShowCreateEvent(false)}
  clubId={data.clubId}
  clubName={data.clubName || ""}
  universityId={data.universityId}
  universityName={data.universityName || ""}
/>

      )}

    </main>
  );
}