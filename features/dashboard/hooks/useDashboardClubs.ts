"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/features/auth/context/AuthContext";

import {
  getClubsByUniversity,
} from "@/features/clubs/services/clubs.service";

type DashboardClub = {
  id: string;
  name: string;
  college: string;
  category?: "central" | "decentralized";
};

export default function useDashboardClubs() {
  const {
    profile,
    loading: authLoading,
  } = useAuth();

  const [clubs, setClubs] =
    useState<DashboardClub[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadClubs() {
      if (authLoading) {
        return;
      }

      if (!profile?.universityId) {
        setClubs([]);
        setLoading(false);
        return;
      }

      try {
        const data =
          await getClubsByUniversity(
            profile.universityId
          );

        setClubs(
          data.map((club) => ({
            id: club.id || "",
            name: club.name || "",
            college: club.college || "",
            category: club.category,
          }))
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadClubs();
  }, [profile?.universityId, authLoading]);

  const centralClubs = clubs.filter(
    (club) =>
      club.category !== "decentralized"
  );

  const decentralizedClubs = clubs.filter(
    (club) =>
      club.category === "decentralized"
  );

  return {
    centralClubs,
    decentralizedClubs,
    loading,
  };
}