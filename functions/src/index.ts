import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import {
  onDocumentUpdated,
  FirestoreEvent,
  Change,
  QueryDocumentSnapshot,
} from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { logger } from "firebase-functions/v2";
import { GoogleGenerativeAI } from "@google/generative-ai";

initializeApp();
const db = getFirestore();

const geminiApiKey = defineSecret("GEMINI_API_KEY");


// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface ChallengeQuestion {
  question: string;
  options: [string, string, string, string];
  correct: number; // index 0-3
  explanation: string;
}

interface GeneratedChallenge {
  title: string;
  description: string;
  difficulty: "سهل" | "متوسط" | "صعب";
  points: number;
  questions: ChallengeQuestion[];
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: Call Gemini via @google/generative-ai SDK — returns raw text
// gemini-2.0-flash free tier: 1500 req/day, 15 req/min
// ─────────────────────────────────────────────────────────────────────────────

async function callGemini(
  apiKey: string,
  systemInstruction: string,
  userPrompt: string
): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7,
    },
  });

  const result = await model.generateContent(userPrompt);
  const text = result.response.text();
  if (!text) throw new Error("Gemini returned an empty response");
  return text;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: Generate one weekly challenge via Gemini
// ─────────────────────────────────────────────────────────────────────────────

async function generateChallengeWithAI(
  apiKey: string,
  clubName: string,
  category: string
): Promise<GeneratedChallenge> {
  const system = `أنت متخصص في إنشاء تحديات أكاديمية لطلاب الجامعات السعودية.
تُنشئ أسئلة MCQ عالية الجودة تناسب مستوى الجامعة.
أجب دائماً بـ JSON صحيح فقط وفق الهيكل المطلوب بدون أي نص إضافي.`;

  const user = `أنشئ تحدياً أسبوعياً لنادي "${clubName}" في تخصص "${category}".

أعد كائن JSON بهذا الهيكل الحرفي بالضبط:
{
  "title": "عنوان التحدي (جملة قصيرة جذابة)",
  "description": "وصف التحدي بجملتين",
  "difficulty": "متوسط",
  "points": 100,
  "questions": [
    {
      "question": "نص السؤال",
      "options": ["الخيار أ", "الخيار ب", "الخيار ج", "الخيار د"],
      "correct": 0,
      "explanation": "شرح سبب صحة الإجابة"
    }
  ]
}

الشروط:
- 5 أسئلة متنوعة متدرجة الصعوبة
- difficulty: اختر من ("سهل" أو "متوسط" أو "صعب")
- correct: رقم من 0 إلى 3 يشير لفهرس الإجابة الصحيحة في options
- جميع النصوص باللغة العربية
- الأسئلة تناسب تخصص النادي بدقة`;

  const raw = await callGemini(apiKey, system, user);
  const parsed = JSON.parse(raw) as GeneratedChallenge;

  if (!parsed.title || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
    throw new Error("Invalid challenge structure returned by Gemini");
  }

  return parsed;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: Generate AI analysis report for a club via Gemini
// ─────────────────────────────────────────────────────────────────────────────

async function generateClubReport(
  apiKey: string,
  clubName: string,
  stats: {
    eventCount: number;
    memberCount: number;
    avgAttendance: number;
    challengeCompletionRate: number;
    avgScore: number;
  }
): Promise<{
  status: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  suggestedWorkshop: string;
}> {
  const system = `أنت مستشار تطوير الأندية الطلابية في الجامعات السعودية.
تُحلل بيانات الأندية وتقدم توصيات عملية ومحددة وقابلة للتنفيذ.
أجب دائماً بـ JSON صحيح فقط.`;

  const user = `حلل بيانات نادي "${clubName}" وقدم تقريراً:

البيانات:
- عدد الفعاليات هذا الشهر: ${stats.eventCount}
- عدد الأعضاء النشطين: ${stats.memberCount}
- متوسط نسبة الحضور: ${stats.avgAttendance}%
- نسبة إنجاز التحديات الأسبوعية: ${stats.challengeCompletionRate}%
- متوسط درجات التحديات: ${stats.avgScore}/100

أعد JSON بهذا الهيكل الحرفي:
{
  "status": "ممتاز",
  "summary": "ملخص أداء النادي في جملتين",
  "strengths": ["نقطة قوة 1", "نقطة قوة 2"],
  "weaknesses": ["نقطة ضعف 1", "نقطة ضعف 2"],
  "recommendations": ["توصية عملية 1", "توصية عملية 2", "توصية عملية 3"],
  "suggestedWorkshop": "اسم ورشة عمل مقترحة مناسبة للنادي"
}

قيم status المسموح بها فقط: "ممتاز" أو "جيد جداً" أو "جيد" أو "يحتاج تحسين"`;

  const raw = await callGemini(apiKey, system, user);
  return JSON.parse(raw);
}

// ─────────────────────────────────────────────────────────────────────────────
// TRIGGER: Join request approved → promote user to member + notify
// ─────────────────────────────────────────────────────────────────────────────

export const onJoinRequestUpdated = onDocumentUpdated(
  "joinRequests/{requestId}",
  async (event: FirestoreEvent<Change<QueryDocumentSnapshot> | undefined>) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();

    if (!before || !after || before.status === after.status) return;

    const { userId, clubId, clubName, universityId, universityName, userName, userEmail } =
      after as {
        userId: string;
        clubId: string;
        clubName: string;
        universityId: string;
        universityName: string;
        userName?: string;
        userEmail?: string;
      };

    if (after.status === "approved") {
      const batch = db.batch();

      batch.update(db.doc(`users/${userId}`), {
        role: "member",
        clubId,
        clubName,
      });

      batch.set(db.collection("clubMembers").doc(), {
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

      batch.set(db.collection("notifications").doc(), {
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

    if (after.status === "rejected") {
      await db.collection("notifications").add({
        userId,
        title: "بخصوص طلب الانضمام للنادي",
        message: `نشكر لك رغبتك في الانضمام إلى ${clubName}. نعتذر، لم تتم الموافقة على طلبك حاليًا.`,
        type: "join-rejected",
        isRead: false,
        createdAt: FieldValue.serverTimestamp(),
      });
      logger.info(`Join rejected: user ${userId} for club ${clubId}`);
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// TRIGGER: Position request approved → promote role + notify
// ─────────────────────────────────────────────────────────────────────────────

export const onPositionRequestUpdated = onDocumentUpdated(
  "positionRequests/{requestId}",
  async (event: FirestoreEvent<Change<QueryDocumentSnapshot> | undefined>) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();

    if (!before || !after || before.status === after.status) return;
    if (after.status !== "approved") return;

    const { userId, position, clubId, clubName } = after as {
      userId: string;
      position: "vicePresident" | "president";
      clubId: string;
      clubName: string;
    };

    const newRole = position === "president" ? "president" : "vicePresident";

    const batch = db.batch();

    batch.update(db.doc(`users/${userId}`), { role: newRole, clubId, clubName });

    const titles: Record<string, string> = {
      president:     "تهانينا! تم تعيينك رئيساً للنادي",
      vicePresident: "تهانينا! تم تعيينك نائباً للرئيس",
    };
    const msgs: Record<string, string> = {
      president:     `تم تعيينك رئيساً لـ ${clubName}. يمكنك الآن إدارة النادي وإضافة الفعاليات.`,
      vicePresident: `تم تعيينك نائب رئيس في ${clubName}. يمكنك الآن المساعدة في إدارة النادي.`,
    };

    batch.set(db.collection("notifications").doc(), {
      userId,
      title: titles[position] ?? "تم قبول طلب المنصب",
      message: msgs[position] ?? `تم قبول طلبك في ${clubName}.`,
      type: "president-assigned",
      isRead: false,
      createdAt: FieldValue.serverTimestamp(),
    });

    await batch.commit();
    logger.info(`Position approved: user ${userId} → ${newRole} of club ${clubId}`);
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// TRIGGER: Direct president assignment by admin → notify
// ─────────────────────────────────────────────────────────────────────────────

export const onPresidentAssigned = onDocumentUpdated(
  "users/{userId}",
  async (event: FirestoreEvent<Change<QueryDocumentSnapshot> | undefined>) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();

    if (!before || !after) return;
    if (before.role === after.role) return;
    if (after.role !== "president") return;

    await db.collection("notifications").add({
      userId: event.params.userId,
      title: "تهانينا! تم تعيينك رئيساً للنادي",
      message: `تم تعيينك رئيساً لـ ${after.clubName}. يمكنك الآن إدارة النادي وإضافة الفعاليات.`,
      type: "president-assigned",
      isRead: false,
      createdAt: FieldValue.serverTimestamp(),
    });

    logger.info(`President assigned: user ${event.params.userId} → ${after.clubId}`);
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// SCHEDULED: Generate weekly AI challenges — every Monday 08:00 Riyadh time
// Free tier: gemini-2.0-flash → 1500 req/day, 15 req/min
// ─────────────────────────────────────────────────────────────────────────────

export const generateWeeklyChallenges = onSchedule(
  {
    schedule: "0 5 * * 1", // 08:00 Riyadh (UTC+3 = 05:00 UTC)
    timeZone: "Asia/Riyadh",
    secrets: [geminiApiKey],
  },
  async () => {
    const apiKey = geminiApiKey.value();
    const weekKey = getWeekKey();
    logger.info(`Generating weekly challenges for week: ${weekKey}`);

    const clubsSnapshot = await db.collection("clubs").get();
    logger.info(`Found ${clubsSnapshot.size} clubs`);

    // Process clubs sequentially to respect rate limits (15 req/min)
    for (const clubDoc of clubsSnapshot.docs) {
      const club = clubDoc.data();
      const docId = `${clubDoc.id}_${weekKey}`;
      const ref = db.doc(`challenges/${docId}`);

      const existing = await ref.get();
      if (existing.exists) {
        logger.info(`Challenge already exists for club ${club.name as string}, skipping.`);
        continue;
      }

      try {
        const challenge = await generateChallengeWithAI(
          apiKey,
          club.name as string,
          (club.college || club.category || "عام") as string
        );

        await ref.set({
          ...challenge,
          clubId: clubDoc.id,
          clubName: club.name,
          universityId: club.universityId,
          weekKey,
          aiGenerated: true,
          participants: 0,
          duration: "60",
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: FieldValue.serverTimestamp(),
        });

        logger.info(`Gemini challenge created for club: ${club.name as string}`);

        // 4s delay between clubs to stay within 15 req/min
        await delay(4000);
      } catch (err) {
        logger.error(`Failed to generate challenge for club ${club.name as string}:`, err);
      }
    }

    logger.info("Weekly challenge generation complete.");
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// CALLABLE: Get AI report for a club (called from president dashboard)
// ─────────────────────────────────────────────────────────────────────────────

export const getClubAIReport = onCall(
  { secrets: [geminiApiKey] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "يجب تسجيل الدخول أولاً");
    }

    const { clubId } = request.data as { clubId: string };
    if (!clubId) {
      throw new HttpsError("invalid-argument", "clubId مطلوب");
    }

    // Verify caller is president/universityAdmin/superAdmin
    const callerUid = request.auth.uid;
    const userDoc = await db.doc(`users/${callerUid}`).get();
    const userData = userDoc.data();

    const allowedRoles = ["president", "universityAdmin", "superAdmin"];
    if (!userData || !allowedRoles.includes(userData.role as string)) {
      throw new HttpsError("permission-denied", "ليس لديك صلاحية لعرض هذا التقرير");
    }
    if (userData.role === "president" && userData.clubId !== clubId) {
      throw new HttpsError("permission-denied", "يمكنك فقط عرض تقرير ناديك");
    }

    // Return cached report if < 24h old
    const cached = await db.doc(`clubReports/${clubId}`).get();
    if (cached.exists) {
      const cachedData = cached.data() as { generatedAt?: { seconds: number } };
      const ageMs = cachedData.generatedAt
        ? Date.now() - cachedData.generatedAt.seconds * 1000
        : Infinity;
      if (ageMs < 24 * 60 * 60 * 1000) {
        logger.info(`Returning cached report for club ${clubId}`);
        return cached.data();
      }
    }

    // Gather real stats from Firestore
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [eventsSnap, membersSnap, submissionsSnap] = await Promise.all([
      db.collection("events")
        .where("clubId", "==", clubId)
        .where("createdAt", ">=", monthAgo)
        .get(),
      db.collection("users")
        .where("clubId", "==", clubId)
        .get(),
      db.collection("challengeSubmissions")
        .where("clubId", "==", clubId)
        .get(),
    ]);

    // Attendance rate
    let totalAttendance = 0;
    let totalCapacity = 0;
    eventsSnap.docs.forEach((d) => {
      const e = d.data();
      if (e.attendanceCount) totalAttendance += e.attendanceCount as number;
      if (e.capacity) totalCapacity += e.capacity as number;
    });
    const avgAttendance =
      totalCapacity > 0 ? Math.round((totalAttendance / totalCapacity) * 100) : 0;

    // Challenge stats
    const memberCount = membersSnap.size;
    const submissionCount = submissionsSnap.size;
    const completionRate =
      memberCount > 0 ? Math.round((submissionCount / memberCount) * 100) : 0;

    let totalScore = 0;
    submissionsSnap.docs.forEach((d) => {
      totalScore += (d.data().score as number) || 0;
    });
    const avgScore =
      submissionCount > 0 ? Math.round(totalScore / submissionCount) : 0;

    const clubDoc = await db.doc(`clubs/${clubId}`).get();
    const clubName = (clubDoc.data()?.name as string) || "النادي";

    // Generate report via Gemini
    const report = await generateClubReport(geminiApiKey.value(), clubName, {
      eventCount: eventsSnap.size,
      memberCount,
      avgAttendance,
      challengeCompletionRate: completionRate,
      avgScore,
    });

    const payload = {
      ...report,
      stats: {
        eventCount: eventsSnap.size,
        memberCount,
        avgAttendance,
        completionRate,
        avgScore,
      },
      generatedAt: FieldValue.serverTimestamp(),
    };

    // Cache for 24h
    await db.doc(`clubReports/${clubId}`).set(payload);
    logger.info(`AI report generated for club ${clubId}`);

    return payload;
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

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

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
