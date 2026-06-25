"use client";

import { useEffect, useState } from "react";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "@/src/lib/firebase";

type PresidentClub = {
  role?: string;
  clubId?: string;
  clubName?: string;
  universityId?: string;
  universityName?: string;
};

export default function usePresidentClub() {
  const [data, setData] =
    useState<PresidentClub | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadPresidentClub() {
      try {
        const user = auth.currentUser;

        if (!user) {
          setData(null);
          return;
        }

        const userRef = doc(
          db,
          "users",
          user.uid
        );

        const snapshot =
          await getDoc(userRef);

        if (snapshot.exists()) {
          setData(
            snapshot.data() as PresidentClub
          );
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadPresidentClub();
  }, []);

  return {
    data,
    loading,
  };
}