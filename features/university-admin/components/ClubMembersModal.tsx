"use client";

import { useState } from "react";
import { X, UserMinus, ChevronDown, Check, Users } from "lucide-react";
import { removeMemberFromClub, changeClubRole, type UniMember } from "../services/members.service";

const ROLE_LABELS: Record<string, string> = {
  president: "رئيس",
  vicePresident: "نائب الرئيس",
  member: "عضو",
  student: "طالب",
};

const ROLE_COLORS: Record<string, string> = {
  president: "bg-amber-50 text-amber-700",
  vicePresident: "bg-purple-50 text-purple-700",
  member: "bg-blue-50 text-blue-700",
  student: "bg-gray-100 text-gray-500",
};

type Club = { id: string; name?: string };

interface Props {
  club: Club;
  members: UniMember[];
  onClose: () => void;
  onChanged: () => void;
}

export default function ClubMembersModal({ club, members, onClose, onChanged }: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [openRoleId, setOpenRoleId] = useState<string | null>(null);

  const clubMembers = members.filter((m) => m.clubId === club.id);

  async function handleRemove(member: UniMember) {
    if (!confirm(`هل تريد إزالة ${member.name ?? member.email} من النادي؟`)) return;
    setLoadingId(member.id);
    try {
      await removeMemberFromClub(member.id);
      onChanged();
    } finally {
      setLoadingId(null);
    }
  }

  async function handleRole(member: UniMember, newRole: "member" | "vicePresident" | "president") {
    setLoadingId(member.id);
    setOpenRoleId(null);
    try {
      await changeClubRole(member.id, newRole, club.id, club.name ?? "");
      onChanged();
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[28px] w-full max-w-lg shadow-2xl flex flex-col max-h-[85vh]" dir="rtl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50 shrink-0">
          <div>
            <p className="text-xs font-bold text-[#7C3AED] mb-0.5">أعضاء النادي</p>
            <h2 className="text-lg font-black text-[#21166A]">{club.name}</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
              {clubMembers.length} عضو
            </span>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Members list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {clubMembers.length === 0 ? (
            <div className="text-center py-12">
              <Users size={28} className="text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400 font-bold">لا يوجد أعضاء في هذا النادي</p>
            </div>
          ) : (
            clubMembers.map((m) => {
              const isLoading = loadingId === m.id;
              const roleColor = ROLE_COLORS[m.role ?? "student"] ?? ROLE_COLORS.student;

              return (
                <div
                  key={m.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-50 hover:bg-[#F7F5FF] transition"
                >
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#22C55E] flex items-center justify-center text-white text-sm font-black shrink-0">
                    {(m.name ?? m.email ?? "?")[0].toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-[#21166A] truncate">{m.name ?? "—"}</p>
                    <p className="text-[11px] text-gray-400 truncate" dir="ltr">{m.email}</p>
                  </div>

                  {/* Role badge + dropdown */}
                  <div className="relative shrink-0">
                    <button
                      onClick={() => setOpenRoleId(openRoleId === m.id ? null : m.id)}
                      disabled={isLoading}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition hover:opacity-80 ${roleColor}`}
                    >
                      {ROLE_LABELS[m.role ?? "student"]}
                      <ChevronDown size={10} />
                    </button>

                    {openRoleId === m.id && (
                      <div className="absolute left-0 top-full mt-1 z-10 bg-white rounded-2xl shadow-lg border border-gray-100 py-1 min-w-[130px]">
                        {(["member", "vicePresident", "president"] as const).map((r) => (
                          <button
                            key={r}
                            onClick={() => handleRole(m, r)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-right hover:bg-[#F7F5FF] transition"
                          >
                            {m.role === r && <Check size={11} className="text-[#7C3AED]" />}
                            <span className={m.role === r ? "text-[#7C3AED]" : "text-gray-600"}>
                              {ROLE_LABELS[r]}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => handleRemove(m)}
                    disabled={isLoading}
                    className="w-8 h-8 rounded-xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition disabled:opacity-40 shrink-0"
                    title="إزالة من النادي"
                  >
                    {isLoading ? (
                      <span className="w-3 h-3 border-2 border-red-300 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <UserMinus size={13} />
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
