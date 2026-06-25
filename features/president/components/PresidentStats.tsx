"use client";


import {
  Users,
  CalendarDays,
  Star,
  BarChart3,
} from "lucide-react";


import usePresidentStats
from "../hooks/usePresidentStats";



export default function PresidentStats({
  clubId,
}: {
  clubId: string;
}) {
  const { stats, loading } =
    usePresidentStats(clubId);

  if (loading) {
    return (
      <div className="bg-white rounded-[30px] p-5 shadow-lg">
        جاري تحميل الإحصائيات...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">

      <div className="bg-white rounded-[26px] p-5 shadow-lg">
        <Users className="text-[#7C3AED]" />
        <h3 className="mt-4 text-3xl font-black text-[#21166A]">
          {stats.totalMembers}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          أعضاء النادي
        </p>
      </div>

      <div className="bg-white rounded-[26px] p-5 shadow-lg">
        <CalendarDays className="text-emerald-500" />
        <h3 className="mt-4 text-3xl font-black text-[#21166A]">
          {stats.totalEvents}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          الفعاليات
        </p>
      </div>

      <div className="bg-white rounded-[26px] p-5 shadow-lg">
        <BarChart3 className="text-orange-500" />
        <h3 className="mt-4 text-3xl font-black text-[#21166A]">
          {stats.totalAttendance}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          الحضور
        </p>
      </div>

      <div className="bg-white rounded-[26px] p-5 shadow-lg">
        <Star className="text-yellow-500" />
        <h3 className="mt-4 text-3xl font-black text-[#21166A]">
          {stats.averageRating}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          متوسط التقييم
        </p>
      </div>

    </div>
  );
}