"use client";

import { Users, Star, BarChart2 } from "lucide-react";
import useEventAttendance from "../hooks/useEventAttendance";
import { useEventRating } from "@/features/events/hooks/useEventRating";

type Props = {
  eventId?: string;
  universityId?: string;
};

function StarDisplay({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={i < Math.round(value) ? "text-amber-400" : "text-gray-200"}
          fill={i < Math.round(value) ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}

function RatingBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-bold text-gray-400 w-3">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] font-bold text-gray-400 w-4 text-left">{value}</span>
    </div>
  );
}

function initials(name?: string) {
  if (!name) return "؟";
  return name.trim().split(" ").slice(0, 2).map((w) => w[0]).join("");
}

export default function EventAttendanceCard({ eventId, universityId }: Props) {
  const { attendance, loading: attLoading } = useEventAttendance(eventId, universityId);
  const { stats, loading: ratingLoading }   = useEventRating(undefined, eventId);

  if (!eventId) {
    return (
      <div className="bg-white rounded-[24px] p-5 shadow-md border border-gray-50 flex items-center justify-center min-h-[140px]" dir="rtl">
        <p className="text-xs font-bold text-gray-400">اختر فعالية من الجدول</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" dir="rtl">

      {/* Attendance card */}
      <div className="bg-white rounded-[24px] p-5 shadow-md border border-gray-50">
        <div className="flex items-center gap-2 mb-4">
          <Users size={15} className="text-[#7C3AED]" />
          <h2 className="text-base font-black text-[#21166A]">الحضور</h2>
          <span className="mr-auto text-xs text-gray-400 font-bold">{attendance.length} حاضر</span>
        </div>

        {attLoading ? (
          <p className="text-xs text-gray-400 font-bold text-center py-4">جاري التحميل...</p>
        ) : attendance.length === 0 ? (
          <p className="text-xs text-gray-400 font-bold text-center py-4">لا يوجد حضور مسجل</p>
        ) : (
          <div className="space-y-2 max-h-52 overflow-y-auto">
            {attendance.map((item) => (
              <div key={item.id} className="flex items-center gap-3 bg-[#F7F5FF] rounded-2xl px-4 py-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#21166A] to-[#7C3AED] text-white text-xs font-black flex items-center justify-center shrink-0">
                  {initials(item.userName)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-[#21166A] truncate">{item.userName || "مستخدم"}</p>
                  <p className="text-[10px] text-gray-400 truncate">{item.userEmail || "—"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rating stats card */}
      <div className="bg-white rounded-[24px] p-5 shadow-md border border-gray-50">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={15} className="text-amber-500" />
          <h2 className="text-base font-black text-[#21166A]">تقييمات الفعالية</h2>
        </div>

        {ratingLoading ? (
          <p className="text-xs text-gray-400 font-bold text-center py-4">جاري التحميل...</p>
        ) : !stats || stats.count === 0 ? (
          <p className="text-xs text-gray-400 font-bold text-center py-4">لا توجد تقييمات بعد</p>
        ) : (
          <div className="space-y-4">
            {/* Average */}
            <div className="flex items-center gap-3 bg-amber-50 rounded-2xl px-4 py-3">
              <span className="text-3xl font-black text-amber-600">{stats.avg}</span>
              <div>
                <StarDisplay value={stats.avg} />
                <p className="text-[10px] text-amber-500 font-bold mt-1">{stats.count} تقييم</p>
              </div>
            </div>

            {/* Distribution */}
            <div className="space-y-1.5">
              {([5,4,3,2,1] as const).map((star) => (
                <RatingBar
                  key={star}
                  label={String(star)}
                  value={stats.distribution[star]}
                  max={stats.count}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
