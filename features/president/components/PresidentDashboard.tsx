"use client";

import { useState } from "react";
import { Plus, UserCheck } from "lucide-react";

import Sidebar               from "@/features/dashboard/components/Sidebar";
import PresidentStats        from "./PresidentStats";
import JoinRequestsCard      from "./JoinRequestsCard";
import CreateEventModal      from "./CreateEventModal";
import ClubEventsTable       from "./ClubEventsTable";
import EventAttendanceCard   from "./EventAttendanceCard";
import usePresidentClub      from "../hooks/usePresidentClub";
import { useAuth }           from "@/features/auth/context/AuthContext";
import { useLanguage }       from "@/features/i18n/context/LanguageContext";
import WeeklyChallengeCard   from "@/features/ai/components/WeeklyChallengeCard";
import PositionRequestCard   from "@/features/positions/components/PositionRequestCard";
import { usePendingVPRequests } from "@/features/positions/hooks/usePositionRequests";

export default function PresidentDashboard() {
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>();
  const [eventsRefreshKey, setEventsRefreshKey] = useState(0);

  const { user }          = useAuth();
  const { data, loading } = usePresidentClub();
  const { t, dir }        = useLanguage();
  const { requests: vpRequests, reload: reloadVP } =
    usePendingVPRequests(data?.clubId ?? undefined);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#F7F5FF] items-center justify-center">
        <p className="font-bold text-[#21166A]">{t.president.loading}</p>
      </div>
    );
  }

  const isPresident = data?.role === "president";
  const isVP        = data?.role === "vicePresident";
  const hasAccess   = (isPresident || isVP) && !!data?.clubId && !!data?.universityId;

  if (!hasAccess) {
    return (
      <div className="flex min-h-screen bg-[#F7F5FF] items-center justify-center">
        <p className="font-bold text-[#21166A]">{t.president.noAccess}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F7F5FF]">
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Sticky page header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
          <div className="px-8 py-4 flex items-center justify-between" dir={dir}>
            <div>
              <p className="text-xs font-bold text-[#7C3AED] mb-0.5">
                {isVP ? t.president.vpDashTag : t.president.dashTag}
              </p>
              <h1 className="text-xl font-black text-[#21166A]">{data!.clubName}</h1>
            </div>

            {isPresident && (
              <button
                onClick={() => setShowCreateEvent(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#21166A] text-white text-sm font-bold hover:opacity-90 transition shadow"
              >
                <Plus size={16} />
                {t.president.createEvent}
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-8">

          {/* Stats strip */}
          <PresidentStats
            clubId={data!.clubId!}
            universityId={data!.universityId!}
          />

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6">

            {/* Left column — requests + events */}
            <div className="xl:col-span-8 space-y-6">

              {/* Join Requests */}
              <div className="bg-white rounded-[24px] p-6 shadow-md border border-gray-50" dir={dir}>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-xs font-bold text-[#7C3AED]">{t.president.incomingReqs}</p>
                </div>
                <h2 className="text-lg font-black text-[#21166A] mb-5">{t.president.joinReqs}</h2>
                <JoinRequestsCard
                  clubId={data!.clubId!}
                  universityId={data!.universityId!}
                  canManage={isPresident}
                />
              </div>

              {/* VP Position Requests */}
              {isPresident && vpRequests.length > 0 && (
                <div className="bg-white rounded-[24px] p-6 shadow-md border border-gray-50" dir={dir}>
                  <div className="flex items-center gap-2 mb-5">
                    <UserCheck size={16} className="text-[#7C3AED]" />
                    <h2 className="text-lg font-black text-[#21166A]">{t.president.vpReqs}</h2>
                    <span className="mr-auto inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#EFE8F7] text-[#7C3AED] text-xs font-black">
                      {vpRequests.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {vpRequests.map((req) => (
                      <PositionRequestCard
                        key={req.id}
                        request={req}
                        reviewerUserId={user?.uid ?? ""}
                        onReviewed={reloadVP}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Events table */}
              <ClubEventsTable
                clubId={data!.clubId!}
                universityId={data!.universityId!}
                refreshKey={eventsRefreshKey}
                onSelectEvent={setSelectedEventId}
                canDelete={isPresident}
              />
            </div>

            {/* Right column — club summary + attendance */}
            <div className="xl:col-span-4 space-y-5">

              {/* Club summary card */}
              <div className="relative overflow-hidden bg-[#21166A] rounded-[24px] p-5 shadow-xl shadow-purple-900/20" dir={dir}>
                <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

                <div className="relative z-10">
                  <p className="text-xs font-bold text-white/50 mb-1">{t.president.clubSummary}</p>
                  <h2 className="text-base font-black text-white mb-4">{data!.clubName}</h2>

                  <div className="space-y-2.5">
                    {[
                      { label: t.president.university, value: data!.universityName },
                      { label: t.president.role,       value: isPresident ? t.president.dashTag : t.president.vpDashTag },
                      { label: t.president.status,     value: t.president.active },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between bg-white/10 rounded-2xl px-4 py-2.5">
                        <span className="text-xs text-white/50 font-bold">{label}</span>
                        <span className="text-xs font-black text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Weekly AI Challenge */}
              <WeeklyChallengeCard
                clubId={data!.clubId!}
                universityId={data!.universityId!}
                clubName={data!.clubName ?? ""}
                category="عام"
              />

              {/* Attendance */}
              <EventAttendanceCard
                eventId={selectedEventId}
                universityId={data!.universityId!}
              />
            </div>
          </div>
        </div>
      </div>

      <Sidebar />

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
    </div>
  );
}
