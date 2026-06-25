import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase";

import { createNotification } from "@/features/notifications/services/notifications.service";

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

export async function approveJoinRequest(
  requestId: string
) {
  const requestRef = doc(db, "joinRequests", requestId);
  const requestSnap = await getDoc(requestRef);

  if (!requestSnap.exists()) {
    throw new Error("طلب الانضمام غير موجود");
  }

  const request = requestSnap.data();

  await updateDoc(requestRef, {
    status: "approved",
    reviewedAt: serverTimestamp(),
  });

  await addDoc(collection(db, "clubMembers"), {
    userId: request.userId,
    userName: request.userName || "",
    userEmail: request.userEmail || "",

    clubId: request.clubId,
    clubName: request.clubName || "",

    universityId: request.universityId,
    universityName: request.universityName || "",

    role: "member",
    joinedAt: serverTimestamp(),
  });

  await createNotification({
    userId: request.userId,
    title: "تم قبول طلب الانضمام",
    message: `تم قبول طلب انضمامك إلى ${request.clubName}. يمكنك الآن المشاركة كعضو في النادي.`,
    type: "join-approved",
  });
}

export async function rejectJoinRequest(
  requestId: string
) {
  const requestRef = doc(db, "joinRequests", requestId);
  const requestSnap = await getDoc(requestRef);

  if (!requestSnap.exists()) {
    throw new Error("طلب الانضمام غير موجود");
  }

  const request = requestSnap.data();

  await updateDoc(requestRef, {
    status: "rejected",
    reviewedAt: serverTimestamp(),
  });

  await createNotification({
    userId: request.userId,
    title: "بخصوص طلب الانضمام للنادي",
    message: `نشكر لك رغبتك في الانضمام إلى ${request.clubName}. نعتذر، لم تتم الموافقة على طلبك حاليًا، ونسعد بمشاركتك في فعاليات النادي القادمة.`,
    type: "join-rejected",
  });
}