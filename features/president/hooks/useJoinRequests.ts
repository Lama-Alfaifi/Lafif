"use client";

import { useEffect, useState } from "react";
import {
  collection, query, where, onSnapshot,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";

export default function useJoinRequests(clubId: string, universityId: string) {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string>("");

  useEffect(() => {
    if (!clubId) {
      setLoading(false);
      return;
    }

    setError("");

    const q = query(
      collection(db, "joinRequests"),
      where("clubId", "==", clubId),
      where("status", "==", "pending")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        setRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        // Surface the real error so we can diagnose clubId mismatches or missing indexes
        console.error("[useJoinRequests] Firestore error:", err.code, err.message, { clubId });
        setError(`خطأ في جلب الطلبات: ${err.code}`);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [clubId]);

  // kept for compatibility with JoinRequestsCard which calls it after approve/reject
  function loadRequests() { /* no-op: onSnapshot keeps list live */ }

  return { requests, loading, error, loadRequests };
}
