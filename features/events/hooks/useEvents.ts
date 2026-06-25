"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/features/auth/context/AuthContext";

import type { EventItem } from "../types/event.types";

import { getEventsByUniversity } from "../services/events.service";

export default function useEvents() {
  const {
    profile,
    loading: authLoading,
  } = useAuth();

  const [events, setEvents] =
    useState<EventItem[]>([]);

  const [selectedEvent, setSelectedEvent] =
    useState<EventItem | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function fetchEvents() {
      if (authLoading) {
        return;
      }

      if (!profile?.universityId) {
        setEvents([]);
        setSelectedEvent(null);
        setLoading(false);
        return;
      }

      try {
        const fetchedEvents =
          await getEventsByUniversity(
            profile.universityId
          );

        setEvents(fetchedEvents);

        if (fetchedEvents.length > 0) {
          setSelectedEvent(fetchedEvents[0]);
        } else {
          setSelectedEvent(null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [profile?.universityId, authLoading]);

  return {
    events,
    selectedEvent,
    setSelectedEvent,
    loading,
  };
}