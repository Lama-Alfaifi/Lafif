"use client";

import { useEffect } from "react";

import {
  Users,
  Star,
  MessageCircle,
} from "lucide-react";

import useEventStats from "../hooks/useEventStats";

type AttendanceStatsProps = {
  refreshKey?: number;
};

export default function AttendanceStats({
  refreshKey,
}: AttendanceStatsProps) {
  const {
    stats,
    loading,
    refreshStats,
  } = useEventStats();

  useEffect(() => {
    refreshStats();
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="bg-white rounded-[30px] p-5 shadow-lg mt-5">
        جاري تحميل الإحصائيات...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[30px] p-5 shadow-lg mt-5">
      <h2 className="text-xl font-black text-[#21166A] mb-5">
        إحصائيات الفعاليات
      </h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#EEE7F8] p-4 bg-[#F8F6FC]">
          <div className="flex items-center justify-between">
            <Users size={20} className="text-[#7C3AED]" />
            <p className="text-xs text-gray-500">عدد الحضور</p>
          </div>

          <h3 className="mt-4 text-2xl font-black text-[#21166A]">
            {stats.totalAttendance}
          </h3>
        </div>

        <div className="rounded-2xl border border-[#EEE7F8] p-4 bg-[#F8F6FC]">
          <div className="flex items-center justify-between">
            <Star size={20} className="text-yellow-500" />
            <p className="text-xs text-gray-500">متوسط التقييم</p>
          </div>

          <h3 className="mt-4 text-2xl font-black text-[#21166A]">
            {stats.averageRating}
          </h3>
        </div>

        <div className="rounded-2xl border border-[#EEE7F8] p-4 bg-[#F8F6FC]">
          <div className="flex items-center justify-between">
            <MessageCircle size={20} className="text-emerald-500" />
            <p className="text-xs text-gray-500">عدد التقييمات</p>
          </div>

          <h3 className="mt-4 text-2xl font-black text-[#21166A]">
            {stats.totalRatings}
          </h3>
        </div>
      </div>
    </div>
  );
}