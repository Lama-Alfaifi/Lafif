"use client";

import Sidebar from "@/features/dashboard/components/Sidebar";
import Topbar from "@/features/dashboard/components/Topbar";
import CountdownCard from "@/features/dashboard/components/CountdownCard";
import ClubGrid from "@/features/dashboard/components/ClubGrid";
import useDashboardClubs from "@/features/dashboard/hooks/useDashboardClubs";

export default function DashboardPage() {
  const { centralClubs, decentralizedClubs, loading } = useDashboardClubs();

  return (
    <div className="flex min-h-screen bg-[#F7F5FF]">
      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />

        <div className="flex-1 p-6 lg:p-8">
          {/* Background blobs */}
          <div className="pointer-events-none fixed -top-24 -left-24 w-96 h-96 rounded-full bg-purple-300/15 blur-3xl" />
          <div className="pointer-events-none fixed bottom-10 right-80 w-80 h-80 rounded-full bg-emerald-200/15 blur-3xl" />

          <div className="relative">
            <CountdownCard />

            {loading ? (
              <div className="mt-12 flex items-center justify-center py-12">
                <p className="text-sm font-bold text-[#21166A]">
                  جاري تحميل أندية جامعتك...
                </p>
              </div>
            ) : (
              <>
                <ClubGrid title="الأندية المركزية"    clubs={centralClubs} />
                <ClubGrid title="الأندية اللامركزية" clubs={decentralizedClubs} />
              </>
            )}
          </div>
        </div>
      </div>

      <Sidebar />
    </div>
  );
}
