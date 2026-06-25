// features/ai/services/saveChallenge.service.ts

import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import type { ChallengeType } from "../types/challenge.types";
import { getClubById } from "@/features/clubs/services/clubs.service";

// مفتاح أسبوع ISO مبسّط: yyyy-ww
function getWeekKey(d = new Date()): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date as unknown as number) - (yearStart as unknown as number)) / 86400000 + 1) / 7);
  const yyyy = date.getUTCFullYear();
  const ww = String(weekNo).padStart(2, "0");
  return `${yyyy}-${ww}`;
}

type SaveOpts = {
  clubId: string;
  universityId: string;
  challenge: ChallengeType;
  weekKey?: string;
  overwrite?: boolean;
};

export type SavedChallenge = ChallengeType & {
  clubId: string;
  universityId: string;
  weekKey: string;
  createdAt?: unknown;
  id: string;
  clubMetrics?: {
    attendance: number | null;
    engagement: number | null;
    score: number | null;
  } | null;
};

export default async function saveChallengeService(opts: SaveOpts): Promise<SavedChallenge> {
  const { clubId, universityId, challenge, overwrite } = opts;
  const weekKey = opts.weekKey ?? getWeekKey();
  if (!clubId) throw new Error("clubId مفقود.");

  const required: Array<keyof ChallengeType> = [
    "clubName","category","title","description","challengeType",
    "difficulty","points","duration","deadline","aiGenerated","participants",
  ];
  for (const k of required) {
    const v = challenge[k];
    if (v === undefined || v === null || (typeof v === "string" && v.trim() === "")) {
      throw new Error(`الحقل ${String(k)} مفقود أو غير صالح.`);
    }
  }

  const docId = `${clubId}_${weekKey}`;
  const ref = doc(db, "challenges", docId);

  // إعادة الموجود بصياغة متوافقة مع SavedChallenge
  const existing = await getDoc(ref);
  if (existing.exists() && !overwrite) {
    const raw = existing.data() as Partial<ChallengeType> & {
      clubId?: string;
      weekKey?: string;
      createdAt?: unknown;
      clubMetrics?: {
        attendance: number | null;
        engagement: number | null;
        score: number | null;
      } | null;
    };

    const result: SavedChallenge = {
      id: ref.id,
      clubId: raw.clubId ?? clubId,
      universityId,
      weekKey: raw.weekKey ?? weekKey,
      createdAt: raw.createdAt,
      clubMetrics: raw.clubMetrics ?? null,

      clubName: raw.clubName ?? challenge.clubName,
      category: raw.category ?? challenge.category,
      title: raw.title ?? challenge.title,
      description: raw.description ?? challenge.description,
      challengeType: raw.challengeType ?? challenge.challengeType,
      difficulty: raw.difficulty ?? challenge.difficulty,
      points: Number(raw.points ?? challenge.points ?? 0),
      duration: String(raw.duration ?? challenge.duration ?? ""),
      deadline: String(raw.deadline ?? challenge.deadline ?? ""),
      participants: Number(raw.participants ?? challenge.participants ?? 0),
      aiGenerated: Boolean(raw.aiGenerated ?? challenge.aiGenerated ?? true),
    };

    return result;
  }

  // snapshot لمقاييس النادي
  let clubMetrics: SavedChallenge["clubMetrics"] = null;
  try {
    const club = await getClubById(clubId);
    if (club) {
      clubMetrics = {
        attendance: club.attendance ?? null,
        engagement: club.engagement ?? null,
        score: club.score ?? null,
      };
    }
  } catch {
    // اختياري
  }

  const payload: Omit<SavedChallenge, "id"> = {
    ...challenge,
    clubId,
    universityId,
    weekKey,
    participants: Number.isFinite(challenge.participants) ? challenge.participants : 0,
    createdAt: serverTimestamp(),
    clubMetrics,
  };

  await setDoc(ref, payload, { merge: true });

  return { id: ref.id, ...payload };
}
