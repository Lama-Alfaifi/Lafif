"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/features/auth/context/AuthContext";
import { getClubById } from "@/features/clubs/services/clubs.service";

export default function useClubAnalytics() {
  const { profile, loading: authLoading } = useAuth();

  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !profile?.clubId) {
      setLoading(false);
      return;
    }

    async function fetchAnalytics() {
      try {
        const club = await getClubById(profile!.clubId!);

        setAnalytics({
          score: club?.score || 0,
          attendance: club?.attendance || 0,
          engagement: club?.engagement || 0,
          challengeCompletion: club?.challengeCompletion || 0,
          insight: {
            status: "النادي يحقق أداء ممتاز",
            recommendation: "ننصح بإضافة تحديات وورش جديدة",
          },
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [profile?.clubId, authLoading]);

  return { analytics, loading };
}
