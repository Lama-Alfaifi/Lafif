"use client";

import { useEffect, useState } from "react";

import { getEventAttendance } from "../services/attendance.service";

import type { EventAttendance } from "../types/attendance.types";

export default function useEventAttendance(
  eventId?: string
) {
  const [attendance, setAttendance] =
    useState<EventAttendance[]>([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    async function loadAttendance() {
      if (!eventId) {
        setAttendance([]);
        return;
      }

      try {
        setLoading(true);

        const data =
          (await getEventAttendance(
            eventId
          )) as EventAttendance[];

        setAttendance(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadAttendance();
  }, [eventId]);

  return {
    attendance,
    loading,
  };
}