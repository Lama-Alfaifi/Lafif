import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export async function POST(request: Request) {
  try {
    const body = await request.json() as { club?: string; category?: string };
    const { club, category } = body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.8,
      },
    });

    const prompt = `أنت AI متخصص في إنشاء تحديات جامعية ذكية.

أنشئ تحدياً أسبوعياً مناسباً للنادي التالي:
- اسم النادي: ${club ?? ""}
- التصنيف: ${category ?? ""}

أعد JSON بهذا الهيكل الحرفي فقط:
{
  "title": "",
  "description": "",
  "challengeType": "",
  "difficulty": "",
  "points": 0,
  "duration": "",
  "deadline": ""
}`;

    const result = await model.generateContent(prompt);
    const data = result.response.text();

    return Response.json({ success: true, data });
  } catch (error) {
    console.error("[api/ai] error:", error);
    return Response.json({ success: false, message: "AI Error" }, { status: 500 });
  }
}
