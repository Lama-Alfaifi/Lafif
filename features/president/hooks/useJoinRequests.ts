"use client";

import { useEffect, useState } from "react";

import {
  getJoinRequests,
} from "../services/joinRequests.service";

export default function useJoinRequests(
  clubId: string,
  universityId: string
) {
  const [requests, setRequests] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  async function loadRequests() {
    try {
      const data =
        await getJoinRequests(
          clubId,
          universityId
        );

      setRequests(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!clubId || !universityId) return;

    loadRequests();
  }, [clubId, universityId]);

  return {
    requests,
    loading,
    loadRequests,
  };
}