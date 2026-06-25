"use client";

import type { EventItem } from "../types/event.types";

import useCalendar from "../hooks/useCalendar";

import {
  arabicDays,
  arabicMonths,
  getCalendarCells,
} from "../utils/calendar.utils";

type EventCalendarProps = {
  events: EventItem[];
  selectedEvent: EventItem | null;
  setSelectedEvent: (event: EventItem) => void;
};

export default function EventCalendar({
  events,
  selectedEvent,
  setSelectedEvent,
}: EventCalendarProps) {
  const {
    month,
    year,
    goNextMonth,
    goPrevMonth,
  } = useCalendar();

  const cells =
    getCalendarCells(year, month);

  function getEventsForDay(day: number) {
    return events.filter(
      (event) =>
        event.day === day &&
        event.month === month &&
        event.year === year
    );
  }

  return (
    <div className="bg-white rounded-[30px] p-5 shadow-lg">
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-2">
          <button
            onClick={goPrevMonth}
            className="
              w-9 h-9
              rounded-xl
              bg-[#F3F0FA]
              text-[#21166A]
              font-bold
            "
          >
            ‹
          </button>

          <button
            onClick={goNextMonth}
            className="
              w-9 h-9
              rounded-xl
              bg-[#F3F0FA]
              text-[#21166A]
              font-bold
            "
          >
            ›
          </button>
        </div>

        <h2 className="text-xl font-black text-[#21166A]">
          {arabicMonths[month - 1]} {year}
        </h2>

        <div className="flex gap-3 text-[11px] font-bold">
          <span className="flex items-center gap-1 text-emerald-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            عامة
          </span>

          <span className="flex items-center gap-1 text-red-500">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            للأعضاء فقط
          </span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-3">
        {arabicDays.map((day) => (
          <div
            key={day}
            className="text-center text-[11px] font-bold text-[#21166A]"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {cells.map((day, index) => {
          if (day === null) {
            return (
              <div
                key={`empty-${index}`}
                className="h-[58px]"
              />
            );
          }

          const dayEvents =
            getEventsForDay(day);

          const hasPublic =
            dayEvents.some(
              (event) => event.type === "public"
            );

          const hasMembers =
            dayEvents.some(
              (event) => event.type === "members"
            );

          return (
            <button
              key={day}
              onClick={() => {
                if (dayEvents[0]) {
                  setSelectedEvent(dayEvents[0]);
                }
              }}
              className={`
                h-[58px]
                rounded-2xl
                border
                p-2
                bg-[#F8F6FC]
                border-[#EEE7F8]
                hover:bg-white
                hover:shadow-md
                transition
                text-right
                ${
                  selectedEvent?.day === day &&
                  selectedEvent?.month === month &&
                  selectedEvent?.year === year
                    ? "ring-2 ring-[#7C3AED]/30"
                    : ""
                }
              `}
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-black text-[#21166A]">
                  {day}
                </span>

                <div className="flex gap-1">
                  {hasPublic && (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  )}

                  {hasMembers && (
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}