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

initializeApp();
const db = getFirestore();

const openaiApiKey = defineSecret("OPENAI_API_KEY");

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
// HELPER: Call OpenAI and parse JSON safely
// ─────────────────────────────────────────────────────────────────────────────

async function callOpenAI(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 2000
): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error ${res.status}: ${err}`);
  }

  const data = (await res.json()) as {
    choices: { message: { content: string } }[];
  };
  return data.choices[0].message.content;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: Generate one challenge via OpenAI
// ─────────────────────────────────────────────────────────────────────────────

async function generateChallengeWithAI(
  apiKey: string,
  clubName: string,
  category: string
): Promise<GeneratedChallenge> {
  const systemPrompt = `أنت متخصص في إنشاء تحديات أكاديمية لطلاب الجامعات السعودية.
تُنشئ أسئلة MCQ عالية الجودة تناسب مستوى الجامعة.
أجب دائماً بـ JSON صحيح فقط بدون أي نص إضافي.`;

  const userPrompt = `أنشئ تحدياً أسبوعياً لنادي "${clubName}" في تخصص "${category}".

المطلوب: كائن JSON بهذا الهيكل الحرفي:
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
- الأسئلة باللغة العربية
- تناسب تخصص النادي بدقة`;

  const raw = await callOpenAI(apiKey, systemPrompt, userPrompt, 2000);
  const parsed = JSON.parse(raw) as GeneratedChallenge;

  // Validate minimum structure
  if (!parsed.title || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
    throw new Error("Invalid challenge structure returned by OpenAI");
  }

  return parsed;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: Generate AI analysis report for a club
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
  const systemPrompt = `أنت مستشار تطوير الأندية الطلابية في الجامعات السعودية.
تُحلل بيانات الأندية وتقدم توصيات عملية ومحددة.
أجب دائماً بـ JSON صحيح فقط.`;

  const userPrompt = `حلل بيانات نادي "${clubName}" وقدم تقريراً:

البيانات:
- عدد الفعاليات هذا الشهر: ${stats.eventCount}
- عدد الأعضاء النشطين: ${stats.memberCount}
- متوسط نسبة الحضور: ${stats.avgAttendance}%
- نسبة إنجاز التحديات الأسبوعية: ${stats.challengeCompletionRate}%
- متوسط درجات التحديات: ${stats.avgScore}/100

