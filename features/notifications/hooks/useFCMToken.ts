"use client";

import { useEffect, useRef } from "react";
import { requestAndSaveFCMToken, onForegroundMessage } from "@/src/lib/messaging";

export default function useFCMToken(uid: string | undefined) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!uid || initialized.current) return;
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    initialized.current = true;

    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then(() => requestAndSaveFCMToken(uid))
      .catch((e) => console.warn("[FCM] sw register error:", e));

    const unsub = onForegroundMessage((title, body) => {
      if (Notification.permission === "granted") {
        new Notification(title, { body, dir: "rtl", lang: "ar" });
      }
    });

    return unsub;
  }, [uid]);
}
