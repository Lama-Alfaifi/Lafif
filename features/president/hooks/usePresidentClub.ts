"use client";

import { useAuth } from "@/features/auth/context/AuthContext";

export default function usePresidentClub() {
  const { profile, loading } = useAuth();

  return {
    data: profile
      ? {
          role: profile.role,
          clubId: profile.clubId,
          clubName: profile.clubName,
          universityId: profile.universityId,
          universityName: profile.universityName,
        }
      : null,
    loading,
  };
}
