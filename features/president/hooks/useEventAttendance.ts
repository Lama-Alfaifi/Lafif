"use client";

import { useEffect, useState } from "react";

import { getEventAttendance } from "../services/attendance.service";

import type { EventAttendance } from "../types/attendance.types";

export default function useEventAttendance(
  eventId?: string,
  universityId?: string
) {
  const [attendance, setAttendance] = useState<EventAttendance[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadAttendance() {
      if (!eventId || !universityId) {
        setAttendance([]);
        return;
      }

      try {
        setLoading(true);
        const data = (await getEventAttendance(
          eventId,
          universityId
        )) as EventAttendance[];
        setAttendance(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadAttendance();
  }, [eventId, universityId]);

  return { attendance, loading };
}
