import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase";

export async function getUniversityClubs(
  universityId: string
) {
  const q = query(
    collection(db, "clubs"),
    where("universityId", "==", universityId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}