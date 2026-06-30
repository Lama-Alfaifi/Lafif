"use client";

import { useEffect, useState } from "react";
import {
  collection, query, where, onSnapshot,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";

export default function useJoinRequests(clubId: string, universityId: string) {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!clubId) return;

    const q = query(
      collection(db, "joinRequests"),
      where("clubId",  "==", clubId),
      where("status",  "==", "pending")
    );

    const unsub = onSnapshot(q, (snap) => {
      setRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));

    return () => unsub();
  }, [clubId]);

  // kept for compatibility with JoinRequestsCard which calls it after approve/reject
  function loadRequests() { /* no-op: onSnapshot keeps list live */ }

  return { requests, loading, loadRequests };
}
