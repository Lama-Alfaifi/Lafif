import { getGeminiModel } from "./openai.service";

export default async function challengeService(
  clubName: string,
  category: string
): Promise<string | null> {
  const model = getGeminiModel(0.8);

  const prompt = `أنت AI متخصص في إنشاء تحديات أكاديمية لطلاب الجامعات السعودية.

أنشئ تحدياً أسبوعياً لنادي "${clubName}" في تخصص "${category}".

أعد JSON بهذا الهيكل الحرفي فقط:
{
  "title": "عنوان التحدي",
  "description": "وصف التحدي بجملتين",
  "challengeType": "quiz",
  "difficulty": "متوسط",
  "points": 100,
  "duration": "60",
  "deadline": ""
}`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
