import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { app } from "@/src/lib/firebase";

export interface WeekStat {
  weekKey: string;
  avgScore: number;
  avgAccuracy: number;
  submissionCount: number;
}

export interface ClubAIReport {
  status: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  suggestedWorkshop: string;
  stats?: {
    eventCount: number;
    memberCount: number;
    avgAttendance: number;
    completionRate: number;
    avgScore: number;
  };
  generatedAt?: { seconds: number };
  // Computed fields — not from Gemini
  trend?: {
    direction: "improving" | "declining" | "stable";
    deltaScore: number;
    weeks: WeekStat[];
  };
  challengeAnalysis?: {
    hardest: WeekStat | null;
    easiest: WeekStat | null;
  };
  memberRankings?: {
    top: { rank: number; totalScore: number; submissionCount: number }[];
    bottom: { rank: number; totalScore: number; submissionCount: number }[];
  };
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export async function getClubReport(clubId: string): Promise<ClubAIReport> {
  const db = getFirestore(app);

  // 1. Return cached report if < 24h old
  try {
    const cached = await getDoc(doc(db, "clubReports", clubId));
    if (cached.exists()) {
      const data = cached.data() as ClubAIReport;
      const age = data.generatedAt
        ? Date.now() - data.generatedAt.seconds * 1000
        : Infinity;
      if (age < CACHE_TTL_MS) return data;
    }
  } catch {
    // Cache miss or permission denied — proceed to generate
  }

  // 2. Fetch club metadata
  const clubDoc = await getDoc(doc(db, "clubs", clubId));
  const clubData = clubDoc.data() as
    | { name?: string; category?: string; college?: string }
    | undefined;
  const clubName = clubData?.name ?? clubId;
  const category = clubData?.category ?? clubData?.college ?? "عام";

  // 3. Gather real stats in parallel
  const [membersSnap, eventsSnap, submissionsSnap, registrationsSnap] = await Promise.all([
    getDocs(query(collection(db, "users"), where("clubId", "==", clubId))),
    getDocs(query(collection(db, "events"), where("clubId", "==", clubId))),
    getDocs(query(collection(db, "challengeSubmissions"), where("clubId", "==", clubId))),
    getDocs(query(collection(db, "eventRegistrations"), where("clubId", "==", clubId))),
  ]);

  const memberCount = membersSnap.size;
  const eventCount = eventsSnap.size;
  const totalAttendance = registrationsSnap.size;
  const avgAttendanceRate =
    eventCount > 0 && memberCount > 0
      ? Math.min(100, Math.round((totalAttendance / (eventCount * memberCount)) * 100))
      : 0;

  type SubDoc = {
    score?: number;
    correctCount?: number;
    totalQuestions?: number;
    weekKey?: string;
    userId?: string;
  };
  const submissions = submissionsSnap.docs.map((d) => d.data() as SubDoc);
  const submissionCount = submissions.length;
  const totalScore = submissions.reduce((s, d) => s + (d.score ?? 0), 0);
  const avgScore = submissionCount > 0 ? Math.round(totalScore / submissionCount) : 0;
  const avgAccuracy =
    submissionCount > 0
      ? Math.round(
          submissions.reduce(
            (s, d) =>
              s + (d.totalQuestions ? ((d.correctCount ?? 0) / d.totalQuestions) * 100 : 0),
            0
          ) / submissionCount
        )
      : 0;

  const uniqueWeeks = new Set(submissions.map((d) => d.weekKey).filter(Boolean));
  const challengeCount = uniqueWeeks.size;

  // 4. Weekly breakdown for trend + challenge analysis
  const weekMap = new Map<string, { totalScore: number; totalAccuracy: number; count: number }>();
  const userMap = new Map<string, { totalScore: number; count: number }>();

  for (const d of submissions) {
    if (d.weekKey) {
      const w = weekMap.get(d.weekKey) ?? { totalScore: 0, totalAccuracy: 0, count: 0 };
      w.totalScore += d.score ?? 0;
      w.totalAccuracy += d.totalQuestions
        ? ((d.correctCount ?? 0) / d.totalQuestions) * 100
        : 0;
      w.count += 1;
      weekMap.set(d.weekKey, w);
    }
    if (d.userId) {
      const u = userMap.get(d.userId) ?? { totalScore: 0, count: 0 };
      u.totalScore += d.score ?? 0;
      u.count += 1;
      userMap.set(d.userId, u);
    }
  }

  const weeks: WeekStat[] = Array.from(weekMap.entries())
    .map(([weekKey, { totalScore: ts, totalAccuracy: ta, count }]) => ({
      weekKey,
      avgScore: Math.round(ts / count),
      avgAccuracy: Math.round(ta / count),
      submissionCount: count,
    }))
    .sort((a, b) => a.weekKey.localeCompare(b.weekKey));

  // Trend: compare last 2 weeks vs earlier average
  let trend: ClubAIReport["trend"];
  if (weeks.length >= 2) {
    const pivot = Math.max(1, weeks.length - 2);
    const recentAvg =
      weeks.slice(pivot).reduce((s, w) => s + w.avgScore, 0) / (weeks.length - pivot);
    const earlierAvg =
      weeks.slice(0, pivot).reduce((s, w) => s + w.avgScore, 0) / pivot;
    const delta = Math.round(recentAvg - earlierAvg);
    trend = {
      direction: delta > 5 ? "improving" : delta < -5 ? "declining" : "stable",
      deltaScore: delta,
      weeks,
    };
  }

  // Challenge analysis: hardest / easiest by avg accuracy
  let challengeAnalysis: ClubAIReport["challengeAnalysis"];
  if (weeks.length > 0) {
    const byAccuracy = [...weeks].sort((a, b) => a.avgAccuracy - b.avgAccuracy);
    const hardest = byAccuracy[0] ?? null;
    const easiest = byAccuracy[byAccuracy.length - 1] ?? null;
    // Only meaningful if they differ
    if (!hardest || !easiest || hardest.weekKey !== easiest.weekKey) {
      challengeAnalysis = { hardest, easiest };
    }
  }

  // Anonymous member rankings
  let memberRankings: ClubAIReport["memberRankings"];
  if (userMap.size > 0) {
    const ranked = Array.from(userMap.values())
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((u, i) => ({ rank: i + 1, totalScore: u.totalScore, submissionCount: u.count }));
    memberRankings = {
      top: ranked.slice(0, Math.min(3, ranked.length)),
      // Bottom 3 only if there are enough distinct members to avoid overlap with top 3
      bottom: ranked.length > 6 ? ranked.slice(-3) : [],
    };
  }

  const stats = {
    memberCount,
    eventCount,
    totalAttendance,
    avgAttendanceRate,
    challengeCount,
    submissionCount,
    avgScore,
    avgAccuracy,
    totalScore,
    trendDirection: trend?.direction ?? "stable",
    trendDelta: trend?.deltaScore ?? 0,
  };

  // 5. Call AI report route (Gemini generates text fields)
  const res = await fetch("/api/ai/report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clubId, clubName, category, stats }),
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message ?? "تعذر توليد التقرير");
  }

  const { report } = (await res.json()) as { report: ClubAIReport };

  // 6. Attach computed analytics fields
  const finalReport: ClubAIReport = {
    ...report,
    trend,
    challengeAnalysis,
    memberRankings,
  };

  // 7. Cache in Firestore (non-critical)
  try {
    await setDoc(doc(db, "clubReports", clubId), finalReport);
  } catch {
    // ignore
  }

  return finalReport;
}
