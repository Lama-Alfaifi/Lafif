import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { auth, db } from "@/src/lib/firebase";

export async function registerAttendance(
  eventId: string,
  eventTitle: string,
  clubId?: string,
  clubName?: string
) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("يجب تسجيل الدخول أولاً.");
  }

  const existingQuery = query(
    collection(db, "eventRegistrations"),
    where("eventId", "==", eventId),
    where("userId", "==", user.uid)
  );

  const existingSnapshot =
    await getDocs(existingQuery);

  if (!existingSnapshot.empty) {
    throw new Error("تم تسجيل حضورك مسبقًا.");
  }

  await addDoc(
    collection(db, "eventRegistrations"),
    {
      eventId,
      eventTitle,
      clubId: clubId || "",
      clubName: clubName || "",
      userId: user.uid,
      userEmail: user.email,
      createdAt: serverTimestamp(),
    }
  );
}