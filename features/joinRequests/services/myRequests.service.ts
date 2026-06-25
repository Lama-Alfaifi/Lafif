import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase";
import type { JoinRequest } from "../types/joinRequest.types";

export async function getMyRequests(userId: string): Promise<JoinRequest[]> {
  const q = query(
    collection(db, "joinRequests"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...(docItem.data() as Omit<JoinRequest, "id">),
  }));
}
