import { getFunctions, httpsCallable } from "firebase/functions";
import { getFirestore, doc, getDoc } from "firebase/firestore";
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

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

export async function getClubReport(clubId: string): Promise<ClubAIReport> {
  const db = getFirestore(app);

  // Return cached report if fresh (< 24h old)
  const cached = await getDoc(doc(db, "clubReports", clubId));
  if (cached.exists()) {
    const data = cached.data() as ClubAIReport;
    const age = data.generatedAt
      ? Date.now() - data.generatedAt.seconds * 1000
      : Infinity;
    if (age < CACHE_TTL_MS) return data;
  }

  // Call the Firebase Function to generate a fresh report
  const functions = getFunctions(app, "us-central1");
  const fn = httpsCallable<{ clubId: string }, ClubAIReport>(functions, "getClubAIReport");
  const result = await fn({ clubId });
  return result.data;
}
