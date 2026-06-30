"use client";

import { useState } from "react";
import { Trash2, Users, CalendarDays } from "lucide-react";
import useClubEvents   from "../hooks/useClubEvents";
import { deleteEvent } from "../services/createEvent.service";
import { useLanguage } from "@/features/i18n/context/LanguageContext";

type Props = {
  clubId: string;
  universityId: string;
  refreshKey?: number;
  onSelectEvent?: (eventId: string) => void;
  canDelete?: boolean;
};

export default function ClubEventsTable({
  clubId,
  universityId,
  refreshKey,
  onSelectEvent,
  canDelete = true,
}: Props) {
  const { events, loading, reloadEvents } = useClubEvents(clubId, universityId, refreshKey);
  const [deletingId, setDeletingId]       = useState<string | null>(null);
  const [confirmId, setConfirmId]         = useState<string | null>(null);
  const { t, dir } = useLanguage();

  async function handleDelete(eventId: string) {
    setDeletingId(eventId);
    try {
      await deleteEvent(eventId);
      await reloadEvents();
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-[30px] p-5 shadow-lg mt-6">
        <p className="text-sm text-gray-400 font-bold text-center py-6">{t.president.loadingEvents}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[30px] p-5 shadow-lg mt-6">
      <div className="flex items-center justify-between mb-5" dir={dir}>
        <p className="text-sm text-gray-400">{events.length} {t.president.evtCount}</p>
        <h2 className="text-xl font-black text-[#21166A]">{t.president.events}</h2>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
          <div className="w-12 h-12 rounded-[16px] bg-[#F3F0FA] flex items-center justify-center">
            <CalendarDays size={20} className="text-[#7C3AED]" />
          </div>
          <p className="text-sm font-bold text-gray-400">{t.president.noEvents}</p>
          <p className="text-xs text-gray-300">{t.president.noEventsSub}</p>
        </div>
      ) : (
        <div className="overflow-x-auto" dir={dir}>
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-[#EEE7F8]">
                <th className="pb-3 font-bold text-gray-400 text-xs">{t.president.evtTitle}</th>
                <th className="pb-3 font-bold text-gray-400 text-xs">{t.president.evtDate}</th>
                <th className="pb-3 font-bold text-gray-400 text-xs">{t.president.evtTime}</th>
                <th className="pb-3 font-bold text-gray-400 text-xs">{t.president.evtType}</th>
                <th className="pb-3 font-bold text-gray-400 text-xs">{t.president.evtActions}</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b border-[#F3F0FA] hover:bg-[#F8F6FC] transition">
                  <td className="py-4 font-black text-[#21166A] pr-1 max-w-[180px] truncate">
                    {event.title}
                  </td>

                  <td className="py-4 text-gray-500">
                    {event.day}/{event.month}/{event.year}
                  </td>

                  <td className="py-4 text-gray-500">{event.time}</td>

                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      event.type === "public"
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-red-100 text-red-500"
                    }`}>
                      {event.type === "public" ? t.president.evtPublic : t.president.evtMembers}
                    </span>
                  </td>

                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectEvent?.(event.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#21166A] text-white text-xs font-bold hover:opacity-90 transition"
                      >
                        <Users size={12} />
                        {t.president.viewAtt}
                      </button>

                      {canDelete && (
                        confirmId === event.id ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleDelete(event.id)}
                              disabled={deletingId === event.id}
                              className="px-3 py-1.5 rounded-xl bg-red-500 text-white text-xs font-bold hover:opacity-90 transition disabled:opacity-60"
                            >
                              {deletingId === event.id ? "..." : t.president.confirm}
                            </button>
                            <button
                              onClick={() => setConfirmId(null)}
                              className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-500 text-xs font-bold hover:bg-gray-200 transition"
                            >
                              {t.cancel}
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmId(event.id)}
                            className="w-8 h-8 rounded-xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
