import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase";

import type { AppUser } from "../types/admin.types";

export async function getUsers() {
  const snapshot = await getDocs(
    collection(db, "users")
  );

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  })) as AppUser[];
}

export async function assignPresident(
  userId: string,
  clubId: string,
  clubName: string
) {
  await updateDoc(doc(db, "users", userId), {
    role: "president",
    clubId,
    clubName,
  });
}

export async function removePresidentRole(
  userId: string
) {
  await updateDoc(doc(db, "users", userId), {
    role: "member",
    clubId: "",
    clubName: "",
  });
}

export type FixResult = {
  fixed: number;
  skipped: number;
  failed: number;
  details: string[];
};

/* ── Fix users whose universityId/universityName is missing or empty ── */
export async function fixUserUniversityData(): Promise<FixResult> {
  const result: FixResult = { fixed: 0, skipped: 0, failed: 0, details: [] };

  // 1. Load all users
  const usersSnap = await getDocs(collection(db, "users"));

  // 2. Build domain → { id, name } map from universities collection
  const uniSnap = await getDocs(collection(db, "universities"));
  const domainMap = new Map<string, { id: string; name: string }>();
  uniSnap.docs.forEach((d) => {
    const data = d.data() as { domain?: string; name?: string };
    if (data.domain) {
      domainMap.set(data.domain, { id: d.id, name: data.name ?? "" });
    }
  });

  // 3. For each user: fix if universityId or universityName is missing/empty
  for (const userDoc of usersSnap.docs) {
    const data = userDoc.data() as AppUser & { universityId?: string; universityName?: string; email?: string };
    const needsFix = !data.universityId || !data.universityName;

    if (!needsFix) {
      result.skipped++;
      continue;
    }

    const email = data.email ?? "";
    const domain = email.split("@")[1] ?? "";
    const uni = domainMap.get(domain);

    if (!uni) {
      result.failed++;
      result.details.push(`${email} — نطاق غير معروف: ${domain || "فارغ"}`);
      continue;
    }

    try {
      await updateDoc(doc(db, "users", userDoc.id), {
        universityId:   uni.id,
        universityName: uni.name,
      });
      result.fixed++;
      result.details.push(`${email} → ${uni.id}`);
    } catch {
      result.failed++;
      result.details.push(`${email} — فشل التحديث`);
    }
  }

  return result;
}

/* ── Backfill clubs.score from challengeSubmissions ─────────────────────────
 *  Reads every submission, sums scores per clubId, then OVERWRITES clubs.score
 *  so the clubs leaderboard reflects all historical data.
 *  Safe to run multiple times (idempotent — always writes the correct total).
 * ────────────────────────────────────────────────────────────────────────── */
export async function backfillClubScores(): Promise<FixResult> {
  const result: FixResult = { fixed: 0, skipped: 0, failed: 0, details: [] };

  // 1. Aggregate scores per club from all submissions
  const submissionsSnap = await getDocs(collection(db, "challengeSubmissions"));

  const clubTotals = new Map<string, number>();
  submissionsSnap.docs.forEach((d) => {
    const data = d.data() as { clubId?: string; score?: number };
    if (data.clubId && typeof data.score === "number") {
      clubTotals.set(data.clubId, (clubTotals.get(data.clubId) ?? 0) + data.score);
    }
  });

  if (clubTotals.size === 0) {
    result.details.push("لا توجد تسليمات في challengeSubmissions — لا يوجد ما يُصلح");
    return result;
  }

  // 2. Write totals to each club document
  for (const [clubId, total] of clubTotals.entries()) {
    try {
      await updateDoc(doc(db, "clubs", clubId), { score: total });
      result.fixed++;
      result.details.push(`${clubId}: ${total} نقطة`);
    } catch (e: any) {
      result.failed++;
      result.details.push(`${clubId} — فشل: ${e?.code ?? e?.message ?? "خطأ غير معروف"}`);
    }
  }

  return result;
}