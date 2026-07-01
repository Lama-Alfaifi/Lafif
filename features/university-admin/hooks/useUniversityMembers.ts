"use client";

import { useEffect, useState } from "react";
import { getUniversityMembers, type UniMember } from "../services/members.service";

export default function useUniversityMembers(universityId?: string) {
  const [members, setMembers] = useState<UniMember[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadMembers() {
    if (!universityId) { setMembers([]); setLoading(false); return; }
    setLoading(true);
    try {
      setMembers(await getUniversityMembers(universityId));
    } catch (e) {
      console.error("[useUniversityMembers]", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadMembers(); }, [universityId]);

  return { members, loading, reload: loadMembers };
}
