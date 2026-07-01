import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY not set" }, { status: 500 });
  }

  const { adminName, adminEmail, adminPassword, universityName } = await req.json() as {
    adminName: string;
    adminEmail: string;
    adminPassword: string;
    universityName: string;
  };

  if (!adminEmail || !adminPassword || !universityName) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const resend = new Resend(apiKey);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://lafif.app";

  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#F7F5FF;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(33,22,106,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#21166A,#7C3AED);padding:36px 40px;text-align:center;">
            <p style="margin:0 0 8px;color:#C4B5FD;font-size:13px;font-weight:700;">منصة لفيف</p>
            <h1 style="margin:0;color:#fff;font-size:26px;font-weight:900;">مرحباً بك في لفيف</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 8px;color:#21166A;font-size:16px;font-weight:700;">
              مرحباً ${adminName ? adminName : ""}،
            </p>
            <p style="margin:0 0 24px;color:#6B7280;font-size:14px;line-height:1.7;">
              تم تعيينك مسؤولاً للجامعة على منصة <strong style="color:#21166A;">لفيف</strong>.
              فيما يلي بيانات دخولك إلى المنصة:
            </p>

            <!-- Credentials box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F5FF;border-radius:16px;margin-bottom:24px;">
              <tr><td style="padding:24px;">
                <p style="margin:0 0 4px;color:#7C3AED;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1px;">
                  الجامعة
                </p>
                <p style="margin:0 0 16px;color:#21166A;font-size:18px;font-weight:900;">${universityName}</p>

                <p style="margin:0 0 4px;color:#7C3AED;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1px;">
                  البريد الإلكتروني
                </p>
                <p style="margin:0 0 16px;color:#21166A;font-size:14px;font-weight:700;direction:ltr;text-align:right;">${adminEmail}</p>

                <p style="margin:0 0 4px;color:#7C3AED;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1px;">
                  كلمة المرور المؤقتة
                </p>
                <p style="margin:0;color:#21166A;font-size:14px;font-weight:700;direction:ltr;text-align:right;background:#fff;border:2px solid #EFE8F7;border-radius:10px;padding:10px 14px;">${adminPassword}</p>
              </td></tr>
            </table>

            <p style="margin:0 0 24px;color:#6B7280;font-size:13px;">
              يُنصح بتغيير كلمة المرور فور تسجيل الدخول لأول مرة.
            </p>

            <!-- CTA button -->
            <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
              <tr>
                <td style="background:#21166A;border-radius:16px;">
                  <a href="${appUrl}/login" style="display:inline-block;padding:14px 32px;color:#fff;font-size:14px;font-weight:900;text-decoration:none;">
                    تسجيل الدخول الآن
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#F9FAFB;padding:20px 40px;text-align:center;">
            <p style="margin:0;color:#9CA3AF;font-size:12px;">
              هذا البريد أُرسل تلقائياً من منصة لفيف · لا تشاركه مع أحد
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    await resend.emails.send({
      from: "لفيف <no-reply@lafif.app>",
      to: adminEmail,
      subject: `مرحباً بك في لفيف — بيانات دخولك لجامعة ${universityName}`,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[send-admin-email]", err);
    return NextResponse.json({ error: "failed to send" }, { status: 500 });
  }
}
