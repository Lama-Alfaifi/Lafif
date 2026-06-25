"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { useAuth } from "@/features/auth/context/AuthContext";

export type PlayerEntry = {
  userId: string;
  userName: string;
  clubName: string;
  totalScore: number;
  challengeCount: number;
  avgAccuracy: number;
};

export default function usePlayerLeaderboard() {
  const { profile, loading: authLoading } = useAuth();
  const [players, setPlayers] = useState<PlayerEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !profile?.universityId) return;

    async function fetch() {
      setLoading(true);
      try {
        const snap = await getDocs(
          query(
            collection(db, "challengeSubmissions"),
            where("universityId", "==", profile!.universityId)
          )
        );

        const map = new Map<string, PlayerEntry>();

        snap.docs.forEach((d) => {
          const data = d.data() as {
            userId: string;
            userName: string;
            clubName: string;
            score: number;
            correctCount: number;
            totalQuestions: number;
          };

          const existing = map.get(data.userId);
          const accuracy = data.totalQuestions
            ? (data.correctCount / data.totalQuestions) * 100
            : 0;

          if (existing) {
            existing.totalScore     += data.score;
            existing.challengeCount += 1;
            existing.avgAccuracy     = Math.round(
              (existing.avgAccuracy * (existing.challengeCount - 1) + accuracy) /
              existing.challengeCount
            );
          } else {
            map.set(data.userId, {
              userId:         data.userId,
              userName:       data.userName,
              clubName:       data.clubName,
              totalScore:     data.score,
              challengeCount: 1,
              avgAccuracy:    Math.round(accuracy),
            });
          }
        });

        setPlayers(
          [...map.values()].sort((a, b) => b.totalScore - a.totalScore)
        );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetch();
  }, [profile?.universityId, authLoading]);

  return { players, loading };
}
