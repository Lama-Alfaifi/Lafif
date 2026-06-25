"use client";

import { Clock, MapPin } from "lucide-react";
import type { EventItem } from "../types/event.types";

type Props = {
  events: EventItem[];
  selectedEvent: EventItem | null;
  onSelect: (event: EventItem) => void;
};

const MONTHS_AR = [
  "يناير","فبراير","مارس","أبريل","مايو","يونيو",
  "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر",
];

function sortUpcoming(events: EventItem[]): EventItem[] {
  const now = new Date();
  return [...events]
    .filter((e) => {
      const d = new Date(e.year ?? 2025, (e.month ?? 1) - 1, e.day);
      return d >= new Date(now.getFullYear(), now.getMonth(), now.getDate());
    })
    .sort((a, b) => {
      const da = new Date(a.year ?? 2025, (a.month ?? 1) - 1, a.day).getTime();
      const db = new Date(b.year ?? 2025, (b.month ?? 1) - 1, b.day).getTime();
      return da - db;
    })
    .slice(0, 5);
}

export default function UpcomingEvents({ events, selectedEvent, onSelect }: Props) {
  const upcoming = sortUpcoming(events);

  if (upcoming.length === 0) {
    return (
      <div className="bg-white rounded-[30px] p-5 shadow-lg mt-5">
        <h2 className="text-lg font-black text-[#21166A] mb-3">الفعاليات القادمة</h2>
        <p className="text-sm text-gray-400">لا توجد فعاليات قادمة حاليًا</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[30px] p-5 shadow-lg mt-5">
      <h2 className="text-lg font-black text-[#21166A] mb-4">الفعاليات القادمة</h2>

      <div className="space-y-2.5">
        {upcoming.map((event) => {
          const isSelected = selectedEvent?.id === event.id;
          const monthName = MONTHS_AR[(event.month ?? 1) - 1];

          return (
            <button
              key={event.id}
              onClick={() => onSelect(event)}
              className={`
                w-full text-right flex items-center gap-3 p-3 rounded-2xl transition
                ${isSelected
                  ? "bg-[#EFE8F7] ring-1 ring-[#7C3AED]/30"
                  : "bg-[#F8F6FC] hover:bg-[#EFE8F7]"
                }
              `}
            >
              {/* Date badge */}
              <div className="shrink-0 w-11 h-11 rounded-xl bg-[#21166A] flex flex-col items-center justify-center text-white">
                <span className="text-[11px] font-black leading-none">{event.day}</span>
                <span className="text-[9px] font-bold leading-none mt-0.5">
                  {monthName?.slice(0, 3)}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-[#21166A] leading-5 truncate">
                  {event.title}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-[10px] text-gray-400">
                    <Clock size={10} />
                    {event.time}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-gray-400">
                    <MapPin size={10} />
                    {event.place}
                  </span>
                </div>
              </div>

              <span
                className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-full ${
                  event.type === "public"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {event.type === "public" ? "عامة" : "أعضاء"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
