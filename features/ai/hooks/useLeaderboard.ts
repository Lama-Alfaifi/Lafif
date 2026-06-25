"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "@/src/lib/firebase";
import { useAuth } from "@/features/auth/context/AuthContext";

export default function useLeaderboard() {
  const { profile, loading: authLoading } = useAuth();

  const [clubs, setClubs] = useState<any[]>([]);

  useEffect(() => {
    if (authLoading || !profile?.universityId) return;

    async function fetchLeaderboard() {
      try {
        const q = query(
          collection(db, "clubs"),
          where("universityId", "==", profile!.universityId)
        );

        const snapshot = await getDocs(q);

        const sorted = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a: any, b: any) => b.score - a.score);

        setClubs(sorted);
      } catch (error) {
        console.error(error);
      }
    }

    fetchLeaderboard();
  }, [profile?.universityId, authLoading]);

  return clubs;
}
