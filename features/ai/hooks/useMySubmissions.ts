"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { useAuth } from "@/features/auth/context/AuthContext";

export interface MySubmission {
  id: string;
  clubId: string;
  clubName?: string;
  weekKey: string;
  challengeId: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  timeSeconds: number;
  submittedAt?: { seconds: number };
}

export default function useMySubmissions() {
  const { user, loading: authLoading } = useAuth();
  const [submissions, setSubmissions] = useState<MySubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;

    async function load() {
      setLoading(true);
      try {
        const snap = await getDocs(
          query(collection(db, "challengeSubmissions"), where("userId", "==", user!.uid))
        );
        const sorted = snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as MySubmission))
          .sort((a, b) => (b.submittedAt?.seconds ?? 0) - (a.submittedAt?.seconds ?? 0));
        setSubmissions(sorted);
      } catch (e) {
        console.error("[useMySubmissions]", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user?.uid, authLoading]);

  return { submissions, loading };
}
