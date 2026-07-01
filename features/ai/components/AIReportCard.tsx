"use client";

import { useState, useEffect } from "react";
import {
  Sparkles, RefreshCw, TrendingUp, TrendingDown,
  Minus, AlertCircle, AlertTriangle, Lightbulb,
  Users, Target,
} from "lucide-react";
import { getClubReport, type ClubAIReport, type WeekStat } from "../services/analysis.service";
import { useAuth } from "@/features/auth/context/AuthContext";

// ─── helpers ────────────────────────────────────────────────────────────────

function formatWeekKey(weekKey: string): string {
  const [year, week] = weekKey.split("-");
  return `أسبوع ${week} — ${year}`;
}

const STATUS_COLOR: Record<string, string> = {
  "ممتاز":        "text-emerald-600 bg-emerald-50",
  "جيد جداً":     "text-blue-600 bg-blue-50",
  "جيد":          "text-amber-600 bg-amber-50",
  "يحتاج تحسين": "text-red-600 bg-red-50",
};

// ─── sub-components ─────────────────────────────────────────────────────────

function TrendSection({ trend }: { trend: NonNullable<ClubAIReport["trend"]> }) {
  const TrendIcon =
    trend.direction === "improving" ? TrendingUp
    : trend.direction === "declining" ? TrendingDown
    : Minus;

  const badgeColor =
    trend.direction === "improving" ? "text-emerald-600 bg-emerald-50"
    : trend.direction === "declining" ? "text-red-600 bg-red-50"
    : "text-gray-600 bg-gray-100";

  const label =
    trend.direction === "improving" ? "تحسّن مستمر"
    : trend.direction === "declining" ? "تراجع ملحوظ"
    : "أداء مستقر";

  const maxScore = Math.max(...trend.weeks.map((w) => w.avgScore), 1);

  return (
    <div className="rounded-[20px] border border-gray-100 p-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp size={14} className="text-gray-400" />
        <p className="text-xs font-black text-[#21166A]">اتجاه الأداء عبر الزمن</p>
      </div>

      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <span className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full ${badgeColor}`}>
          <TrendIcon size={12} />
          {label}
        </span>
        {trend.deltaScore !== 0 && (
          <span className={`text-xs font-bold ${trend.deltaScore > 0 ? "text-emerald-600" : "text-red-500"}`}>
            {trend.deltaScore > 0 ? "+" : ""}{trend.deltaScore} نقطة مقارنةً بالأسابيع السابقة
          </span>
        )}
      </div>

      {/* Mini bar chart */}
      <div className="flex items-end gap-1 h-10">
        {trend.weeks.map((w) => (
          <div
            key={w.weekKey}
            className="flex-1 rounded-t-sm bg-[#7C3AED]/25 hover:bg-[#7C3AED]/55 transition cursor-default"
            style={{ height: `${Math.max(6, Math.round((w.avgScore / maxScore) * 40))}px` }}
            title={`${formatWeekKey(w.weekKey)}: ${w.avgScore} نقطة`}
          />
        ))}
      </div>
      <div className="flex justify-between text-[9px] text-gray-300 mt-1 font-medium">
        <span>{formatWeekKey(trend.weeks[0].weekKey)}</span>
        <span>{formatWeekKey(trend.weeks[trend.weeks.length - 1].weekKey)}</span>
      </div>
    </div>
  );
}

function ChallengeCard({ week, label, accent }: { week: WeekStat; label: string; accent: string }) {
  return (
    <div className={`rounded-[14px] p-3 ${accent}`}>
      <p className="text-[10px] font-bold opacity-60 mb-1">{label}</p>
      <p className="text-xs font-black opacity-90">{formatWeekKey(week.weekKey)}</p>
      <p className="text-[11px] opacity-70 mt-1">متوسط دقة {week.avgAccuracy}%</p>
    </div>
  );
}

function MemberBar({
  member,
  maxScore,
  barColor,
}: {
  member: { rank: number; totalScore: number; submissionCount: number };
  maxScore: number;
  barColor: string;
}) {
  const pct = Math.min(100, Math.round((member.totalScore / (maxScore || 1)) * 100));
  return (
    <div className="flex items-center gap-3">
      <span className={`w-6 h-6 rounded-full text-white text-[10px] font-black flex items-center justify-center shrink-0 ${barColor}`}>
        {member.rank}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-[#21166A]">{member.totalScore} نقطة</span>
          <span className="text-[10px] text-gray-400">{member.submissionCount} تسليم</span>
        </div>
        <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── main component ──────────────────────────────────────────────────────────

export default function AIReportCard() {
  const { profile } = useAuth();
  const [report, setReport] = useState<ClubAIReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clubId = profile?.clubId;

  useEffect(() => {
    if (!clubId) return;
    fetchReport();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubId]);

  async function fetchReport() {
    if (!clubId) return;
    setLoading(true);
    setError("");
    try {
      setReport(await getClubReport(clubId));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "تعذر تحميل التقرير");
    } finally {
      setLoading(false);
    }
  }

  const topMaxScore = report?.memberRankings?.top[0]?.totalScore ?? 1;

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
          <p className="text-xs text-gray-300">قد يستغرق حتى 15 ثانية</p>
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

          {/* ── Status + Summary ── */}
          <div className="bg-[#F7F5FF] rounded-[20px] p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-xs font-black px-3 py-1 rounded-full ${STATUS_COLOR[report.status] ?? "bg-gray-100 text-gray-600"}`}>
                {report.status}
              </span>
            </div>
            <p className="text-sm text-[#21166A] leading-7">{report.summary}</p>
          </div>

          {/* ── Stats Grid ── */}
          {report.stats && (
            <div className="grid grid-cols-3 gap-3">
              {([
                { label: "الفعاليات", val: report.stats.eventCount },
                { label: "الأعضاء",   val: report.stats.memberCount },
                { label: "الحضور",    val: `${report.stats.avgAttendance}%` },
              ] as { label: string; val: string | number }[]).map(({ label, val }) => (
                <div key={label} className="bg-gray-50 rounded-[16px] p-4 text-center">
                  <p className="text-2xl font-black text-[#21166A]">{val}</p>
                  <p className="text-[10px] text-gray-400 font-bold mt-1">{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── Trend ── */}
          {report.trend && report.trend.weeks.length >= 2 && (
            <TrendSection trend={report.trend} />
          )}

          {/* ── Strengths ── */}
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

          {/* ── Weaknesses ── */}
          {report.weaknesses?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={14} className="text-red-400" />
                <p className="text-xs font-black text-[#21166A]">نقاط الضعف</p>
              </div>
              <ul className="space-y-1.5">
                {report.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-red-400 font-black mt-0.5">!</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Challenge Breakdown ── */}
          {report.challengeAnalysis &&
            (report.challengeAnalysis.hardest || report.challengeAnalysis.easiest) && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target size={14} className="text-[#7C3AED]" />
                <p className="text-xs font-black text-[#21166A]">تحليل التحديات</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {report.challengeAnalysis.hardest && (
                  <ChallengeCard
                    week={report.challengeAnalysis.hardest}
                    label="الأصعب"
                    accent="bg-red-50 text-red-700"
                  />
                )}
                {report.challengeAnalysis.easiest && (
                  <ChallengeCard
                    week={report.challengeAnalysis.easiest}
                    label="الأسهل"
                    accent="bg-emerald-50 text-emerald-700"
                  />
                )}
              </div>
            </div>
          )}

          {/* ── Member Rankings ── */}
          {report.memberRankings && report.memberRankings.top.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users size={14} className="text-[#7C3AED]" />
                <p className="text-xs font-black text-[#21166A]">أداء الأعضاء (مجهول)</p>
              </div>

              <p className="text-[10px] font-bold text-gray-400 mb-2">الأعلى نشاطاً</p>
              <div className="space-y-2 mb-3">
                {report.memberRankings.top.map((m) => (
                  <MemberBar
                    key={m.rank}
                    member={m}
                    maxScore={topMaxScore}
                    barColor="bg-[#7C3AED]"
                  />
                ))}
              </div>

              {report.memberRankings.bottom.length > 0 && (
                <>
                  <p className="text-[10px] font-bold text-gray-400 mb-2">الأقل نشاطاً</p>
                  <div className="space-y-2">
                    {report.memberRankings.bottom.map((m) => (
                      <MemberBar
                        key={m.rank}
                        member={m}
                        maxScore={topMaxScore}
                        barColor="bg-gray-300"
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── Recommendations ── */}
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

          {/* ── Suggested Workshop ── */}
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
