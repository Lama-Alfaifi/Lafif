"use client";

import { useRouter } from "next/navigation";
import { Sparkles, Zap, RefreshCw, AlertCircle } from "lucide-react";
import useAI from "../hooks/useAI";
import type { ChallengeType } from "../types/challenge.types";

function difficultyColor(d: string) {
  if (d === "سهل") return "bg-emerald-100 text-emerald-700";
  if (d === "صعب") return "bg-rose-100 text-rose-700";
  return "bg-amber-100 text-amber-700";
}

type WeeklyChallengeCardProps = {
  clubId: string;
  universityId: string;
  clubName: string;
  category: string;
  onStart?: (challenge: ChallengeType) => void;
};

export default function WeeklyChallengeCard({
  clubId,
  universityId,
  clubName,
  category,
  onStart,
}: WeeklyChallengeCardProps) {
  const router = useRouter();
  const { challenge, saved, loading, generating, error, generate } = useAI({
    clubId,
    universityId,
    clubName,
    category,
  });

  const subtitle = category && category !== "عام"
    ? `تحدي هذا الأسبوع — ${category}`
    : "AI Weekly Challenge";

  // ── Loading (checking Firestore) ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-white rounded-[32px] p-7 shadow-xl">
        <div className="animate-pulse flex flex-col gap-4">
          <div className="h-4 w-40 rounded-full bg-gray-200" />
          <div className="h-8 w-64 rounded-2xl bg-gray-200" />
          <div className="h-20 rounded-3xl bg-gray-100" />
          <div className="h-10 w-36 rounded-2xl bg-gray-200 self-end" />
        </div>
      </div>
    );
  }

  // ── Generating (API call in progress) ────────────────────────────────────
  if (generating) {
    return (
      <div className="bg-white rounded-[32px] p-7 shadow-xl">
        <div className="flex flex-col items-center justify-center py-10 gap-4">
          <div className="w-14 h-14 rounded-[18px] bg-[#EFE8F7] flex items-center justify-center">
            <Sparkles size={24} className="text-[#7C3AED] animate-pulse" />
          </div>
          <p className="text-base font-black text-[#21166A]">
            جاري توليد التحدي بالذكاء الاصطناعي...
          </p>
          <p className="text-sm text-gray-400">Gemini 2.0 Flash • قد يستغرق 10–20 ثانية</p>
          <div className="flex gap-1.5 mt-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-[#7C3AED] animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── No challenge yet — show Generate button ───────────────────────────────
  if (!challenge) {
    return (
      <div className="bg-white rounded-[32px] p-7 shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-sm text-[#7C3AED] font-bold">{subtitle}</p>
            <h1 className="text-2xl font-black mt-2 text-[#21166A]">التحدي الأسبوعي</h1>
          </div>
          <div className="w-11 h-11 rounded-[14px] bg-[#EFE8F7] flex items-center justify-center">
            <Zap size={20} className="text-[#7C3AED]" />
          </div>
        </div>

        <div className="bg-[#F7F5FF] rounded-[20px] p-5 mb-6">
          <p className="text-sm text-gray-500 leading-7">
            لم يُولَّد تحدي هذا الأسبوع بعد. اضغط على الزر لتوليد 5 أسئلة تفاعلية مخصصة لنادي{" "}
            <span className="font-bold text-[#21166A]">{clubName}</span> بواسطة Gemini AI.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-2xl px-4 py-3 mb-4">
            <AlertCircle size={15} className="text-red-500 shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          onClick={generate}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-l from-[#5B3DF5] to-[#7C3AED] text-white font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-purple-900/20"
        >
          <Sparkles size={18} />
          توليد التحدي بـ Gemini AI
        </button>
      </div>
    );
  }

  // ── Challenge ready ───────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-[32px] p-7 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-cyan-600 font-bold">{subtitle}</p>
          <h1 className="text-2xl font-black mt-2 text-[#0F172A]">{challenge.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 rounded-full bg-cyan-100 text-cyan-700 text-sm font-bold">
            {Number(challenge.points) || 100} XP
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="mt-5 text-gray-600 leading-8">{challenge.description}</p>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-4 mt-7">
        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="text-gray-400 text-sm">عدد الأسئلة</p>
          <h2 className="font-bold mt-1">
            {Array.isArray(challenge.questions) && challenge.questions.length > 0
              ? `${challenge.questions.length} أسئلة`
              : "5 أسئلة"}
          </h2>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="text-gray-400 text-sm">الصعوبة</p>
          <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold ${difficultyColor(challenge.difficulty ?? "متوسط")}`}>
            {challenge.difficulty ?? "متوسط"}
          </span>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="text-gray-400 text-sm">المدة</p>
          <h2 className="font-bold mt-1">{challenge.duration || "20 دقيقة"}</h2>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="text-gray-400 text-sm">الموعد النهائي</p>
          <h2 className="font-bold mt-1 text-sm leading-5">{challenge.deadline || "نهاية الأسبوع"}</h2>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-8">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <p className="text-sm text-gray-500">
            {challenge.aiGenerated ? "Gemini AI" : "تحدٍ مخصص"}
            {saved?.weekKey ? ` • أسبوع ${saved.weekKey}` : ""}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Regenerate button */}
          <button
            onClick={generate}
            title="توليد تحدٍ جديد"
            className="w-10 h-10 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-[#EFE8F7] hover:text-[#7C3AED] transition"
          >
            <RefreshCw size={15} />
          </button>

          {/* Start button */}
          <button
            onClick={() => {
              if (saved?.id) {
                router.push(`/challenge/${saved.id}`);
              } else {
                onStart?.(challenge);
              }
            }}
            className="px-5 py-3 rounded-2xl bg-[#0F172A] text-white font-bold hover:scale-105 active:scale-95 transition-all duration-300"
          >
            ابدأ التحدي
          </button>
        </div>
      </div>
    </div>
  );
}
