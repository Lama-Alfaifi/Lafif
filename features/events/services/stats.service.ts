import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase";

export async function getEventsStats() {

  const registrationsSnapshot =
    await getDocs(
      collection(db, "eventRegistrations")
    );

  const ratingsSnapshot =
    await getDocs(
      collection(db, "eventRatings")
    );

  const registrations =
    registrationsSnapshot.docs.map(
      (doc) => doc.data()
    );

  const ratings =
    ratingsSnapshot.docs.map(
      (doc) => doc.data()
    );

  const totalAttendance =
    registrations.length;

  const totalRatings =
    ratings.length;

  const averageRating =
    totalRatings > 0
      ? (
          ratings.reduce(
            (sum: number, item: any) =>
              sum + item.rating,
            0
          ) / totalRatings
        ).toFixed(1)
      : "0.0";

  return {
    totalAttendance,
    totalRatings,
    averageRating,
  };
}