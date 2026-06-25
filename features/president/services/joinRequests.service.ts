import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase";

export async function getJoinRequests(
  clubId: string,
  universityId: string
) {
  const q = query(
    collection(db, "joinRequests"),
    where("clubId", "==", clubId),
    where("universityId", "==", universityId),
    where("status", "==", "pending")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  }));
}

// Only updates the status field.
// Role update, clubMembers creation, and notification
// are handled server-side by the onJoinRequestUpdated Firebase Function.
export async function approveJoinRequest(requestId: string) {
  await updateDoc(doc(db, "joinRequests", requestId), {
    status: "approved",
    reviewedAt: serverTimestamp(),
  });
}

export async function rejectJoinRequest(requestId: string) {
  await updateDoc(doc(db, "joinRequests", requestId), {
    status: "rejected",
    reviewedAt: serverTimestamp(),
  });
}
