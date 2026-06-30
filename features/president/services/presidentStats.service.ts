import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase";

export async function getPresidentStats(
  clubId: string,
  universityId: string
) {
  // Count current members from users collection (accurate, not joinRequests)
  const membersQuery = query(
    collection(db, "users"),
    where("clubId", "==", clubId)
  );

  const eventsQuery = query(
    collection(db, "events"),
    where("clubId", "==", clubId),
    where("universityId", "==", universityId)
  );

  const attendanceQuery = query(
    collection(db, "eventRegistrations"),
    where("clubId", "==", clubId),
    where("universityId", "==", universityId)
  );

  const ratingsQuery = query(
    collection(db, "eventRatings"),
    where("clubId", "==", clubId),
    where("universityId", "==", universityId)
  );

  const [
    membersSnapshot,
    eventsSnapshot,
    attendanceSnapshot,
    ratingsSnapshot,
  ] = await Promise.all([
    getDocs(membersQuery),
    getDocs(eventsQuery),
    getDocs(attendanceQuery),
    getDocs(ratingsQuery),
  ]);

  const ratings = ratingsSnapshot.docs.map((doc) => doc.data());

  const averageRating =
    ratings.length > 0
      ? (
          ratings.reduce(
            (sum: number, item: any) => sum + item.rating,
            0
          ) / ratings.length
        ).toFixed(1)
      : "0.0";

  return {
    totalMembers: membersSnapshot.size,
    totalEvents: eventsSnapshot.size,
    totalAttendance: attendanceSnapshot.size,
    averageRating,
  };
}
