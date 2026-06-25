import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase";

export async function getClubEvents(
  clubId: string
) {

  const q = query(
    collection(db, "events"),
    where("clubId", "==", clubId)
  );

  const snapshot =
    await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}