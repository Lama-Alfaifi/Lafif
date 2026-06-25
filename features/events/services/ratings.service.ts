import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";

export type EventRating = {
  id: string;
  userId: string;
  userName?: string;
  eventId: string;
  eventTitle: string;
  universityId: string;
  clubId: string;
  clubName: string;
  rating: number;
  comment?: string;
  createdAt?: unknown;
};

export type RatingStats = {
  avg: number;
  count: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
};

/* ── Submit / update rating ────────────────────────────────────── */
export async function submitRating(
  eventId: string,
  eventTitle: string,
  universityId: string,
  clubId: string,
  clubName: string,
  rating: number,
  options?: { userId: string; userName?: string; comment?: string }
): Promise<void> {
  if (!options?.userId) throw new Error("يجب تسجيل الدخول أولاً.");
  if (rating < 1 || rating > 5) throw new Error("التقييم يجب أن يكون بين 1 و 5.");

  const docId = `${options.userId}_${eventId}`;
  await setDoc(
    doc(db, "eventRatings", docId),
    {
      userId: options.userId,
      userName: options.userName ?? "",
      eventId,
      eventTitle,
      universityId,
      clubId,
      clubName,
      rating,
      comment: options.comment?.trim() ?? "",
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/* ── Get the current user's rating for an event ─────────────── */
export async function getMyRating(
  userId: string,
  eventId: string
): Promise<EventRating | null> {
  const snap = await getDoc(doc(db, "eventRatings", `${userId}_${eventId}`));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<EventRating, "id">) };
}

/* ── Get aggregate stats for an event ───────────────────────── */
export async function getEventRatingStats(eventId: string): Promise<RatingStats> {
  const snap = await getDocs(
    query(collection(db, "eventRatings"), where("eventId", "==", eventId))
  );

  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let total = 0;

  snap.docs.forEach((d) => {
    const r = (d.data() as EventRating).rating;
    if (r >= 1 && r <= 5) {
      distribution[r]++;
      total += r;
    }
  });

  const count = snap.size;
  return {
    avg: count ? Math.round((total / count) * 10) / 10 : 0,
    count,
    distribution: distribution as Record<1 | 2 | 3 | 4 | 5, number>,
  };
}

/* ── Get all ratings for a club (for president overview) ─────── */
export async function getClubEventRatings(clubId: string): Promise<EventRating[]> {
  const snap = await getDocs(
    query(collection(db, "eventRatings"), where("clubId", "==", clubId))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<EventRating, "id">) }));
}
