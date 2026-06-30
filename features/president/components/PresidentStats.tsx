"use client";

import { Users, CalendarDays, Star, BarChart3 } from "lucide-react";
import usePresidentStats from "../hooks/usePresidentStats";
import { useLanguage }   from "@/features/i18n/context/LanguageContext";

export default function PresidentStats({
  clubId,
  universityId,
}: {
  clubId: string;
  universityId: string;
}) {
  const { stats, loading } = usePresidentStats(clubId, universityId);
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="bg-white rounded-[30px] p-5 shadow-lg text-sm text-gray-400 font-bold text-center">
        {t.president.loadingStats}
      </div>
    );
  }

  const STATS = [
    { icon: <Users className="text-[#7C3AED]" />,       value: stats.totalMembers,    label: t.president.totalMembers },
    { icon: <CalendarDays className="text-emerald-500" />, value: stats.totalEvents,   label: t.president.totalEvents },
    { icon: <BarChart3 className="text-orange-500" />,  value: stats.totalAttendance, label: t.president.totalAttendance },
    { icon: <Star className="text-yellow-500" />,       value: stats.averageRating,   label: t.president.avgRating },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {STATS.map(({ icon, value, label }) => (
        <div key={label} className="bg-white rounded-[26px] p-5 shadow-lg">
          {icon}
          <h3 className="mt-4 text-3xl font-black text-[#21166A]">{value}</h3>
          <p className="text-sm text-gray-500 mt-1">{label}</p>
        </div>
      ))}
    </div>
  );
}