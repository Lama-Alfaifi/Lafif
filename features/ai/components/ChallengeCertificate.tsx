"use client";

import { useRef } from "react";
import { Trophy, Star, Download, Zap } from "lucide-react";
import type { ChallengeSubmission } from "../types/challenge.types";

type Props = {
  submission: ChallengeSubmission;
  userName: string;
  clubName: string;
  universityName: string;
};

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-1 justify-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14}
          className={i < count ? "text-amber-400" : "text-gray-200"}
          fill={i < count ? "currentColor" : "none"} />
      ))}
    </div>
  );
}

function pctToStars(pct: number) {
  if (pct >= 90) return 5;
  if (pct >= 75) return 4;
  if (pct >= 60) return 3;
  if (pct >= 40) return 2;
  return 1;
}

function fmtDate(ts: unknown): string {
  if (!ts || typeof ts !== "object") return new Date().toLocaleDateString("ar-SA");
  const d = (ts as { toDate?: () => Date }).toDate?.();
  return d ? d.toLocaleDateString("ar-SA") : new Date().toLocaleDateString("ar-SA");
}

function fmtTime(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

export default function ChallengeCertificate({
  submission, userName, clubName, universityName,
}: Props) {
  const certRef = useRef<HTMLDivElement>(null);

  const pct    = Math.round((submission.correctCount / submission.totalQuestions) * 100);
  const stars  = pctToStars(pct);
  const grade  = pct >= 90 ? "ممتاز" : pct >= 75 ? "جيد جداً" : pct >= 60 ? "جيد" : pct >= 40 ? "مقبول" : "ضعيف";

  function handleDownload() {
    window.print();
  }

  return (
    <div className="space-y-4" dir="rtl">

      {/* Download button */}
      <div className="flex justify-end">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#21166A] text-white text-xs font-bold hover:opacity-90 transition shadow"
        >
          <Download size={13} />
          تنزيل الشهادة
        </button>
      </div>

      {/* Certificate */}
      <div
        ref={certRef}
        className="relative overflow-hidden rounded-[28px] bg-white border-4 border-[#21166A] p-8 shadow-xl text-center"
        style={{ fontFamily: "serif" }}
      >
        {/* Corner ornaments */}
        <div className="absolute top-3 right-3 w-10 h-10 border-t-4 border-r-4 border-[#7C3AED] rounded-tr-2xl" />
        <div className="absolute top-3 left-3  w-10 h-10 border-t-4 border-l-4 border-[#7C3AED] rounded-tl-2xl" />
        <div className="absolute bottom-3 right-3 w-10 h-10 border-b-4 border-r-4 border-[#7C3AED] rounded-br-2xl" />
        <div className="absolute bottom-3 left-3  w-10 h-10 border-b-4 border-l-4 border-[#7C3AED] rounded-bl-2xl" />

        {/* Background blobs */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-purple-100/50 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          {/* Platform logo */}
          <div>
            <p className="text-3xl font-black text-[#21166A]">لفيف</p>
            <p className="text-xs text-[#7C3AED] font-bold">منصة الأندية الجامعية</p>
          </div>

          <div className="h-px bg-gradient-to-l from-transparent via-[#7C3AED]/30 to-transparent" />

          {/* Title */}
          <div>
            <p className="text-xs font-bold text-gray-400 mb-1">شهادة إتمام</p>
            <h2 className="text-2xl font-black text-[#21166A]">التحدي الأسبوعي</h2>
          </div>

          {/* Trophy */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-[#21166A] to-[#7C3AED] flex items-center justify-center shadow-lg shadow-purple-900/25">
              <Trophy size={28} className="text-white" />
            </div>
          </div>

          {/* Recipient */}
          <div>
            <p className="text-xs text-gray-400 font-bold">تُمنح هذه الشهادة إلى</p>
            <p className="text-2xl font-black text-[#21166A] mt-1">{userName}</p>
            <p className="text-sm text-gray-500 mt-0.5">{clubName} · {universityName}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#F7F5FF] rounded-[16px] p-3">
              <div className="flex items-center gap-1 justify-center mb-1">
                <Zap size={12} className="text-[#7C3AED]" />
                <span className="text-lg font-black text-[#21166A]">{submission.score}</span>
              </div>
              <p className="text-[10px] text-gray-400 font-bold">نقطة XP</p>
            </div>
            <div className="bg-[#F7F5FF] rounded-[16px] p-3">
              <p className="text-lg font-black text-[#21166A] mb-1">{pct}%</p>
              <p className="text-[10px] text-gray-400 font-bold">دقة الإجابة</p>
            </div>
            <div className="bg-[#F7F5FF] rounded-[16px] p-3">
              <p className="text-lg font-black text-[#21166A] mb-1">{fmtTime(submission.timeSeconds)}</p>
              <p className="text-[10px] text-gray-400 font-bold">الوقت</p>
            </div>
          </div>

          {/* Stars + grade */}
          <div className="space-y-1.5">
            <StarRow count={stars} />
            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-black ${
              stars >= 4 ? "bg-amber-50 text-amber-600" :
              stars === 3 ? "bg-blue-50 text-blue-600" :
              "bg-gray-50 text-gray-500"
            }`}>
              {grade}
            </span>
          </div>

          <div className="h-px bg-gradient-to-l from-transparent via-[#7C3AED]/30 to-transparent" />

          {/* Footer */}
          <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
            <span>أسبوع {submission.weekKey}</span>
            <span>{fmtDate(submission.submittedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
