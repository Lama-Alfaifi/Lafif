"use client";

import { useEffect, useState, useCallback } from "react";
import { getClubEvents } from "../services/clubEvents.service";

export default function useClubEvents(
  clubId: string,
  universityId: string,
  refreshKey?: number
) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = useCallback(async () => {
    if (!clubId || !universityId) return;
    setLoading(true);
    try {
      const data = await getClubEvents(clubId, universityId);
      setEvents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [clubId, universityId]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents, refreshKey]);

  return { events, loading, reloadEvents: loadEvents };
}
