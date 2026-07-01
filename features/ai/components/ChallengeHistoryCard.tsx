"use client";

import { Clock, Zap, Calendar } from "lucide-react";
import useMySubmissions from "../hooks/useMySubmissions";

function formatWeekKey(weekKey: string): string {
  const [year, week] = weekKey.split("-");
  return `أسبوع ${week} — ${year}`;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatDate(ts?: { seconds: number }): string {
  if (!ts) return "";
  return new Date(ts.seconds * 1000).toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ChallengeHistoryCard() {
  const { submissions, loading } = useMySubmissions();

  return (
    <div className="bg-white rounded-[32px] p-7 shadow-xl border border-gray-50" dir="rtl">
      <div className="mb-6">
        <p className="text-xs font-bold text-[#7C3AED] mb-0.5">سجل الأداء</p>
        <h2 className="text-xl font-black text-[#21166A]">تحدياتي السابقة</h2>
      </div>

      {/* Skeleton */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 rounded-[20px] bg-gray-100 animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && submissions.length === 0 && (
        <div className="text-center py-12">
          <div className="w-14 h-14 rounded-[20px] bg-[#EFE8F7] flex items-center justify-center mx-auto mb-3">
            <Zap size={22} className="text-[#7C3AED]" />
          </div>
          <p className="text-sm font-bold text-gray-400">لم تشارك في أي تحدٍّ بعد</p>
          <p className="text-xs text-gray-300 mt-1">ابدأ تحدي هذا الأسبوع من لوحة التحكم</p>
        </div>
      )}

      {/* Summary bar */}
      {!loading && submissions.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              {
                label: "التحديات",
                val: submissions.length,
              },
              {
                label: "إجمالي النقاط",
                val: submissions.reduce((s, x) => s + x.score, 0),
              },
              {
                label: "متوسط الدقة",
                val:
                  submissions.length > 0
                    ? `${Math.round(
                        submissions.reduce(
                          (s, x) =>
                            s + (x.totalQuestions ? (x.correctCount / x.totalQuestions) * 100 : 0),
                          0
                        ) / submissions.length
                      )}%`
                    : "—",
              },
            ].map(({ label, val }) => (
              <div key={label} className="bg-[#F7F5FF] rounded-[16px] p-4 text-center">
                <p className="text-xl font-black text-[#21166A]">{val}</p>
                <p className="text-[10px] text-gray-400 font-bold mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {submissions.map((s) => {
              const accuracy =
                s.totalQuestions > 0
                  ? Math.round((s.correctCount / s.totalQuestions) * 100)
                  : 0;
              const barColor =
                accuracy >= 80
                  ? "bg-emerald-400"
                  : accuracy >= 50
                  ? "bg-amber-400"
                  : "bg-red-400";
              const textColor =
                accuracy >= 80
                  ? "text-emerald-600 bg-emerald-50"
                  : accuracy >= 50
                  ? "text-amber-600 bg-amber-50"
                  : "text-red-500 bg-red-50";

              return (
                <div key={s.id} className="bg-[#F7F5FF] rounded-[20px] p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-sm font-black text-[#21166A]">
                        {formatWeekKey(s.weekKey)}
                      </p>
                      {s.clubName && (
                        <p className="text-[11px] text-gray-400 font-bold mt-0.5">{s.clubName}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Zap size={13} className="text-amber-500" />
                      <span className="text-base font-black text-[#7C3AED]">{s.score}</span>
                      <span className="text-[10px] text-gray-400 font-bold">نقطة</span>
                    </div>
                  </div>

                  {/* Accuracy bar */}
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full rounded-full transition-all ${barColor}`}
                      style={{ width: `${accuracy}%` }}
                    />
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`text-xs font-black px-2.5 py-1 rounded-full ${textColor}`}>
                      {s.correctCount}/{s.totalQuestions} صحيح ({accuracy}%)
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400 font-bold">
                      <Clock size={11} />
                      {formatTime(s.timeSeconds)}
                    </span>
                    {s.submittedAt && (
                      <span className="flex items-center gap-1 text-xs text-gray-400 font-bold">
                        <Calendar size={11} />
                        {formatDate(s.submittedAt)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
