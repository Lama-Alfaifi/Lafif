import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";

export type UniMember = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  clubId?: string;
  clubName?: string;
  universityId?: string;
};

export async function getUniversityMembers(universityId: string): Promise<UniMember[]> {
  const snap = await getDocs(
    query(collection(db, "users"), where("universityId", "==", universityId))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<UniMember, "id">) }));
}

export async function removeMemberFromClub(userId: string): Promise<void> {
  await updateDoc(doc(db, "users", userId), {
    role: "student",
    clubId: "",
    clubName: "",
  });
}

export async function changeClubRole(
  userId: string,
  newRole: "member" | "vicePresident" | "president",
  clubId: string,
  clubName: string
): Promise<void> {
  await updateDoc(doc(db, "users", userId), { role: newRole, clubId, clubName });
}
