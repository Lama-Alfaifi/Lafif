import { getApp, initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  collection,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";

export interface NewUniversityArgs {
  universityName: string;
  domain: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
}

/**
 * Creates a university document + its first universityAdmin account.
 *
 * Uses a secondary Firebase app instance so the SuperAdmin's current
 * auth session is NOT affected by createUserWithEmailAndPassword.
 */
export async function createUniversityWithAdmin(
  args: NewUniversityArgs
): Promise<{ universityId: string; adminUid: string }> {
  const { universityName, domain, adminName, adminEmail, adminPassword } = args;

  // 1. Create the university document (auto-ID)
  const uniRef = doc(collection(db, "universities"));
  const universityId = uniRef.id;

  await setDoc(uniRef, {
    name: universityName,
    domain,
    createdAt: serverTimestamp(),
  });

  // 2. Create Firebase Auth user via a temporary secondary app so the
  //    SuperAdmin's session stays intact.
  const secondaryApp = initializeApp(
    getApp().options,
    `onboarding-${Date.now()}`
  );

  let adminUid = "";
  try {
    const cred = await createUserWithEmailAndPassword(
      getAuth(secondaryApp),
      adminEmail,
      adminPassword
    );
    adminUid = cred.user.uid;

    // 3. Create the Firestore user doc for the new admin
    await setDoc(doc(db, "users", adminUid), {
      name: adminName,
      email: adminEmail,
      role: "universityAdmin",
      universityId,
      universityName,
      clubId: "",
      clubName: "",
      createdAt: serverTimestamp(),
    });

    return { universityId, adminUid };
  } catch (error) {
    // Rollback university doc on any failure
    await deleteDoc(uniRef).catch(() => {});
    throw error;
  } finally {
    await deleteApp(secondaryApp).catch(() => {});
  }
}
