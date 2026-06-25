// features/ai/hooks/useAI.ts
"use client";

import { useEffect, useState, useCallback } from "react";
import saveChallengeService, { type SavedChallenge } from "../services/saveChallenge.service";
import type { ChallengeType } from "../types/challenge.types";
import generateWeeklyChallenge from "../utils/generateWeeklyChallenge";
import { getClubById } from "@/features/clubs/services/clubs.service";

type UseAIArgs = { clubId: string; universityId: string; clubName: string; category: string };

type UseAIState = {
  challenge: ChallengeType | null;
  loading: boolean;
  error: string;
  saved?: SavedChallenge;
};

export default function useAI({ clubId, universityId, clubName, category }: UseAIArgs): UseAIState {
  const [challenge, setChallenge] = useState<ChallengeType | null>(null);
  const [saved, setSaved] = useState<SavedChallenge | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const generateChallenge = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // 1) اسحب نبض النادي من Firestore
      const clubDoc = await getClubById(clubId);
      const avgScore = clubDoc?.score ?? clubDoc?.challengeCompletion ?? 70;
      const participationRate = (clubDoc?.attendance ?? 60) / 100;

      // 2) ولّد محليًا مع hint
      const ch = generateWeeklyChallenge(clubName, category, { avgScore, participationRate });

      setChallenge(ch);

      // 3) خزّن وثيقة الأسبوع (يمنع التكرار تلقائيًا)
      const savedDoc = await saveChallengeService({ clubId, universityId, challenge: ch });
      setSaved(savedDoc);
    } catch (e) {
      console.error(e);
      setError("تعذّر توليد/حفظ التحدي.");
    } finally {
      setLoading(false);
    }
  }, [clubId, universityId, clubName, category]);

  useEffect(() => {
    generateChallenge();
  }, [generateChallenge]);

  return { challenge, loading, error, saved };
}
