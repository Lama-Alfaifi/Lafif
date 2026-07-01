"use client";

import { useState } from "react";
import { Users, Shield, ChevronDown, CheckCircle, XCircle, UserCog, Wrench, Loader2, BarChart2 } from "lucide-react";

import Sidebar from "@/features/dashboard/components/Sidebar";
import { useLanguage } from "@/features/i18n/context/LanguageContext";
import useUsers from "../hooks/useUsers";
import useAdminClubs from "../hooks/useAdminClubs";
import { assignPresident, removePresidentRole, fixUserUniversityData, backfillClubScores, type FixResult } from "../services/users.service";

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
  const { t, dir } = useLanguage();
  const { clubs } = useAdminClubs(universityId !== "unknown" ? universityId : undefined);
  const universityName = users[0]?.universityName || universityId;

  return (
    <div className="bg-white rounded-[24px] shadow-md border border-gray-50 overflow-hidden mb-5">
      <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3" dir={dir}>
        <div className="w-8 h-8 rounded-xl bg-[#EFE8F7] flex items-center justify-center shrink-0">
          <Shield size={14} className="text-[#7C3AED]" />
        </div>
        <div>
          <p className="text-sm font-black text-[#21166A]">{universityName}</p>
          <p className="text-xs text-gray-400 font-bold">{users.length} {t.admin.userCount}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full" dir={dir}>
          <thead>
            <tr className="border-b border-gray-50">
              <th className="px-6 py-3 text-xs font-bold text-gray-400 text-right">{t.admin.userCol}</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-400 text-right">{t.admin.roleCol}</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-400 text-right">{t.admin.clubCol}</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-400 text-right">{t.admin.assignCol}</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-400 text-right">{t.admin.actionCol}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const roleLabel = t.roles[user.role as keyof typeof t.roles] ?? user.role ?? t.roles.student;
              return (
              <tr key={user.id} className="border-b border-gray-50 last:border-0 hover:bg-[#FAFAFA] transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#21166A] to-[#7C3AED] flex items-center justify-center text-white text-xs font-black shrink-0">
                      {initials(user.name)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#21166A]">{user.name || t.profile.noName}</p>
                      <p className="text-xs text-gray-400">{user.email || "—"}</p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${ROLE_STYLE[user.role ?? "student"] ?? "bg-gray-100 text-gray-600"}`}>
                    {roleLabel}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm text-gray-500 font-bold">
                  {user.clubName || <span className="text-gray-300">—</span>}
                </td>

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
                        <option value="" disabled>{t.admin.pickClub}</option>
                        {clubs.map((club) => (
                          <option key={club.id} value={club.id}>{club.name}</option>
                        ))}
                      </select>
                      <ChevronDown size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  ) : (
                    <span className="text-xs text-gray-300">{t.admin.noClubs}</span>
                  )}
                </td>

                <td className="px-6 py-4">
                  {user.role === "president" ? (
                    <button
                      onClick={() => onRemove(user.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 transition"
                    >
                      <XCircle size={13} />
                      {t.admin.removeRole}
                    </button>
                  ) : (
                    <span className="text-xs text-gray-300">—</span>
                  )}
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const { t, dir } = useLanguage();
  const { users, loading, loadUsers } = useUsers();
  const [actionUserId, setActionUserId]     = useState<string | null>(null);
  const [fixing, setFixing]                 = useState(false);
  const [fixResult, setFixResult]           = useState<FixResult | null>(null);
  const [backfilling, setBackfilling]       = useState(false);
  const [backfillResult, setBackfillResult] = useState<FixResult | null>(null);

  async function handleFixUniversities() {
    setFixing(true);
    setFixResult(null);
    try {
      const result = await fixUserUniversityData();
      setFixResult(result);
      await loadUsers();
    } finally {
      setFixing(false);
    }
  }

  async function handleBackfillScores() {
    setBackfilling(true);
    setBackfillResult(null);
    try {
      const result = await backfillClubScores();
      setBackfillResult(result);
    } finally {
      setBackfilling(false);
    }
  }

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

        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
          <div className="px-8 py-4 flex items-center gap-4" dir={dir}>
            <div className="w-10 h-10 rounded-[14px] bg-[#EFE8F7] flex items-center justify-center shrink-0">
              <UserCog size={18} className="text-[#7C3AED]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#EFE8F7] text-[10px] font-black text-[#7C3AED] uppercase tracking-wide">
                  {t.admin.usersTag}
                </span>
              </div>
              <h1 className="text-xl font-black text-[#21166A] mt-0.5">{t.admin.usersTitle}</h1>
            </div>

            <div className="flex items-center gap-3 mr-auto">
              <div className="bg-white border border-gray-100 rounded-2xl px-4 py-2 flex items-center gap-2 shadow-sm">
                <Users size={15} className="text-[#7C3AED]" />
                <span className="text-sm font-black text-[#21166A]">{users.length} {t.admin.userCount}</span>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl px-4 py-2 flex items-center gap-2 shadow-sm">
                <CheckCircle size={15} className="text-emerald-500" />
                <span className="text-sm font-black text-[#21166A]">
                  {users.filter((u) => u.role === "president").length} {t.admin.presCount}
                </span>
              </div>
              <button
                onClick={handleBackfillScores}
                disabled={backfilling}
                title="يحسب مجموع نقاط challengeSubmissions ويكتبها في clubs.score"
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500 text-white text-xs font-bold hover:opacity-90 transition disabled:opacity-50 shadow-sm"
              >
                {backfilling
                  ? <><Loader2 size={13} className="animate-spin" />جاري الحساب...</>
                  : <><BarChart2 size={13} />إصلاح نقاط الأندية</>
                }
              </button>
              <button
                onClick={handleFixUniversities}
                disabled={fixing}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500 text-white text-xs font-bold hover:opacity-90 transition disabled:opacity-50 shadow-sm"
              >
                {fixing
                  ? <><Loader2 size={13} className="animate-spin" />{t.admin.fixing}</>
                  : <><Wrench size={13} />{t.admin.fixBtn}</>
                }
              </button>
            </div>
          </div>
        </header>

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
            <div className="bg-white rounded-[24px] p-12 shadow-md text-center" dir={dir}>
              <Users size={32} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-bold">{t.admin.noUsers}</p>
            </div>
          ) : (
            <div dir={dir}>
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
              {t.admin.updating}
            </div>
          )}

          {fixResult && (
            <div
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-md bg-white rounded-[24px] shadow-2xl border border-gray-100 overflow-hidden"
              dir={dir}
            >
              <div className="bg-amber-500 px-5 py-3 flex items-center justify-between">
                <span className="text-white text-sm font-black">{t.admin.fixTitle}</span>
                <button onClick={() => setFixResult(null)} className="text-white/70 hover:text-white text-lg leading-none">×</button>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-emerald-50 rounded-2xl py-2">
                    <p className="text-lg font-black text-emerald-600">{fixResult.fixed}</p>
                    <p className="text-[10px] text-emerald-500 font-bold">{t.admin.fixFixed}</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl py-2">
                    <p className="text-lg font-black text-gray-500">{fixResult.skipped}</p>
                    <p className="text-[10px] text-gray-400 font-bold">{t.admin.fixSkipped}</p>
                  </div>
                  <div className="bg-red-50 rounded-2xl py-2">
                    <p className="text-lg font-black text-red-500">{fixResult.failed}</p>
                    <p className="text-[10px] text-red-400 font-bold">{t.admin.fixFailed}</p>
                  </div>
                </div>
                {fixResult.details.length > 0 && (
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {fixResult.details.map((d, i) => (
                      <p key={i} className="text-[11px] text-gray-500 font-bold bg-gray-50 rounded-xl px-3 py-1.5">{d}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {backfillResult && (
            <div
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-md bg-white rounded-[24px] shadow-2xl border border-gray-100 overflow-hidden"
              dir={dir}
            >
              <div className="bg-emerald-500 px-5 py-3 flex items-center justify-between">
                <span className="text-white text-sm font-black">نتيجة إصلاح نقاط الأندية</span>
                <button onClick={() => setBackfillResult(null)} className="text-white/70 hover:text-white text-lg leading-none">×</button>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-emerald-50 rounded-2xl py-3">
                    <p className="text-2xl font-black text-emerald-600">{backfillResult.fixed}</p>
                    <p className="text-[10px] text-emerald-500 font-bold">نادٍ تم تحديثه</p>
                  </div>
                  <div className="bg-red-50 rounded-2xl py-3">
                    <p className="text-2xl font-black text-red-500">{backfillResult.failed}</p>
                    <p className="text-[10px] text-red-400 font-bold">فشل التحديث</p>
                  </div>
                </div>
                {backfillResult.details.length > 0 && (
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {backfillResult.details.map((d, i) => (
                      <p key={i} className="text-[11px] text-gray-500 font-bold bg-gray-50 rounded-xl px-3 py-1.5 font-mono">{d}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Sidebar />
    </div>
  );
}
