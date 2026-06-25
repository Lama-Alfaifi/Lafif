// features/ai/utils/generateWeeklyChallenge.ts
import type { ChallengeType } from "../types/challenge.types";
import { getQuestionsForCategory } from "./questionBank";

// أدوات مساعدة
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

type Difficulty = "سهل" | "متوسط" | "صعب";

function deriveDifficulty(avgScore?: number, participation?: number): Difficulty {
  const s = avgScore ?? 70;
  const p = participation ?? 0.5;
  if (s < 60 || p < 0.35) return "سهل";
  if (s > 80 && p > 0.6) return "صعب";
  return "متوسط";
}

function metaByDifficulty(d: Difficulty) {
  if (d === "سهل") return { points: 50, duration: "15 دقيقة" };
  if (d === "صعب") return { points: 120, duration: "30 دقيقة" };
  return { points: 90, duration: "20 دقيقة" };
}

function computeDeadlineText(): string {
  // افتراضي ثابت حالياً
  return "الخميس 11:00 مساءً";
}

// قوالب حسب الفئة
const PRESETS: Record<
  string,
  Array<{
    title: string;
    description: string;
    type: string;
    forceDifficulty?: Difficulty;
  }>
> = {
  "حاسب": [
    { title: "خوارزمية بحث فعّالة", description: "اكتب دالة binarySearch(arr, target) مع حالتي اختبار.", type: "Coding Challenge" },
    { title: "تحليل التعقيد", description: "حدّد Big‑O لمقتطف كود واذكر السبب باختصار.", type: "Concept Review" },
    { title: "تصحيح كود", description: "أصلح خطأ منطقي في دالة ترتيب ووضّح سبب المشكلة.", type: "Debugging" },
  ],
  "طب": [
    { title: "تشخيص حالة مختصرة", description: "قدّم 3 احتمالات تشخيصية وخطوة فحص مرجِّحة.", type: "Medical Challenge" },
    { title: "دواء وموانع", description: "اختر دواء الخط الأول مع جرعته واذكر مانعين أساسيين.", type: "Pharma Quick Pick" },
  ],
  "تصميم": [
    { title: "نقد واجهة سريع", description: "اذكر 3 تحسينات قابلة للتنفيذ على واجهة معيّنة.", type: "UI/UX Challenge" },
    { title: "سلكي منخفض الدقة", description: "ارسم تخطيطًا نصيًا (ASCII) لشاشة رئيسية يبرز الهرمية.", type: "Wireframe" },
  ],
  "ثقافة": [
    { title: "نص موجز بهوية محلية", description: "اكتب 120–180 كلمة تتضمّن استعارة ومثالًا واقعيًا.", type: "Literature Challenge", forceDifficulty: "سهل" },
    { title: "تحرير أسلوبي", description: "حسّن فقرة واذكر سببين واضحين للتعديل.", type: "Editing" },
  ],
};

export default function generateWeeklyChallenge(
  clubName: string,
  category: string,
  hint?: { avgScore?: number; participationRate?: number }
): ChallengeType {
  const pool = PRESETS[category] ?? [
    { title: "تحدي عام قصير", description: "أجب عن 3 أسئلة تطبيقية مرتبطة بمجال ناديك.", type: "General Challenge" },
  ];

  const tpl = pick(pool);
  const difficulty: Difficulty = tpl.forceDifficulty ?? deriveDifficulty(hint?.avgScore, hint?.participationRate);
  const meta = metaByDifficulty(difficulty);

  return {
    clubName,
    category,
    title: tpl.title,
    description: tpl.description,
    challengeType: tpl.type,
    difficulty,
    points: meta.points,
    duration: meta.duration,
    deadline: computeDeadlineText(),
    participants: 0,
    aiGenerated: true,
    questions: getQuestionsForCategory(category, 5),
  };
}
