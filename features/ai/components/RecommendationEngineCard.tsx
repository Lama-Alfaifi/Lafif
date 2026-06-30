"use client";

import { useState, useEffect } from "react";
import { getClubReport, type ClubAIReport } from "../services/analysis.service";
import { useAuth } from "@/features/auth/context/AuthContext";

export default function RecommendationEngineCard() {
  const { profile } = useAuth();
  const [report, setReport] = useState<ClubAIReport | null>(null);

  useEffect(() => {
    if (!profile?.clubId) return;
    getClubReport(profile.clubId)
      .then(setReport)
      .catch(() => null);
  }, [profile?.clubId]);

  const level = report
    ? report.status === "ممتاز"
      ? "مرتفع"
      : report.status === "جيد جداً"
      ? "متوسط-عالي"
      : report.status === "جيد"
      ? "متوسط"
      : "منخفض"
    : "—";

  const priority = report
    ? report.status === "ممتاز"
      ? "High"
      : report.status === "يحتاج تحسين"
      ? "Critical"
      : "Medium"
    : "—";

  return (
    <div className="bg-white rounded-[32px] p-7 shadow-xl" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-emerald-600 font-bold">AI Recommendation Engine</p>
          <h1 className="text-2xl font-black mt-2 text-[#0F172A]">توصيات تطوير النادي</h1>
        </div>
        <div className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold">
          {priority}
        </div>
      </div>

      <div className="mt-8 bg-gray-50 rounded-3xl p-6">
        <p className="text-sm text-gray-400">توصية AI</p>
        <h1 className="mt-3 text-xl font-black leading-10 text-[#0F172A]">
          {report?.recommendations?.[0] ?? "جاري التحليل..."}
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-gray-50 rounded-2xl p-5">
          <p className="text-sm text-gray-400">مستوى النادي</p>
          <h1 className="mt-2 text-2xl font-black">{level}</h1>
        </div>
        <div className="bg-gray-50 rounded-2xl p-5">
          <p className="text-sm text-gray-400">الورشة المقترحة</p>
          <h1 className="mt-2 text-xl font-black">
            {report?.suggestedWorkshop ?? "—"}
          </h1>
        </div>
      </div>
    </div>
  );
}
