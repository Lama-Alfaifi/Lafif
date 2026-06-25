import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "@/src/lib/firebase";

import type { ClubOption } from "../types/admin.types";

export async function getClubsByUniversity(
  universityId: string
): Promise<ClubOption[]> {
  const q = query(
    collection(db, "clubs"),
    where("universityId", "==", universityId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name || "",
  }));
}
