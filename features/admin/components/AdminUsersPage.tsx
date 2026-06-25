"use client";

import { useState } from "react";
import { Users, Shield, ChevronDown, CheckCircle, XCircle, UserCog } from "lucide-react";

import Sidebar from "@/features/dashboard/components/Sidebar";
import useUsers from "../hooks/useUsers";
import useAdminClubs from "../hooks/useAdminClubs";
import { assignPresident, removePresidentRole } from "../services/users.service";

const ROLE_LABELS: Record<string, string> = {
  superAdmin:      "سوبر أدمن",
  universityAdmin: "أدمن جامعة",
  president:       "رئيس نادي",
  vicePresident:   "نائب الرئيس",
  member:          "عضو",
  student:         "طالب",
};

const ROLE_STYLE: Record<string, string> = {
  superAdmin:      "bg-purple-100 text-purple-700",
  universityAdmin: "bg-blue-100 text-blue-700",
  president:       "bg-amber-100 text-amber-700",
  vicePresident:   "bg-orange-100 text-orange-700",
  member:          "bg-emerald-100 text-emerald-700",
  student:         "bg-gray-100 text-gray-600",
};

function initials(name?: string) {
  if (!name) return "؟";
  return name.trim().split(" ").slice(0, 2).map((w) => w[0]).join("");
}

/* ─── Per-university table ─────────────────────────────────────────── */
type UserRow = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  universityName?: string;
  clubId?: string;
  clubName?: string;
};

