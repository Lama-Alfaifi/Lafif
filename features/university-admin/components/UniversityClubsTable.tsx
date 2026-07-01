"use client";

import { Users, Trophy, BookOpen } from "lucide-react";
import type { UniMember } from "../services/members.service";

type Club = {
  id: string;
  name?: string;
  college?: string;
  category?: "central" | "decentralized";
  email?: string;
  presidentId?: string;
  score?: number;
};

interface Props {
  clubs: Club[];
  members: UniMember[];
  loading: boolean;
  onViewMembers: (club: Club) => void;
}

export default function UniversityClubsTable({ clubs, members, loading, onViewMembers }: Props) {
  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (clubs.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen size={28} className="text-gray-200 mx-auto mb-2" />
        <p className="text-sm text-gray-400 font-bold">لا توجد أندية مضافة حالياً</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      {clubs.map((club) => {
        const memberCount = members.filter((m) => m.clubId === club.id).length;
        const president = members.find((m) => m.clubId === club.id && m.role === "president");
        const isCentral = club.category !== "decentralized";

        return (
          <div
            key={club.id}
            className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-gray-50 hover:bg-[#F7F5FF] transition"
          >
            {/* Color dot */}
            <div
              className={`w-2 h-10 rounded-full shrink-0 ${isCentral ? "bg-[#7C3AED]" : "bg-emerald-400"}`}
            />

            {/* Main info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-black text-[#21166A] truncate">{club.name ?? "بدون اسم"}</p>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    isCentral
                      ? "bg-purple-50 text-purple-600"
                      : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  {isCentral ? "مركزي" : "لامركزي"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-gray-400 font-bold">
                {club.college && <span>{club.college}</span>}
                {president && (
                  <>
                    <span className="text-gray-200">•</span>
                    <span className="text-amber-600">{president.name ?? president.email}</span>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1 text-[11px] font-bold text-gray-500">
                <Users size={12} className="text-gray-400" />
                {memberCount}
              </div>
              {(club.score ?? 0) > 0 && (
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600">
                  <Trophy size={11} />
                  {club.score}
                </div>
              )}
            </div>

            {/* View members button */}
            <button
              onClick={() => onViewMembers(club)}
              className="px-3 py-1.5 rounded-xl bg-[#EFE8F7] text-[#7C3AED] text-xs font-bold hover:bg-[#E0D4F5] transition shrink-0"
            >
              الأعضاء
            </button>
          </div>
        );
      })}
    </div>
  );
}
