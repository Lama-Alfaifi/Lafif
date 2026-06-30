"use client";

import { useState, useEffect, useCallback } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import type { ChallengeType } from "../types/challenge.types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getWeekKey(d = new Date()): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    (((date as unknown as number) - (yearStart as unknown as number)) / 86400000 + 1) / 7
  );
  return `${date.getUTCFullYear()}-${String(weekNo).padStart(2, "0")}`;
}

/** Returns ms remaining until Sunday 23:59 (end of ISO week) */
export function msUntilWeekEnd(): number {
  const now = new Date();
  const daysUntilSunday = now.getDay() === 0 ? 0 : 7 - now.getDay();
  const deadline = new Date(now);
  deadline.setDate(now.getDate() + daysUntilSunday);
  deadline.setHours(23, 59, 59, 999);
  return Math.max(0, deadline.getTime() - now.getTime());
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return "انتهى التحدي";
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  const mins = Math.floor((ms % 3_600_000) / 60_000);
  if (days > 0) return `${days} ${days === 1 ? "يوم" : "أيام"} و${hours} ساعة`;
  if (hours > 0) return `${hours} ${hours === 1 ? "ساعة" : "ساعات"} و${mins} دقيقة`;
  return `${mins} ${mins === 1 ? "دقيقة" : "دقائق"}`;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type SavedChallenge = ChallengeType & {
  id: string;
  weekKey: string;
  clubId: string;
  universityId: string;
  createdAt?: unknown;
};

type GenerateArgs = {
  clubId: string;
  clubName: string;
  category: string;
  universityId: string;
};

type UseAIResult = {
  challenge: ChallengeType | null;
  saved: SavedChallenge | undefined;
  /** true while reading Firestore on mount */
  loading: boolean;
  /** true while calling the API / writing to Firestore */
  generating: boolean;
  error: string;
  /** Manually trigger re-generation (for the refresh button) */
  generate: () => Promise<void>;
};

// ─── Standalone generate logic (no stale-closure risk) ───────────────────────

async function callGenerateAPI(args: GenerateArgs): Promise<{
  challenge: ChallengeType & { weekKey?: string };
  weekKey: string;
}> {
  const res = await fetch("/api/challenge/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
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

  return {
    challenge: json.challenge,
    weekKey: json.weekKey ?? getWeekKey(),
  };
}

async function saveToFirestore(
  args: GenerateArgs,
  challenge: ChallengeType & { weekKey?: string },
  weekKey: string
): Promise<SavedChallenge> {
  const docId = `${args.clubId}_${weekKey}`;
  const ref = doc(db, "challenges", docId);

  // Race-condition guard: check again before writing
  const existing = await getDoc(ref);
  if (existing.exists()) {
    const data = existing.data() as ChallengeType & { weekKey?: string };
    return { id: ref.id, weekKey, clubId: args.clubId, universityId: args.universityId, ...data };
  }

  const payload = {
    ...challenge,
    clubId: args.clubId,
    clubName: args.clubName,
    universityId: args.universityId,
    category: args.category,
    weekKey,
    createdAt: serverTimestamp(),
  };
  await setDoc(ref, payload);
  return { id: ref.id, weekKey, clubId: args.clubId, universityId: args.universityId, ...challenge };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export default function useAI({
  clubId,
  universityId,
  clubName,
  category,
}: GenerateArgs): UseAIResult {
  const [challenge, setChallenge] = useState<ChallengeType | null>(null);
  const [saved, setSaved] = useState<SavedChallenge | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  // ── Internal generate (shared by auto + manual) ───────────────────────────
  const runGenerate = useCallback(
    async (args: GenerateArgs) => {
      setGenerating(true);
      setError("");
      try {
        const { challenge: generated, weekKey } = await callGenerateAPI(args);
        const savedDoc = await saveToFirestore(args, generated, weekKey);
        setChallenge(generated);
        setSaved(savedDoc);
      } catch (e) {
        console.error("[useAI] generate:", e);
        setError(e instanceof Error ? e.message : "تعذّر توليد التحدي");
      } finally {
        setGenerating(false);
      }
    },
    []
  );

  // ── On mount: check Firestore → auto-generate if missing ─────────────────
  useEffect(() => {
    if (!clubId) { setLoading(false); return; }

    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const weekKey = getWeekKey();
        const snap = await getDoc(doc(db, "challenges", `${clubId}_${weekKey}`));

        if (cancelled) return;

        if (snap.exists()) {
          const data = snap.data() as ChallengeType & { weekKey?: string; clubId?: string; universityId?: string };
          setChallenge(data);
          setSaved({
            id: snap.id,
            weekKey: data.weekKey ?? weekKey,
            clubId: data.clubId ?? clubId,
            universityId: data.universityId ?? universityId,
            ...data,
          });
          setLoading(false);
        } else {
          // No challenge this week → auto-generate
          setLoading(false);
          await runGenerate({ clubId, clubName, category, universityId });
        }
      } catch (e) {
        if (!cancelled) {
          console.error("[useAI] mount:", e);
          setLoading(false);
        }
      }
    })();

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubId, universityId]); // intentionally omit clubName/category/runGenerate — stable after first render

  // ── Manual regenerate (refresh button) ───────────────────────────────────
  const generate = useCallback(async () => {
    if (!clubId || generating) return;
    await runGenerate({ clubId, clubName, category, universityId });
  }, [clubId, clubName, category, universityId, generating, runGenerate]);

  return { challenge, saved, loading, generating, error, generate };
}
