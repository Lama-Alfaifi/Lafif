"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "@/src/lib/firebase";
import { useAuth } from "@/features/auth/context/AuthContext";

export default function useLeaderboard() {
  const { profile, loading: authLoading } = useAuth();

  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !profile?.universityId) return;

    async function fetchLeaderboard() {
      setLoading(true);
      try {
        const q = query(
          collection(db, "clubs"),
          where("universityId", "==", profile!.universityId)
        );

        const snapshot = await getDocs(q);

        const sorted = snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          // score defaults to 0 if never incremented
          .sort((a: any, b: any) => (b.score ?? 0) - (a.score ?? 0));

        setClubs(sorted);
      } catch (error) {
        console.error("[useLeaderboard]", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, [profile?.universityId, authLoading]);

  return { clubs, loading };
}
