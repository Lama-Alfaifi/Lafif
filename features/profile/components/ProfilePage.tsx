"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { User, Building2, BookOpen, CheckCircle, ClipboardList, Mail, Medal } from "lucide-react";

import Sidebar from "@/features/dashboard/components/Sidebar";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useLanguage } from "@/features/i18n/context/LanguageContext";
import { db } from "@/src/lib/firebase";
import MyRequestsSection from "@/features/joinRequests/components/MyRequestsSection";
import RequestPositionModal from "@/features/positions/components/RequestPositionModal";
import { useMyPositionRequests } from "@/features/positions/hooks/usePositionRequests";

const ROLE_COLOR: Record<string, string> = {
  student:         "bg-gray-100 text-gray-600",
  member:          "bg-emerald-100 text-emerald-700",
  vicePresident:   "bg-cyan-100 text-cyan-700",
  president:       "bg-purple-100 text-purple-700",
  universityAdmin: "bg-indigo-100 text-indigo-700",
  superAdmin:      "bg-red-100 text-red-600",
};

const STATUS_COLOR: Record<string, string> = {
  pending:  "bg-amber-50 text-amber-600",
  approved: "bg-emerald-50 text-emerald-600",
  rejected: "bg-red-50 text-red-500",
};

type Tab = "info" | "requests";

