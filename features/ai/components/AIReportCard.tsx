"use client";

import { useState, useEffect } from "react";
import { Sparkles, RefreshCw, TrendingUp, AlertCircle, Lightbulb } from "lucide-react";
import { getClubReport, type ClubAIReport } from "../services/analysis.service";
import { useAuth } from "@/features/auth/context/AuthContext";

export default function AIReportCard() {
  const { profile } = useAuth();
  const [report, setReport] = useState<ClubAIReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clubId = profile?.clubId;

  useEffect(() => {
    if (!clubId) return;
    fetchReport();
  }, [clubId]);

  async function fetchReport() {
    if (!clubId) return;
    setLoading(true);
    setError("");
    try {
      const data = await getClubReport(clubId);
      setReport(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "تعذر تحميل التقرير");
    } finally {
      setLoading(false);
    }
  }

  const STATUS_COLOR: Record<string, string> = {
    "ممتاز":          "text-emerald-600 bg-emerald-50",
    "جيد جداً":       "text-blue-600 bg-blue-50",
    "جيد":            "text-amber-600 bg-amber-50",
    "يحتاج تحسين":   "text-red-600 bg-red-50",
  };

  return (
    <div className="bg-white rounded-[32px] p-7 shadow-xl border border-gray-50" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-bold text-[#7C3AED] mb-0.5">AI Smart Report</p>
          <h2 className="text-xl font-black text-[#21166A]">التقرير الذكي للنادي</h2>
        </div>
        <button
          onClick={fetchReport}
          disabled={loading}
          className="w-9 h-9 rounded-2xl bg-[#EFE8F7] text-[#7C3AED] flex items-center justify-center hover:bg-[#E0D4F5] transition disabled:opacity-40"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="w-12 h-12 rounded-[16px] bg-[#EFE8F7] flex items-center justify-center">
            <Sparkles size={20} className="text-[#7C3AED] animate-pulse" />
          </div>
          <p className="text-sm font-bold text-gray-400">جاري توليد التقرير بالذكاء الاصطناعي...</p>
          <p className="text-xs text-gray-300">قد يستغرق حتى 10 ثوانٍ</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex items-center gap-3 bg-red-50 rounded-2xl px-4 py-4">
          <AlertCircle size={16} className="text-red-500 shrink-0" />
          <div>
            <p className="text-sm font-bold text-red-600">تعذر تحميل التقرير</p>
            <p className="text-xs text-red-400 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* No club */}
      {!loading && !error && !clubId && (
        <p className="text-center text-sm text-gray-400 py-8">
          يجب أن تكون رئيساً لنادٍ لعرض التقرير.
        </p>
      )}

      {/* Report */}
      {!loading && report && (
        <div className="space-y-5">
          {/* Status + Summary */}
          <div className="bg-[#F7F5FF] rounded-[20px] p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-xs font-black px-3 py-1 rounded-full ${STATUS_COLOR[report.status] ?? "bg-gray-100 text-gray-600"}`}>
                {report.status}
              </span>
            </div>
            <p className="text-sm text-[#21166A] leading-7">{report.summary}</p>
          </div>

          {/* Stats */}
          {report.stats && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "الفعاليات", val: report.stats.eventCount },
                { label: "الأعضاء", val: report.stats.memberCount },
                { label: "الحضور", val: `${report.stats.avgAttendance}%` },
              ].map(({ label, val }) => (
                <div key={label} className="bg-gray-50 rounded-[16px] p-4 text-center">
                  <p className="text-2xl font-black text-[#21166A]">{val}</p>
                  <p className="text-[10px] text-gray-400 font-bold mt-1">{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Strengths */}
          {report.strengths?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={14} className="text-emerald-500" />
                <p className="text-xs font-black text-[#21166A]">نقاط القوة</p>
              </div>
              <ul className="space-y-1.5">
                {report.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-emerald-500 font-black mt-0.5">✓</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {report.recommendations?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={14} className="text-amber-500" />
                <p className="text-xs font-black text-[#21166A]">التوصيات</p>
              </div>
              <ul className="space-y-1.5">
                {report.recommendations.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-amber-500 font-black mt-0.5">{i + 1}.</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggested Workshop */}
          {report.suggestedWorkshop && (
            <div className="bg-[#21166A] rounded-[16px] px-5 py-4">
              <p className="text-[10px] font-bold text-white/50 mb-1">ورشة العمل المقترحة</p>
              <p className="text-sm font-black text-white">{report.suggestedWorkshop}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
