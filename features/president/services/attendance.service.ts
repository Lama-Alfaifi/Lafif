import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase";

export async function getEventAttendance(
  eventId: string
) {
  const q = query(
    collection(db, "eventRegistrations"),
    where("eventId", "==", eventId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}