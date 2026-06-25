"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/features/auth/context/AuthContext";
import { getMyRequests } from "../services/myRequests.service";
import type { JoinRequest } from "../types/joinRequest.types";

export default function useMyRequests() {
  const { user, loading: authLoading } = useAuth();

  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;

    async function load() {
      if (!user) return;
      try {
        const data = await getMyRequests(user.uid);
        setRequests(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user?.uid, authLoading]);

  return { requests, loading };
}
