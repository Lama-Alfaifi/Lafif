"use client";

import { useEffect, useState } from "react";

import { getPresidentStats } from "../services/presidentStats.service";

export default function usePresidentStats(
  clubId: string,
  universityId: string
) {
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalEvents: 0,
    totalAttendance: 0,
    averageRating: "0.0",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getPresidentStats(clubId, universityId);
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (clubId && universityId) {
      loadStats();
    }
  }, [clubId, universityId]);

  return { stats, loading };
}
