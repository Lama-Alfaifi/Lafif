import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// ISO week key: yyyy-ww
function getWeekKey(d = new Date()): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    (((date as unknown as number) - (yearStart as unknown as number)) / 86400000 + 1) / 7
  );
  return `${date.getUTCFullYear()}-${String(weekNo).padStart(2, "0")}`;
}

// Sunday 23:59 of current ISO week
function getDeadlineText(): string {
  const now = new Date();
  const daysUntilSunday = now.getDay() === 0 ? 0 : 7 - now.getDay();
  const sunday = new Date(now);
  sunday.setDate(now.getDate() + daysUntilSunday);
  return `${sunday.getFullYear()}/${String(sunday.getMonth() + 1).padStart(2, "0")}/${String(sunday.getDate()).padStart(2, "0")} الساعة 11:59 مساءً`;
}

interface GeminiQuestion {
  question: string;
  options: [string, string, string, string];
  correct: number;
  explanation?: string;
}

interface GeminiChallenge {
  title: string;
  description: string;
  difficulty: string;
  points: number;
  questions: GeminiQuestion[];
}

interface RequestBody {
  clubId: string;
  clubName: string;
  category: string;
  universityId: string;
}

const SYSTEM = `أنت متخصص في إنشاء تحديات أكاديمية لطلاب الجامعات السعودية.
تُنشئ أسئلة اختيار من متعدد (MCQ) عالية الجودة تناسب مستوى الجامعة.
أجب دائماً بـ JSON صحيح فقط بدون أي نص إضافي خارج JSON.`;

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { success: false, message: "GEMINI_API_KEY غير مضبوط في .env.local" },
      { status: 500 }
    );
  }

  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json(
      { success: false, message: "طلب غير صالح" },
      { status: 400 }
    );
  }

  const { clubId, clubName, category, universityId } = body;

  if (!clubId || !clubName || !universityId) {
    return NextResponse.json(
      { success: false, message: "clubId, clubName, universityId مطلوبة" },
      { status: 400 }
    );
  }

  const cat = category && category !== "عام" ? category : "المعرفة العامة";

  const prompt = `أنشئ تحدياً أسبوعياً لنادي "${clubName}" في تخصص "${cat}".

أعد JSON بهذا الهيكل الحرفي بالضبط (لا تضف أي نص قبله أو بعده):
{
  "title": "عنوان التحدي الجذاب",
  "description": "وصف التحدي بجملتين",
  "difficulty": "متوسط",
  "points": 100,
  "questions": [
    {
      "question": "نص السؤال",
      "options": ["الخيار أ", "الخيار ب", "الخيار ج", "الخيار د"],
      "correct": 0,
      "explanation": "سبب صحة الإجابة"
    }
  ]
}

الشروط:
- 5 أسئلة مختلفة ومتدرجة الصعوبة
- difficulty: "سهل" أو "متوسط" أو "صعب" فقط
- correct: رقم 0-3 = فهرس الإجابة الصحيحة في options
- options: 4 خيارات نصية بالعربية
- جميع النصوص عربية
- الأسئلة مرتبطة بتخصص "${cat}"`;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    // gemini-1.5-flash: stable, free tier, fast
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });

    const chat = model.startChat({
      history: [{ role: "user", parts: [{ text: SYSTEM }] }],
    });

    const result = await chat.sendMessage(prompt);
    const raw = result.response.text().trim();

    // Strip markdown code fences if model added them
    const cleaned = raw.startsWith("```")
      ? raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "")
      : raw;

    let gemini: GeminiChallenge;
    try {
      gemini = JSON.parse(cleaned) as GeminiChallenge;
    } catch {
      console.error("[challenge/generate] bad JSON:", cleaned.slice(0, 300));
      return NextResponse.json(
        { success: false, message: "Gemini لم يُعد JSON صحيحاً — حاول مرة أخرى" },
        { status: 502 }
      );
    }

    if (
      !gemini.title ||
      !Array.isArray(gemini.questions) ||
      gemini.questions.length === 0
    ) {
      return NextResponse.json(
        { success: false, message: "هيكل الرد من Gemini غير مكتمل" },
        { status: 502 }
      );
    }

    const questions = gemini.questions.slice(0, 5).map((q) => ({
      question: q.question,
      options: q.options as [string, string, string, string],
      correctIndex: (Math.min(3, Math.max(0, q.correct ?? 0))) as 0 | 1 | 2 | 3,
      explanation: q.explanation ?? "",
    }));

    const weekKey = getWeekKey();

    const challenge = {
      clubId,
      clubName,
      universityId,
      category: cat,
      weekKey,
      title: gemini.title,
      description: gemini.description ?? "",
      difficulty: ["سهل", "متوسط", "صعب"].includes(gemini.difficulty)
        ? gemini.difficulty
        : "متوسط",
      points: typeof gemini.points === "number" && gemini.points > 0 ? gemini.points : 100,
      challengeType: "AI Challenge",
      questions,
      duration: "20 دقيقة",
      deadline: getDeadlineText(),
      participants: 0,
      aiGenerated: true,
    };

    return NextResponse.json({ success: true, challenge, weekKey });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("[challenge/generate] Gemini error:", errMsg);

    // Surface real error in dev so you can see what's wrong
    const clientMsg =
      process.env.NODE_ENV === "development"
        ? `Gemini: ${errMsg}`
        : "حدث خطأ أثناء التوليد — تحقق من GEMINI_API_KEY وحاول مرة أخرى";

    return NextResponse.json({ success: false, message: clientMsg }, { status: 500 });
  }
}
