"use client";

import { useEffect, useState } from "react";

import { getUniversityClubs } from "../services/universityClubs.service";

type UniversityClub = {
  id: string;
  name?: string;
  college?: string;
  category?: "central" | "decentralized";
  email?: string;
  presidentId?: string;
};

export default function useUniversityClubs(
  universityId?: string
) {
  const [clubs, setClubs] = useState<UniversityClub[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadClubs() {
    if (!universityId) {
      setClubs([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data =
        (await getUniversityClubs(universityId)) as UniversityClub[];

      setClubs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClubs();
  }, [universityId]);

  return {
    clubs,
    loading,
    loadClubs,
  };
}