"use client";

import useLeaderboard from "@/features/ai/hooks/useLeaderboard";

export default function Leaderboard() {
  const { clubs, loading } = useLeaderboard();

  if (loading) {
    return (
      <div className="bg-white rounded-[32px] p-7 shadow-xl animate-pulse">
        <div className="h-4 w-24 rounded-full bg-gray-200 mb-2" />
        <div className="h-6 w-36 rounded-2xl bg-gray-200 mb-6" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 mb-3">
            <div className="w-10 h-10 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-28 rounded-full bg-gray-200" />
              <div className="h-2 w-16 rounded-full bg-gray-100" />
            </div>
            <div className="h-6 w-14 rounded-full bg-gray-200" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] p-7 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-amber-500 font-bold">AI Ranking</p>
          <h1 className="text-2xl font-black mt-2 text-[#0F172A]">ترتيب الأندية</h1>
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-4">
        {clubs.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">لا توجد بيانات بعد</p>
        )}
        {clubs.map((club: any, index: number) => (
          <div
            key={club.id}
            className="flex items-center justify-between bg-gray-50 rounded-2xl p-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-black">
                {index + 1}
              </div>
              <div>
                <h1 className="font-black text-[#0F172A]">{club.name}</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {club.type === "central" ? "نادي مركزي" : "نادي لامركزي"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-black text-emerald-500">{club.score ?? 0}</h1>
              <p className="text-xs text-gray-400">AI Score</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
