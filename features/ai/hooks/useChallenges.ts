"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "@/src/lib/firebase";
import { useAuth } from "@/features/auth/context/AuthContext";

export default function useChallenges() {
  const { profile, loading: authLoading } = useAuth();

  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !profile?.universityId) return;

    async function fetchChallenges() {
      try {
        const q = query(
          collection(db, "challenges"),
          where("universityId", "==", profile!.universityId)
        );

        const snapshot = await getDocs(q);

        setChallenges(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchChallenges();
  }, [profile?.universityId, authLoading]);

  return { challenges, loading };
}
