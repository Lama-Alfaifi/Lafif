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

  // 2. Fetch club metadata (name, category)
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
              s +
              (d.totalQuestions
                ? ((d.correctCount ?? 0) / d.totalQuestions) * 100
                : 0),
            0
          ) / submissionCount
        )
      : 0;

  const weekKeys = new Set(submissions.map((d) => d.weekKey).filter(Boolean));
  const challengeCount = weekKeys.size;

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
  };

  // 4. Generate report via API route
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

  // 5. Cache in Firestore (non-critical — silently skip if permission denied)
  try {
    await setDoc(doc(db, "clubReports", clubId), report);
  } catch {
    // ignore
  }

  return report;
}
