import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase";

import type { EventItem } from "../types/event.types";

export async function getEvents() {
  const snapshot = await getDocs(
    collection(db, "events")
  );

  const events = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as EventItem[];

  return events;
}

export async function getEventsByUniversity(
  universityId: string
) {

  const eventsQuery = query(
    collection(db, "events"),
    where(
      "universityId",
      "==",
      universityId
    )
  );

  const snapshot =
    await getDocs(eventsQuery);

  const events = snapshot.docs.map(
    (doc) => ({
      id: doc.id,
      ...doc.data(),
    })
  ) as EventItem[];

  return events;
}