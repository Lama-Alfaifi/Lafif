import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

function initAdmin() {
  if (getApps().length > 0) return;

  const projectId     = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail   = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey    = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin env vars missing");
  }

  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

export function getAdminMessaging() {
  initAdmin();
  return getMessaging();
}
