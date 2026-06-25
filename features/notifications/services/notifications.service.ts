import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase";
import type { Notification } from "../types/notification.types";

type CreateNotificationData = {
  userId: string;
  title: string;
  message: string;
  type: string;
};

export async function createNotification(data: CreateNotificationData) {
  await addDoc(collection(db, "notifications"), {
    ...data,
    isRead: false,
    createdAt: new Date(),
  });
}

export async function getNotifications(userId: string): Promise<Notification[]> {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...(docItem.data() as Omit<Notification, "id">),
  }));
}

export async function markAsRead(notificationId: string) {
  await updateDoc(doc(db, "notifications", notificationId), {
    isRead: true,
  });
}

export async function markAllAsRead(userId: string) {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    where("isRead", "==", false)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) return;

  const batch = writeBatch(db);
  snapshot.docs.forEach((docItem) => {
    batch.update(docItem.ref, { isRead: true });
  });

  await batch.commit();
}
