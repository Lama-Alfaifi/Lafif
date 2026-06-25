import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase";

export async function getEventsStats(universityId: string) {
  const registrationsQuery = query(
    collection(db, "eventRegistrations"),
    where("universityId", "==", universityId)
  );

  const ratingsQuery = query(
    collection(db, "eventRatings"),
    where("universityId", "==", universityId)
  );

  const [registrationsSnapshot, ratingsSnapshot] = await Promise.all([
    getDocs(registrationsQuery),
    getDocs(ratingsQuery),
  ]);

  const ratings = ratingsSnapshot.docs.map((doc) => doc.data());

  const totalAttendance = registrationsSnapshot.size;
  const totalRatings = ratings.length;

  const averageRating =
    totalRatings > 0
      ? (
          ratings.reduce(
            (sum: number, item: any) => sum + item.rating,
            0
          ) / totalRatings
        ).toFixed(1)
      : "0.0";

  return { totalAttendance, totalRatings, averageRating };
}
