"use client";

import Sidebar from "@/features/dashboard/components/Sidebar";
import ChallengeHistoryCard from "@/features/ai/components/ChallengeHistoryCard";
import { useLanguage } from "@/features/i18n/context/LanguageContext";

export default function ChallengeHistoryPage() {
  const { dir } = useLanguage();

  return (
    <div className="flex min-h-screen bg-[#F7F5FF]">
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
          <div className="px-8 py-4" dir={dir}>
            <p className="text-xs font-bold text-[#7C3AED] mb-0.5">سجل الأداء</p>
            <h1 className="text-xl font-black text-[#21166A]">تحدياتي السابقة</h1>
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-8">
          <div className="max-w-2xl">
            <ChallengeHistoryCard />
          </div>
        </div>
      </div>

      <Sidebar />
    </div>
  );
}
