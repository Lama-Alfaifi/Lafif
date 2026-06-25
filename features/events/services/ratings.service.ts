import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { auth, db } from "@/src/lib/firebase";

export async function submitRating(
  eventId: string,
  eventTitle: string,
  clubId: string,
  clubName: string,
  rating: number
) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("يجب تسجيل الدخول أولاً.");
  }

  const existingQuery = query(
    collection(db, "eventRatings"),
    where("eventId", "==", eventId),
    where("userId", "==", user.uid)
  );

  const existingSnapshot =
    await getDocs(existingQuery);

  if (!existingSnapshot.empty) {
    throw new Error("تم تقييم هذه الفعالية مسبقًا.");
  }

  await addDoc(
    collection(db, "eventRatings"),
    {
      eventId,
      eventTitle,
      clubId,
      clubName,
      userId: user.uid,
      userEmail: user.email,
      rating,
      createdAt: serverTimestamp(),
    }
  );
}