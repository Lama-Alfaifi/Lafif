"use client";

import { useEffect, useState } from "react";

import { checkAttendance } from "../services/checkAttendance.service";

export default function useAttendance(eventId?: string) {
  const [hasAttended, setHasAttended] = useState(false);

  useEffect(() => {
    async function check() {
      if (!eventId) {
        setHasAttended(false);
        return;
      }

      const result = await checkAttendance(eventId);

      setHasAttended(result);
    }

    check();
  }, [eventId]);

  return {
    hasAttended,
    setHasAttended,
  };
}