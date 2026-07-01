import { NextRequest, NextResponse } from "next/server";
import { getAdminMessaging } from "@/src/lib/firebase-admin";

export async function POST(req: NextRequest) {
  const { token, title, body } = await req.json() as {
    token: string;
    title: string;
    body: string;
  };

  if (!token || !title) {
    return NextResponse.json({ error: "missing token or title" }, { status: 400 });
  }

  try {
    const messaging = getAdminMessaging();
    await messaging.send({
      token,
      notification: { title, body },
      webpush: {
        notification: { dir: "rtl", lang: "ar", icon: "/next.svg" },
      },
    });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    // Token expired/invalid — not a server error
    if (msg.includes("registration-token-not-registered")) {
      return NextResponse.json({ ok: false, reason: "token-invalid" });
    }
    console.error("[push-notification]", err);
    return NextResponse.json({ error: "send failed" }, { status: 500 });
  }
}