المطلوب JSON بهذا الهيكل:
{
  "status": "ممتاز | جيد جداً | جيد | يحتاج تحسين",
  "summary": "ملخص أداء النادي في جملتين",
  "strengths": ["نقطة قوة 1", "نقطة قوة 2"],
  "weaknesses": ["نقطة ضعف 1", "نقطة ضعف 2"],
  "recommendations": ["توصية عملية 1", "توصية عملية 2", "توصية عملية 3"],
  "suggestedWorkshop": "اسم ورشة عمل مقترحة مناسبة للنادي"
}`;

  const raw = await callOpenAI(apiKey, systemPrompt, userPrompt, 1000);
  return JSON.parse(raw);
}

// ─────────────────────────────────────────────────────────────────────────────
// TRIGGER: Join request status changed → promote user + notify
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

    batch.update(db.doc(`users/${userId}`), {
      role: newRole,
      clubId,
      clubName,
    });

    const titleMap = {
      president: "تهانينا! تم تعيينك رئيساً للنادي",
      vicePresident: "تهانينا! تم تعيينك نائباً للرئيس",
    };
    const msgMap = {
      president: `تم تعيينك رئيساً لـ ${clubName}. يمكنك الآن إدارة النادي وإضافة الفعاليات.`,
      vicePresident: `تم تعيينك نائب رئيس في ${clubName}. يمكنك الآن المساعدة في إدارة النادي.`,
    };

    batch.set(db.collection("notifications").doc(), {
      userId,
      title: titleMap[position] ?? "تم قبول طلب المنصب",
      message: msgMap[position] ?? `تم قبول طلبك في ${clubName}.`,
      type: "president-assigned",
      isRead: false,
      createdAt: FieldValue.serverTimestamp(),
    });

    await batch.commit();
    logger.info(`Position approved: user ${userId} → ${newRole} of club ${clubId}`);
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// TRIGGER: User role changed to president (direct assignment by admin)
// ─────────────────────────────────────────────────────────────────────────────

export const onPresidentAssigned = onDocumentUpdated(
  "users/{userId}",
  async (event: FirestoreEvent<Change<QueryDocumentSnapshot> | undefined>) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();

    if (!before || !after) return;
    if (before.role === after.role) return;
    if (after.role !== "president") return;

    const userId = event.params.userId;

    await db.collection("notifications").add({
      userId,
      title: "تهانينا! تم تعيينك رئيساً للنادي",
      message: `تم تعيينك رئيساً لـ ${after.clubName}. يمكنك الآن إدارة النادي وإضافة الفعاليات.`,
      type: "president-assigned",
      isRead: false,
      createdAt: FieldValue.serverTimestamp(),
    });

    logger.info(`President assigned directly: user ${userId} → president of ${after.clubId}`);
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// SCHEDULED: Generate weekly AI challenges — every Monday 08:00 Riyadh time
// ─────────────────────────────────────────────────────────────────────────────

export const generateWeeklyChallenges = onSchedule(
  {
    schedule: "0 5 * * 1",
    timeZone: "Asia/Riyadh",
    secrets: [openaiApiKey],
  },
  async () => {
    const apiKey = openaiApiKey.value();
    const weekKey = getWeekKey();
    logger.info(`Generating weekly challenges for week: ${weekKey}`);

    const clubsSnapshot = await db.collection("clubs").get();

    const tasks = clubsSnapshot.docs.map(async (clubDoc) => {
      const club = clubDoc.data();
      const docId = `${clubDoc.id}_${weekKey}`;
      const ref = db.doc(`challenges/${docId}`);

      const existing = await ref.get();
      if (existing.exists) {
        logger.info(`Challenge already exists for club ${club.name}, skipping.`);
        return;
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

        logger.info(`AI challenge created for club: ${club.name}`);
      } catch (err) {
        logger.error(`Failed to generate challenge for club ${club.name}:`, err);
      }
    });

    await Promise.allSettled(tasks);
    logger.info("Weekly challenge generation complete.");
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// CALLABLE: Get AI report for a club (called from president dashboard)
// ─────────────────────────────────────────────────────────────────────────────

export const getClubAIReport = onCall(
  { secrets: [openaiApiKey] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "يجب تسجيل الدخول أولاً");
    }

    const { clubId } = request.data as { clubId: string };
    if (!clubId) {
      throw new HttpsError("invalid-argument", "clubId مطلوب");
    }

    // Verify caller is president or universityAdmin of this club
    const callerUid = request.auth.uid;
    const userDoc = await db.doc(`users/${callerUid}`).get();
    const userData = userDoc.data();

    if (
      !userData ||
      (userData.role !== "president" && userData.role !== "universityAdmin" && userData.role !== "superAdmin") ||
      (userData.role === "president" && userData.clubId !== clubId)
    ) {
      throw new HttpsError("permission-denied", "ليس لديك صلاحية لعرض تقرير هذا النادي");
    }

    // Gather real stats from Firestore
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [eventsSnap, membersSnap, challengesSnap] = await Promise.all([
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

    // Calculate attendance rate from events
    let totalAttendance = 0;
    let totalCapacity = 0;
    eventsSnap.docs.forEach((d) => {
      const e = d.data();
      if (e.attendanceCount) totalAttendance += e.attendanceCount as number;
      if (e.capacity) totalCapacity += e.capacity as number;
    });
    const avgAttendance =
      totalCapacity > 0 ? Math.round((totalAttendance / totalCapacity) * 100) : 0;

    // Calculate challenge stats
    const memberCount = membersSnap.size;
    const submissionCount = challengesSnap.size;
    const completionRate =
      memberCount > 0 ? Math.round((submissionCount / memberCount) * 100) : 0;

    let totalScore = 0;
    challengesSnap.docs.forEach((d) => {
      totalScore += (d.data().score as number) || 0;
    });
    const avgScore =
      submissionCount > 0 ? Math.round(totalScore / submissionCount) : 0;

    const clubDoc = await db.doc(`clubs/${clubId}`).get();
    const clubName = (clubDoc.data()?.name as string) || "النادي";

    const apiKey = openaiApiKey.value();
    const report = await generateClubReport(apiKey, clubName, {
      eventCount: eventsSnap.size,
      memberCount,
      avgAttendance,
      challengeCompletionRate: completionRate,
      avgScore,
    });

    // Cache report in Firestore (TTL: 24h)
    await db.collection("clubReports").doc(clubId).set({
      ...report,
      stats: { eventCount: eventsSnap.size, memberCount, avgAttendance, completionRate, avgScore },
      generatedAt: FieldValue.serverTimestamp(),
    });

    return report;
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
