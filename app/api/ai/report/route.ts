import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

interface ReportStats {
  memberCount: number;
  eventCount: number;
  totalAttendance: number;
  avgAttendanceRate: number;
  challengeCount: number;
  submissionCount: number;
  avgScore: number;
  avgAccuracy: number;
  totalScore: number;
  trendDirection?: "improving" | "declining" | "stable";
  trendDelta?: number;
}

interface RequestBody {
  clubId: string;
  clubName: string;
  category: string;
  stats: ReportStats;
}

function buildPrompt(clubName: string, category: string, s: ReportStats): string {
  const lines: string[] = [];

  if (s.avgAttendanceRate < 40)
    lines.push("⚠️ نسبة الحضور منخفضة جداً (أقل من 40%) — مشكلة تفاعل حادة.");
  else if (s.avgAttendanceRate < 60)
    lines.push("تنبيه: نسبة الحضور مقبولة لكن تحتاج تحسيناً.");

  if (s.avgScore > 0 && s.avgScore < 50)
    lines.push("⚠️ متوسط النقاط منخفض — الأعضاء يحتاجون دعماً أكاديمياً.");

  if (s.eventCount === 0)
    lines.push("⚠️ النادي لم ينظم أي فعالية — غياب نشاط أساسي.");

  if (s.memberCount < 10)
    lines.push("ملاحظة: النادي صغير ويحتاج استقطاب أعضاء.");

  const trendLabel =
    s.trendDirection === "improving"
      ? `تحسّن ↑ (+${s.trendDelta} نقطة مقارنةً بالأسابيع السابقة)`
      : s.trendDirection === "declining"
      ? `تراجع ↓ (${s.trendDelta} نقطة مقارنةً بالأسابيع السابقة)`
      : "مستقر →";

  if (s.trendDirection === "declining")
    lines.push(`⚠️ اتجاه الأداء: ${trendLabel} — يحتاج تدخلاً عاجلاً.`);
  else if (s.trendDirection === "improving")
    lines.push(`✅ اتجاه الأداء: ${trendLabel} — مؤشر إيجابي يستحق التعزيز.`);

  const notes = lines.join("\n") || "لا توجد تحذيرات — الأداء العام مقبول.";

  return `أنت مستشار تطوير أندية جامعية متخصص في الجامعات السعودية.

حلّل أداء نادي "${clubName}" (تخصص: ${category}) بناءً على البيانات الفعلية:

📊 الإحصاءات الحقيقية:
• عدد الأعضاء: ${s.memberCount}
• الفعاليات المنظّمة: ${s.eventCount}
• إجمالي سجلات الحضور: ${s.totalAttendance}
• نسبة الحضور التقديرية: ${s.avgAttendanceRate}%
• تحديات أسبوعية أُنجزت: ${s.challengeCount}
• إجمالي تسليمات التحديات: ${s.submissionCount}
• متوسط النقاط: ${s.avgScore}
• متوسط دقة الإجابات: ${s.avgAccuracy}%
• النقاط التراكمية: ${s.totalScore}

📌 ملاحظات التحليل:
${notes}

قواعد تحديد الحالة (اختر واحدة فقط):
• "ممتاز" — حضور > 70% وأعضاء ≥ 20 وتحديات ≥ 5 ونقاط > 70
• "جيد جداً" — حضور > 50% أو (نقاط > 60 وفعاليات > 2)
• "جيد" — حضور > 30% وفعاليات > 0
• "يحتاج تحسين" — أي حالة أسوأ مما سبق

أعد JSON صحيح بهذا الهيكل الحرفي فقط (لا نص خارجه):
{
  "status": "...",
  "summary": "تحليل واقعي في 3-4 جمل يستند إلى الأرقام الفعلية — لا تتجمّل إذا كانت هناك مشاكل",
  "strengths": ["نقطة قوة فعلية مستندة للبيانات", "..."],
  "weaknesses": ["نقطة ضعف فعلية مستندة للبيانات", "..."],
  "recommendations": [
    "توصية عملية محددة قابلة للتنفيذ هذا الأسبوع",
    "توصية ثانية",
    "توصية ثالثة"
  ],
  "suggestedWorkshop": "ورشة عمل محددة تناسب تخصص ${category} ومستوى النادي الحالي — اذكر الاسم والهدف"
}`;
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { success: false, message: "GEMINI_API_KEY غير مضبوط" },
      { status: 500 }
    );
  }

  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json({ success: false, message: "طلب غير صالح" }, { status: 400 });
  }

  const { clubName, category, stats } = body;
  if (!clubName || !stats) {
    return NextResponse.json({ success: false, message: "بيانات ناقصة" }, { status: 400 });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.55,
        maxOutputTokens: 1024,
      },
    });

    const result = await model.generateContent(buildPrompt(clubName, category, stats));
    const raw = result.response.text().trim();
    const cleaned = raw.startsWith("```")
      ? raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "")
      : raw;

    const report = JSON.parse(cleaned) as Record<string, unknown>;

    report.stats = {
      eventCount: stats.eventCount,
      memberCount: stats.memberCount,
      avgAttendance: stats.avgAttendanceRate,
      completionRate: stats.challengeCount,
      avgScore: stats.avgScore,
    };
    report.generatedAt = { seconds: Math.floor(Date.now() / 1000) };

    return NextResponse.json({ success: true, report });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[api/ai/report]", msg);
    return NextResponse.json(
      { success: false, message: "تعذر توليد التقرير — حاول مرة أخرى" },
      { status: 500 }
    );
  }
}
