import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase";

type CreateClubData = {
  name: string;
  college: string;
  description: string;
  goals: string;
  achievements: string;
  president: string;
  email: string;
  image: string;
  category: "central" | "decentralized";
  universityId: string;
  universityName: string;
};

export async function createClub(data: CreateClubData) {
  await addDoc(collection(db, "clubs"), {
    ...data,
    createdAt: serverTimestamp(),
  });
}