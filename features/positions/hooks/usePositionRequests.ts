"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getPendingVPRequests,
  getPendingPresidentRequests,
  getMyPositionRequests,
  type PositionRequest,
} from "../services/positionRequests.service";

/* ── My own requests (member view) ──────────────────────────────── */
export function useMyPositionRequests(userId?: string) {
  const [requests, setRequests] = useState<PositionRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      setRequests(await getMyPositionRequests(userId));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const pendingVP        = requests.find((r) => r.position === "vicePresident" && r.status === "pending");
  const pendingPresident = requests.find((r) => r.position === "president"     && r.status === "pending");

  return { requests, loading, reload: load, pendingVP, pendingPresident };
}

/* ── Pending VP requests (president view) ────────────────────────── */
export function usePendingVPRequests(clubId?: string) {
  const [requests, setRequests] = useState<PositionRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!clubId) return;
    setLoading(true);
    try {
      setRequests(await getPendingVPRequests(clubId));
    } finally {
      setLoading(false);
    }
  }, [clubId]);

  useEffect(() => { load(); }, [load]);

  return { requests, loading, reload: load };
}

/* ── Pending president requests (universityAdmin view) ───────────── */
export function usePendingPresidentRequests(universityId?: string) {
  const [requests, setRequests] = useState<PositionRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!universityId) return;
    setLoading(true);
    try {
      setRequests(await getPendingPresidentRequests(universityId));
    } finally {
      setLoading(false);
    }
  }, [universityId]);

  useEffect(() => { load(); }, [load]);

  return { requests, loading, reload: load };
}
