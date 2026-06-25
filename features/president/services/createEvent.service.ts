import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase";

type CreateEventData = {
  title: string;
  description: string;
  place: string;
  time: string;
  type: "public" | "members";
  day: number;
  month: number;
  year: number;

  clubId: string;
  clubName: string;
  universityId: string;
  universityName: string;
};

export async function createEvent(data: CreateEventData) {
  await addDoc(collection(db, "events"), {
    ...data,
    createdAt: serverTimestamp(),
  });
}