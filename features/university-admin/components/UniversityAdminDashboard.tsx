"use client";

import { useState } from "react";

import Sidebar from "@/features/dashboard/components/Sidebar";
import { useAuth } from "@/features/auth/context/AuthContext";

import { Plus, Search, Bell } from "lucide-react";

import CreateClubModal from "./CreateClubModal";
import UniversityClubsTable from "./UniversityClubsTable";

import useUniversityClubs from "../hooks/useUniversityClubs";

export default function UniversityAdminDashboard() {
  const { user, profile, loading } = useAuth();

  const [showCreateClub, setShowCreateClub] = useState(false);

  const {
    clubs,
    loading: clubsLoading,
    loadClubs,
  } = useUniversityClubs(profile?.universityId);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#EFE8F7] flex items-center justify-center">
        <p className="font-bold text-[#21166A]">
          جاري تحميل بيانات الأدمن...
        </p>
      </main>
    );
  }

  if (
    !user ||
    profile?.role !== "universityAdmin" ||
    !profile?.universityId
  ) {
    return (
      <main className="min-h-screen bg-[#EFE8F7] flex items-center justify-center">
        <p className="font-bold text-[#21166A]">
          لا تملكين صلاحية دخول لوحة أدمن الجامعة.
        </p>
      </main>
    );
  }

  const centralCount = clubs.filter(
    (club) => club.category !== "decentralized"
  ).length;

  const decentralizedCount = clubs.filter(
    (club) => club.category === "decentralized"
  ).length;

  return (
    <main className="min-h-screen bg-[#EFE8F7] p-5 overflow-hidden">
      <div className="flex h-[calc(100vh-40px)] rounded-[36px] bg-white/60 backdrop-blur-xl border border-white/80 shadow-2xl overflow-hidden">
        <section className="flex-1 h-full overflow-y-auto p-7">
          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-4">
              <button className="w-11 h-11 rounded-2xl bg-white shadow-md flex items-center justify-center relative">
                <Bell size={18} className="text-[#21166A]" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full" />
              </button>

              <div className="w-[300px] h-12 rounded-2xl bg-white shadow-md px-4 flex items-center gap-3">
                <Search size={18} className="text-gray-400" />
                <input
                  placeholder="ابحث..."
                  className="w-full bg-transparent outline-none text-sm text-right placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="text-right">
              <h1 className="text-3xl font-black text-[#21166A]">
                لوحة أدمن الجامعة
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                {profile.universityName}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-[26px] p-5 shadow-lg">
              <p className="text-sm text-gray-500">عدد الأندية</p>
              <h3 className="mt-3 text-3xl font-black text-[#21166A]">
                {clubs.length}
              </h3>
            </div>

            <div className="bg-white rounded-[26px] p-5 shadow-lg">
              <p className="text-sm text-gray-500">الأندية المركزية</p>
              <h3 className="mt-3 text-3xl font-black text-[#21166A]">
                {centralCount}
              </h3>
            </div>

            <div className="bg-white rounded-[26px] p-5 shadow-lg">
              <p className="text-sm text-gray-500">الأندية اللامركزية</p>
              <h3 className="mt-3 text-3xl font-black text-[#21166A]">
                {decentralizedCount}
              </h3>
            </div>

            <button
              onClick={() => setShowCreateClub(true)}
              className="bg-[#7C3AED] rounded-[26px] p-5 shadow-lg text-white flex items-center justify-center gap-2 font-bold"
            >
              <Plus size={20} />
              إضافة نادي
            </button>
          </div>

          <UniversityClubsTable
            clubs={clubs}
            loading={clubsLoading}
          />
        </section>

        <Sidebar />
      </div>

      {showCreateClub && (
        <CreateClubModal
          onClose={() => setShowCreateClub(false)}
          universityId={profile.universityId}
          universityName={profile.universityName || ""}
          onCreated={loadClubs}
        />
      )}
    </main>
  );
}