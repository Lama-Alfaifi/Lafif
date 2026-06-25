"use client";

import { useState } from "react";
import { Plus, Building2, BookOpen, LayoutGrid, TrendingUp, Crown } from "lucide-react";

import Sidebar from "@/features/dashboard/components/Sidebar";
import { useAuth } from "@/features/auth/context/AuthContext";
import CreateClubModal from "./CreateClubModal";
import UniversityClubsTable from "./UniversityClubsTable";
import useUniversityClubs from "../hooks/useUniversityClubs";
import PositionRequestCard from "@/features/positions/components/PositionRequestCard";
import { usePendingPresidentRequests } from "@/features/positions/hooks/usePositionRequests";

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div className="bg-white rounded-[20px] p-5 shadow-md border border-gray-50 flex items-center gap-4" dir="rtl">
      <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 ${accent ?? "bg-[#EFE8F7]"}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400">{label}</p>
        <p className="text-2xl font-black text-[#21166A] mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function UniversityAdminDashboard() {
  const { user, profile, loading } = useAuth();
  const [showCreateClub, setShowCreateClub] = useState(false);

  const {
    clubs,
    loading: clubsLoading,
    loadClubs,
  } = useUniversityClubs(profile?.universityId);

  const { requests: presidentRequests, reload: reloadPresidentReqs } =
    usePendingPresidentRequests(profile?.universityId);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#F7F5FF] items-center justify-center">
        <p className="font-bold text-[#21166A]">جاري تحميل بيانات الأدمن...</p>
      </div>
    );
  }

  if (!user || profile?.role !== "universityAdmin" || !profile?.universityId) {
    return (
      <div className="flex min-h-screen bg-[#F7F5FF] items-center justify-center" dir="rtl">
        <div className="text-center">
          <Building2 size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="font-bold text-[#21166A]">لا تملك صلاحية دخول لوحة أدمن الجامعة.</p>
        </div>
      </div>
    );
  }

  const centralCount     = clubs.filter((c) => c.category !== "decentralized").length;
  const decentralized    = clubs.filter((c) => c.category === "decentralized").length;
  const withPresident    = clubs.filter((c) => c.presidentId).length;

  return (
    <div className="flex min-h-screen bg-[#F7F5FF]">
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Sticky header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
          <div className="px-8 py-4 flex items-center justify-between" dir="rtl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-[14px] bg-[#EFE8F7] flex items-center justify-center shrink-0">
                <Building2 size={18} className="text-[#7C3AED]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#EFE8F7] text-[10px] font-black text-[#7C3AED] uppercase tracking-wide">
                    University Admin
                  </span>
                </div>
                <h1 className="text-xl font-black text-[#21166A]">{profile.universityName}</h1>
              </div>
            </div>

            <button
              onClick={() => setShowCreateClub(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#21166A] text-white text-sm font-bold hover:opacity-90 transition shadow"
            >
              <Plus size={16} />
              إضافة نادي
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 lg:p-8" dir="rtl">

          {/* Stats */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <StatCard
              icon={<LayoutGrid size={18} className="text-[#7C3AED]" />}
              label="إجمالي الأندية"
              value={clubs.length}
              accent="bg-[#EFE8F7]"
            />
            <StatCard
              icon={<BookOpen size={18} className="text-blue-500" />}
              label="الأندية المركزية"
              value={centralCount}
              accent="bg-blue-50"
            />
            <StatCard
              icon={<TrendingUp size={18} className="text-emerald-500" />}
              label="الأندية اللامركزية"
              value={decentralized}
              accent="bg-emerald-50"
            />
            <StatCard
              icon={<Building2 size={18} className="text-amber-500" />}
              label="أندية لها رئيس"
              value={withPresident}
              accent="bg-amber-50"
            />
          </div>

          {/* Clubs table card */}
          <div className="bg-white rounded-[24px] shadow-md border border-gray-50 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LayoutGrid size={15} className="text-[#7C3AED]" />
                <h2 className="text-base font-black text-[#21166A]">قائمة الأندية</h2>
              </div>
              {clubsLoading && (
                <span className="text-xs text-gray-400 font-bold">جاري التحميل...</span>
              )}
            </div>

            <UniversityClubsTable clubs={clubs} loading={clubsLoading} />
          </div>

          {/* President position requests */}
          {presidentRequests.length > 0 && (
            <div className="bg-white rounded-[24px] shadow-md border border-gray-50 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
                <Crown size={15} className="text-amber-500" />
                <h2 className="text-base font-black text-[#21166A]">طلبات الرئاسة</h2>
                <span className="mr-auto inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-50 text-amber-600 text-xs font-black">
                  {presidentRequests.length}
                </span>
              </div>
              <div className="p-5 grid grid-cols-1 xl:grid-cols-2 gap-4">
                {presidentRequests.map((req) => (
                  <PositionRequestCard
                    key={req.id}
                    request={req}
                    reviewerUserId={user?.uid ?? ""}
                    onReviewed={reloadPresidentReqs}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Sidebar />

      {showCreateClub && (
        <CreateClubModal
          onClose={() => setShowCreateClub(false)}
          universityId={profile.universityId}
          universityName={profile.universityName || ""}
          onCreated={loadClubs}
        />
      )}
    </div>
  );
}
