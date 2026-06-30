import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

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

// Deadline = next Sunday at 23:59 Riyadh time
function getDeadlineText(): string {
  const now = new Date();
  const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
  const sunday = new Date(now);
  sunday.setDate(now.getDate() + daysUntilSunday);
  const dd = String(sunday.getDate()).padStart(2, "0");
  const mm = String(sunday.getMonth() + 1).padStart(2, "0");
  return `${sunday.getFullYear()}/${mm}/${dd} الساعة 11:59 مساءً`;
}

interface GeminiQuestion {
  question: string;
  options: [string, string, string, string];
  correct: number;
  explanation: string;
}

interface GeminiChallenge {
  title: string;
  description: string;
  difficulty: "سهل" | "متوسط" | "صعب";
  points: number;
  questions: GeminiQuestion[];
}

interface RequestBody {
  clubId: string;
  clubName: string;
  category: string;
  universityId: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    const { clubId, clubName, category, universityId } = body;

    if (!clubId || !clubName || !universityId) {
      return NextResponse.json(
        { success: false, message: "clubId, clubName, universityId مطلوبة" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, message: "GEMINI_API_KEY غير مضبوط في .env.local" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: `أنت متخصص في إنشاء تحديات أكاديمية لطلاب الجامعات السعودية.
تُنشئ أسئلة اختيار من متعدد (MCQ) عالية الجودة تناسب مستوى الجامعة.
أجب دائماً بـ JSON صحيح فقط بدون أي نص إضافي.`,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.75,
      },
    });

    const cat = category && category !== "عام" ? category : "المعرفة العامة";

    const prompt = `أنشئ تحدياً أسبوعياً لنادي "${clubName}" في تخصص "${cat}".

أعد JSON بهذا الهيكل الحرفي بالضبط:
{
  "title": "عنوان التحدي (جملة قصيرة جذابة)",
  "description": "وصف التحدي بجملتين يشرح الهدف منه",
  "difficulty": "متوسط",
  "points": 100,
  "questions": [
    {
      "question": "نص السؤال بوضوح",
      "options": ["الخيار أ", "الخيار ب", "الخيار ج", "الخيار د"],
      "correct": 0,
      "explanation": "شرح سبب صحة هذه الإجابة"
    }
  ]
}

الشروط الإلزامية:
- 5 أسئلة متنوعة متدرجة الصعوبة
- difficulty: اختر من ("سهل" أو "متوسط" أو "صعب") فقط
- correct: رقم من 0 إلى 3 يمثل فهرس الإجابة الصحيحة في مصفوفة options
- options: مصفوفة بالضبط 4 عناصر نصية
- جميع النصوص باللغة العربية حصراً
- الأسئلة مرتبطة بتخصص النادي بشكل واضح`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text();

    let gemini: GeminiChallenge;
    try {
      gemini = JSON.parse(raw) as GeminiChallenge;
    } catch {
      console.error("[challenge/generate] JSON parse failed:", raw.slice(0, 200));
      return NextResponse.json(
        { success: false, message: "Gemini لم يُعد JSON صحيحاً" },
        { status: 502 }
      );
    }

    if (!gemini.title || !Array.isArray(gemini.questions) || gemini.questions.length === 0) {
      return NextResponse.json(
        { success: false, message: "هيكل الرد من Gemini غير مكتمل" },
        { status: 502 }
      );
    }

    // Normalise: Gemini uses `correct` (number) → our MCQQuestion uses `correctIndex`
    const questions = gemini.questions.slice(0, 5).map((q) => ({
      question: q.question,
      options: q.options as [string, string, string, string],
      correctIndex: (typeof q.correct === "number" ? q.correct : 0) as 0 | 1 | 2 | 3,
      explanation: q.explanation ?? "",
    }));

    const weekKey = getWeekKey();

    const challenge = {
      // Identity
      clubId,
      clubName,
      universityId,
      category: cat,
      weekKey,
      // Content
      title: gemini.title,
      description: gemini.description,
      difficulty: gemini.difficulty ?? "متوسط",
      points: typeof gemini.points === "number" ? gemini.points : 100,
      challengeType: "AI Challenge",
      questions,
      // Meta
      duration: "20 دقيقة",
      deadline: getDeadlineText(),
      participants: 0,
      aiGenerated: true,
    };

    return NextResponse.json({ success: true, challenge, weekKey });
  } catch (error) {
    console.error("[challenge/generate] error:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ أثناء التوليد" },
      { status: 500 }
    );
  }
}