function UniversitySection({
  universityId,
  users,
  onAssign,
  onRemove,
}: {
  universityId: string;
  users: UserRow[];
  onAssign: (userId: string, clubId: string, clubName: string) => void;
  onRemove: (userId: string) => void;
}) {
  const { clubs } = useAdminClubs(universityId !== "unknown" ? universityId : undefined);
  const universityName = users[0]?.universityName || universityId;

  return (
    <div className="bg-white rounded-[24px] shadow-md border border-gray-50 overflow-hidden mb-5">
      {/* Section header */}
      <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3" dir="rtl">
        <div className="w-8 h-8 rounded-xl bg-[#EFE8F7] flex items-center justify-center shrink-0">
          <Shield size={14} className="text-[#7C3AED]" />
        </div>
        <div>
          <p className="text-sm font-black text-[#21166A]">{universityName}</p>
          <p className="text-xs text-gray-400 font-bold">{users.length} مستخدم</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full" dir="rtl">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="px-6 py-3 text-xs font-bold text-gray-400 text-right">المستخدم</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-400 text-right">الدور</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-400 text-right">النادي الحالي</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-400 text-right">تعيين رئيساً</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-400 text-right">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-50 last:border-0 hover:bg-[#FAFAFA] transition">
                {/* User */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#21166A] to-[#7C3AED] flex items-center justify-center text-white text-xs font-black shrink-0">
                      {initials(user.name)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#21166A]">{user.name || "بدون اسم"}</p>
                      <p className="text-xs text-gray-400">{user.email || "—"}</p>
                    </div>
                  </div>
                </td>

                {/* Role */}
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${ROLE_STYLE[user.role ?? "student"] ?? "bg-gray-100 text-gray-600"}`}>
                    {ROLE_LABELS[user.role ?? ""] || user.role || "طالب"}
                  </span>
                </td>

                {/* Current club */}
                <td className="px-6 py-4 text-sm text-gray-500 font-bold">
                  {user.clubName || <span className="text-gray-300">—</span>}
                </td>

                {/* Assign dropdown */}
                <td className="px-6 py-4">
                  {clubs.length > 0 ? (
                    <div className="relative inline-block">
                      <select
                        defaultValue=""
                        onChange={(e) => {
                          const club = clubs.find((c) => c.id === e.target.value);
                          if (club) onAssign(user.id, club.id, club.name);
                          e.currentTarget.value = "";
                        }}
                        className="appearance-none pr-4 pl-8 py-2 rounded-xl border border-gray-100 bg-[#F7F5FF] text-xs font-bold text-[#21166A] outline-none cursor-pointer hover:border-purple-200 transition"
                      >
                        <option value="" disabled>اختر نادياً</option>
                        {clubs.map((club) => (
                          <option key={club.id} value={club.id}>{club.name}</option>
                        ))}
                      </select>
                      <ChevronDown size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  ) : (
                    <span className="text-xs text-gray-300">لا توجد أندية</span>
                  )}
                </td>

                {/* Remove action */}
                <td className="px-6 py-4">
                  {user.role === "president" ? (
                    <button
                      onClick={() => onRemove(user.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 transition"
                    >
                      <XCircle size={13} />
                      إزالة الرئاسة
                    </button>
                  ) : (
                    <span className="text-xs text-gray-300">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Main page ────────────────────────────────────────────────────── */
export default function AdminUsersPage() {
  const { users, loading, loadUsers } = useUsers();
  const [actionUserId, setActionUserId] = useState<string | null>(null);

  const usersByUniversity = users.reduce<Record<string, typeof users>>(
    (acc, user) => {
      const key = user.universityId || "unknown";
      if (!acc[key]) acc[key] = [];
      acc[key].push(user);
      return acc;
    },
    {}
  );

  async function handleAssignPresident(userId: string, clubId: string, clubName: string) {
    setActionUserId(userId);
    await assignPresident(userId, clubId, clubName);
    await loadUsers();
    setActionUserId(null);
  }

  async function handleRemovePresident(userId: string) {
    setActionUserId(userId);
    await removePresidentRole(userId);
    await loadUsers();
    setActionUserId(null);
  }

  return (
    <div className="flex min-h-screen bg-[#F7F5FF]">
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Sticky header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
          <div className="px-8 py-4 flex items-center gap-4" dir="rtl">
            <div className="w-10 h-10 rounded-[14px] bg-[#EFE8F7] flex items-center justify-center shrink-0">
              <UserCog size={18} className="text-[#7C3AED]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#EFE8F7] text-[10px] font-black text-[#7C3AED] uppercase tracking-wide">
                  Super Admin
                </span>
              </div>
              <h1 className="text-xl font-black text-[#21166A] mt-0.5">إدارة المستخدمين</h1>
            </div>

            <div className="flex items-center gap-3 mr-auto">
              <div className="bg-white border border-gray-100 rounded-2xl px-4 py-2 flex items-center gap-2 shadow-sm">
                <Users size={15} className="text-[#7C3AED]" />
                <span className="text-sm font-black text-[#21166A]">{users.length} مستخدم</span>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl px-4 py-2 flex items-center gap-2 shadow-sm">
                <CheckCircle size={15} className="text-emerald-500" />
                <span className="text-sm font-black text-[#21166A]">
                  {users.filter((u) => u.role === "president").length} رئيس
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 lg:p-8">
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-[24px] p-6 shadow-md animate-pulse">
                  <div className="h-5 w-40 bg-gray-100 rounded-full mb-4" />
                  <div className="space-y-3">
                    {[1, 2, 3].map((j) => <div key={j} className="h-10 bg-gray-50 rounded-xl" />)}
                  </div>
                </div>
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="bg-white rounded-[24px] p-12 shadow-md text-center" dir="rtl">
              <Users size={32} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-bold">لا يوجد مستخدمون حالياً</p>
            </div>
          ) : (
            <div dir="rtl">
              {Object.entries(usersByUniversity).map(([universityId, uniUsers]) => (
                <UniversitySection
                  key={universityId}
                  universityId={universityId}
                  users={uniUsers}
                  onAssign={handleAssignPresident}
                  onRemove={handleRemovePresident}
                />
              ))}
            </div>
          )}

          {actionUserId && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#21166A] text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-bold z-50">
              جاري تحديث الصلاحية...
            </div>
          )}
        </div>
      </div>

      <Sidebar />
    </div>
  );
}
