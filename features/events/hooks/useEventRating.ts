"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getMyRating,
  getEventRatingStats,
  type EventRating,
  type RatingStats,
} from "../services/ratings.service";

export function useEventRating(userId?: string, eventId?: string) {
  const [myRating, setMyRating]   = useState<EventRating | null>(null);
  const [stats, setStats]         = useState<RatingStats | null>(null);
  const [loading, setLoading]     = useState(false);

  const load = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      const [rating, s] = await Promise.all([
        userId ? getMyRating(userId, eventId) : Promise.resolve(null),
        getEventRatingStats(eventId),
      ]);
      setMyRating(rating);
      setStats(s);
    } finally {
      setLoading(false);
    }
  }, [userId, eventId]);

  useEffect(() => { load(); }, [load]);

  return { myRating, stats, loading, reload: load };
}