export default function ProfilePage() {
  const { user, profile, loading } = useAuth();
  const { t, dir } = useLanguage();
  const [tab, setTab] = useState<Tab>("info");
  const [name, setName] = useState(profile?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPositionModal, setShowPositionModal] = useState(false);

  const { requests: posRequests, reload: reloadPositions,
          pendingVP, pendingPresident } = useMyPositionRequests(user?.uid);

  // Only members (not already VP/president) can request a position
  const canRequestPosition = profile?.role === "member" && !!profile?.clubId;

  async function handleSave() {
    if (!user || !name.trim()) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), { name: name.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#F7F5FF] items-center justify-center">
        <p className="text-sm font-bold text-[#21166A]">جاري التحميل...</p>
      </div>
    );
  }

  const role      = profile?.role ?? "student";
  const roleLabel = t.roles[role as keyof typeof t.roles] ?? role;
  const roleColor = ROLE_COLOR[role] ?? "bg-gray-100 text-gray-600";
  const initial   = (profile?.name ?? "؟")[0];

  return (
    <div className="flex min-h-screen bg-[#F7F5FF]">
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Sticky page header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
          <div className="px-8 py-4" dir={dir}>
            <p className="text-xs font-bold text-[#7C3AED] mb-0.5">{t.profile.tag}</p>
            <h1 className="text-xl font-black text-[#21166A]">{t.profile.title}</h1>
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-8">
          <div className="max-w-2xl" dir={dir}>

            {/* Profile hero card */}
            <div className="relative overflow-hidden bg-[#21166A] rounded-[28px] p-6 mb-6 shadow-xl shadow-purple-900/25">
              <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

              <div className="relative z-10 flex items-center gap-5">
                <div className="w-16 h-16 rounded-[20px] bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center text-white text-2xl font-black shrink-0">
                  {initial}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-black text-white truncate">{profile?.name ?? "—"}</h2>
                  <p className="text-sm text-white/60 truncate mt-0.5">{profile?.email ?? user?.email ?? "—"}</p>
                  <span className={`mt-2 inline-block text-[11px] font-bold px-3 py-1 rounded-full ${roleColor}`}>
                    {roleLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setTab("info")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition ${
                  tab === "info"
                    ? "bg-[#21166A] text-white shadow"
                    : "bg-white text-gray-500 hover:bg-[#F3F0FA] hover:text-[#21166A]"
                }`}
              >
                <User size={15} />
                {t.profile.myInfo}
              </button>
              <button
                onClick={() => setTab("requests")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition ${
                  tab === "requests"
                    ? "bg-[#21166A] text-white shadow"
                    : "bg-white text-gray-500 hover:bg-[#F3F0FA] hover:text-[#21166A]"
                }`}
              >
                <ClipboardList size={15} />
                {t.profile.myRequests}
              </button>
            </div>

            {/* Tab: My Info */}
            {tab === "info" && (
              <div className="space-y-4">
                {/* Edit name */}
                <div className="bg-white rounded-[24px] p-5 shadow-md border border-gray-50">
                  <div className="flex items-center gap-2 mb-4">
                    <User size={16} className="text-[#7C3AED]" />
                    <h3 className="text-sm font-black text-[#21166A]">{t.profile.editName}</h3>
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.profile.fullName}
                      className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 text-sm font-bold text-[#21166A] outline-none focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-100 transition"
                    />
                    <button
                      onClick={handleSave}
                      disabled={saving || !name.trim()}
                      className="px-5 py-3 rounded-2xl bg-[#21166A] text-white text-sm font-bold hover:opacity-90 transition disabled:opacity-50"
                    >
                      {saved ? (
                        <span className="flex items-center gap-1.5">
                          <CheckCircle size={14} />
                          {t.saved}
                        </span>
                      ) : saving ? "..." : t.save}
                    </button>
                  </div>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-[24px] p-5 shadow-md border border-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 size={15} className="text-cyan-600" />
                      <span className="text-xs font-bold text-gray-400">{t.profile.university}</span>
                    </div>
                    <p className="text-sm font-black text-[#21166A]">
                      {profile?.universityName ?? "—"}
                    </p>
                  </div>

                  <div className="bg-white rounded-[24px] p-5 shadow-md border border-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen size={15} className="text-emerald-600" />
                      <span className="text-xs font-bold text-gray-400">{t.profile.club}</span>
                    </div>
                    <p className="text-sm font-black text-[#21166A]">
                      {profile?.clubName ?? t.profile.noClub}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-[24px] p-5 shadow-md border border-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail size={15} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-400">{t.profile.email}</span>
                  </div>
                  <p className="text-sm font-bold text-gray-600">
                    {profile?.email ?? user?.email ?? "—"}
                  </p>
                </div>

                {/* Position request section — members only */}
                {canRequestPosition && (
                  <div className="bg-white rounded-[24px] p-5 shadow-md border border-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Medal size={15} className="text-[#7C3AED]" />
                        <h3 className="text-sm font-black text-[#21166A]">{t.profile.requestPos}</h3>
                      </div>
                      <button
                        onClick={() => setShowPositionModal(true)}
                        className="px-4 py-2 rounded-2xl bg-[#21166A] text-white text-xs font-bold hover:opacity-90 transition"
                      >
                        {t.profile.newRequest}
                      </button>
                    </div>

                    {posRequests.length === 0 ? (
                      <p className="text-xs text-gray-400 font-bold text-center py-3">
                        {t.profile.noRequests}
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {posRequests.map((r) => {
                          const statusLabel = { pending: t.profile.statusPending, approved: t.profile.statusApproved, rejected: t.profile.statusRejected }[r.status] ?? r.status;
                          return (
                          <div key={r.id} className="flex items-center justify-between bg-[#F7F5FF] rounded-2xl px-4 py-3">
                            <div>
                              <p className="text-xs font-black text-[#21166A]">
                                {r.position === "vicePresident" ? t.profile.vp : t.profile.pres}
                              </p>
                              <p className="text-[11px] text-gray-400 mt-0.5">{r.clubName}</p>
                            </div>
                            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${STATUS_COLOR[r.status]}`}>
                              {statusLabel}
                            </span>
                          </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Tab: My Requests */}
            {tab === "requests" && (
              <div>
                <p className="text-sm text-gray-400 mb-5">
                  جميع طلبات الانضمام التي أرسلتها إلى الأندية
                </p>
                <MyRequestsSection />
              </div>
            )}
          </div>
        </div>
      </div>

      <Sidebar />

      {showPositionModal && user && profile?.clubId && (
        <RequestPositionModal
          userId={user.uid}
          userName={profile.name ?? ""}
          clubId={profile.clubId}
          clubName={profile.clubName ?? ""}
          universityId={profile.universityId ?? ""}
          hasPendingVP={!!pendingVP}
          hasPendingPresident={!!pendingPresident}
          onClose={() => setShowPositionModal(false)}
          onSubmitted={reloadPositions}
        />
      )}
    </div>
  );
}
