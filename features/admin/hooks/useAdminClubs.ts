"use client";

import { useEffect, useState } from "react";

import { getClubsByUniversity } from "../services/clubs.service";

import type { ClubOption } from "../types/admin.types";

export default function useAdminClubs(universityId?: string) {
  const [clubs, setClubs] = useState<ClubOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!universityId) {
      setClubs([]);
      setLoading(false);
      return;
    }

    getClubsByUniversity(universityId)
      .then(setClubs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [universityId]);

  return { clubs, loading };
}
