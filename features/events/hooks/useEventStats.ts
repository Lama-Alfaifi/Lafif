"use client";

import { useEffect, useState } from "react";

import { getEventsStats }
from "../services/stats.service";

export default function useEventStats() {

  const [stats, setStats] =
    useState({
      totalAttendance: 0,
      totalRatings: 0,
      averageRating: "0.0",
    });

  const [loading, setLoading] =
    useState(true);

  async function refreshStats() {

    try {

      const data =
        await getEventsStats();

      setStats(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    refreshStats();

  }, []);

  return {
    stats,
    loading,
    refreshStats,
  };
}