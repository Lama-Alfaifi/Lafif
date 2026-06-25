import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase";

import type { AppUser } from "../types/admin.types";

export async function getUsers() {
  const snapshot = await getDocs(
    collection(db, "users")
  );

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  })) as AppUser[];
}

export async function assignPresident(
  userId: string,
  clubId: string,
  clubName: string
) {
  await updateDoc(doc(db, "users", userId), {
    role: "president",
    clubId,
    clubName,
  });
}

export async function removePresidentRole(
  userId: string
) {
  await updateDoc(doc(db, "users", userId), {
    role: "member",
    clubId: "",
    clubName: "",
  });
}