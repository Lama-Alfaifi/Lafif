import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase";

type NotificationData = {
  userId: string;
  title: string;
  message: string;
  type: string;
};

export async function createNotification(
  data: NotificationData
) {
  await addDoc(collection(db, "notifications"), {
    ...data,
    isRead: false,
    createdAt: serverTimestamp(),
  });
}