"use client";

import { useEffect, useState }
from "react";

import {
  getClubEvents,
} from "../services/clubEvents.service";

export default function useClubEvents(
  clubId: string
) {

  const [events, setEvents] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function loadEvents() {

      try {

        const data =
          await getClubEvents(clubId);

        setEvents(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    }

    loadEvents();

  }, []);

  return {
    events,
    loading,
  };
}