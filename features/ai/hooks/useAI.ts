"use client";

import { useState, useEffect, useCallback } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import type { ChallengeType } from "../types/challenge.types";

function getWeekKey(d = new Date()): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    (((date as unknown as number) - (yearStart as unknown as number)) / 86400000 + 1) / 7
  );
  return `${date.getUTCFullYear()}-${String(weekNo).padStart(2, "0")}`;
}

export type SavedChallenge = ChallengeType & {
  id: string;
  weekKey: string;
  clubId: string;
  universityId: string;
  createdAt?: unknown;
};

type UseAIArgs = {
  clubId: string;
  universityId: string;
  clubName: string;
  category: string;
};

type UseAIResult = {
  challenge: ChallengeType | null;
  saved: SavedChallenge | undefined;
  loading: boolean;
  generating: boolean;
  error: string;
  generate: () => Promise<void>;
};

export default function useAI({
  clubId,
  universityId,
  clubName,
  category,
}: UseAIArgs): UseAIResult {
  const [challenge, setChallenge] = useState<ChallengeType | null>(null);
  const [saved, setSaved] = useState<SavedChallenge | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  // On mount: check Firestore for this week's existing challenge
  useEffect(() => {
    if (!clubId) { setLoading(false); return; }

    async function checkExisting() {
      setLoading(true);
      try {
        const weekKey = getWeekKey();
        const docId = `${clubId}_${weekKey}`;
        const snap = await getDoc(doc(db, "challenges", docId));
        if (snap.exists()) {
          const data = snap.data() as ChallengeType & {
            weekKey?: string;
            clubId?: string;
            universityId?: string;
          };
          setChallenge(data);
          setSaved({
            id: snap.id,
            weekKey: data.weekKey ?? weekKey,
            clubId: data.clubId ?? clubId,
            universityId: data.universityId ?? universityId,
            ...data,
          });
        }
      } catch (e) {
        console.error("[useAI] checkExisting:", e);
      } finally {
        setLoading(false);
      }
    }

    checkExisting();
  }, [clubId, universityId]);

  // Generate challenge via Next.js API Route → Gemini → save to Firestore
  const generate = useCallback(async () => {
    if (!clubId || generating) return;
    setGenerating(true);
    setError("");

    try {
      const res = await fetch("/api/challenge/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clubId, clubName, category, universityId }),
      });

      const json = (await res.json()) as {
        success: boolean;
        challenge?: ChallengeType & { weekKey?: string };
        weekKey?: string;
        message?: string;
      };

      if (!json.success || !json.challenge) {
        throw new Error(json.message ?? "فشل توليد التحدي");
      }

      const generated = json.challenge;
      const weekKey = json.weekKey ?? getWeekKey();
      const docId = `${clubId}_${weekKey}`;
      const ref = doc(db, "challenges", docId);

      // Check one more time before writing (race condition guard)
      const existing = await getDoc(ref);
      if (existing.exists()) {
        const data = existing.data() as ChallengeType & { weekKey?: string };
        setChallenge(data);
        setSaved({ id: ref.id, weekKey, clubId, universityId, ...data });
        return;
      }

      // Write to Firestore
      const payload = {
        ...generated,
        clubId,
        clubName,
        universityId,
        category,
        weekKey,
        createdAt: serverTimestamp(),
      };
      await setDoc(ref, payload);

      setChallenge(generated);
      setSaved({ id: ref.id, weekKey, clubId, universityId, ...generated });
    } catch (e) {
      console.error("[useAI] generate:", e);
      setError(e instanceof Error ? e.message : "تعذّر توليد التحدي");
    } finally {
      setGenerating(false);
    }
  }, [clubId, clubName, category, universityId, generating]);

  return { challenge, saved, loading, generating, error, generate };
}
