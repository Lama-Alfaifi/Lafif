// features/ai/components/WeeklyChallengeCard.tsx
"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import useAI from "../hooks/useAI";
import type { ChallengeType } from "../types/challenge.types";

function difficultyColor(d: string) {
  switch (d) {
    case "سهل": return "bg-emerald-100 text-emerald-700";
    case "صعب": return "bg-rose-100 text-rose-700";
    default: return "bg-amber-100 text-amber-700";
  }
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
  const { challenge, loading, error, saved } = useAI({ clubId, universityId, clubName, category });

  const subtitle = useMemo(
    () => (category ? `تحدي هذا الأسبوع — ${category}` : "AI Weekly Challenge"),
    [category]
  );

  if (loading) {
    return (
      <div className="bg-white rounded-[32px] p-7 shadow-xl">
        <div className="animate-pulse flex flex-col gap-4">
          <div className="h-5 w-40 rounded-full bg-gray-200" />
          <div className="h-10 w-72 rounded-2xl bg-gray-200" />
          <div className="h-24 rounded-3xl bg-gray-100" />
        </div>
        <p className="mt-6 text-sm text-gray-500">جاري توليد التحدي بواسطة الذكاء الاصطناعي...</p>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="bg-white rounded-[32px] p-7 shadow-xl">
        <p className="text-rose-600 font-semibold">تعذر توليد التحدي.</p>
        <p className="text-gray-500 mt-2 text-sm">حاول لاحقًا. {error || ""}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] p-7 shadow-xl">
      {/* Top */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-cyan-600 font-bold">{subtitle}</p>
          <h1 className="text-2xl font-black mt-2 text-[#0F172A]">{challenge.title}</h1>
        </div>

        <div className="px-4 py-2 rounded-full bg-cyan-100 text-cyan-700 text-sm font-bold">
          {Number(challenge.points) || 100} XP
        </div>
      </div>

      {/* Description */}
      <p className="mt-5 text-gray-600 leading-8">{challenge.description}</p>

      {/* Info */}
      <div className="grid grid-cols-2 gap-4 mt-7">
        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="text-gray-400 text-sm">نوع التحدي</p>
          <h2 className="font-bold mt-1">{challenge.challengeType || "AI Challenge"}</h2>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="text-gray-400 text-sm">الصعوبة</p>
          <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold ${difficultyColor(challenge.difficulty || "متوسط")}`}>
            {challenge.difficulty || "متوسط"}
          </span>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="text-gray-400 text-sm">المدة</p>
          <h2 className="font-bold mt-1">{challenge.duration || "20 دقيقة"}</h2>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="text-gray-400 text-sm">الموعد النهائي</p>
          <h2 className="font-bold mt-1">{challenge.deadline || "الخميس 11:00 مساءً"}</h2>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex items-center justify-between mt-8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <p className="text-sm text-gray-500">
            {challenge.aiGenerated ? "تم إنشاؤه وتحليله بواسطة AI" : "تحدٍ مخصص"}
            {saved?.weekKey ? ` • أسبوع ${saved.weekKey}` : null}
          </p>
        </div>

        <button
          onClick={() => {
            if (saved?.id) {
              router.push(`/challenge/${saved.id}`);
            } else {
              onStart?.(challenge);
            }
          }}
          className="px-5 py-3 rounded-2xl bg-[#0F172A] text-white hover:scale-105 active:scale-95 transition-all duration-300"
        >
          ابدأ التحدي
        </button>
      </div>
    </div>
  );
}
