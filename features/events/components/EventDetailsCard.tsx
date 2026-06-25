"use client";

import { useState } from "react";

import useAttendance from "../hooks/useAttendance";
import { useAuth } from "@/features/auth/context/AuthContext";

import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Star,
} from "lucide-react";

import type { EventItem } from "../types/event.types";

import { registerAttendance } from "../services/registrations.service";

import {
  submitRating as submitEventRating,
} from "../services/ratings.service";

type EventDetailsCardProps = {
  selectedEvent: EventItem | null;
  onStatsRefresh?: () => void;
};

export default function EventDetailsCard({
  selectedEvent,
  onStatsRefresh,
}: EventDetailsCardProps) {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");

  const { profile } = useAuth();

  const {
    hasAttended,
    setHasAttended,
  } = useAttendance(selectedEvent?.id);

  if (!selectedEvent) {
    return null;
  }

  async function handleRegister() {
  if (!selectedEvent) {
    setMessage("اختاري فعالية أولاً.");
    return;
  }

  try {
    await registerAttendance(
      selectedEvent.id,
      selectedEvent.title,
      profile?.universityId || "",
      selectedEvent.clubId || "",
      selectedEvent.clubName || ""
    );

    setMessage("تم تسجيل حضورك بنجاح.");
    setHasAttended(true);
    onStatsRefresh?.();
  } catch (error: any) {
    setMessage(error.message);
  }
}

async function handleRating(value: number) {
  if (!selectedEvent) {
    setMessage("اختاري فعالية أولاً.");
    return;
  }

  if (!hasAttended) {
    setMessage("يجب تسجيل حضورك أولاً حتى تتمكن من التقييم.");
    return;
  }

  try {
    setRating(value);

    await submitEventRating(
      selectedEvent.id,
      selectedEvent.title,
      profile?.universityId || "",
      selectedEvent.clubId || "",
      selectedEvent.clubName || "",
      value
    );

    setMessage("تم حفظ تقييمك.");
    onStatsRefresh?.();
  } catch (error: any) {
    setMessage(error.message);
  }
}

  return (
    <div className="bg-white rounded-[30px] p-5 shadow-lg">
      <div className="flex items-center justify-between mb-5">
        <span
          className={`
            w-3 h-3 rounded-full
            ${
              selectedEvent.type === "public"
                ? "bg-emerald-500"
                : "bg-red-500"
            }
          `}
        />

        <h2 className="text-xl font-black text-[#21166A]">
          تفاصيل الفعالية
        </h2>
      </div>

      <div className="rounded-[24px] border border-[#EEE7F8] p-5">
        <h3 className="text-lg font-black text-[#21166A] leading-8">
          {selectedEvent.title}
        </h3>

        <div className="mt-5 space-y-3 text-sm text-gray-500">
          <p className="flex items-center gap-2">
            <CalendarDays size={15} />
            {selectedEvent.month}/{selectedEvent.day}/{selectedEvent.year}
          </p>

          <p className="flex items-center gap-2">
            <Clock size={15} />
            {selectedEvent.time}
          </p>

          <p className="flex items-center gap-2">
            <MapPin size={15} />
            {selectedEvent.place}
          </p>

          <p className="flex items-center gap-2">
            <Users size={15} />
            {selectedEvent.clubName}
          </p>
        </div>

        <p className="mt-5 text-sm text-gray-600 leading-7">
          {selectedEvent.description}
        </p>

        <button
          onClick={handleRegister}
          disabled={hasAttended}
          className={`
            mt-6 w-full rounded-2xl py-3 font-bold text-sm transition
            ${hasAttended
              ? "bg-emerald-100 text-emerald-700 cursor-default"
              : "bg-[#21166A] text-white hover:opacity-90"
            }
          `}
        >
          {hasAttended ? "✓ تم تسجيل حضورك" : "تسجيل حضور"}
        </button>

        <div className="mt-5">
          <p className="text-sm font-bold text-[#21166A] mb-3">
            تقييم الفعالية
          </p>

          {!hasAttended && (
            <p className="text-xs text-red-500 mb-3">
              يجب تسجيل حضورك أولاً حتى تتمكن من التقييم.
            </p>
          )}

          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                disabled={!hasAttended}
                onClick={() => handleRating(value)}
                className={`
                  w-10 h-10
                  rounded-xl
                  flex items-center justify-center
                  transition
                  ${
                    value <= rating
                      ? "bg-yellow-100 text-yellow-500"
                      : "bg-[#F3F0FA] text-gray-400"
                  }
                  ${
                    !hasAttended
                      ? "opacity-40 cursor-not-allowed"
                      : ""
                  }
                `}
              >
                <Star
                  size={20}
                  fill={
                    value <= rating
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>
            ))}
          </div>
        </div>

        {message && (
          <p className="mt-4 text-sm font-bold text-emerald-600">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}