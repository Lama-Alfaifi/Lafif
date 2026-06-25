"use client";

import Sidebar from "@/features/dashboard/components/Sidebar";
import Topbar from "@/features/dashboard/components/Topbar";
import CountdownCard from "@/features/dashboard/components/CountdownCard";
import ClubGrid from "@/features/dashboard/components/ClubGrid";

import useDashboardClubs from "@/features/dashboard/hooks/useDashboardClubs";

export default function DashboardPage() {
  const {
    centralClubs,
    decentralizedClubs,
    loading,
  } = useDashboardClubs();

  return (
    <main className="min-h-screen bg-[#EFE8F7] p-5 overflow-hidden">
      <div
        className="
          flex
          h-[calc(100vh-40px)]
          rounded-[36px]
          bg-white/60
          backdrop-blur-xl
          border border-white/80
          shadow-2xl
          overflow-hidden
        "
      >
        <section className="flex-1 h-full p-6 lg:p-8 overflow-y-auto">
          <Topbar />

          <div className="mt-7">
            <CountdownCard />
          </div>

          {loading ? (
            <p className="mt-8 text-sm font-bold text-[#21166A]">
              جاري تحميل أندية جامعتك...
            </p>
          ) : (
            <>
              <ClubGrid
                title="الأندية المركزية"
                clubs={centralClubs}
              />

              <ClubGrid
                title="الأندية اللامركزية"
                clubs={decentralizedClubs}
              />
            </>
          )}
        </section>

        <Sidebar />
      </div>
    </main>
  );
}