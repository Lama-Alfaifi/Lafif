import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { auth, db } from "@/src/lib/firebase";

export async function checkAttendance(
  eventId: string
) {

  const user = auth.currentUser;

  if (!user) {
    return false;
  }

  const q = query(
    collection(db, "eventRegistrations"),
    where("eventId", "==", eventId),
    where("userId", "==", user.uid)
  );

  const snapshot =
    await getDocs(q);

  return !snapshot.empty;
}