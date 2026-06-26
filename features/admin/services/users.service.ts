import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
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