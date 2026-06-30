import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import type { MCQQuestion, ChallengeSubmission } from "../types/challenge.types";

type SubmitArgs = {
  userId: string;
  userName: string;
  clubId: string;
  universityId: string;
  weekKey: string;
  challengeId: string;
  answers: number[];
  questions: MCQQuestion[];
  totalPoints: number;
  timeSeconds: number;
};

function calcScore(
  correctCount: number,
  totalQ: number,
  timeSeconds: number,
  totalPoints: number
): number {
  const accuracy = (correctCount / totalQ) * (totalPoints * 0.7);
  const speedFraction =
    timeSeconds <= 180 ? 1 :
    timeSeconds <= 420 ? 0.5 : 0;
  return Math.round(accuracy + totalPoints * 0.3 * speedFraction);
}

export async function submitChallenge(
  args: SubmitArgs
): Promise<ChallengeSubmission> {
  const {
    userId, userName, clubId, universityId,
    weekKey, challengeId, answers, questions, totalPoints, timeSeconds,
  } = args;

  const submissionId = `${userId}_${challengeId}`;
  const submissionRef = doc(db, "challengeSubmissions", submissionId);

  // Guard: prevent double submission
  const existing = await getDoc(submissionRef);
  if (existing.exists()) {
    return { id: submissionId, ...existing.data() } as ChallengeSubmission;
  }

  const correctCount = answers.reduce(
    (acc, ans, i) => acc + (ans === questions[i].correctIndex ? 1 : 0),
    0
  );
  const score = calcScore(correctCount, questions.length, timeSeconds, totalPoints);

  const payload: Omit<ChallengeSubmission, "id"> = {
    userId,
    userName,
    clubId,
    universityId,
    weekKey,
    challengeId,
    correctCount,
    totalQuestions: questions.length,
    timeSeconds,
    score,
    submittedAt: serverTimestamp(),
  };

  await setDoc(submissionRef, payload);

  // Increment participants counter on the challenge doc
  try {
    await updateDoc(doc(db, "challenges", challengeId), {
      participants: increment(1),
    });
  } catch {
    // non-critical
  }

  // Accumulate score on the club doc (drives the clubs leaderboard)
  try {
    await updateDoc(doc(db, "clubs", clubId), {
      score: increment(score),
    });
  } catch {
    // non-critical — leaderboard still works via challengeSubmissions
  }

  return { id: submissionId, ...payload };
}

export async function getExistingSubmission(
  userId: string,
  challengeId: string
): Promise<ChallengeSubmission | null> {
  const ref = doc(db, "challengeSubmissions", `${userId}_${challengeId}`);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as ChallengeSubmission;
}
