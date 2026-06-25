import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import {
  onDocumentUpdated,
  FirestoreEvent,
  Change,
  QueryDocumentSnapshot,
} from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions/v2";

initializeApp();
const db = getFirestore();

// ─────────────────────────────────────────────────────────────────────────────
// TRIGGER: Join request status changed
// Handles role promotion (approved) and rejection notification
// ─────────────────────────────────────────────────────────────────────────────

export const onJoinRequestUpdated = onDocumentUpdated(
  "joinRequests/{requestId}",
  async (
    event: FirestoreEvent<Change<QueryDocumentSnapshot> | undefined>
  ) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();

    if (!before || !after) return;

    // Only react to actual status changes
    if (before.status === after.status) return;

    const { userId, clubId, clubName, universityId, universityName, userName, userEmail } = after as {
      userId: string;
      clubId: string;
      clubName: string;
      universityId: string;
      universityName: string;
      userName?: string;
      userEmail?: string;
    };

    // ── Approved ──────────────────────────────────────────────────────────────
    if (after.status === "approved") {
      const batch = db.batch();

      // 1. Promote user from "student" to "member" and link them to the club
      const userRef = db.doc(`users/${userId}`);
      batch.update(userRef, {
        role: "member",
        clubId,
        clubName,
      });

      // 2. Create the club membership record
      const memberRef = db.collection("clubMembers").doc();
      batch.set(memberRef, {
        userId,
        userName: userName || "",
        userEmail: userEmail || "",
        clubId,
        clubName,
        universityId,
        universityName: universityName || "",
        role: "member",
        joinedAt: FieldValue.serverTimestamp(),
      });

      // 3. Send approval notification
      const notifRef = db.collection("notifications").doc();
      batch.set(notifRef, {
        userId,
        title: "تم قبول طلب الانضمام",
        message: `تم قبول طلب انضمامك إلى ${clubName}. يمكنك الآن المشاركة كعضو في النادي.`,
        type: "join-approved",
        isRead: false,
        createdAt: FieldValue.serverTimestamp(),
      });

      await batch.commit();
      logger.info(`Join approved: user ${userId} → member of club ${clubId}`);
    }

    // ── Rejected ──────────────────────────────────────────────────────────────
    if (after.status === "rejected") {
      await db.collection("notifications").add({
        userId,
        title: "بخصوص طلب الانضمام للنادي",
        message: `نشكر لك رغبتك في الانضمام إلى ${clubName}. نعتذر، لم تتم الموافقة على طلبك حاليًا، ونسعد بمشاركتك في فعاليات النادي القادمة.`,
        type: "join-rejected",
        isRead: false,
        createdAt: FieldValue.serverTimestamp(),
      });

      logger.info(`Join rejected: user ${userId} for club ${clubId}`);
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// TRIGGER: User role changed to president
// Sends a notification when a universityAdmin promotes someone to president
// ─────────────────────────────────────────────────────────────────────────────

export const onPresidentAssigned = onDocumentUpdated(
  "users/{userId}",
  async (
    event: FirestoreEvent<Change<QueryDocumentSnapshot> | undefined>
  ) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();

    if (!before || !after) return;

    const roleChanged = before.role !== after.role;
    const promotedToPresident = after.role === "president";

    if (!roleChanged || !promotedToPresident) return;

    const userId = event.params.userId;

    await db.collection("notifications").add({
      userId,
      title: "تهانينا! تم تعيينك رئيساً للنادي",
      message: `تم تعيينك رئيساً لـ ${after.clubName}. يمكنك الآن إدارة النادي وإضافة الفعاليات.`,
      type: "president-assigned",
      isRead: false,
      createdAt: FieldValue.serverTimestamp(),
    });

    logger.info(`President assigned: user ${userId} → president of ${after.clubId}`);
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// SCHEDULED: Generate weekly challenges for all clubs
// Runs every Monday at 08:00 Riyadh time (UTC+3 = 05:00 UTC)
// ─────────────────────────────────────────────────────────────────────────────

export const generateWeeklyChallenges = onSchedule(
  { schedule: "0 5 * * 1", timeZone: "Asia/Riyadh" },
  async () => {
    const weekKey = getWeekKey();
    logger.info(`Generating weekly challenges for week: ${weekKey}`);

    const clubsSnapshot = await db.collection("clubs").get();

    const tasks = clubsSnapshot.docs.map(async (clubDoc) => {
      const club = clubDoc.data();
      const docId = `${clubDoc.id}_${weekKey}`;
      const ref = db.doc(`challenges/${docId}`);

      // Skip if already generated this week
      const existing = await ref.get();
      if (existing.exists) return;

      // Placeholder challenge — replace with OpenAI call when API key is set
      const challenge = buildPlaceholderChallenge(club.name, club.college);

      await ref.set({
        ...challenge,
        clubId: clubDoc.id,
        universityId: club.universityId,
        weekKey,
        aiGenerated: true,
        participants: 0,
        createdAt: FieldValue.serverTimestamp(),
      });

      logger.info(`Challenge created for club: ${club.name}`);
    });

    await Promise.allSettled(tasks);
    logger.info("Weekly challenge generation complete.");
  }
);

// ─── Utilities ────────────────────────────────────────────────────────────────

function getWeekKey(d = new Date()): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    (((date as unknown as number) - (yearStart as unknown as number)) / 86400000 + 1) / 7
  );
  return `${date.getUTCFullYear()}-${String(weekNo).padStart(2, "0")}`;
}

function buildPlaceholderChallenge(clubName: string, college?: string) {
  return {
    clubName,
    category: college || "عام",
    title: "تحدي الأسبوع",
    description: "سيتم توليد هذا التحدي بالذكاء الاصطناعي عند إعداد مفتاح OpenAI API.",
    challengeType: "quiz",
    difficulty: "متوسط",
    points: 100,
    duration: "60",
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
}
