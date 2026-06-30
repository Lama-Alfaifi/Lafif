"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, RefreshCw, AlertCircle, Clock, Zap } from "lucide-react";
import useAI, { msUntilWeekEnd, formatCountdown } from "../hooks/useAI";
import type { ChallengeType } from "../types/challenge.types";

function difficultyColor(d: string) {
  if (d === "سهل") return "bg-emerald-100 text-emerald-700";
  if (d === "صعب") return "bg-rose-100 text-rose-700";
  return "bg-amber-100 text-amber-700";
}

function useCountdown(): string {
  const [text, setText] = useState("");
  useEffect(() => {
    function tick() { setText(formatCountdown(msUntilWeekEnd())); }
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);
  return text;
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
  const countdown = useCountdown();
  const { challenge, saved, loading, generating, error, generate } = useAI({
    clubId,
    universityId,
    clubName,
    category,
  });

  const subtitle =
    category && category !== "عام"
      ? `تحدي هذا الأسبوع — ${category}`
      : "AI Weekly Challenge";

  // ── Loading skeleton ──────────────────────────────────────────────────────
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

  // ── Generating (auto or manual refresh) ──────────────────────────────────
  if (generating) {
    return (
      <div className="bg-white rounded-[32px] p-7 shadow-xl">
        <div className="flex flex-col items-center justify-center py-10 gap-4">
          <div className="w-14 h-14 rounded-[18px] bg-[#EFE8F7] flex items-center justify-center">
            <Sparkles size={24} className="text-[#7C3AED] animate-pulse" />
          </div>
          <div className="text-center">
            <p className="text-base font-black text-[#21166A]">
              يتولّد التحدي تلقائياً...
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Gemini 1.5 Flash • حتى 20 ثانية
            </p>
          </div>
          <div className="flex gap-1.5 mt-1">
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

  // ── Error — no challenge generated ───────────────────────────────────────
  if (!challenge) {
    return (
      <div className="bg-white rounded-[32px] p-7 shadow-xl">
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-2xl px-4 py-3 mb-5">
          <AlertCircle size={15} className="text-red-500 shrink-0" />
          <p className="text-sm text-red-600 font-bold">
            {error || "تعذّر توليد التحدي"}
          </p>
        </div>
        <p className="text-sm text-gray-500 mb-5">
          تحقق من أن <code className="bg-gray-100 px-1 rounded text-xs">GEMINI_API_KEY</code> موجود في{" "}
          <code className="bg-gray-100 px-1 rounded text-xs">.env.local</code>، ثم حاول مرة أخرى.
        </p>
        <button
          onClick={generate}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#21166A] text-white font-bold hover:opacity-90 transition"
        >
          <RefreshCw size={15} />
          إعادة المحاولة
        </button>
      </div>
    );
  }

  // ── Challenge ready ───────────────────────────────────────────────────────
  const questionCount =
    Array.isArray(challenge.questions) && challenge.questions.length > 0
      ? challenge.questions.length
      : 5;

  return (
    <div className="bg-white rounded-[32px] p-7 shadow-xl">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-cyan-600 font-bold">{subtitle}</p>
          <h1 className="text-2xl font-black mt-2 text-[#0F172A] leading-tight">
            {challenge.title}
          </h1>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-1.5">
          <span className="px-3 py-1.5 rounded-full bg-cyan-100 text-cyan-700 text-sm font-bold whitespace-nowrap">
            {Number(challenge.points) || 100} XP
          </span>
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${difficultyColor(challenge.difficulty ?? "متوسط")}`}>
            {challenge.difficulty ?? "متوسط"}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="mt-5 text-gray-600 leading-7 text-sm">{challenge.description}</p>

      {/* Countdown + stats */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        <div className="col-span-2 bg-[#F7F5FF] rounded-2xl px-4 py-3 flex items-center gap-2">
          <Clock size={15} className="text-[#7C3AED] shrink-0" />
          <div>
            <p className="text-[10px] text-gray-400 font-bold">ينتهي التحدي خلال</p>
            <p className="text-sm font-black text-[#21166A]">{countdown}</p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-2xl px-4 py-3 text-center">
          <p className="text-2xl font-black text-[#21166A]">{questionCount}</p>
          <p className="text-[10px] text-gray-400 font-bold mt-0.5">أسئلة</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <p className="text-xs text-gray-400 font-bold">
            {challenge.aiGenerated ? "Gemini AI" : "تحدٍ مخصص"}
            {saved?.weekKey ? ` • ${saved.weekKey}` : ""}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={generate}
            title="توليد تحدٍ جديد"
            className="w-9 h-9 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-[#EFE8F7] hover:text-[#7C3AED] transition"
          >
            <RefreshCw size={13} />
          </button>
          <button
            onClick={() => {
              if (saved?.id) router.push(`/challenge/${saved.id}`);
              else onStart?.(challenge);
            }}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-[#0F172A] text-white font-bold hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <Zap size={14} />
            ابدأ التحدي
          </button>
        </div>
      </div>
    </div>
  );
}
