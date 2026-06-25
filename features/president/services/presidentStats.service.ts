import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase";

export async function getPresidentStats(
  clubId: string
) {

  const approvedMembersQuery = query(
    collection(db, "joinRequests"),
    where("clubId", "==", clubId),
    where("status", "==", "approved")
  );

  const eventsQuery = query(
    collection(db, "events"),
    where("clubId", "==", clubId)
  );

  const attendanceQuery = query(
    collection(db, "eventRegistrations"),
    where("clubId", "==", clubId)
  );

  const ratingsQuery = query(
    collection(db, "eventRatings"),
    where("clubId", "==", clubId)
  );

  const [
    membersSnapshot,
    eventsSnapshot,
    attendanceSnapshot,
    ratingsSnapshot,
  ] = await Promise.all([
    getDocs(approvedMembersQuery),
    getDocs(eventsQuery),
    getDocs(attendanceQuery),
    getDocs(ratingsQuery),
  ]);

  const ratings =
    ratingsSnapshot.docs.map(
      (doc) => doc.data()
    );

  const averageRating =
    ratings.length > 0
      ? (
          ratings.reduce(
            (sum: number, item: any) =>
              sum + item.rating,
            0
          ) / ratings.length
        ).toFixed(1)
      : "0.0";

  return {
    totalMembers:
      membersSnapshot.size,

    totalEvents:
      eventsSnapshot.size,

    totalAttendance:
      attendanceSnapshot.size,

    averageRating,
  };
}