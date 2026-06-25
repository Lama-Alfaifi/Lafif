"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/features/auth/context/AuthContext";
import { getEventsStats } from "../services/stats.service";

export default function useEventStats() {
  const { profile, loading: authLoading } = useAuth();

  const [stats, setStats] = useState({
    totalAttendance: 0,
    totalRatings: 0,
    averageRating: "0.0",
  });

  const [loading, setLoading] = useState(true);

  async function refreshStats() {
    if (!profile?.universityId) return;

    try {
      const data = await getEventsStats(profile.universityId);
      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!authLoading && profile?.universityId) {
      refreshStats();
    }
  }, [profile?.universityId, authLoading]);

  return { stats, loading, refreshStats };
}
