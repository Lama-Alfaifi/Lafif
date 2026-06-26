import {
  collection,
  getDocs,
  getDoc,
  query,
  where,
  updateDoc,
  addDoc,
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
    where("status", "==", "pending")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  }));
}

export async function approveJoinRequest(requestId: string) {
  // 1. Read request data to get userId, clubId, clubName
  const requestRef = doc(db, "joinRequests", requestId);
  const requestSnap = await getDoc(requestRef);
  if (!requestSnap.exists()) throw new Error("الطلب غير موجود.");

  const data = requestSnap.data() as {
    userId: string;
    userName?: string;
    clubId: string;
    clubName: string;
    universityId?: string;
    universityName?: string;
  };

  // 2. Mark request as approved
  await updateDoc(requestRef, {
    status: "approved",
    reviewedAt: serverTimestamp(),
  });

  // 3. Promote user to member and assign club
  await updateDoc(doc(db, "users", data.userId), {
    role: "member",
    clubId: data.clubId,
    clubName: data.clubName,
  });

  // 4. Send notification to the member
  await addDoc(collection(db, "notifications"), {
    userId: data.userId,
    title: "تم قبول طلب انضمامك",
    message: `مرحباً ${data.userName ?? ""}! تم قبول طلب انضمامك إلى ${data.clubName}.`,
    type: "join_approved",
    isRead: false,
    createdAt: serverTimestamp(),
  });
}

export async function rejectJoinRequest(requestId: string) {
  // 1. Read request data to notify the member
  const requestRef = doc(db, "joinRequests", requestId);
  const requestSnap = await getDoc(requestRef);

  const data = requestSnap.exists()
    ? (requestSnap.data() as { userId: string; userName?: string; clubName: string })
    : null;

  // 2. Mark request as rejected
  await updateDoc(requestRef, {
    status: "rejected",
    reviewedAt: serverTimestamp(),
  });

  // 3. Notify the member
  if (data?.userId) {
    await addDoc(collection(db, "notifications"), {
      userId: data.userId,
      title: "تم رفض طلب انضمامك",
      message: `عذراً ${data.userName ?? ""}، تم رفض طلب انضمامك إلى ${data.clubName}.`,
      type: "join_rejected",
      isRead: false,
      createdAt: serverTimestamp(),
    });
  }
}
