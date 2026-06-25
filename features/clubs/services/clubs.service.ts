import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase";

export type ClubDoc = {
  id?: string;
  name: string;
  college?: string;
  email?: string;
  image?: string;
  description?: string;
  attendance?: number;
  engagement?: number;
  score?: number;
  challengeCompletion?: number;
  goals?: string;
  universityId?: string;
  category?: "central" | "decentralized";
};

export async function getClubById(
  clubId: string
): Promise<ClubDoc | null> {

  const ref = doc(
    db,
    "clubs",
    clubId
  );

  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return null;
  }

  return snap.data() as ClubDoc;
}

export async function getClubsByUniversity(
  universityId: string
) {

  const clubsQuery = query(
    collection(db, "clubs"),
    where(
      "universityId",
      "==",
      universityId
    )
  );

  const snapshot =
    await getDocs(clubsQuery);

  return snapshot.docs.map(
    (docItem) => ({
      id: docItem.id,
      ...docItem.data(),
    })
  ) as ClubDoc[];
}