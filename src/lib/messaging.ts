import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { doc, updateDoc } from "firebase/firestore";
import { app, db } from "./firebase";

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ?? "";

let messagingInstance: ReturnType<typeof getMessaging> | null = null;

function getMsg() {
  if (!messagingInstance) messagingInstance = getMessaging(app);
  return messagingInstance;
}

export async function requestAndSaveFCMToken(uid: string): Promise<string | null> {
  if (typeof window === "undefined" || !("Notification" in window)) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    const token = await getToken(getMsg(), { vapidKey: VAPID_KEY });
    if (!token) return null;

    await updateDoc(doc(db, "users", uid), { fcmToken: token });
    return token;
  } catch (e) {
    console.warn("[FCM] token error:", e);
    return null;
  }
}

export function onForegroundMessage(
  callback: (title: string, body: string) => void
) {
  return onMessage(getMsg(), (payload) => {
    const title = payload.notification?.title ?? "لفيف";
    const body = payload.notification?.body ?? "";
    callback(title, body);
  });
}
